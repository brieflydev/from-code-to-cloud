import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION ?? "us-east-1";
const bucket = process.env.S3_BUCKET_NAME;

export function getBucketName(): string {
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME environment variable is not set");
  }
  return bucket;
}

export function getS3Client(): S3Client {
  return new S3Client({ region });
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function getObject(key: string) {
  const client = getS3Client();
  return client.send(
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    }),
  );
}

export type ListedImage = {
  key: string;
  url: string;
  lastModified: string | null;
};

const PRESIGN_EXPIRES_IN = 60 * 15; // 15 minutes

export async function listImages(): Promise<ListedImage[]> {
  const client = getS3Client();
  const bucketName = getBucketName();

  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
    }),
  );

  const contents = listed.Contents ?? [];

  const images = await Promise.all(
    contents
      .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
      .map(async (obj) => {
        const key = obj.Key as string;
        const url = await getSignedUrl(
          client,
          new GetObjectCommand({ Bucket: bucketName, Key: key }),
          { expiresIn: PRESIGN_EXPIRES_IN },
        );
        return {
          key,
          url,
          lastModified: obj.LastModified?.toISOString() ?? null,
        };
      }),
  );

  return images.sort((a, b) => {
    if (!a.lastModified || !b.lastModified) return 0;
    return b.lastModified.localeCompare(a.lastModified);
  });
}
