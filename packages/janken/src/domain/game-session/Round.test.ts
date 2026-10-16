import { describe, expect, it } from "vitest";

import { Hand } from "../hand/Hand";
import { Outcome } from "../hand/Outcome";
import { Round } from "./Round";

describe("between", () => {
  it.each([
    { label: "勝ち", player: Hand.rock(), opponent: Hand.scissors(), expected: Outcome.win() },
    { label: "負け", player: Hand.rock(), opponent: Hand.paper(), expected: Outcome.lose() },
    { label: "あいこ", player: Hand.rock(), opponent: Hand.rock(), expected: Outcome.draw() },
  ])("2 つの手と、手から判定した勝敗（$label）を持つ", ({ player, opponent, expected }) => {
    const round = Round.between(player, opponent);

    expect(round.playerHand().equals(player)).toBe(true);
    expect(round.opponentHand().equals(opponent)).toBe(true);
    expect(round.outcome().equals(expected)).toBe(true);
  });
});

describe("isDecided", () => {
  it("勝ちの勝負は勝敗が決まっている", () => {
    expect(Round.between(Hand.paper(), Hand.rock()).isDecided()).toBe(true);
  });

  it("負けの勝負は勝敗が決まっている", () => {
    expect(Round.between(Hand.scissors(), Hand.rock()).isDecided()).toBe(true);
  });

  it("あいこの勝負は勝敗が決まっていない", () => {
    expect(Round.between(Hand.paper(), Hand.paper()).isDecided()).toBe(false);
  });
});

describe("equals", () => {
  it("2 つの手が同じ勝負は等しい", () => {
    expect(
      Round.between(Hand.rock(), Hand.paper()).equals(Round.between(Hand.rock(), Hand.paper())),
    ).toBe(true);
  });

  it("プレイヤーの手が違えば等しくない", () => {
    expect(
      Round.between(Hand.rock(), Hand.paper()).equals(Round.between(Hand.scissors(), Hand.paper())),
    ).toBe(false);
  });

  it("相手の手が違えば等しくない", () => {
    expect(
      Round.between(Hand.rock(), Hand.paper()).equals(Round.between(Hand.rock(), Hand.scissors())),
    ).toBe(false);
  });
});

describe("playerHand", () => {
  it("プレイヤーの手を返す", () => {
    expect(Round.between(Hand.scissors(), Hand.paper()).playerHand().equals(Hand.scissors())).toBe(
      true,
    );
  });
});

describe("opponentHand", () => {
  it("相手の手を返す", () => {
    expect(Round.between(Hand.scissors(), Hand.paper()).opponentHand().equals(Hand.paper())).toBe(
      true,
    );
  });
});

describe("outcome", () => {
  it("判定した勝敗を返す", () => {
    expect(Round.between(Hand.scissors(), Hand.paper()).outcome().equals(Outcome.win())).toBe(true);
  });
});
