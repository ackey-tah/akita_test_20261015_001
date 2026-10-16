import type { GameView, RoundView } from "@janken-app/janken";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

import { drawView, loseView, winView } from "./fixtures/gameViews";
import { RoundResult } from "./RoundResult";

const meta = {
  component: RoundResult,
} satisfies Meta<typeof RoundResult>;

export default meta;

type Story = StoryObj<typeof meta>;

/** roundOf は fixture の画面から直前の勝負を取り出します。fixture は勝負の後の画面なので必ずあります。 */
function roundOf(view: GameView): RoundView {
  if (view.lastRound === null) {
    throw new Error("fixture に直前の勝負がありません");
  }
  return view.lastRound;
}

/** Win はチョキでパーに勝った勝負です。 */
export const Win: Story = {
  args: { round: roundOf(winView) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      within(canvas.getByRole("group", { name: "あなた" })).getByText("チョキ"),
    ).toBeInTheDocument();
    await expect(
      within(canvas.getByRole("group", { name: "相手" })).getByText("パー"),
    ).toBeInTheDocument();
    await expect(canvas.getByText("勝ち")).toBeInTheDocument();
  },
};

/** Lose はグーでパーに負けた勝負です。 */
export const Lose: Story = {
  args: { round: roundOf(loseView) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      within(canvas.getByRole("group", { name: "あなた" })).getByText("グー"),
    ).toBeInTheDocument();
    await expect(
      within(canvas.getByRole("group", { name: "相手" })).getByText("パー"),
    ).toBeInTheDocument();
    await expect(canvas.getByText("負け")).toBeInTheDocument();
  },
};

/** Draw はパーどうしのあいこです。 */
export const Draw: Story = {
  args: { round: roundOf(drawView) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      within(canvas.getByRole("group", { name: "あなた" })).getByText("パー"),
    ).toBeInTheDocument();
    await expect(
      within(canvas.getByRole("group", { name: "相手" })).getByText("パー"),
    ).toBeInTheDocument();
    await expect(canvas.getByText("あいこでしょ！")).toBeInTheDocument();
  },
};
