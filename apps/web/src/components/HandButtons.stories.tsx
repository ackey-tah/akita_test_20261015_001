import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

import { HandButtons } from "./HandButtons";

const meta = {
  component: HandButtons,
  args: { onSelectHand: fn() },
} satisfies Meta<typeof HandButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Selectable はグー・チョキ・パーを選べるボタンです。押した手を親に渡します。 */
export const Selectable: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "グー" }));
    await userEvent.click(canvas.getByRole("button", { name: "チョキ" }));
    await userEvent.click(canvas.getByRole("button", { name: "パー" }));

    await expect(args.onSelectHand).toHaveBeenNthCalledWith(1, "rock");
    await expect(args.onSelectHand).toHaveBeenNthCalledWith(2, "scissors");
    await expect(args.onSelectHand).toHaveBeenNthCalledWith(3, "paper");
  },
};
