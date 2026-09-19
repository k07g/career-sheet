# SSR (Route Handlers / proxy.ts / cookies() を使うServer Component) を
# ホストするため platform は WEB_COMPUTE を指定する (静的サイトのみなら WEB)。
resource "aws_amplify_app" "this" {
  name         = var.project_name
  repository   = var.github_repository_url
  access_token = var.github_access_token
  platform     = "WEB_COMPUTE"

  # npm ci はsharpのfreebsd/webcontainers向けwasm32オプション依存の解決漏れで
  # Linux上で失敗するため npm install を使う (.github/workflows/ci.yml と同じ理由)。
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  environment_variables = {
    G4_API_BASE_URL = var.g4_api_base_url
  }

  tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

# mainブランチのみを唯一のデプロイ対象ブランチとして接続する。
# auto_branch_creationは有効化しないため、他のブランチが自動でAmplify
# アプリ化されることはない。enable_auto_build=true により、mainへの
# push(=ブランチ保護でCI必須にしたPRのマージ)のたびにAmplifyが
# 自動でビルド・デプロイする。
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.this.id
  branch_name = "main"
  stage       = "PRODUCTION"
  framework   = "Next.js - SSR"

  enable_auto_build = true
}
