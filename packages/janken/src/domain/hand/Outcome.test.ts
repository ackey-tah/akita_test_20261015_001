import { describe, expect, it } from "vitest";

import { Outcome } from "./Outcome";

describe("win", () => {
  it("勝ちの勝敗を返す", () => {
    expect(Outcome.win().kind()).toBe("win");
  });
});

describe("lose", () => {
  it("負けの勝敗を返す", () => {
    expect(Outcome.lose().kind()).toBe("lose");
  });
});

describe("draw", () => {
  it("あいこの勝敗を返す", () => {
    expect(Outcome.draw().kind()).toBe("draw");
  });
});

describe("isDecided", () => {
  it("勝ちは勝敗が決まっている", () => {
    expect(Outcome.win().isDecided()).toBe(true);
  });

  it("負けは勝敗が決まっている", () => {
    expect(Outcome.lose().isDecided()).toBe(true);
  });

  it("あいこは勝敗が決まっていない", () => {
    expect(Outcome.draw().isDecided()).toBe(false);
  });
});

describe("equals", () => {
  it("同じ種類の勝敗は等しい", () => {
    expect(Outcome.win().equals(Outcome.win())).toBe(true);
  });

  it("違う種類の勝敗は等しくない", () => {
    expect(Outcome.win().equals(Outcome.draw())).toBe(false);
  });
});

describe("kind", () => {
  it.each([
    { outcome: Outcome.win(), expected: "win" },
    { outcome: Outcome.lose(), expected: "lose" },
    { outcome: Outcome.draw(), expected: "draw" },
  ])("表示用に勝敗の種類 $expected を返す", ({ outcome, expected }) => {
    expect(outcome.kind()).toBe(expected);
  });
});
