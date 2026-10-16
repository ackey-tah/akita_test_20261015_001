import { MemoryLogger, setLogger } from "@janken-app/shared-kernel";
import { afterEach, describe, expect, it } from "vitest";

import { JankenError } from "../../errors/JankenError";
import { Percentage } from "./Percentage";

afterEach(() => {
  setLogger();
});

/** captureError は操作が投げた例外を返します。例外もログも 1 回の呼び出しの分だけを確かめるため。 */
function captureError(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("例外が投げられませんでした");
}

describe("of", () => {
  it.each([
    { part: 1, total: 8, expected: 13, note: "12.5 は切り上げる" },
    { part: 1, total: 3, expected: 33, note: "33.33… は切り捨てる" },
    { part: 2, total: 3, expected: 67, note: "66.66… は切り上げる" },
    { part: 1, total: 200, expected: 1, note: "0.5 は切り上げる" },
    { part: 1, total: 201, expected: 0, note: "0.49… は切り捨てる" },
    { part: 0, total: 5, expected: 0, note: "0 回は 0%" },
    { part: 5, total: 5, expected: 100, note: "全部は 100%" },
  ])(
    "合計に対する割合を小数第 1 位で四捨五入した整数にする: $part / $total → $expected（$note）",
    ({ part, total, expected }) => {
      expect(Percentage.of(part, total).value()).toBe(expected);
    },
  );

  it("合計が 0 のときは計算できない割合になる", () => {
    expect(Percentage.of(0, 0).isMeasurable()).toBe(false);
  });

  it.each([
    { part: -1, total: 5, note: "回数が負" },
    { part: 1, total: -5, note: "合計が負" },
    { part: 0.5, total: 5, note: "回数が小数" },
    { part: 1, total: 2.5, note: "合計が小数" },
    { part: 6, total: 5, note: "回数が合計を超える" },
  ])(
    "回数として成り立たない $part / $total は invalid_percentage_count で拒否し、値をログに出す（$note）",
    ({ part, total }) => {
      const logger = new MemoryLogger();
      setLogger(logger);

      const rejection = captureError(() => Percentage.of(part, total));

      expect(rejection).toBeInstanceOf(JankenError);
      expect(rejection).toHaveProperty("errorCode", "invalid_percentage_count");
      expect(logger.entries()).toHaveLength(1);
      expect(logger.entries()[0]?.level).toBe("error");
      expect(logger.entries()[0]?.context).toMatchObject({ part, total });
    },
  );
});

describe("isMeasurable", () => {
  it("合計が正なら計算できる", () => {
    expect(Percentage.of(0, 3).isMeasurable()).toBe(true);
  });

  it("合計が 0 なら計算できない", () => {
    expect(Percentage.of(0, 0).isMeasurable()).toBe(false);
  });
});

describe("equals", () => {
  it("比が違っても丸めた値が同じなら等しい", () => {
    expect(Percentage.of(1, 3).equals(Percentage.of(33, 100))).toBe(true);
  });

  it("丸めた値が違えば等しくない", () => {
    expect(Percentage.of(1, 3).equals(Percentage.of(2, 3))).toBe(false);
  });

  it("計算できない割合どうしは等しい", () => {
    expect(Percentage.of(0, 0).equals(Percentage.of(0, 0))).toBe(true);
  });

  it("計算できない割合と計算できる割合は等しくない", () => {
    expect(Percentage.of(0, 0).equals(Percentage.of(0, 1))).toBe(false);
  });
});

describe("value", () => {
  it("四捨五入した整数の割合を返す", () => {
    expect(Percentage.of(2, 3).value()).toBe(67);
  });

  it("計算できない割合は percentage_not_measurable で拒否し、ログに出す", () => {
    const logger = new MemoryLogger();
    setLogger(logger);

    const rejection = captureError(() => Percentage.of(0, 0).value());

    expect(rejection).toBeInstanceOf(JankenError);
    expect(rejection).toHaveProperty("errorCode", "percentage_not_measurable");
    expect(logger.entries()).toHaveLength(1);
    expect(logger.entries()[0]?.level).toBe("error");
  });
});
