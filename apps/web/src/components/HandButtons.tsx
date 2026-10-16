import type { HandName } from "@janken-app/janken";
import type { JSX } from "react";

import { handDisplays, handNames } from "./handDisplay";

/** HandButtonsProps は手のボタンに渡す値です。 */
export interface HandButtonsProps {
  /** onSelectHand はボタンを押したときに、押した手を受け取ります。 */
  readonly onSelectHand: (hand: HandName) => void;
}

/** HandButtons はグー・チョキ・パーのボタンを並べます。 */
export function HandButtons({ onSelectHand }: HandButtonsProps): JSX.Element {
  return (
    <div className="hands">
      {handNames.map((hand) => (
        <button
          key={hand}
          type="button"
          className="hand-btn"
          onClick={() => {
            onSelectHand(hand);
          }}
        >
          <span className="emoji" aria-hidden="true">
            {handDisplays[hand].emoji}
          </span>
          {handDisplays[hand].name}
        </button>
      ))}
    </div>
  );
}
