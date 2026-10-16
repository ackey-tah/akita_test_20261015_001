import type { HandName, OutcomeName, RoundView } from "@janken-app/janken";
import type { JSX } from "react";

import { handDisplays } from "./handDisplay";

/** outcomeTexts は勝敗の文言です。色だけに頼らず文字で示します。 */
const outcomeTexts: Readonly<Record<OutcomeName, string>> = {
  win: "勝ち",
  lose: "負け",
  draw: "あいこでしょ！",
};

/** SideProps は片方の手の表示に渡す値です。 */
interface SideProps {
  readonly side: string;
  readonly hand: HandName;
}

/** Side はあなた・相手のどちらかが出した手を、絵文字と名前で表示します。 */
function Side({ side, hand }: SideProps): JSX.Element {
  return (
    <div role="group" aria-label={side}>
      <div className="side">{side}</div>
      <span className="emoji" aria-hidden="true">
        {handDisplays[hand].emoji}
      </span>
      <span className="name">{handDisplays[hand].name}</span>
    </div>
  );
}

/** RoundResultProps は勝負の結果の表示に渡す値です。 */
export interface RoundResultProps {
  readonly round: RoundView;
}

/** RoundResult は両者の手と勝敗を表示します。 */
export function RoundResult({ round }: RoundResultProps): JSX.Element {
  return (
    <div>
      <div className="duel">
        <Side side="あなた" hand={round.playerHand} />
        <div className="vs">vs</div>
        <Side side="相手" hand={round.opponentHand} />
      </div>
      <p className={`result ${round.outcome}`}>{outcomeTexts[round.outcome]}</p>
    </div>
  );
}
