# Image Upload (Next.js → S3)

Simple Next.js app to upload images to a private S3 bucket and browse them via short-lived signed URLs. UI is Material UI. No app-level auth.

## Local development

1. Copy env file and set your bucket name:

```bash
cp .env.example .env.local
# edit S3_BUCKET_NAME
```

2. Ensure AWS credentials work (`aws configure` / existing profile). The app uses the default credential chain — same as the AWS CLI.

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### API routes

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Multipart upload (`file` field) |
| `GET` | `/api/images` | List objects + presigned GET URLs |

## Docker

Image is multi-stage with Next.js `standalone` output. Build/run will be verified in GitHub Actions (local Docker run is not required on this machine).

```bash
docker build -t image-upload .
```

## Env vars

- `AWS_REGION` — default `us-east-1`
- `S3_BUCKET_NAME` — private bucket name
- Credentials come from the IAM role (ECS) or local AWS config — do not put access keys in env.
