# テストルール（プロジェクト）

> 読み込み規約: 同じフォルダの `standard.md` v0.1 を継承する。先に `standard.md` を読み、続けてこのファイルを読む。合成は連結のみ。

## 上書き

- **Adapter test と実 DB**: 標準の「DB 直結の repository 実装を実 DB で検証する」記述は適用しない。理由: DB を持たないため
- **結合テストの実体**: 標準の `npm run test:integration`（HTTP 結合テスト）は、本プロジェクトでは UI 結合テスト（[acceptance-testing の上書き](../acceptance-testing/project.md)）を指す。`npm run check` に含める点は標準と同じ
- **Storybook の実行**: story の play 関数は、Storybook の portable stories（`composeStories`）で Vitest（jsdom）上で実行し、`npm run check` に含める。理由: ブラウザを起動する実行方式は重く、表示状態の確認には jsdom で足りるため

## 追記

- テストランナーは Vitest を使う。単体テスト・UI 結合テスト・story の実行を同じランナーで回す
