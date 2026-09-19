terraform {
  # S3 backend の use_lockfile (S3ネイティブロック) は Terraform 1.10+ が必要
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0"
    }
  }

  # bucket/regionは -backend-config=backend.hcl (またはCIの-backend-config) で
  # 指定する (backend.hcl.example参照)
  backend "s3" {
    key          = "career-sheet/dev/terraform.tfstate"
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region
}
