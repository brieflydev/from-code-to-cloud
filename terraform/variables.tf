variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for resources"
  type        = string
  default     = "upload-app"
}

variable "root_domain" {
  description = "Existing Route53 hosted zone domain"
  type        = string
  default     = "briefly-learn.com"
}

variable "app_subdomain" {
  description = "Subdomain for the app (FQDN = subdomain.root_domain)"
  type        = string
  default     = "upload"
}

variable "github_org" {
  description = "GitHub org/user for OIDC trust"
  type        = string
  default     = "brieflydev"
}

variable "github_repo" {
  description = "GitHub repository name for OIDC trust"
  type        = string
  default     = "from-code-to-cloud"
}

variable "container_port" {
  description = "Container listen port"
  type        = number
  default     = 3000
}

variable "ecs_desired_count" {
  description = "Desired Fargate tasks (0 until an image is pushed to ECR)"
  type        = number
  default     = 0
}

variable "image_tag" {
  description = "Container image tag in ECR"
  type        = string
  default     = "latest"
}

locals {
  name_prefix = var.project_name
  app_fqdn    = "${var.app_subdomain}.${var.root_domain}"
  common_tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}
