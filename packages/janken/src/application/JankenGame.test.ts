import { describe, expect, it } from "vitest";

import { Hand } from "../domain/hand/Hand";
import { JankenError } from "../errors/JankenError";
import type { GameView } from "./GameView";
import { JankenGame } from "./JankenGame";
import type { OpponentHandPicker } from "./OpponentHandPicker";

/** SequenceOpponentHandPicker は登録した順に相手の手を返す fake の port です。 */
class SequenceOpponentHandPicker implements OpponentHandPicker {
  readonly #hands: Hand[];

  constructor(...hands: Hand[]) {
    this.#hands = hands;
  }

  pick(): Hand {
    const hand = this.#hands.shift();
    if (hand === undefined) {
      throw new Error("相手の手を登録していません");
    }
    return hand;
  }
}

/** emptyRecord は一度も判定していない戦績の表示です。 */
const emptyRecord: GameView["record"] = {
  win: { count: 0, percentage: null },
  lose: { count: 0, percentage: null },
  draw: { count: 0, percentage: null },
};

describe("view", () => {
  it("始めたときは空の戦績で、直前の勝負が無く、手を選べる", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker());

    expect(game.view()).toEqual({
      record: emptyRecord,
      lastRound: null,
      acceptsHand: true,
      canRematch: false,
    });
  });
});

describe("selectHand", () => {
  it("相手の手を port から受け取って勝負し、勝敗と戦績と割合を返す", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker(Hand.scissors()));

    expect(game.selectHand("rock")).toEqual({
      record: {
        win: { count: 1, percentage: 100 },
        lose: { count: 0, percentage: 0 },
        draw: { count: 0, percentage: 0 },
      },
      lastRound: { playerHand: "rock", opponentHand: "scissors", outcome: "win" },
      acceptsHand: false,
      canRematch: true,
    });
  });

  it.each([
    { hand: "rock", opponent: Hand.paper(), outcome: "lose" },
    { hand: "scissors", opponent: Hand.paper(), outcome: "win" },
    { hand: "paper", opponent: Hand.paper(), outcome: "draw" },
  ] as const)("手の名前 $hand をそのまま勝負の手にする", ({ hand, opponent, outcome }) => {
    const game = new JankenGame(new SequenceOpponentHandPicker(opponent));

    expect(game.selectHand(hand).lastRound).toEqual({
      playerHand: hand,
      opponentHand: "paper",
      outcome,
    });
  });

  it("あいこの後は続けて手を選べ、新しい勝負になる", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker(Hand.paper(), Hand.rock()));

    game.selectHand("paper");
    const view = game.selectHand("paper");

    expect(view.lastRound).toEqual({ playerHand: "paper", opponentHand: "rock", outcome: "win" });
    expect(view.record.draw.count).toBe(1);
    expect(view.record.win.count).toBe(1);
  });

  it("結果を表示している間は domain の拒否をそのまま伝え、状態を変えない", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker(Hand.scissors(), Hand.rock()));
    const viewAfterWin = game.selectHand("rock");

    expect(() => game.selectHand("rock")).toThrow(JankenError);
    expect(game.view()).toEqual(viewAfterWin);
  });
});

describe("rematch", () => {
  it("勝敗が決まった後は直前の勝負を消して手を選べるようにし、戦績は残す", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker(Hand.paper()));
    const viewAfterLose = game.selectHand("rock");

    const view = game.rematch();

    expect(view).toEqual({
      record: viewAfterLose.record,
      lastRound: null,
      acceptsHand: true,
      canRematch: false,
    });
  });

  it("勝敗が決まっていない間は domain の拒否をそのまま伝える", () => {
    const game = new JankenGame(new SequenceOpponentHandPicker());

    expect(() => game.rematch()).toThrow(JankenError);
  });
});
