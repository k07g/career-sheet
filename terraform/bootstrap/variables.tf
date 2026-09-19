variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名 (リソース命名に使用)"
  type        = string
  default     = "career-sheet"
}

variable "state_bucket_name" {
  description = "Terraform state用S3バケット名 (グローバルに一意な名前を指定すること)"
  type        = string
}

variable "github_repository" {
  description = "GitHub Actionsの信頼関係に使うリポジトリ (owner/repo形式)"
  type        = string
  default     = "k07g/career-sheet"
}

variable "github_actions_environment" {
  description = "OIDC信頼関係で許可するGitHub Actionsのenvironment名 (ワークフロー側のjobs.<id>.environmentと一致させる)"
  type        = string
  default     = "prod"
}

variable "create_github_oidc_provider" {
  description = <<-EOT
    GitHub Actions用のOIDC IDプロバイダを新規作成するか。
    AWSアカウントには token.actions.githubusercontent.com のプロバイダを1つしか
    作成できないため、他プロジェクト (例: g4) で既に作成済みの場合はfalseにし
    existing_github_oidc_provider_arn を指定すること。
  EOT
  type        = bool
  default     = true
}

variable "existing_github_oidc_provider_arn" {
  description = "create_github_oidc_provider = false の場合に指定する、既存のGitHub Actions用OIDCプロバイダのARN"
  type        = string
  default     = ""
}
