import { afterEach, describe, expect, it, vi } from "vitest";

import { RandomOpponentHandPicker } from "./RandomOpponentHandPicker";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("pick", () => {
  it.each([
    { randomValue: 0, expected: "rock" },
    { randomValue: 0.5, expected: "scissors" },
    { randomValue: 0.9, expected: "paper" },
  ])(
    "ブラウザの乱数 $randomValue から、等確率の規則で $expected の手を選ぶ",
    ({ randomValue, expected }) => {
      vi.spyOn(Math, "random").mockReturnValue(randomValue);

      expect(new RandomOpponentHandPicker().pick().kind()).toBe(expected);
    },
  );

  it("選ぶたびに乱数を 1 回だけ取り出す", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);

    new RandomOpponentHandPicker().pick();

    expect(random).toHaveBeenCalledOnce();
  });
});
