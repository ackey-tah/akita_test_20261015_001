# このリポジトリで作業する AI への案内

> このファイルは索引です。規約の本文は書きません。**規約は `rules/` にのみ存在します。**
> `CLAUDE.md` と `AGENTS.md` は同一内容です。片方だけを更新しないでください（`npm run check:index` で検出されます）。

## このプロジェクト

ブラウザだけで遊べる、コンピュータ相手のじゃんけんゲームです。サーバを持たない静的 Web アプリで、勝敗と戦績を見ながら何度でも遊べます。いまは最初のユースケース（UC-01 じゃんけんで対戦する）の設計を終え、実装に入る段階です。

目的の定義は [docs/product/](docs/product/) を、現在の受け入れ基準（ユースケース記述）は [docs/usecases/](docs/usecases/) を、ユースケースを貫くジャーニー（E2E の対象）は [docs/journeys/](docs/journeys/) を参照してください。

このリポジトリは **ULD（ULS Loop Development）** の標準プロセスで開発します。規約は `rules/`（標準 `standard.md` + プロジェクト `project.md`）、開発フローの記録は `.designs/`、実行系は `.claude/`（スキル `uld-*` とワークフローは uld-kit が配布し `npx --yes github:uls-nakano/uld-kit#<tag> init` がコピーする）、機械チェックは `uld` CLI です。

## 生き資料とログ資料

リポジトリ内のドキュメントは 2 種類に分かれます。

- **生き資料（メンテする）** — `docs/` `rules/` と実装のフォルダ。常に「現在の姿」を表し、古くなったら直す義務があります
- **ログ資料（上書きしない）** — `.designs/`。そのとき何を聞き、何に合意したかの記録です。後から書き換えず、変更したい場合は新しいフローを流します

## 作業を始める前に読むもの

規約はトピック単位に分かれています。**変更する対象に応じて必要なトピックだけを読んでください。** 各トピックは `standard.md` → `project.md` の順に両方読みます。

| 変更する対象 | 読むトピック |
| --- | --- |
| 層・package の置き場、package の追加 | [rules/architecture](rules/architecture/) |
| 実装コード全般 | [rules/development](rules/development/) |
| ドメインモデル（Entity・VO・Domain Service）とモデル図 | [rules/model-design](rules/model-design/) |
| 単体テスト、検証コマンド | [rules/testing](rules/testing/) |
| 結合テスト・E2E・受け入れ基準のトレース | [rules/acceptance-testing](rules/acceptance-testing/) |
| 名前・コメント・テスト名の言語 | [rules/naming](rules/naming/) |
| スキル（命名・本文） | [rules/skills](rules/skills/) |
| ブランチ・コミット | [rules/branch](rules/branch/) |
| PR（スタック・本文・通す条件） | [rules/pull-request](rules/pull-request/) |
| レビューする / セルフチェックする | [rules/review](rules/review/) |
| ドキュメントの書き方 | [rules/documentation](rules/documentation/) |
| 開発フローの記録（`.designs/`）の書き起こし・テンプレート | [rules/design-records](rules/design-records/) |

トピックの一覧と読み込み規約は [rules/README.md](rules/README.md) にあります。

## 構成

構成の詳細は [docs/architecture/](docs/architecture/README.md) にあります。

- `apps/web` — ブラウザアプリ（画面・表示 component と story・composition root）
- `packages/janken` — じゃんけんの業務 module（domain・application・adapters・errors）
- `packages/shared-kernel` — module 共通の最小限の部品（DomainError 基底・Logger）
- `tests/integration` — 受け入れ基準を確かめる UI 結合テスト

## 検証

コミット前とプッシュ前に `npm run check` を実行します。検証コマンドの内訳・実行タイミングは [rules/testing](rules/testing/) にあります。
