# Image Upload (Next.js → S3)

Simple Next.js app to upload images to a private S3 bucket and browse them via short-lived signed URLs. UI is Material UI. No app-level auth.

Gallery viewing uses S3 presigned GET URLs; downloads go through a same-origin `/api/download` route to avoid browser CORS issues with S3.

> **Note:** Workshop live infra (including `upload.briefly-learn.com`) was torn down after the session. To run this yourself, apply Terraform in your own AWS account, update the GitHub Actions workflow env values, then push to deploy.

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
| `GET` | `/api/download?key=` | Stream object as attachment (same-origin download) |

## Docker

Image is multi-stage with Next.js `standalone` output. Build/run is verified in GitHub Actions.

```bash
docker build -t image-upload .
```

## Env vars

- `AWS_REGION` — default `us-east-1`
- `S3_BUCKET_NAME` — private bucket name
- Credentials come from the IAM role (ECS) or local AWS config — do not put access keys in env.

## Infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Creates VPC, private S3, ECR, ECS Fargate + ALB, ACM cert, Route53 subdomain (default `upload.briefly-learn.com`), and a GitHub Actions OIDC deploy role. ECS `desired_count` starts at `0` until an image is pushed.

Update [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) with your account’s role ARN / ECR / ECS names from Terraform outputs before relying on CI.

### Teardown

Empty the uploads bucket (it has no `force_destroy`), then:

```bash
cd terraform
terraform destroy
```

Also delete any local-only test buckets you created outside Terraform.

## CI/CD

Push to `main` (or run **Build and Deploy** via `workflow_dispatch`) builds the Docker image in GitHub Actions, pushes it to ECR, and deploys to ECS with `desired_count=1` using OIDC (no long-lived AWS keys).
