import "./styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createJankenGame } from "./composition/createJankenGame";
import { JankenPage } from "./screens/JankenPage";

// エントリ。composition root を 1 回だけ呼び、作った application service を画面に渡す。
// ページを再読み込みするとここからやり直すため、戦績は 0 回に戻る（UC-01 要件 14）
const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("index.html に描画先の #root がありません");
}

createRoot(rootElement).render(
  <StrictMode>
    <JankenPage game={createJankenGame()} />
  </StrictMode>,
);
