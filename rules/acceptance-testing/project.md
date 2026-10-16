# 受け入れテストルール（プロジェクト）

> 読み込み規約: 同じフォルダの `standard.md` v0.1 を継承する。先に `standard.md` を読み、続けてこのファイルを読む。合成は連結のみ。

## 上書き

- **HTTP 結合テスト**: 標準の「結合テストは REST API 経由で受け入れ基準を検証する」を、本プロジェクトでは「UI 結合テスト」に置き換える。理由: HTTP API を持たず、利用者から見える振る舞いの境界が画面だけだから（[docs/architecture](../../docs/architecture/README.md)）
  - production の composition root と画面を import し、jsdom 上に描画して Testing Library で利用者と同じ操作（ボタンを押す・キーボード操作）を行う。結合テストが自前で application service を組み立てない（標準の「composition root の production と同じ手順を使う」と同じ理由）
  - ファイルは結合テストの置き場（[docs/architecture](../../docs/architecture/README.md)）に置き、`uc-{番号}-{内容の英語名}.integration.test.tsx` と命名する
  - 外部入力である乱数は、テスト側で `Math.random` を差し替えて固定する。composition root に乱数の注入口を開けない（標準の「composition にフェイクを注入する口は開けない」と同じ理由で、本物の adapter まで経路に含めるため）
  - 分離はテストごとに composition root を呼び直して新しい application service を作り、画面を描画し直すことで行う。そのため composition root は、呼ぶたびに新しいインスタンスを組み立てる関数として公開し、モジュールの読み込み時に作った 1 つのインスタンスを共有しない。状態はメモリにしか無いため、データの分割は要らない
- **E2E テスト**: 標準の「UI と API を別プロセスで起動する」は、本プロジェクトでは「ビルドした静的ファイルを Vite の preview サーバで配信し、ブラウザで操作する」に置き換える。理由: API プロセスが無いため。E2E の土台を入れる時期は [docs/architecture](../../docs/architecture/README.md) にある
