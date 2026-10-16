import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

import { BattleRecordPanel } from "./BattleRecordPanel";
import { handSelectionView, loseView } from "./fixtures/gameViews";

const meta = {
  component: BattleRecordPanel,
} satisfies Meta<typeof BattleRecordPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** NoRounds は一度も判定していない戦績です。割合は計算できないので「-」を出します。 */
export const NoRounds: Story = {
  args: { record: handSelectionView.record },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const label of ["勝ち", "負け", "あいこ"]) {
      const tally = within(canvas.getByRole("group", { name: label }));
      await expect(tally.getByText("0回")).toBeInTheDocument();
      await expect(tally.getByText("-")).toBeInTheDocument();
    }
  },
};

/** WithPercentages は回数と割合がある戦績です。3 つの割合の合計が 100 にならなくてもそのまま出します。 */
export const WithPercentages: Story = {
  args: { record: loseView.record },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const label of ["勝ち", "負け", "あいこ"]) {
      const tally = within(canvas.getByRole("group", { name: label }));
      await expect(tally.getByText("1回")).toBeInTheDocument();
      await expect(tally.getByText("33%")).toBeInTheDocument();
    }
  },
};
