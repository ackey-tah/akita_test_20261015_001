import { getLogger } from "@janken-app/shared-kernel";

import { JankenError } from "../../errors/JankenError";
import { BattleRecord } from "../battle-record/BattleRecord";
import type { Hand } from "../hand/Hand";
import { Round } from "./Round";

/**
 * GameSession は対戦の進行です。これまでの戦績と直前の勝負から、いま手を選べるか・もう一度勝負できるかを決めます。
 * 画面の状態（手の選択・あいこ・結果）は別の値として持たず、直前の勝負から導きます。
 */
export class GameSession {
  /** record はこれまでの戦績です。 */
  readonly #record: BattleRecord;

  /** lastRound は直前の勝負です。もう一度勝負したあとと開始直後は undefined です。 */
  readonly #lastRound: Round | undefined;

  private constructor(record: BattleRecord, lastRound: Round | undefined) {
    this.#record = record;
    this.#lastRound = lastRound;
  }

  /** start は戦績が空で、直前の勝負が無い対戦の進行を返します。 */
  static start(): GameSession {
    return new GameSession(BattleRecord.empty(), undefined);
  }

  /**
   * play はプレイヤーの手と相手の手で勝負し、その勝敗を戦績に加えた新しい対戦の進行を返します。
   * 勝敗の結果を表示している間は受け付けません（UC-01 要件 15）。画面がボタンを隠すだけでなく、
   * ボタン以外の経路から勝負が進んで表示と戦績が食い違うことをモデルで防ぐためです。
   */
  play(playerHand: Hand, opponentHand: Hand): GameSession {
    if (!this.acceptsHand()) {
      getLogger().error("勝敗の結果を表示している間に、新しい勝負の手が選ばれました", {
        lastOutcome: this.#lastRound?.outcome().kind(),
        playerHand: playerHand.kind(),
        opponentHand: opponentHand.kind(),
      });
      throw new JankenError("hand_not_accepted", "hand is not accepted while a result is shown");
    }

    const round = Round.between(playerHand, opponentHand);

    return new GameSession(this.#record.add(round.outcome()), round);
  }

  /** rematch は戦績を残したまま直前の勝負を消し、手を選べる対戦の進行を返します。勝敗が決まった後だけ受け付けます。 */
  rematch(): GameSession {
    if (!this.canRematch()) {
      getLogger().error("勝敗が決まっていない間に、もう一度勝負する操作が届きました", {
        // 開始直後・もう一度勝負した後は直前の勝負が無く、undefined になる
        lastOutcome: this.#lastRound?.outcome().kind(),
      });
      throw new JankenError("rematch_not_available", "rematch is available only after a decision");
    }

    return new GameSession(this.#record, undefined);
  }

  /** acceptsHand は手を選べるか（直前の勝負が無いか、あいこか）を返します。 */
  acceptsHand(): boolean {
    return this.#lastRound === undefined || !this.#lastRound.isDecided();
  }

  /** canRematch はもう一度勝負できるか（直前の勝負の勝敗が決まっているか）を返します。 */
  canRematch(): boolean {
    return this.#lastRound !== undefined && this.#lastRound.isDecided();
  }

  /** equals は戦績と直前の勝負が同じかを返します。 */
  equals(other: GameSession): boolean {
    if (!this.#record.equals(other.#record)) {
      return false;
    }
    if (this.#lastRound === undefined || other.#lastRound === undefined) {
      return this.#lastRound === other.#lastRound;
    }

    return this.#lastRound.equals(other.#lastRound);
  }

  /** record はこれまでの戦績を返します。表示用の DTO への変換に使い、条件判定には acceptsHand・canRematch を使います。 */
  record(): BattleRecord {
    return this.#record;
  }

  /** lastRound は直前の勝負を返します。表示用の DTO への変換に使い、条件判定には acceptsHand・canRematch を使います。 */
  lastRound(): Round | undefined {
    return this.#lastRound;
  }
}
