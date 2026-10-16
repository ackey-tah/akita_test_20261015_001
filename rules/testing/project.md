# テストルール（プロジェクト）

> 読み込み規約: 同じフォルダの `standard.md` v0.1 を継承する。先に `standard.md` を読み、続けてこのファイルを読む。合成は連結のみ。

## 上書き

- **Adapter test と実 DB**: 標準の「DB 直結の repository 実装を実 DB で検証する」記述は適用しない。理由: DB を持たないため
- **結合テストの実体**: 標準の `npm run test:integration`（HTTP 結合テスト）は、本プロジェクトでは UI 結合テスト（[acceptance-testing の上書き](../acceptance-testing/project.md)）を指す。`npm run check` に含める点は標準と同じ
- **Storybook の実行**: story の play 関数は、Storybook の portable stories（`composeStories`）で Vitest（jsdom）上で実行し、`npm run check` に含める。理由: ブラウザを起動する実行方式は重く、表示状態の確認には jsdom で足りるため

## 追記

- テストランナーは Vitest を使う。単体テスト・UI 結合テスト・story の実行を同じランナーで回す
- `npm run check` は次の 3 段で動く。段は逐次、段の中は並列（標準の「検証コマンド」）
  1. ULD の規約チェック（`check:branch` `check:kit` `check:rules` `check:index` `check:trace` `check:model-trace`）
  2. 整形（`format:check`）・lint（`lint`）・型（`typecheck`）・import 境界（`deps`）
  3. `npm run coverage`。単体テスト・story・UI 結合テストを 1 回で実行し、カバレッジの閾値まで判定する
- `npm run check` の 3 段目は `npm run test:integration` を別に呼ばない。`coverage` が UI 結合テストを含むため、同じテストを 2 回回さないようにしている。`test:integration` は UI 結合テストだけを手元で回すための入口
- カバレッジの除外コメントは `/* v8 ignore next -- @preserve <理由> */` と書く。理由: TypeScript の変換でコメントが消え、`@preserve` が無いと除外が効かないため（Vitest 4 の v8 カバレッジ）。除外してよい条件は標準の「カバレッジ」のとおり
- `npm run check:fast` は、1 段目から `check:branch` と `check:model-trace` を外し、2 段目の lint を cache 付きにし、3 段目を `npm run test`（単体テストと story）にしたもの
