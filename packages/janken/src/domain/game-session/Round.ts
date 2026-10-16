import type { Hand } from "../hand/Hand";
import type { Outcome } from "../hand/Outcome";

/** Round は勝負です。プレイヤーの手と相手の手、そこから判定した勝敗の 1 回分を表します。 */
export class Round {
  /** playerHand はプレイヤーの手です。 */
  readonly #playerHand: Hand;

  /** opponentHand は相手の手です。 */
  readonly #opponentHand: Hand;

  /** outcome は判定した勝敗です。 */
  readonly #outcome: Outcome;

  private constructor(playerHand: Hand, opponentHand: Hand, outcome: Outcome) {
    this.#playerHand = playerHand;
    this.#opponentHand = opponentHand;
    this.#outcome = outcome;
  }

  /**
   * between はプレイヤーの手と相手の手から勝敗を判定した勝負を返します。
   * 勝敗は作るときに 1 回だけ判定して持ち、表示と戦績が別々に判定し直さないようにします。
   */
  static between(playerHand: Hand, opponentHand: Hand): Round {
    return new Round(playerHand, opponentHand, playerHand.against(opponentHand));
  }

  /** isDecided は勝敗が決まったか（あいこでないか）を返します。 */
  isDecided(): boolean {
    return this.#outcome.isDecided();
  }

  /** equals はプレイヤーの手・相手の手・勝敗がすべて同じかを返します。 */
  equals(other: Round): boolean {
    return (
      this.#playerHand.equals(other.#playerHand) &&
      this.#opponentHand.equals(other.#opponentHand) &&
      this.#outcome.equals(other.#outcome)
    );
  }

  /** playerHand はプレイヤーの手を返します。表示用の DTO への変換に使います。 */
  playerHand(): Hand {
    return this.#playerHand;
  }

  /** opponentHand は相手の手を返します。表示用の DTO への変換に使います。 */
  opponentHand(): Hand {
    return this.#opponentHand;
  }

  /** outcome は判定した勝敗を返します。表示用の DTO への変換と、戦績への加算に使います。 */
  outcome(): Outcome {
    return this.#outcome;
  }
}
