import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createJankenGame } from "../../apps/web/src/composition/createJankenGame";
import { JankenPage } from "../../apps/web/src/screens/JankenPage";

// UC-01 じゃんけんで対戦する（docs/usecases/UC-01-じゃんけんで対戦する.md）の受け入れ基準を、
// 本物の composition root と画面を描画して、利用者と同じ操作で確かめる。

/** HandLabel は画面に出る手の名前です。 */
type HandLabel = "グー" | "チョキ" | "パー";

/**
 * randomValueOf は、相手にその手を出させる乱数の値です。
 * 乱数の外部入力だけを差し替え、相手の手を選ぶ adapter と等確率の規則は本物を通す。
 */
const randomValueOf: Readonly<Record<HandLabel, number>> = {
  グー: 0,
  チョキ: 0.5,
  パー: 0.9,
};

/** opponentWillPlay は、相手がこの順に手を出すように乱数を並べます。 */
function opponentWillPlay(...hands: HandLabel[]): void {
  const random = vi.spyOn(Math, "random");
  for (const hand of hands) {
    random.mockReturnValueOnce(randomValueOf[hand]);
  }
}

/** openPage はじゃんけん画面を開きます。開くたびに composition root を呼び直し、新しい対戦にする。 */
function openPage(): ReturnType<typeof userEvent.setup> {
  render(<JankenPage game={createJankenGame()} />);
  return userEvent.setup();
}

/** handButton は手のボタンです。 */
function handButton(hand: HandLabel): HTMLElement {
  return screen.getByRole("button", { name: hand });
}

/** handButtons は表示されている手のボタンの一覧です。 */
function handButtons(): HTMLElement[] {
  return screen.queryAllByRole("button", { name: /^(グー|チョキ|パー)$/u });
}

/** rematchButton は「もう一度勝負する」ボタンです。無ければ null です。 */
function rematchButton(): HTMLElement | null {
  return screen.queryByRole("button", { name: "もう一度勝負する" });
}

/** tally は戦績のうち、勝ち・負け・あいこのどれか 1 つの枠です。 */
function tally(label: "勝ち" | "負け" | "あいこ"): HTMLElement {
  return within(screen.getByRole("group", { name: "戦績" })).getByRole("group", { name: label });
}

/** expectRecord は戦績の 3 つの枠の表示（回数と割合）を確かめます。 */
function expectRecord(expected: Record<"勝ち" | "負け" | "あいこ", string>): void {
  for (const label of ["勝ち", "負け", "あいこ"] as const) {
    expect(tally(label)).toHaveTextContent(`${label}${expected[label]}`);
  }
}

/** expectRound は表示されている両者の手と勝敗の文言を確かめます。 */
function expectRound(player: HandLabel, opponent: HandLabel, result: string): void {
  expect(screen.getByRole("group", { name: "あなた" })).toHaveTextContent(player);
  expect(screen.getByRole("group", { name: "相手" })).toHaveTextContent(opponent);
  expect(screen.getByText(result, { selector: "p" })).toBeInTheDocument();
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("UC-01 じゃんけんで対戦する", () => {
  it("UC-01 要件 1: 画面を開いたとき、3 つの手のボタンを表示し、「もう一度勝負する」は表示しない", () => {
    // 前提: ページをまだ開いていない
    // 操作: ページを開く
    openPage();

    // 期待: グー・チョキ・パーのボタンがあり、「もう一度勝負する」は無い
    expect(handButtons().map((button) => button.textContent)).toEqual([
      "✊グー",
      "✌️チョキ",
      "✋パー",
    ]);
    expect(rematchButton()).not.toBeInTheDocument();
  });

  it("UC-01 要件 2 / UC-01 要件 13: 画面を開いたとき、戦績を 0 回で表示し、割合は「-」と表示する", () => {
    // 前提: ページをまだ開いていない
    // 操作: ページを開く
    openPage();

    // 期待: 一度も判定していないので、3 つとも 0 回で割合は「-」
    expectRecord({ 勝ち: "0回-", 負け: "0回-", あいこ: "0回-" });
  });

  it.each([
    { randomValue: 0, opponent: "グー" },
    { randomValue: 0.3333, opponent: "グー" },
    { randomValue: 0.3334, opponent: "チョキ" },
    { randomValue: 0.6666, opponent: "チョキ" },
    { randomValue: 0.6667, opponent: "パー" },
    { randomValue: 0.9999, opponent: "パー" },
  ] as const)(
    "UC-01 要件 3: 相手の手は、乱数の値 $randomValue を 3 等分した区間で $opponent に決まる",
    async ({ randomValue, opponent }) => {
      // 前提: 相手の乱数が表の値になる
      vi.spyOn(Math, "random").mockReturnValueOnce(randomValue);
      const user = openPage();

      // 操作: プレイヤーがグーを押す
      await user.click(handButton("グー"));

      // 期待: 相手の手が乱数の区間に対応する手になる
      expect(screen.getByRole("group", { name: "相手" })).toHaveTextContent(opponent);
    },
  );

  it.each([
    { player: "グー", opponent: "チョキ", result: "勝ち" },
    { player: "チョキ", opponent: "パー", result: "勝ち" },
    { player: "パー", opponent: "グー", result: "勝ち" },
    { player: "グー", opponent: "パー", result: "負け" },
    { player: "チョキ", opponent: "グー", result: "負け" },
    { player: "パー", opponent: "チョキ", result: "負け" },
    { player: "グー", opponent: "グー", result: "あいこでしょ！" },
    { player: "チョキ", opponent: "チョキ", result: "あいこでしょ！" },
    { player: "パー", opponent: "パー", result: "あいこでしょ！" },
  ] as const)(
    "UC-01 要件 4: $player と $opponent の勝負は「$result」と判定する",
    async ({ player, opponent, result }) => {
      // 前提: 相手が表の手を出す
      opponentWillPlay(opponent);
      const user = openPage();

      // 操作: プレイヤーが表の手を押す
      await user.click(handButton(player));

      // 期待: 手の組み合わせどおりに判定される
      expectRound(player, opponent, result);
    },
  );

  it("UC-01 要件 5 / UC-01 要件 6 / UC-01 要件 9: 勝ったら両者の手と「勝ち」を表示し、手のボタンを「もう一度勝負する」に替え、勝ちを 1 回数える", async () => {
    // 前提: 画面を開いた直後で、相手がチョキを出す
    opponentWillPlay("チョキ");
    const user = openPage();

    // 操作: プレイヤーがグーを押す
    await user.click(handButton("グー"));

    // 期待: 結果が表示され、手のボタンが消えて「もう一度勝負する」が出て、戦績の勝ちが 1 回になる
    expectRound("グー", "チョキ", "勝ち");
    expect(handButtons()).toHaveLength(0);
    expect(rematchButton()).toBeInTheDocument();
    expectRecord({ 勝ち: "1回100%", 負け: "0回0%", あいこ: "0回0%" });
  });

  it("UC-01 要件 5 / UC-01 要件 6 / UC-01 要件 9: 負けたら両者の手と「負け」を表示し、手のボタンを「もう一度勝負する」に替え、負けを 1 回数える", async () => {
    // 前提: 画面を開いた直後で、相手がグーを出す
    opponentWillPlay("グー");
    const user = openPage();

    // 操作: プレイヤーがチョキを押す
    await user.click(handButton("チョキ"));

    // 期待: 結果が表示され、手のボタンが消えて「もう一度勝負する」が出て、戦績の負けが 1 回になる
    expectRound("チョキ", "グー", "負け");
    expect(handButtons()).toHaveLength(0);
    expect(rematchButton()).toBeInTheDocument();
    expectRecord({ 勝ち: "0回0%", 負け: "1回100%", あいこ: "0回0%" });
  });

  it("UC-01 要件 7 / UC-01 要件 8 / UC-01 要件 9: あいこなら「あいこでしょ！」を表示して手のボタンを残し、続けて押すと新しい勝負になる", async () => {
    // 前提: 画面を開いた直後で、相手がパー、続けてパーを出す
    opponentWillPlay("パー", "パー");
    const user = openPage();

    // 操作: プレイヤーがパーを押す
    await user.click(handButton("パー"));

    // 期待: あいこが表示され、手のボタンは残り、「もう一度勝負する」は出ない。あいこが 1 回になる
    expectRound("パー", "パー", "あいこでしょ！");
    expect(handButtons()).toHaveLength(3);
    expect(rematchButton()).not.toBeInTheDocument();
    expectRecord({ 勝ち: "0回0%", 負け: "0回0%", あいこ: "1回100%" });

    // 操作: 続けてチョキを押す
    await user.click(handButton("チョキ"));

    // 期待: 新しい勝負として判定され、勝ちが表示される
    expectRound("チョキ", "パー", "勝ち");
    expect(handButtons()).toHaveLength(0);
    expectRecord({ 勝ち: "1回50%", 負け: "0回0%", あいこ: "1回50%" });
  });

  it("UC-01 要件 7 / UC-01 要件 8: あいこが続いても、そのたびに「あいこでしょ！」を表示して手のボタンを残す", async () => {
    // 前提: 相手が 3 回続けてグーを出す
    opponentWillPlay("グー", "グー", "グー");
    const user = openPage();

    // 操作: プレイヤーがグーを 3 回押す
    for (let round = 0; round < 3; round += 1) {
      await user.click(handButton("グー"));

      // 期待: 毎回あいこが表示され、手のボタンが残る
      expectRound("グー", "グー", "あいこでしょ！");
      expect(handButtons()).toHaveLength(3);
    }

    // 期待: あいこが 3 回数えられる
    expectRecord({ 勝ち: "0回0%", 負け: "0回0%", あいこ: "3回100%" });
  });

  it("UC-01 要件 10: 割合は 3 つの回数の合計に対するパーセンテージを、小数第 1 位で四捨五入した整数で表示する", async () => {
    // 前提: 相手がチョキ → グー → チョキを出す
    opponentWillPlay("チョキ", "グー", "チョキ");
    const user = openPage();

    // 操作: 勝ち → もう一度 → 負け → もう一度 → 勝ち、と続ける
    await user.click(handButton("グー"));
    await user.click(screen.getByRole("button", { name: "もう一度勝負する" }));
    await user.click(handButton("チョキ"));
    await user.click(screen.getByRole("button", { name: "もう一度勝負する" }));
    await user.click(handButton("グー"));

    // 期待: 2/3 = 66.6… は 67%、1/3 = 33.3… は 33%
    expectRecord({ 勝ち: "2回67%", 負け: "1回33%", あいこ: "0回0%" });
  });

  it("UC-01 要件 10: 3 つの割合の合計が 100% にならなくても、そのまま表示する", async () => {
    // 前提: 相手がチョキ → パー → グーを出す
    opponentWillPlay("チョキ", "パー", "グー");
    const user = openPage();

    // 操作: 勝ち → もう一度 → 負け → もう一度 → あいこ、と 1 回ずつ出す
    await user.click(handButton("グー"));
    await user.click(screen.getByRole("button", { name: "もう一度勝負する" }));
    await user.click(handButton("グー"));
    await user.click(screen.getByRole("button", { name: "もう一度勝負する" }));
    await user.click(handButton("グー"));

    // 期待: 3 つとも 33% で、合計は 99% のまま
    expectRecord({ 勝ち: "1回33%", 負け: "1回33%", あいこ: "1回33%" });
  });

  it("UC-01 要件 11: もう一度勝負すると、前回の手と結果を消して手のボタンを表示し、戦績は残す", async () => {
    // 前提: グーでチョキに勝った結果が表示されている
    opponentWillPlay("チョキ");
    const user = openPage();
    await user.click(handButton("グー"));

    // 操作: 「もう一度勝負する」を押す
    await user.click(screen.getByRole("button", { name: "もう一度勝負する" }));

    // 期待: 結果が消えて手のボタンが戻り、「もう一度勝負する」は消え、戦績は勝ち 1 回のまま
    expect(screen.queryByRole("group", { name: "あなた" })).not.toBeInTheDocument();
    expect(screen.queryByText("勝ち", { selector: "p" })).not.toBeInTheDocument();
    expect(handButtons()).toHaveLength(3);
    expect(rematchButton()).not.toBeInTheDocument();
    expectRecord({ 勝ち: "1回100%", 負け: "0回0%", あいこ: "0回0%" });
  });

  it("UC-01 要件 12: 勝負を何十回続けても、手を選んで遊び続けられる", async () => {
    // 前提: 相手が 50 回続けてグーを出す
    const rounds = 50;
    opponentWillPlay(...Array.from({ length: rounds }, () => "グー" as const));
    const user = openPage();

    // 操作: プレイヤーがグーを 50 回押す
    for (let round = 0; round < rounds; round += 1) {
      await user.click(handButton("グー"));
    }

    // 期待: 50 回とも勝負として数えられ、まだ手を選べる
    expectRecord({ 勝ち: "0回0%", 負け: "0回0%", あいこ: "50回100%" });
    expect(handButtons()).toHaveLength(3);
  });

  it("UC-01 要件 14: ページを開き直したら、戦績を 0 回から数え直す", async () => {
    // 前提: 勝ち 1 回の戦績がある
    opponentWillPlay("チョキ");
    const user = openPage();
    await user.click(handButton("グー"));
    expectRecord({ 勝ち: "1回100%", 負け: "0回0%", あいこ: "0回0%" });

    // 操作: ページを開き直す（画面を捨て、composition root から作り直す）
    cleanup();
    openPage();

    // 期待: 戦績は 0 回で、割合は「-」に戻る
    expectRecord({ 勝ち: "0回-", 負け: "0回-", あいこ: "0回-" });
    expect(handButtons()).toHaveLength(3);
  });

  it("UC-01 要件 15: 勝ちまたは負けの結果を表示している間は、手のボタン以外の操作でも新しい勝負を始めない", async () => {
    // 前提: チョキでグーに負けた結果が表示されている
    opponentWillPlay("グー");
    const user = openPage();
    await user.click(handButton("チョキ"));

    // 操作: 「もう一度勝負する」以外の場所を押し、キーボードの Tab で手のボタンを探す
    await user.click(screen.getByRole("heading", { name: "じゃんけん" }));
    const reachedButtons = new Set<string>();
    for (let step = 0; step < 5; step += 1) {
      await user.tab();
      if (document.activeElement instanceof HTMLButtonElement) {
        reachedButtons.add(document.activeElement.textContent ?? "");
      }
    }

    // 期待: Tab で届くボタンは「もう一度勝負する」だけで、結果も戦績も変わらない
    expect([...reachedButtons]).toEqual(["もう一度勝負する"]);
    expect(handButtons()).toHaveLength(0);
    expectRound("チョキ", "グー", "負け");
    expectRecord({ 勝ち: "0回0%", 負け: "1回100%", あいこ: "0回0%" });
  });

  it("UC-01 要件 16: 手のボタンを素早く続けて押しても、1 回押すごとに 1 回の勝負として判定する", async () => {
    // 前提: 相手が 1 回目にグー（あいこ）、2 回目にパーを出す
    opponentWillPlay("グー", "パー");
    const user = openPage();

    // 操作: プレイヤーがグーを素早く 2 回押す
    await user.dblClick(handButton("グー"));

    // 期待: 1 回目はあいこ、2 回目は負けとして判定され、戦績の合計は押した回数の 2 と一致する
    expectRound("グー", "パー", "負け");
    expectRecord({ 勝ち: "0回0%", 負け: "1回50%", あいこ: "1回50%" });
  });
});
