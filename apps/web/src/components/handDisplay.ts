import type { HandName } from "@janken-app/janken";

/** HandDisplay は手を画面に出すときの名前と絵文字です。 */
export interface HandDisplay {
  /** name は手の名前です。読み上げとボタンの名前にも使います。 */
  readonly name: string;
  /** emoji は一目で分かるように添える絵文字です。読み上げには使いません。 */
  readonly emoji: string;
}

/** handDisplays は手の種類ごとの表示です。手のボタンと勝負の結果が同じ表示を使います。 */
export const handDisplays: Readonly<Record<HandName, HandDisplay>> = {
  rock: { name: "グー", emoji: "✊" },
  scissors: { name: "チョキ", emoji: "✌️" },
  paper: { name: "パー", emoji: "✋" },
};

/** handNames は手のボタンを並べる順です。 */
export const handNames: readonly HandName[] = ["rock", "scissors", "paper"];
