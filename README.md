# career-sheet

## ローカル環境での起動

### 前提

- Node.js 24（CI と同じバージョン）
- ログインまで動作確認する場合のみ: 認証 API [k07g/g4](https://github.com/k07g/g4) をローカルで起動するための Go と Docker

### 1. 依存パッケージのインストール

```sh
npm ci
```

### 2. 環境変数の設定

```sh
cp .env.local.example .env.local
```

| 変数 | 説明 | ローカルでの値 |
| --- | --- | --- |
| `G4_API_BASE_URL` | 認証 API (g4) のベース URL。サーバー側の Route Handler からのみ使用 | `http://localhost:8080` |

### 3. 認証 API (g4) の起動

ログイン画面からサインアップ・サインインするには g4 が必要です。g4 リポジトリで、AWS アカウント不要のインメモリ認証モードで起動します（詳細は [g4 の README](https://github.com/k07g/g4#ローカルでの動作検証awsアカウント不要) を参照）。

```sh
# g4 リポジトリで実行
docker compose up -d postgres
# 初回のみ: マイグレーションを適用
docker compose exec -T postgres psql -U g4 -d g4 < internal/db/migrations/0001_create_users_table.up.sql

PORT=8080 \
AUTH_PROVIDER=memory \
DATABASE_URL="postgres://g4:g4@localhost:5433/g4?sslmode=disable" \
go run ./cmd/server
```

インメモリ認証モードでは、サインアップ時の確認コードとパスワードリセットのコードは常に `000000` です。ユーザー情報は g4 を再起動すると消えます。

### 4. 開発サーバーの起動

```sh
npm run dev
```

http://localhost:3000 を開くと `/login` にリダイレクトされます。「新規登録」からアカウントを作成し、確認コード `000000` を入力してからサインインしてください。

入力したキャリアシートはブラウザの localStorage に保存されます（ログイン中のメールアドレスごとに分かれます）。

#### g4 を起動せずに画面だけ確認する場合

画面へのアクセス制御は Cookie `g4_access_token` があるかどうかだけを見ています。ブラウザの開発者ツールのコンソールで次を実行してからリロードすると、ログインせずにフォーム画面を開けます。ただしサインアウトなど、g4 を呼び出す操作は動きません。

```js
document.cookie = "g4_access_token=dummy; path=/";
document.cookie = "g4_email=dev@example.com; path=/";
```

## テスト・Lint

```sh
npm run lint      # ESLint
npm test          # ユニットテスト (Vitest)
npm run test:e2e  # E2E テスト (Playwright)
```

E2E テストを初めて実行するときは、先にブラウザをインストールしてください。

```sh
npx playwright install chromium
```

E2E テストは本番ビルド（`npm run build && npm run start`）を自動で起動します。認証は Cookie を直接設定するか API をモックしているため、g4 は不要です。ポート 3000 で開発サーバーが動いている場合はそちらが再利用されます。

## デプロイ

AWS Amplify Hosting にデプロイしています。インフラ構成は [terraform/README.md](terraform/README.md) を参照してください。
