import { describe, expect, it } from "vitest";

import { Outcome } from "../hand/Outcome";
import { BattleRecord } from "./BattleRecord";
import { Percentage } from "./Percentage";

/** recordOf は勝敗を順に加えた戦績を返します。 */
function recordOf(...outcomes: Outcome[]): BattleRecord {
  return outcomes.reduce((record, outcome) => record.add(outcome), BattleRecord.empty());
}

describe("empty", () => {
  it("勝ち・負け・あいこがすべて 0 回の戦績を返す", () => {
    const record = BattleRecord.empty();

    expect(record.countOf(Outcome.win())).toBe(0);
    expect(record.countOf(Outcome.lose())).toBe(0);
    expect(record.countOf(Outcome.draw())).toBe(0);
  });
});

describe("add", () => {
  it.each([
    { outcome: Outcome.win(), label: "勝ち" },
    { outcome: Outcome.lose(), label: "負け" },
    { outcome: Outcome.draw(), label: "あいこ" },
  ])("$label を加えると、その回数だけが 1 増える", ({ outcome }) => {
    const record = BattleRecord.empty().add(outcome);

    expect(record.countOf(outcome)).toBe(1);
    expect(
      [Outcome.win(), Outcome.lose(), Outcome.draw()]
        .filter((other) => !other.equals(outcome))
        .map((other) => record.countOf(other)),
    ).toEqual([0, 0]);
  });

  it("元の戦績は変えず、新しい戦績を返す", () => {
    const original = BattleRecord.empty();

    original.add(Outcome.win());

    expect(original.countOf(Outcome.win())).toBe(0);
  });
});

describe("countOf", () => {
  it("勝敗ごとにこれまで加えた回数を返す", () => {
    const record = recordOf(
      Outcome.win(),
      Outcome.win(),
      Outcome.lose(),
      Outcome.draw(),
      Outcome.draw(),
      Outcome.draw(),
    );

    expect(record.countOf(Outcome.win())).toBe(2);
    expect(record.countOf(Outcome.lose())).toBe(1);
    expect(record.countOf(Outcome.draw())).toBe(3);
  });
});

describe("percentageOf", () => {
  it("勝ち・負け・あいこの合計を分母にした割合を返す", () => {
    const record = recordOf(Outcome.win(), Outcome.lose(), Outcome.draw(), Outcome.draw());

    expect(record.percentageOf(Outcome.win()).equals(Percentage.of(1, 4))).toBe(true);
    expect(record.percentageOf(Outcome.draw()).equals(Percentage.of(2, 4))).toBe(true);
  });

  it("3 つの割合の合計が 100 にならなくても、そのままの値を返す", () => {
    const record = recordOf(Outcome.win(), Outcome.lose(), Outcome.draw());

    const values = [Outcome.win(), Outcome.lose(), Outcome.draw()].map((outcome) =>
      record.percentageOf(outcome).value(),
    );

    expect(values).toEqual([33, 33, 33]);
  });

  it("一度も加えていない戦績では計算できない割合を返す", () => {
    expect(BattleRecord.empty().percentageOf(Outcome.win()).isMeasurable()).toBe(false);
  });
});

describe("equals", () => {
  it("3 つの回数がすべて同じなら等しい", () => {
    expect(
      recordOf(Outcome.win(), Outcome.draw()).equals(recordOf(Outcome.draw(), Outcome.win())),
    ).toBe(true);
  });

  it.each([
    { other: recordOf(Outcome.win(), Outcome.win()), label: "勝ちの回数" },
    { other: recordOf(Outcome.win(), Outcome.lose()), label: "負けの回数" },
    { other: recordOf(Outcome.win(), Outcome.draw(), Outcome.draw()), label: "あいこの回数" },
  ])("$label が違えば等しくない", ({ other }) => {
    expect(recordOf(Outcome.win(), Outcome.draw()).equals(other)).toBe(false);
  });
});
