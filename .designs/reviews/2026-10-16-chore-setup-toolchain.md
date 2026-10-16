# レビュー記録: 土台整備（chore/setup-toolchain）

> 置き場: `.designs/reviews/2026-10-16-chore-setup-toolchain.md`
> レビューの**記録**です。レビュー基準そのものは生き資料であり、[rules/review](../../rules/review/project.md) にあります。

## 概要

| 項目 | 内容 |
| --- | --- |
| 対象 | 実装スタックの前提となる土台整備（npm workspaces・TypeScript・Vitest・ESLint・Prettier・dependency-cruiser・Vite・React・Storybook の設定、`npm run check` への組み込み、CI） |
| レビュー種別 | AI レビュー（実装と別コンテキストのサブエージェント） |
| 実施日 | 2026-10-16 |
| 反復回数 | 2 周 |
| 結果 | 収束（2 周目で critical / major ゼロ） |

## 指摘

| # | 重要度 | 該当箇所 | 内容 | 修正案 | 対応 |
| --- | --- | --- | --- | --- | --- |
| 1 | major | `.dependency-cruiser.cjs`・`docs/architecture/README.md` | domain → errors を拒否しており、1.2.1 が境界チェックで落ちる。境界表に errors 層が無い | 境界表に errors 層を足し、domain・application・adapters に errors を許可する | 対応済み |
| 2 | major | `.dependency-cruiser.cjs` | application が外部ライブラリや apps を import しても通る | 許可したもの以外を拒否する書き方にする | 対応済み |
| 3 | major | `.dependency-cruiser.cjs` | 公開 entrypoint から domain・adapter を re-export しても通る | 公開 entrypoint → domain・adapters を拒否する | 対応済み |
| 4 | major | `.dependency-cruiser.cjs` | packages → apps と shared-kernel → 業務 module が通る | 2 つのルールを足す | 対応済み |
| 5 | major | `package.json` | ULD の規約チェックの段が逐次で、最初の失敗で止まる（規約は段の中を並列） | `run-p --continue-on-error` にする | 対応済み |
| 6 | minor | `apps/web/index.html` | 参照する `src/main.tsx` が 1.6.1 まで無く、dev・build が動かない | PR に明記する | 見送り（PR に明記。1.6.1 で作る） |
| 7 | minor | `packages/shared-kernel/package.json` | `exports` の行き先が無い | 空の入口を置く | 対応済み |
| 8 | minor | `tsconfig.json` | 内側の層でも DOM・Node のグローバルが使える | lint で禁止する | 対応済み（ESLint） |
| 9 | minor | `package.json` | React が root の devDependencies にある | `apps/web` の dependencies に移す | 対応済み |
| 10 | minor | `package.json` | `@types/node` と実行環境の Node の版がずれている | `^24` と `engines` | 対応済み |
| 11 | minor | `.dependency-cruiser.cjs` | adapter 用の入口のルールが janken 固定 | 一般化する | 対応済み |
| 12 | minor | `.prettierignore` | Markdown をすべて整形の対象外にしている | 対象を絞る | 見送り（配布物の標準規約とログ資料を整形で書き換えないため。PR に明記） |
| 13 | minor | `.dependency-cruiser.cjs` | adapters が application 全体を import できる（表は port だけ） | port の置き場が決まったら絞る | 見送り（port の置き場は 1.6.1 で決まる） |
| 14 | minor | `.dependency-cruiser.cjs` | application 経由の domain の再公開は検出できない | DTO 作成時のレビュー観点にする | 見送り（1.5.1 のレビューで見る） |
| 15 | minor | `package.json` | `test:integration` はテストが 0 件の間 exit 1 になる | PR に明記する | 見送り（PR に明記。check には含めていない） |
| 16 | minor | `eslint.config.js` | `crypto`・`fetch` が内側の層で使える | 禁止に加える | 対応済み |
| 17 | minor | `tests/package.json` | 公開 entrypoint を参照するなら依存の宣言が要る | 必要になった段で加える | 見送り（1.6.1 で判断） |

## ルール還元

| # | 振り分け | 還元先 | 状態 |
| --- | --- | --- | --- |
| 1〜5, 8, 11, 16 | 機械化できる | `.dependency-cruiser.cjs`・`eslint.config.js`（この PR で機械チェックそのものを入れた） | 反映済み |
| 6, 7, 9, 10, 12〜15, 17 | 還元不要（この土台整備固有） | — | — |
