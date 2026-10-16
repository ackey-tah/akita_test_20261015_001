# アーキテクチャルール（プロジェクト）

> 読み込み規約: 同じフォルダの `standard.md` v0.1 を継承する。先に `standard.md` を読み、続けてこのファイルを読む。合成は連結のみ。

本プロジェクトはサーバを持たず、ブラウザだけで動く静的 Web アプリです（構成は [docs/architecture](../../docs/architecture/README.md)）。API サーバ・DB・API 契約（OpenAPI）が存在しないため、それらを前提にした標準の記述を次のとおり上書きします。

## 上書き

- **Composition Root**: 標準の「独立したアプリ（API サーバーなど）に 1 か所だけ置く」「composition root の route / controller は API 契約の生成型と application DTO の境界変換を担当する」を、本プロジェクトでは「ブラウザアプリのエントリから呼ぶ composition root に 1 か所だけ置き、adapter を application service に注入して組み立てる」（置き場は [docs/architecture](../../docs/architecture/README.md)）に置き換える。理由: API サーバが無く、adapter を注入できる起動点がブラウザアプリのエントリしか無いため
- **Presentation**: 標準の「UI は API 契約の生成型だけに依存」を、本プロジェクトでは「UI は業務 module の公開 entrypoint が公開する application service と application DTO だけに依存し、domain・adapter・composition root を import しない」に置き換える。理由: API 契約が無く、UI と業務 module の境界は application service になるため。domain rule や集計を UI で再実装しない点は標準と同じ
- **HTTP API**: 標準の「HTTP API は API のアプリにだけ置く」は適用しない。理由: HTTP API を持たないため

## 追記

- import 境界の機械チェックには dependency-cruiser を使う。境界表は [docs/architecture](../../docs/architecture/README.md) の「層と依存」にあり、表を変えるときは dependency-cruiser の設定を同じ変更で更新する
