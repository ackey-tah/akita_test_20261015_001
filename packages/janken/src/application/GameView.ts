/** HandName は画面に渡す手の種類（グー・チョキ・パー）です。 */
export type HandName = "rock" | "scissors" | "paper";

/** OutcomeName は画面に渡す勝敗の種類（勝ち・負け・あいこ）です。 */
export type OutcomeName = "win" | "lose" | "draw";

/** OutcomeTally は勝敗 1 種類ぶんの回数と割合です。 */
export interface OutcomeTally {
  /** count は回数です。 */
  readonly count: number;
  /** percentage は四捨五入した整数の割合です。一度も判定していない（合計が 0 の）ときは null です。 */
  readonly percentage: number | null;
}

/** BattleRecordView は画面に渡す戦績です。 */
export interface BattleRecordView {
  readonly win: OutcomeTally;
  readonly lose: OutcomeTally;
  readonly draw: OutcomeTally;
}

/** RoundView は画面に渡す直前の勝負です。 */
export interface RoundView {
  readonly playerHand: HandName;
  readonly opponentHand: HandName;
  readonly outcome: OutcomeName;
}

/**
 * GameView はじゃんけん画面が表示に使う値です（application DTO）。
 * 手のボタンと「もう一度勝負する」ボタンを出すかは acceptsHand・canRematch が決め、画面は自分で判定しません。
 */
export interface GameView {
  /** record はこれまでの戦績です。 */
  readonly record: BattleRecordView;
  /** lastRound は直前の勝負です。開始直後ともう一度勝負した後は null です。 */
  readonly lastRound: RoundView | null;
  /** acceptsHand は手を選べるかです。 */
  readonly acceptsHand: boolean;
  /** canRematch はもう一度勝負できるかです。 */
  readonly canRematch: boolean;
}
