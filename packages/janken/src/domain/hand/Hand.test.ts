import { MemoryLogger, setLogger } from "@janken-app/shared-kernel";
import { afterEach, describe, expect, it } from "vitest";

import { JankenError } from "../../errors/JankenError";
import { Hand } from "./Hand";
import { Outcome } from "./Outcome";

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

describe("rock", () => {
  it("グーの手を返す", () => {
    expect(Hand.rock().kind()).toBe("rock");
  });
});

describe("scissors", () => {
  it("チョキの手を返す", () => {
    expect(Hand.scissors().kind()).toBe("scissors");
  });
});

describe("paper", () => {
  it("パーの手を返す", () => {
    expect(Hand.paper().kind()).toBe("paper");
  });
});

describe("pickByRandomValue", () => {
  it.each([
    // 区間の境界の直前は、境界より小さい最大の倍精度の値で確かめる
    { randomValue: 0, expected: "rock" },
    { randomValue: 0.33333333333333326, expected: "rock" },
    { randomValue: 1 / 3, expected: "scissors" },
    { randomValue: 0.6666666666666665, expected: "scissors" },
    { randomValue: 2 / 3, expected: "paper" },
    { randomValue: 0.9999999999999999, expected: "paper" },
  ])(
    "0 以上 1 未満を 3 等分し、$randomValue は $expected の手になる",
    ({ randomValue, expected }) => {
      expect(Hand.pickByRandomValue(randomValue).kind()).toBe(expected);
    },
  );

  it.each([{ randomValue: -Number.EPSILON }, { randomValue: 1 }, { randomValue: Number.NaN }])(
    "0 以上 1 未満でない $randomValue は random_value_out_of_range で拒否し、乱数値をログに出す",
    ({ randomValue }) => {
      const logger = new MemoryLogger();
      setLogger(logger);

      const rejection = captureError(() => Hand.pickByRandomValue(randomValue));

      expect(rejection).toBeInstanceOf(JankenError);
      expect(rejection).toHaveProperty("errorCode", "random_value_out_of_range");
      expect(logger.entries()).toHaveLength(1);
      expect(logger.entries()[0]?.level).toBe("error");
      expect(logger.entries()[0]?.context).toHaveProperty("randomValue", randomValue);
    },
  );
});

describe("against", () => {
  it.each([
    {
      label: "グーでチョキに勝つ",
      player: Hand.rock(),
      opponent: Hand.scissors(),
      expected: Outcome.win(),
    },
    {
      label: "チョキでパーに勝つ",
      player: Hand.scissors(),
      opponent: Hand.paper(),
      expected: Outcome.win(),
    },
    {
      label: "パーでグーに勝つ",
      player: Hand.paper(),
      opponent: Hand.rock(),
      expected: Outcome.win(),
    },
    {
      label: "グーでパーに負ける",
      player: Hand.rock(),
      opponent: Hand.paper(),
      expected: Outcome.lose(),
    },
    {
      label: "チョキでグーに負ける",
      player: Hand.scissors(),
      opponent: Hand.rock(),
      expected: Outcome.lose(),
    },
    {
      label: "パーでチョキに負ける",
      player: Hand.paper(),
      opponent: Hand.scissors(),
      expected: Outcome.lose(),
    },
    {
      label: "グーどうしはあいこ",
      player: Hand.rock(),
      opponent: Hand.rock(),
      expected: Outcome.draw(),
    },
    {
      label: "チョキどうしはあいこ",
      player: Hand.scissors(),
      opponent: Hand.scissors(),
      expected: Outcome.draw(),
    },
    {
      label: "パーどうしはあいこ",
      player: Hand.paper(),
      opponent: Hand.paper(),
      expected: Outcome.draw(),
    },
  ])("相手の手との勝敗をこの手の側から返す: $label", ({ player, opponent, expected }) => {
    expect(player.against(opponent).equals(expected)).toBe(true);
  });
});

describe("equals", () => {
  it("同じ種類の手は等しい", () => {
    expect(Hand.rock().equals(Hand.rock())).toBe(true);
  });

  it("違う種類の手は等しくない", () => {
    expect(Hand.rock().equals(Hand.paper())).toBe(false);
  });
});

describe("kind", () => {
  it.each([
    { hand: Hand.rock(), expected: "rock" },
    { hand: Hand.scissors(), expected: "scissors" },
    { hand: Hand.paper(), expected: "paper" },
  ])("表示用に手の種類 $expected を返す", ({ hand, expected }) => {
    expect(hand.kind()).toBe(expected);
  });
});
