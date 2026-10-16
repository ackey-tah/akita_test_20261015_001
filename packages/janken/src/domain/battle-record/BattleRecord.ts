import { Outcome } from "../hand/Outcome";
import { Percentage } from "./Percentage";

/**
 * BattleRecord は戦績です。ページを開いてからの勝ち・負け・あいこの回数を持ち、勝敗ごとの割合を求めます。
 * 割合の分母（3 つの回数の合計）は戦績が決めます。
 */
export class BattleRecord {
  /** winCount は勝ちの回数です。 */
  readonly #winCount: number;

  /** loseCount は負けの回数です。 */
  readonly #loseCount: number;

  /** drawCount はあいこの回数です。 */
  readonly #drawCount: number;

  private constructor(winCount: number, loseCount: number, drawCount: number) {
    this.#winCount = winCount;
    this.#loseCount = loseCount;
    this.#drawCount = drawCount;
  }

  /** empty は勝ち・負け・あいこがすべて 0 回の戦績を返します。 */
  static empty(): BattleRecord {
    return new BattleRecord(0, 0, 0);
  }

  /** add は勝敗に対応する回数を 1 増やした新しい戦績を返します。自分自身は変えません。 */
  add(outcome: Outcome): BattleRecord {
    if (outcome.equals(Outcome.win())) {
      return new BattleRecord(this.#winCount + 1, this.#loseCount, this.#drawCount);
    }
    if (outcome.equals(Outcome.lose())) {
      return new BattleRecord(this.#winCount, this.#loseCount + 1, this.#drawCount);
    }

    return new BattleRecord(this.#winCount, this.#loseCount, this.#drawCount + 1);
  }

  /** countOf は勝敗に対応する回数を返します。 */
  countOf(outcome: Outcome): number {
    if (outcome.equals(Outcome.win())) {
      return this.#winCount;
    }
    if (outcome.equals(Outcome.lose())) {
      return this.#loseCount;
    }

    return this.#drawCount;
  }

  /** percentageOf は勝敗の回数が、勝ち・負け・あいこの合計に占める割合を返します。 */
  percentageOf(outcome: Outcome): Percentage {
    return Percentage.of(this.countOf(outcome), this.#total());
  }

  /** equals は勝ち・負け・あいこの回数がすべて同じかを返します。 */
  equals(other: BattleRecord): boolean {
    return (
      this.#winCount === other.#winCount &&
      this.#loseCount === other.#loseCount &&
      this.#drawCount === other.#drawCount
    );
  }

  /** total は勝ち・負け・あいこの回数の合計です。割合の分母になります。 */
  #total(): number {
    return this.#winCount + this.#loseCount + this.#drawCount;
  }
}
