# 実装計画: じゃんけんで対戦する

> 置き場: `.designs/REQ-001-janken/UC-01-janken-battle/tasks.md`
> **設計フェーズの成果物**で、実装スタックの**段数と束ね方の索引**です。設計 PR に含め、人は「何段のスタックをどう積むか」だけを見ます。
> 各タスクの実装方針・テスト項目・完了条件はここに書きません。実装フェーズの設計メモ（`impl/<タスクID>-design.md`）が持ちます。
> 実装中に束ね方が変わったら、その子タスク PR でこのファイルを更新し、要確認〔予定外〕に載せます。チェックボックスはコミット時に `node scripts/uld/uld.mjs finish-task` が `[x]` にします。

## 概要

| 項目 | 内容 |
| --- | --- |
| 移行単位 | REQ-001/UC-01 |
| 総タスク数（= スタックの段数） | 6 |
| スタックの底 | `task/REQ-001-UC-01/1.1.1-shared-kernel` |
| 生き資料（仕様の正） | `docs/usecases/UC-01-じゃんけんで対戦する.md`（UC-01 要件 1〜16）、`docs/domain/janken/`、`docs/architecture/README.md`。ジャーニーと OpenAPI は無し |
| スタックの前提 | 土台整備をスタックの前に `chore/setup-toolchain` で入れる。中身は npm workspaces・TypeScript・Vitest・ESLint・Prettier・dependency-cruiser・Vite・React・Storybook の設定、`packages/janken` の package.json の `exports`（公開 entrypoint と adapter 用 entrypoint の 2 つ。行き先の `src/index.ts` と `src/adapters/index.ts` は空の export で作っておき、中身は 1.5.1・1.6.1 で足す）、`npm run check` への型・lint・整形・境界・テスト・カバレッジの追加。観測点を持たない設定だけの変更で、子タスクに混ぜると最初の段の規模が上限 15 を超えるため |

## 束ね方の判断

- 判断の要るロジックは単体テストが観測点になるので 1 段ずつにした。共通部品（DomainError 基底と Logger。Logger の stack trace の補い方は単体テストで確かめる判断を持つ）、domain の 3 境界（手と勝敗・戦績・対戦の進行）の 4 段。後の段が前の段の成果物を使う（手と勝敗は DomainError を、戦績は勝敗を、対戦の進行は戦績と勝負を使う）ため、同一フェーズに並べず 4 フェーズに分けた
- 画面は「表示」（1.5.1）と「組み込み」（1.6.1）の 2 段に分けた。表示 component が受け取る DTO の型（`GameView`）と、それを公開する entrypoint は 1.5.1 で先に作る。表示 component が DTO を import できる順にするためで、型だけの変更なので 1.5.1 の観測点（story）は変わらない
- application service・port・乱数の adapter は受け渡しが中心で単独では観測点を持たないため、その先の観測点である UI 結合テストまで 1.6.1 に束ねた。受け入れ基準 ID（UC-01 要件 1〜16）はすべて 1.6.1 の UI 結合テストで外す
- フェーズの並びは domain → application の DTO（型）と presentation の表示 → application service・adapter・組み込み。標準のボトムアップのうち、application の DTO の型だけを表示の段に前倒しした。理由は上の表示と組み込みの 2 段分割
- 1.6.1 は変更ファイルの見積もりが 14 件で上限 15 に近い。設計工程で上限を超えたら、application service と adapter を先の段に切り出す分割案を人に提示する
- E2E の段は無い。ユースケースが 1 つでジャーニーが無いため（docs/journeys の規約）

## タスク

同一フェーズ内のタスクは互いに依存しない。

### Phase 1: 共通部品

- [x] 1.1.1 共通部品（`DomainError`・`Logger`・`getLogger`・`ConsoleLogger`・`MemoryLogger`）
  - 観測点: 単体テスト（`DomainError.test.ts`・`getLogger.test.ts`・`ConsoleLogger.test.ts`・`MemoryLogger.test.ts`）
  - 変更ファイル: `packages/shared-kernel/src/DomainError.ts`・`DomainError.test.ts`・`Logger.ts`・`getLogger.ts`・`getLogger.test.ts`・`ConsoleLogger.ts`・`ConsoleLogger.test.ts`・`MemoryLogger.ts`・`MemoryLogger.test.ts`・`index.ts`（10 件）
  - 同期する生き資料: なし
  - 入力: `chore/setup-toolchain`
  - 外す（未実装）ID: なし
  - _シナリオ: なし（土台の部品）_ / _要件: なし_

### Phase 2: 手と勝敗

- [ ] 1.2.1 手と勝敗（`Hand`・`Outcome`、`JankenError`・`JankenErrorCode`）
  - 観測点: domain の単体テスト（`Hand.test.ts`・`Outcome.test.ts`）
  - 変更ファイル: `packages/janken/src/domain/hand/Hand.ts`・`Hand.test.ts`・`Outcome.ts`・`Outcome.test.ts`・`HandKind.ts`・`OutcomeKind.ts`、`packages/janken/src/errors/JankenErrorCode.ts`・`JankenError.ts`・`JankenError.test.ts`（9 件）
  - 同期する生き資料: なし（モデル図は設計フェーズで最終形）
  - 入力: 1.1.1（`DomainError`・`Logger`）
  - 外す（未実装）ID: なし
  - _シナリオ: S-01-02, S-01-03, S-01-04_ / _要件: UC-01 要件 3, UC-01 要件 4_

### Phase 3: 戦績

- [ ] 1.3.1 戦績（`BattleRecord`・`Percentage`）
  - 観測点: domain の単体テスト（`BattleRecord.test.ts`・`Percentage.test.ts`）
  - 変更ファイル: `packages/janken/src/domain/battle-record/BattleRecord.ts`・`BattleRecord.test.ts`・`Percentage.ts`・`Percentage.test.ts`、`packages/janken/src/errors/JankenErrorCode.ts`（5 件）
  - 同期する生き資料: なし
  - 入力: 1.2.1（`Outcome`）
  - 外す（未実装）ID: なし
  - _シナリオ: S-01-06, S-01-11, S-01-14, S-01-15_ / _要件: UC-01 要件 9, UC-01 要件 10, UC-01 要件 13_

### Phase 4: 対戦の進行

- [ ] 1.4.1 対戦の進行（`GameSession`・`Round`）
  - 観測点: domain の単体テスト（`GameSession.test.ts`・`Round.test.ts`）
  - 変更ファイル: `packages/janken/src/domain/game-session/GameSession.ts`・`GameSession.test.ts`・`Round.ts`・`Round.test.ts`、`packages/janken/src/errors/JankenErrorCode.ts`（5 件）
  - 同期する生き資料: なし
  - 入力: 1.2.1（`Hand`・`Outcome`）、1.3.1（`BattleRecord`）
  - 外す（未実装）ID: なし
  - _シナリオ: S-01-04, S-01-05, S-01-12, S-01-13_ / _要件: UC-01 要件 8, UC-01 要件 11, UC-01 要件 15, UC-01 要件 16_

### Phase 5: じゃんけん画面の表示

- [ ] 1.5.1 じゃんけん画面の表示（`GameView`、戦績・手のボタン・勝負の結果・画面全体の表示 component）
  - 観測点: story（手の選択・あいこ・勝ち・負け・戦績 0 回の各状態）
  - 変更ファイル: `packages/janken/src/application/GameView.ts`、`packages/janken/src/index.ts`、`apps/web/src/components/BattleRecordPanel.tsx`・`.stories.tsx`、`HandButtons.tsx`・`.stories.tsx`、`RoundResult.tsx`・`.stories.tsx`、`JankenScreen.tsx`・`.stories.tsx`、`apps/web/src/components/fixtures/gameViews.ts`、`apps/web/src/styles.css`（12 件）
  - 同期する生き資料: なし
  - 入力: 1.4.1（表示する状態の種類）
  - 外す（未実装）ID: なし（表示の基準も 1.6.1 の UI 結合テストで外す）
  - _シナリオ: S-01-01, S-01-02, S-01-03, S-01-04_ / _要件: UC-01 要件 1, UC-01 要件 2, UC-01 要件 5, UC-01 要件 6, UC-01 要件 7, UC-01 要件 10, UC-01 要件 13_

### Phase 6: じゃんけん画面の組み込み

- [ ] 1.6.1 じゃんけん画面の組み込み（`JankenGame`・`OpponentHandPicker`・`RandomOpponentHandPicker`、composition root、画面の配線）
  - 観測点: UI 結合テスト（`tests/integration/uc-01-janken-battle.integration.test.tsx`）
  - 変更ファイル: `packages/janken/src/application/JankenGame.ts`・`JankenGame.test.ts`・`OpponentHandPicker.ts`、`packages/janken/src/adapters/RandomOpponentHandPicker.ts`・`RandomOpponentHandPicker.test.ts`・`index.ts`、`packages/janken/src/index.ts`、`apps/web/src/composition/createJankenGame.ts`、`apps/web/src/screens/JankenPage.tsx`、`apps/web/src/main.tsx`、`tests/integration/uc-01-janken-battle.integration.test.tsx`、`docs/usecases/UC-01-じゃんけんで対戦する.md`、`scenarios.md`（対応表）、この `tasks.md`（14 件。上限 15 に近い）
  - 同期する生き資料: `docs/usecases/UC-01-じゃんけんで対戦する.md`（UC-01 要件 1〜16 の「（未実装）」を外す）
  - 入力: 1.4.1、1.5.1
  - 外す（未実装）ID: UC-01 要件 1〜UC-01 要件 16
  - _シナリオ: S-01-01〜S-01-06, S-01-11〜S-01-15_ / _要件: UC-01 要件 1〜UC-01 要件 16_

## 品質チェック

- [x] **要件の網羅**: `docs/usecases/UC-01` の（未実装）の全 ID（要件 1〜16）が、1.6.1 の「外す（未実装）ID」に 1 回ずつ現れる
- [x] **シナリオの網羅**: `scenarios.md` の全シナリオ（S-01-01〜06・S-01-11〜15）が、いずれかのタスクの `_シナリオ_` に現れる
- [x] **1 観測点 1 タスク**: 全タスクに観測点がある。application service・adapter は単独にせず 1.6.1 の UI 結合テストまで束ねた。E2E は無い（ジャーニーが無い）。画面は表示（1.5.1）と組み込み（1.6.1）で 2 段に分けた。生き資料の同期だけのタスクは無い
- [x] **規模**: 変更ファイルが 15 を超えるタスクが無い（最大は 1.6.1 の 14 件。新設のテストファイルまで数えた）
- [x] **フェーズ内依存の禁止**: 各フェーズのタスクは 1 つずつで、フェーズ内の依存が無い
