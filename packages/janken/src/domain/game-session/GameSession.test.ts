import { MemoryLogger, setLogger } from "@janken-app/shared-kernel";
import { afterEach, describe, expect, it } from "vitest";

import { JankenError } from "../../errors/JankenError";
import { BattleRecord } from "../battle-record/BattleRecord";
import { Hand } from "../hand/Hand";
import { Outcome } from "../hand/Outcome";
import { GameSession } from "./GameSession";
import { Round } from "./Round";

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

/** afterWin は勝ちの勝負を 1 回終えた対戦の進行です。 */
function afterWin(): GameSession {
  return GameSession.start().play(Hand.rock(), Hand.scissors());
}

/** afterLose は負けの勝負を 1 回終えた対戦の進行です。 */
function afterLose(): GameSession {
  return GameSession.start().play(Hand.rock(), Hand.paper());
}

/** afterDraw はあいこの勝負を 1 回終えた対戦の進行です。 */
function afterDraw(): GameSession {
  return GameSession.start().play(Hand.rock(), Hand.rock());
}

describe("start", () => {
  it("戦績が空で、直前の勝負が無い対戦の進行を返す", () => {
    const session = GameSession.start();

    expect(session.record().equals(BattleRecord.empty())).toBe(true);
    expect(session.lastRound()).toBeUndefined();
  });
});

describe("play", () => {
  it("勝負の勝敗を戦績に加え、その勝負を直前の勝負にする", () => {
    const session = GameSession.start().play(Hand.paper(), Hand.rock());

    expect(session.record().equals(BattleRecord.empty().add(Outcome.win()))).toBe(true);
    expect(session.lastRound()?.equals(Round.between(Hand.paper(), Hand.rock()))).toBe(true);
  });

  it("あいこの後は続けて手を選べ、あいこも 1 回の勝負として戦績に数える", () => {
    const session = afterDraw().play(Hand.rock(), Hand.scissors());

    expect(session.record().countOf(Outcome.draw())).toBe(1);
    expect(session.record().countOf(Outcome.win())).toBe(1);
    expect(session.lastRound()?.equals(Round.between(Hand.rock(), Hand.scissors()))).toBe(true);
  });

  it("元の対戦の進行は変えず、新しい対戦の進行を返す", () => {
    const original = GameSession.start();

    original.play(Hand.rock(), Hand.scissors());

    expect(original.equals(GameSession.start())).toBe(true);
  });

  it.each([
    { label: "勝ち", session: afterWin(), lastOutcome: "win" },
    { label: "負け", session: afterLose(), lastOutcome: "lose" },
  ])(
    "$label の結果が出ている間は hand_not_accepted で拒否し、直前の勝敗をログに出し、戦績は変わらない",
    ({ session, lastOutcome }) => {
      const logger = new MemoryLogger();
      setLogger(logger);
      const recordBefore = session.record();

      const rejection = captureError(() => session.play(Hand.paper(), Hand.rock()));

      expect(rejection).toBeInstanceOf(JankenError);
      expect(rejection).toHaveProperty("errorCode", "hand_not_accepted");
      expect(logger.entries()).toHaveLength(1);
      expect(logger.entries()[0]?.level).toBe("error");
      expect(logger.entries()[0]?.context).toHaveProperty("lastOutcome", lastOutcome);
      expect(session.record().equals(recordBefore)).toBe(true);
    },
  );
});

describe("rematch", () => {
  it.each([
    { label: "勝ち", session: afterWin() },
    { label: "負け", session: afterLose() },
  ])("$label の後は直前の勝負を消し、戦績は残す", ({ session }) => {
    const rematched = session.rematch();

    expect(rematched.lastRound()).toBeUndefined();
    expect(rematched.record().equals(session.record())).toBe(true);
  });

  it.each([
    { label: "開始直後", session: GameSession.start() },
    { label: "あいこの後", session: afterDraw() },
  ])("$label は rematch_not_available で拒否し、ログを出す", ({ session }) => {
    const logger = new MemoryLogger();
    setLogger(logger);

    const rejection = captureError(() => session.rematch());

    expect(rejection).toBeInstanceOf(JankenError);
    expect(rejection).toHaveProperty("errorCode", "rematch_not_available");
    expect(logger.entries()).toHaveLength(1);
    expect(logger.entries()[0]?.level).toBe("error");
  });
});

describe("acceptsHand", () => {
  it.each([
    { label: "開始直後", session: GameSession.start(), expected: true },
    { label: "あいこの後", session: afterDraw(), expected: true },
    { label: "勝ちの後", session: afterWin(), expected: false },
    { label: "負けの後", session: afterLose(), expected: false },
    { label: "もう一度勝負した後", session: afterWin().rematch(), expected: true },
  ])("$label に手を選べるかは $expected", ({ session, expected }) => {
    expect(session.acceptsHand()).toBe(expected);
  });
});

describe("canRematch", () => {
  it.each([
    { label: "開始直後", session: GameSession.start(), expected: false },
    { label: "あいこの後", session: afterDraw(), expected: false },
    { label: "勝ちの後", session: afterWin(), expected: true },
    { label: "負けの後", session: afterLose(), expected: true },
    { label: "もう一度勝負した後", session: afterWin().rematch(), expected: false },
  ])("$label にもう一度勝負できるかは $expected", ({ session, expected }) => {
    expect(session.canRematch()).toBe(expected);
  });
});

describe("equals", () => {
  it("戦績と直前の勝負が同じなら等しい", () => {
    expect(afterWin().equals(afterWin())).toBe(true);
  });

  it("戦績が違えば等しくない", () => {
    expect(afterWin().rematch().equals(GameSession.start())).toBe(false);
  });

  it("直前の勝負の有無が違えば等しくない", () => {
    expect(afterWin().equals(afterWin().rematch())).toBe(false);
  });

  it("直前の勝負が違えば等しくない", () => {
    const winWithRock = GameSession.start().play(Hand.rock(), Hand.scissors());
    const winWithPaper = GameSession.start().play(Hand.paper(), Hand.rock());

    expect(winWithRock.equals(winWithPaper)).toBe(false);
  });
});

describe("record", () => {
  it("これまでの戦績を返す", () => {
    expect(afterLose().record().equals(BattleRecord.empty().add(Outcome.lose()))).toBe(true);
  });
});

describe("lastRound", () => {
  it("直前の勝負を返す", () => {
    expect(afterLose().lastRound()?.equals(Round.between(Hand.rock(), Hand.paper()))).toBe(true);
  });

  it("もう一度勝負した後は直前の勝負が無い", () => {
    expect(afterLose().rematch().lastRound()).toBeUndefined();
  });
});
