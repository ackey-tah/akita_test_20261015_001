import { getLogger } from "@janken-app/shared-kernel";

import { JankenError } from "../../errors/JankenError";
import type { HandKind } from "./HandKind";
import { Outcome } from "./Outcome";

/** beatenKindOf は、その手の種類が勝つ相手の手の種類です。 */
const beatenKindOf: Readonly<Record<HandKind, HandKind>> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

/** Hand は手です。プレイヤーと相手が出すグー・チョキ・パーを表し、勝敗の規則を持ちます。 */
export class Hand {
  /** kind は手の種類です。 */
  readonly #kind: HandKind;

  private constructor(kind: HandKind) {
    this.#kind = kind;
  }

  /** rock はグーの手を返します。 */
  static rock(): Hand {
    return new Hand("rock");
  }

  /** scissors はチョキの手を返します。 */
  static scissors(): Hand {
    return new Hand("scissors");
  }

  /** paper はパーの手を返します。 */
  static paper(): Hand {
    return new Hand("paper");
  }

  /**
   * pickByRandomValue は 0 以上 1 未満の値を 3 等分し、値が入る区間の手を返します（等確率の規則）。
   * 乱数の生成はドメインの外が持ち、ここでは値を手に対応させる規則だけを持ちます。
   */
  static pickByRandomValue(randomValue: number): Hand {
    // NaN も比較がすべて false になるため、この条件で拒否される
    if (!(randomValue >= 0 && randomValue < 1)) {
      getLogger().error("相手の手を選ぶ乱数値が 0 以上 1 未満ではありません", { randomValue });
      throw new JankenError("random_value_out_of_range", "random value must be in [0, 1)");
    }

    // 添字の計算（Math.floor(randomValue * 3)）ではなく区間の比較にしたのは、配列の添字が外れる
    // 到達しない分岐を作らずに、すべての値をいずれかの区間へ対応させるため
    if (randomValue < 1 / 3) {
      return Hand.rock();
    }
    if (randomValue < 2 / 3) {
      return Hand.scissors();
    }

    return Hand.paper();
  }

  /** against は、この手で相手の手と勝負したときの勝敗をこの手の側から返します。 */
  against(opponent: Hand): Outcome {
    if (this.#kind === opponent.#kind) {
      return Outcome.draw();
    }

    return beatenKindOf[this.#kind] === opponent.#kind ? Outcome.win() : Outcome.lose();
  }

  /** equals は手の種類が同じかを返します。 */
  equals(other: Hand): boolean {
    return this.#kind === other.#kind;
  }

  /** kind は手の種類を返します。表示用の DTO への変換に使い、条件判定には使いません。 */
  kind(): HandKind {
    return this.#kind;
  }
}
