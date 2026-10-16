import type { Hand } from "../domain/hand/Hand";

/**
 * OpponentHandPicker は相手の手を選ぶ port です。
 * 乱数の生成は外部依存なので、application は手を受け取るだけにし、実装は adapter に置きます。
 */
export interface OpponentHandPicker {
  /** pick は相手が出す手を 1 つ選びます。 */
  pick(): Hand;
}
