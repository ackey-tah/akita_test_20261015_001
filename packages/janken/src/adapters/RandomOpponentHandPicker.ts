import type { OpponentHandPicker } from "../application/OpponentHandPicker";
import { Hand } from "../domain/hand/Hand";

/**
 * RandomOpponentHandPicker はブラウザの乱数で相手の手を選ぶ adapter です。
 * 乱数の生成だけを持ち、値を手に対応させる等確率の規則は domain（Hand.pickByRandomValue）に任せます。
 */
export class RandomOpponentHandPicker implements OpponentHandPicker {
  pick(): Hand {
    return Hand.pickByRandomValue(Math.random());
  }
}
