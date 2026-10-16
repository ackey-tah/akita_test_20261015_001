/**
 * JankenErrorCode は janken module の中でエラーを識別する英語 snake_case の識別子です。
 *
 * - `random_value_out_of_range`: 相手の手を選ぶ乱数値が 0 以上 1 未満でない
 */
export type JankenErrorCode = "random_value_out_of_range";
