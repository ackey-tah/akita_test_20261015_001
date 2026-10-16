import type { Percentage } from "../domain/battle-record/Percentage";
import { GameSession } from "../domain/game-session/GameSession";
import { Hand } from "../domain/hand/Hand";
import { Outcome } from "../domain/hand/Outcome";
import type { GameView, HandName, OutcomeTally } from "./GameView";
import type { OpponentHandPicker } from "./OpponentHandPicker";

/** handOf は画面から受け取った手の名前に対応する手です。 */
const handOf: Readonly<Record<HandName, () => Hand>> = {
  rock: () => Hand.rock(),
  scissors: () => Hand.scissors(),
  paper: () => Hand.paper(),
};

/** percentageOf は割合を画面に渡す値にします。計算できない割合は null にします。 */
function percentageOf(percentage: Percentage): number | null {
  return percentage.isMeasurable() ? percentage.value() : null;
}

/**
 * JankenGame はじゃんけん画面の操作を編成する application service です。
 * ページを開いている間の対戦の進行をメモリに 1 つ持ち、操作のたびに画面に渡す値（GameView）を返します。
 * 何も保存しないので Repository port は持ちません（docs/domain の「保存の大原則」）。
 */
export class JankenGame {
  /** session はいまの対戦の進行です。操作のたびに新しい値に持ち替えます。 */
  #session: GameSession = GameSession.start();

  /** opponentHandPicker は相手の手を選ぶ port です。 */
  readonly #opponentHandPicker: OpponentHandPicker;

  constructor(opponentHandPicker: OpponentHandPicker) {
    this.#opponentHandPicker = opponentHandPicker;
  }

  /** view はいまの対戦の進行を画面に渡す値にして返します。 */
  view(): GameView {
    const record = this.#session.record();
    const tallyOf = (outcome: Outcome): OutcomeTally => ({
      count: record.countOf(outcome),
      percentage: percentageOf(record.percentageOf(outcome)),
    });
    const lastRound = this.#session.lastRound();

    return {
      record: {
        win: tallyOf(Outcome.win()),
        lose: tallyOf(Outcome.lose()),
        draw: tallyOf(Outcome.draw()),
      },
      lastRound:
        lastRound === undefined
          ? null
          : {
              playerHand: lastRound.playerHand().kind(),
              opponentHand: lastRound.opponentHand().kind(),
              outcome: lastRound.outcome().kind(),
            },
      acceptsHand: this.#session.acceptsHand(),
      canRematch: this.#session.canRematch(),
    };
  }

  /**
   * selectHand はプレイヤーが選んだ手で勝負し、結果を反映した画面の値を返します。
   * 結果を表示している間は domain（GameSession.play）が拒否し、その JankenError をそのまま伝えます。
   * 画面はその間手のボタンを出さないので、届いたら経路の誤りとして気付けるようにするためです。
   */
  selectHand(hand: HandName): GameView {
    this.#session = this.#session.play(handOf[hand](), this.#opponentHandPicker.pick());
    return this.view();
  }

  /** rematch は戦績を残したまま手の選択に戻し、画面の値を返します。勝敗が決まっていなければ domain が拒否します。 */
  rematch(): GameView {
    this.#session = this.#session.rematch();
    return this.view();
  }
}
