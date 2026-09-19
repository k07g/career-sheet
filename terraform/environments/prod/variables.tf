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

variable "github_repository_url" {
  description = "Amplifyが接続するGitHubリポジトリのURL"
  type        = string
  default     = "https://github.com/k07g/career-sheet"
}

variable "github_access_token" {
  description = <<-EOT
    AmplifyのGitHub App経由でリポジトリへアクセスするためのGitHub Personal
    Access Token (classic、admin:repo_hook スコープ)。事前に対象リージョンの
    Amplify GitHub Appをリポジトリにインストールしておくこと (README参照)。
    値は機密情報なのでコミットせず、apply時に -var や環境変数
    (TF_VAR_github_access_token) で渡すこと。
  EOT
  type        = string
  sensitive   = true
}

variable "g4_api_base_url" {
  description = "g4認証APIのベースURL (Amplifyのサーバーサイド関数から到達可能なURLを指定)"
  type        = string
}
