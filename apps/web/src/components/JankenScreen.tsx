import type { GameView, HandName } from "@janken-app/janken";
import type { JSX } from "react";

import { BattleRecordPanel } from "./BattleRecordPanel";
import { HandButtons } from "./HandButtons";
import { RoundResult } from "./RoundResult";

/** JankenScreenProps はじゃんけん画面に渡す値です。 */
export interface JankenScreenProps {
  /** view は表示する値です。 */
  readonly view: GameView;
  /** onSelectHand は手のボタンを押したときに、押した手を受け取ります。 */
  readonly onSelectHand: (hand: HandName) => void;
  /** onRematch は「もう一度勝負する」を押したときに呼ばれます。 */
  readonly onRematch: () => void;
}

/**
 * JankenScreen はじゃんけん画面全体です。戦績を常に上に置き、その下を手の選択・あいこ・結果で切り替えます。
 * どのボタンを出すかは view の acceptsHand・canRematch に従い、画面では判定しません。
 */
export function JankenScreen({ view, onSelectHand, onRematch }: JankenScreenProps): JSX.Element {
  return (
    <main className="screen">
      <h1 className="title">じゃんけん</h1>
      <BattleRecordPanel record={view.record} />
      {/* 読み上げの領域は常に置き、中身だけを入れ替える。結果が出るたびに領域ごと挿入すると、
          多くのスクリーンリーダーは新しく挿入された領域を読み上げないため */}
      <div aria-live="polite">
        {view.lastRound === null ? (
          <p className="prompt">じゃんけん…手を選んでね</p>
        ) : (
          <RoundResult round={view.lastRound} />
        )}
      </div>
      {view.acceptsHand && <HandButtons onSelectHand={onSelectHand} />}
      {view.canRematch && (
        <button type="button" className="rematch" onClick={onRematch}>
          もう一度勝負する
        </button>
      )}
    </main>
  );
}
