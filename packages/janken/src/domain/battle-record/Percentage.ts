import { getLogger } from "@janken-app/shared-kernel";

import { JankenError } from "../../errors/JankenError";

/**
 * Percentage は割合です。ある回数が合計に占める割合を、小数第 1 位を四捨五入した整数のパーセンテージで表します。
 * 合計が 0 のときは「計算できない割合」として表します。
 */
export class Percentage {
  /** roundedValue は四捨五入した整数の割合です。計算できないときは undefined です。 */
  readonly #roundedValue: number | undefined;

  private constructor(roundedValue: number | undefined) {
    this.#roundedValue = roundedValue;
  }

  /** of は回数 part が合計 total に占める割合を返します。合計が 0 なら計算できない割合を返します。 */
  static of(part: number, total: number): Percentage {
    if (!Number.isInteger(part) || !Number.isInteger(total) || part < 0 || part > total) {
      getLogger().error("割合を求める回数と合計が回数として成り立っていません", { part, total });
      throw new JankenError(
        "invalid_percentage_count",
        "part and total must be non-negative integers with part <= total",
      );
    }

    if (total === 0) {
      return new Percentage(undefined);
    }

    return new Percentage(Math.round((part * 100) / total));
  }

  /** isMeasurable は割合を計算できたか（合計が 0 でなかったか）を返します。 */
  isMeasurable(): boolean {
    return this.#roundedValue !== undefined;
  }

  /** equals は四捨五入した割合が同じかを返します。計算できない割合どうしは等しいとします。 */
  equals(other: Percentage): boolean {
    return this.#roundedValue === other.#roundedValue;
  }

  /** value は四捨五入した整数の割合を返します。表示用の DTO への変換に使い、計算できない割合には使えません。 */
  value(): number {
    if (this.#roundedValue === undefined) {
      getLogger().error("計算できない割合の値を求めました");
      throw new JankenError("percentage_not_measurable", "percentage is not measurable");
    }

    return this.#roundedValue;
  }
}
