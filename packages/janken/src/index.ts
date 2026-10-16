// 公開 entrypoint。application service・port・DTO を export する（domain は export しない）。
export type {
  BattleRecordView,
  GameView,
  HandName,
  OutcomeName,
  OutcomeTally,
  RoundView,
} from "./application/GameView";
