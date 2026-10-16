import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

import { drawView, handSelectionView, loseView, winView } from "./fixtures/gameViews";
import { JankenScreen } from "./JankenScreen";

const meta = {
  component: JankenScreen,
  args: { onSelectHand: fn(), onRematch: fn() },
} satisfies Meta<typeof JankenScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** HandSelection は開いた直後の画面です。手のボタンと案内を出し、「もう一度勝負する」は出しません。 */
export const HandSelection: Story = {
  args: { view: handSelectionView },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: "じゃんけん" })).toBeInTheDocument();
    await expect(canvas.getByText("じゃんけん…手を選んでね")).toBeInTheDocument();
    await expect(canvas.getAllByRole("button", { name: /^(グー|チョキ|パー)$/u })).toHaveLength(3);
    await expect(
      canvas.queryByRole("button", { name: "もう一度勝負する" }),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "パー" }));
    await expect(args.onSelectHand).toHaveBeenCalledWith("paper");
  },
};

/** Draw はあいこの直後の画面です。結果を出したまま手のボタンを残し、「もう一度勝負する」は出しません。 */
export const Draw: Story = {
  args: { view: drawView },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("あいこでしょ！")).toBeInTheDocument();
    await expect(canvas.queryByText("じゃんけん…手を選んでね")).not.toBeInTheDocument();
    await expect(canvas.getAllByRole("button", { name: /^(グー|チョキ|パー)$/u })).toHaveLength(3);
    await expect(
      canvas.queryByRole("button", { name: "もう一度勝負する" }),
    ).not.toBeInTheDocument();
  },
};

/** Win は勝った直後の画面です。手のボタンを「もう一度勝負する」に替えます。 */
export const Win: Story = {
  args: { view: winView },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("勝ち", { selector: "p" })).toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: /^(グー|チョキ|パー)$/u }),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "もう一度勝負する" }));
    await expect(args.onRematch).toHaveBeenCalledOnce();
  },
};

/** Lose は負けた直後の画面です。手のボタンを「もう一度勝負する」に替えます。 */
export const Lose: Story = {
  args: { view: loseView },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("負け", { selector: "p" })).toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: /^(グー|チョキ|パー)$/u }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "もう一度勝負する" })).toBeInTheDocument();
  },
};
