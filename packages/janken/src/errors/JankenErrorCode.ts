/**
 * JankenErrorCode は janken module の中でエラーを識別する英語 snake_case の識別子です。
 *
 * - `random_value_out_of_range`: 相手の手を選ぶ乱数値が 0 以上 1 未満でない
 * - `invalid_percentage_count`: 割合を求める回数と合計が、0 以上の整数で回数が合計以下、になっていない
 * - `percentage_not_measurable`: 計算できない割合（合計が 0）の値を求めた
 * - `hand_not_accepted`: 勝敗の結果を表示している間に、新しい勝負の手が選ばれた
 * - `rematch_not_available`: 勝敗が決まっていない間に、もう一度勝負する操作が届いた
 */
export type JankenErrorCode =
  | "random_value_out_of_range"
  | "invalid_percentage_count"
  | "percentage_not_measurable"
  | "hand_not_accepted"
  | "rematch_not_available";
