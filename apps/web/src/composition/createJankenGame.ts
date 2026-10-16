import { JankenGame } from "@janken-app/janken";
import { RandomOpponentHandPicker } from "@janken-app/janken/adapters";

/**
 * createJankenGame は composition root です。乱数で相手の手を選ぶ adapter を application service に注入して組み立てます。
 * 呼ぶたびに新しいインスタンスを返します。モジュールの読み込み時に 1 つ作って共有すると、
 * UI 結合テストがテストごとに新しい対戦から始められないためです（rules/acceptance-testing/project.md）。
 */
export function createJankenGame(): JankenGame {
  return new JankenGame(new RandomOpponentHandPicker());
}
