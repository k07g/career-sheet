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
  default     = "dev"
}

variable "github_owner_id" {
  description = <<-EOT
    GitHubオーナー(ユーザー/組織)の数値ID。2026-07-15以降に作成された
    リポジトリは、OIDCトークンのsubクレームに不変形式
    (repo:OWNER@OWNER_ID/REPO@REPO_ID:...) を使うため必要。
    `gh api users/<owner> --jq .id` で取得できる
    (career-sheet/k07gの場合は 155704074)。
  EOT
  type        = string
}

variable "github_repo_id" {
  description = <<-EOT
    GitHubリポジトリの数値ID。上記と同じ理由で必要。
    `gh api repos/<owner>/<repo> --jq .id` で取得できる
    (k07g/career-sheetの場合は 1376685107)。
  EOT
  type        = string
}

variable "create_github_oidc_provider" {
  description = <<-EOT
    GitHub Actions用のOIDC IDプロバイダを新規作成するか。
    AWSアカウントには token.actions.githubusercontent.com のプロバイダを1つしか
    作成できない。このAWSアカウントには既に(g4のbootstrapにより)作成済み
    のため既定値はfalse。フレッシュなAWSアカウントで初めて作る場合のみ
    trueにすること。既存プロバイダのARNは existing_github_oidc_provider_arn
    を明示指定しない限り、現在のAWSアカウントIDから自動的に求まる
    (ARNの形式が固定のため)。
  EOT
  type        = bool
  default     = false
}

variable "existing_github_oidc_provider_arn" {
  description = <<-EOT
    create_github_oidc_provider = false の場合に使う、既存のGitHub Actions用
    OIDCプロバイダのARN。通常は指定不要 (現在のAWSアカウントIDから自動的に
    求まる値をそのまま使う)。別アカウントで作成したプロバイダを使うなど、
    自動計算値と異なるARNを使いたい場合のみ指定する。
  EOT
  type        = string
  default     = ""
}
