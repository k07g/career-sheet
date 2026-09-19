# terraform

career-sheetをAWS Amplify Hostingで稼働させるためのTerraformプロジェクト。
[k07g/g4](https://github.com/k07g/g4) の `terraform/` と同じ構成方針を踏襲している。

## 構成

```
terraform/
  bootstrap/           # state用S3、GitHub Actions用OIDC IAMロールを作る(初回のみ手動実行)
  environments/dev/    # Amplifyアプリ/ブランチの本体。mainマージ時にCIが自動apply
```

| 項目 | 値 |
| --- | --- |
| state | S3 backend (`bootstrap`で作成) |
| apply方法 | **mainブランチへのマージ時にGitHub Actionsが自動apply** ([.github/workflows/terraform-dev-apply.yml](../.github/workflows/terraform-dev-apply.yml)) |
| 実データ | AWS Amplify Hosting アプリ + `main` ブランチ (dev環境。g4と同様、現時点で唯一実際に稼働する環境) |
| アプリのビルド・デプロイ | Terraformではなく **Amplifyの自動ビルド機能** が、`main`へのpushのたびに行う |

本格的なステージング/本番分離が必要になった場合は、g4と同様
`environments/` 配下に `stg` / `prod` などを追加すること。

## デプロイのゲート

「全チェックをパスしたらデプロイ」は、以下の2段構成で実現している。

1. GitHubリポジトリの **Settings > Branches** で `main` に対する必須ステータス
   チェック(`test` / `e2e` / CodeQLの `Analyze` 系)を設定し、CIが通らない
   限り `main` へのマージ自体ができないようにする。
2. Amplifyアプリの `main` ブランチは `enable_auto_build = true` のため、
   マージ(=push)が起きると自動でビルド・デプロイが走る。

つまり「マージできた時点で全チェックは既に通過している」という前提のもと、
Amplify自身の自動ビルドをそのままデプロイのトリガーとして使っている。
Amplifyの自動ビルド自体はCIの結果を待たないが、ブランチ保護によって
チェックが通っていないコミットはそもそも`main`に到達しない。

## 前提

- Terraform >= 1.10 (`environments/dev`が使うS3ネイティブロック `use_lockfile` の要件)
- AWS認証情報(環境変数 / `~/.aws/credentials` など)が設定済みであること

## 0. 初回セットアップ(bootstrap、手動・一度だけ)

```sh
cd terraform/bootstrap
terraform init
terraform apply \
  -var="state_bucket_name=<グローバルに一意なバケット名>"
```

- `state_bucket_name` は必須(S3バケット名はAWS全体で一意である必要がある)
- **AWSアカウントに既にGitHub Actions用のOIDCプロバイダが存在する場合**
  (例えば [g4](https://github.com/k07g/g4) のbootstrapを既に適用済みの場合。
  1アカウントにつきプロバイダは1つまでしか作成できない)は、
  `-var="create_github_oidc_provider=false" -var="existing_github_oidc_provider_arn=<既存のARN>"`
  を追加する

apply後、以下をGitHubリポジトリの **Settings > Environments** で `dev` という
名前のEnvironmentを作成し、その配下の **Environment secrets / variables**、
および通常の **Settings > Secrets and variables > Actions** に登録する
(ARN等は機密ではないためVariablesでよいが、GitHub PATは必ずSecretsに入れる)。

| 登録先 | 名前 | 値 |
| --- | --- | --- |
| Environment `dev` の Variables | `AWS_DEV_TERRAFORM_ROLE_ARN` | `terraform output github_actions_role_arn` |
| Environment `dev` の Variables | `TF_STATE_BUCKET` | `terraform output state_bucket_name` |
| Environment `dev` の Variables | `AWS_REGION` | 任意(未設定時は `ap-northeast-1`) |
| Environment `dev` の Variables | `G4_API_BASE_URL` | g4認証APIのURL |
| Environment `dev` の Secrets | `AMPLIFY_GITHUB_ACCESS_TOKEN` | 手順1で発行するGitHub PAT |

`terraform/bootstrap` の `terraform.tfstate` はこのbootstrap自体の管理に必要
なので、誤って削除しないこと(このディレクトリはめったに変更しない想定)。

## 1. Amplify用GitHub Appのインストール + PAT発行(手動・一度だけ)

TerraformからAmplifyアプリを作成するには、事前にAmplify専用のGitHub Appを
インストールしておく必要がある(コンソールを使わないデプロイ全般の制約)。

1. ブラウザで `https://github.com/apps/aws-amplify-ap-northeast-1/installations/new`
   を開く(リージョンが異なる場合はURLの `ap-northeast-1` を読み替える)
2. インストール先のGitHubアカウントを選び、`career-sheet` リポジトリ
   (または全リポジトリ)を対象にインストールする
3. GitHubの **Settings > Developer settings > Personal access tokens
   (classic)** で `admin:repo_hook` スコープのトークンを発行する
4. 発行したトークンを上記の `AMPLIFY_GITHUB_ACCESS_TOKEN` として登録する

参考: [Setting up Amplify access to GitHub repositories](https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html)

## 2. dev環境: mainマージで自動apply

[.github/workflows/terraform-dev-apply.yml](../.github/workflows/terraform-dev-apply.yml) が、
`main` ブランチへのpush(マージ)のうち `terraform/environments/dev/**` に
変更があった場合に、GitHub ActionsのOIDCでAWSにAssumeRoleし
`terraform init && plan && apply` を自動実行し、Amplifyアプリ/ブランチの
設定(ビルド設定・環境変数など)を最新化する。

- 初回はこのファイル一式をmainにマージした時点で自動的にAmplifyアプリが
  作成される
- 手動での再実行は Actions タブから `workflow_dispatch` で可能
- apply前に人手のレビューを挟みたい場合は、**Settings > Environments > dev**
  で Required reviewers を設定すると、ワークフロー変更なしに承認ゲートを
  追加できる

ローカルから同じdev stateを操作したい場合は、`backend.hcl.example` を参考に
`backend.hcl` を作成してから初期化する。

```sh
cd terraform/environments/dev
cp backend.hcl.example backend.hcl   # 値をbootstrap出力に合わせて編集
terraform init -backend-config=backend.hcl
terraform plan \
  -var="github_access_token=<GitHub PAT>" \
  -var="g4_api_base_url=<g4のAPI URL>"
```

## apply後の確認

```sh
cd terraform/environments/dev
terraform output app_url
```

初回applyの直後はAmplify側のビルドがまだ走っていないため、上記URLに
アクセスしてもエラーになることがある。Amplifyコンソールでビルド状況を
確認できる。

## 破棄

```sh
cd terraform/environments/dev
terraform destroy \
  -var="github_access_token=<GitHub PAT>" \
  -var="g4_api_base_url=<g4のAPI URL>"
```

state用のS3バケットやOIDC IAMロール自体を破棄する場合は
`terraform/bootstrap` で `terraform destroy` するが、他プロジェクトが
同じOIDCプロバイダを参照していないことを確認してから実行すること。
