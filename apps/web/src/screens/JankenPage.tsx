import type { GameView, HandName, JankenGame } from "@janken-app/janken";
import { type JSX, useState } from "react";

import { JankenScreen } from "../components/JankenScreen";

/** JankenPageProps はじゃんけんページに渡す値です。 */
export interface JankenPageProps {
  /** game はエントリが composition root で組み立てた application service です。 */
  readonly game: JankenGame;
}

/**
 * JankenPage はじゃんけん画面の配線です。操作を application service に渡し、返った画面の値で描き直します。
 * 勝敗や戦績の計算はせず、application service が返す値をそのまま表示に渡します。
 */
export function JankenPage({ game }: JankenPageProps): JSX.Element {
  const [view, setView] = useState<GameView>(() => game.view());

  return (
    <JankenScreen
      view={view}
      onSelectHand={(hand: HandName) => {
        setView(game.selectHand(hand));
      }}
      onRematch={() => {
        setView(game.rematch());
      }}
    />
  );
}
