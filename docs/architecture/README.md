# アーキテクチャ

このプロダクトの構成（package・層・境界・技術）を表す生き資料です。構成の原則（依存方向・層の責務・import 境界）は [rules/architecture](../../rules/architecture/standard.md) にあり、このプロジェクトでの上書きは [rules/architecture/project.md](../../rules/architecture/project.md) にあります。

## 全体像

サーバを持たない、ブラウザだけで動く静的 Web アプリです。ビルドした HTML・JavaScript・CSS を開くか静的ホスティングに置けば遊べ、実行中にネットワーク通信をしません。そのため API サーバ・DB・OpenAPI はありません。

```text
apps/
  web/                    ブラウザアプリ（presentation と composition root）
    index.html
    src/
      main.tsx            エントリ。composition root を呼んで画面を描画する
      composition/        composition root（具体的な adapter を application に注入する唯一の場所）
      screens/            画面（ページの配線）
      components/         表示 component と story
packages/
  shared-kernel/          複数 module で共有する最小限の共通物（DomainError 基底・Logger）
  janken/                 じゃんけんの業務 module
    src/
      domain/             手・勝敗・戦績・対戦の進行（docs/domain/janken）
      application/        application service・port・DTO
      adapters/           port の実装（相手の手をランダムに選ぶ）
      errors/             module 固有の ErrorCode と DomainError 継承クラス
      index.ts            公開 entrypoint（application service・port・DTO。domain は公開しない）
      adapters/index.ts   adapter 用の entrypoint（composition root だけが使う）
tests/
  integration/            受け入れ基準を確かめる UI 結合テスト
```

## 層と依存

```text
apps/web (presentation) -> packages/janken（公開 entrypoint の application service の型と DTO）
apps/web/src/main.tsx -> apps/web/src/composition -> packages/janken/adapters -> application -> domain
```

| 層 | 置き場 | 責務 | import してよいもの |
| --- | --- | --- | --- |
| domain | `packages/janken/src/domain/` | 業務の判断（勝敗・等確率の規則・割合・状態遷移） | 同じ domain、`packages/shared-kernel` |
| application | `packages/janken/src/application/` | 対戦の操作（手を選ぶ・もう一度勝負する・表示内容を返す）の編成。外部依存は port で受ける | domain、`packages/shared-kernel` |
| adapters | `packages/janken/src/adapters/` | port の実装（ブラウザの乱数で相手の手を選ぶ） | application の port、domain |
| composition root | `apps/web/src/composition/` | adapter を application service に注入して組み立てる。呼ぶたびに新しいインスタンスを返す | `packages/janken` の公開 entrypoint と adapter 用の entrypoint（`packages/janken/adapters`） |
| presentation | `apps/web/src/screens/` `apps/web/src/components/` | application service が返す DTO を表示し、操作を application service に渡す。application service は `main.tsx` から props で受け取る | `packages/janken` の公開 entrypoint（application service の型と DTO） |
| エントリ | `apps/web/src/main.tsx` | composition root を 1 回呼び、作った application service を画面に渡して描画する | composition root、presentation |
| 結合テスト | `tests/integration/` | 受け入れ基準を画面の操作で確かめる。テストごとに composition root を呼び直す | `apps/web` の composition root と画面 |

- presentation は domain を import しない。勝敗・割合・状態の判断を画面で再実装せず、DTO の値を表示する
- `packages/janken` は package.json の `exports` で 2 つの入口だけを公開する。公開 entrypoint（`packages/janken`）は domain を export しない。adapter 用の entrypoint（`packages/janken/adapters`）を import してよいのは composition root だけ
- presentation（`screens/` `components/`）は composition root と adapter 用の entrypoint を import しない。adapter への経路を画面に作らないため
- 他 package の内部 path を import しない
- production コードから `tests/` を import しない。循環依存を禁止する
- 上の import 可否は dependency-cruiser で機械検証し、`npm run check` に含める。入口をパスで分けているのは、dependency-cruiser がファイル単位でしか依存を判定できず、1 つの入口の中のどの export を使ったかは区別できないため

## 技術

| 用途 | 技術 |
| --- | --- |
| 言語 | TypeScript（strict） |
| UI | React |
| ビルド・開発サーバ | Vite |
| 単体テスト・結合テスト | Vitest（結合テストと story の実行は jsdom + Testing Library） |
| UI の表示状態の確認 | Storybook（story の play 関数は Vitest 上で実行する） |
| Lint・整形 | ESLint（typescript-eslint・React Hooks）・Prettier |
| import 境界の検証 | dependency-cruiser |
| package 管理 | npm workspaces |

E2E テストの土台（Playwright）は、複数のユースケースを貫くジャーニーができたときに導入します。いまはユースケースが 1 つで、[docs/journeys](../journeys/README.md) の規約上ジャーニーを書かないためです。

## 実行時の振る舞い

- 対戦の状態（戦績を含む）は application service のインスタンスがメモリに持ちます。インスタンスはページの読み込みごとに composition root が 1 つ作るため、再読み込みで状態は捨てられます
- 相手の手の乱数は、adapter がブラウザの `Math.random` から得て、domain の等確率の規則（[手と勝敗](../domain/janken/hand-手と勝敗.md)）で手に変換します
