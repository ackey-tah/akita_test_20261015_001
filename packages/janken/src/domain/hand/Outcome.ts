import type { OutcomeKind } from "./OutcomeKind";

/** Outcome は勝敗です。1 回の勝負をプレイヤーから見た結果（勝ち・負け・あいこ）を表します。 */
export class Outcome {
  /** kind は勝敗の種類です。 */
  readonly #kind: OutcomeKind;

  private constructor(kind: OutcomeKind) {
    this.#kind = kind;
  }

  /** win は勝ちの勝敗を返します。 */
  static win(): Outcome {
    return new Outcome("win");
  }

  /** lose は負けの勝敗を返します。 */
  static lose(): Outcome {
    return new Outcome("lose");
  }

  /** draw はあいこの勝敗を返します。 */
  static draw(): Outcome {
    return new Outcome("draw");
  }

  /** isDecided は勝敗が決まったか（あいこでないか）を返します。 */
  isDecided(): boolean {
    return this.#kind !== "draw";
  }

  /** equals は勝敗の種類が同じかを返します。 */
  equals(other: Outcome): boolean {
    return this.#kind === other.#kind;
  }

  /** kind は勝敗の種類を返します。表示用の DTO への変換に使い、条件判定には使いません。 */
  kind(): OutcomeKind {
    return this.#kind;
  }
}
