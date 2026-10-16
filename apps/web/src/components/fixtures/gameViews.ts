import type { GameView } from "@janken-app/janken";

/** handSelectionView は開いた直後（一度も判定していない）の画面です。 */
export const handSelectionView: GameView = {
  record: {
    win: { count: 0, percentage: null },
    lose: { count: 0, percentage: null },
    draw: { count: 0, percentage: null },
  },
  lastRound: null,
  acceptsHand: true,
  canRematch: false,
};

/** drawView はパーどうしであいこになった直後の画面です。 */
export const drawView: GameView = {
  record: {
    win: { count: 0, percentage: 0 },
    lose: { count: 0, percentage: 0 },
    draw: { count: 1, percentage: 100 },
  },
  lastRound: { playerHand: "paper", opponentHand: "paper", outcome: "draw" },
  acceptsHand: true,
  canRematch: false,
};

/** winView はあいこの後、チョキでパーに勝った直後の画面です。 */
export const winView: GameView = {
  record: {
    win: { count: 1, percentage: 50 },
    lose: { count: 0, percentage: 0 },
    draw: { count: 1, percentage: 50 },
  },
  lastRound: { playerHand: "scissors", opponentHand: "paper", outcome: "win" },
  acceptsHand: false,
  canRematch: true,
};

/** loseView はグーでパーに負けた直後の画面です。勝ち・負け・あいこ 1 回ずつで、割合の合計が 100 にならない例を兼ねます。 */
export const loseView: GameView = {
  record: {
    win: { count: 1, percentage: 33 },
    lose: { count: 1, percentage: 33 },
    draw: { count: 1, percentage: 33 },
  },
  lastRound: { playerHand: "rock", opponentHand: "paper", outcome: "lose" },
  acceptsHand: false,
  canRematch: true,
};
