# 開発ルール（プロジェクト）

> 読み込み規約: 同じフォルダの `standard.md` v0.1 を継承する。先に `standard.md` を読み、続けてこのファイルを読む。合成は連結のみ。

## 追記

- クラスの private な状態は ES private field（`#name`）で持つ。理由: 状態と同じ名前の getter（例: `#kind` と `kind()`）を置けるようにするため。`private` 修飾子と `_` prefix（[naming](../naming/standard.md) で禁止）では同名にできない

## 上書き

- **API 生成**: 標準の「API 生成」の節は適用しない。理由: API 契約（OpenAPI）を持たないため（[docs/architecture](../../docs/architecture/README.md)）。application DTO は業務 module の `application/` に手書きの型で定義する
- **Repository / Use Case ルール**: 標準のうち Repository port・トランザクション境界の記述は、永続化する状態が生まれるまで適用しない。理由: 何も永続化しないため（[docs/domain](../../docs/domain/README.md) の「保存の大原則」）。メモリ上の状態は application service が保持し、Repository port を経由しない
