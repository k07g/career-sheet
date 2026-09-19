data "aws_caller_identity" "current" {}

# --- Terraform state用バックエンド(S3。ロックはS3ネイティブロックを
#     使うため別途DynamoDBテーブルは不要) ---

resource "aws_s3_bucket" "terraform_state" {
  bucket = var.state_bucket_name

  # 誤ってstateバケットを削除してしまうと各環境のstateを失うため保護する
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
    Purpose   = "terraform-state"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# --- GitHub Actions用 OIDC IAMロール ---
# CIから長期クレデンシャルを使わずAWSを操作できるようにする。
# ワークフロー側のjobsで`environment: dev`を指定する前提のため、GitHubが
# 発行するOIDCトークンのsubクレームは repo:OWNER/REPO:environment:ENV_NAME になる。

data "tls_certificate" "github_actions" {
  count = var.create_github_oidc_provider ? 1 : 0
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  count = var.create_github_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github_actions[0].certificates[0].sha1_fingerprint]
}

locals {
  github_oidc_provider_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github_actions[0].arn : var.existing_github_oidc_provider_arn
}

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:environment:${var.github_actions_environment}"]
    }
  }
}

resource "aws_iam_role" "terraform_ci" {
  name               = "${var.project_name}-terraform-ci"
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust.json

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

data "aws_iam_policy_document" "terraform_ci_permissions" {
  statement {
    sid    = "TerraformStateObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.terraform_state.arn}/*"]
  }

  statement {
    sid       = "TerraformStateBucketList"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.terraform_state.arn]
  }

  # stateのロックはS3ネイティブロック(use_lockfile)を使う。ロックファイルも
  # 同じバケット内のオブジェクトなので、上の権限だけで足り追加権限は不要。

  statement {
    # Amplifyアプリ/ブランチの作成・変更・削除に必要。このロールはOIDCの
    # environment条件により、GitHub Actionsの`environment: dev`ジョブから
    # のみAssumeRoleWithWebIdentityできるため実行経路はCIに限定される。
    sid       = "AmplifyManagement"
    effect    = "Allow"
    actions   = ["amplify:*"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "terraform_ci" {
  name   = "${var.project_name}-terraform-ci"
  role   = aws_iam_role.terraform_ci.id
  policy = data.aws_iam_policy_document.terraform_ci_permissions.json
}
