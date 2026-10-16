import { afterEach, describe, expect, it } from "vitest";

import { ConsoleLogger } from "./ConsoleLogger";
import { getLogger, setLogger } from "./getLogger";
import { MemoryLogger } from "./MemoryLogger";

afterEach(() => {
  setLogger();
});

describe("getLogger", () => {
  it("差し替えていなければ ConsoleLogger を返す", () => {
    expect(getLogger()).toBeInstanceOf(ConsoleLogger);
  });
});

describe("setLogger", () => {
  it("差し替えた logger を getLogger が返す", () => {
    const logger = new MemoryLogger();

    setLogger(logger);

    expect(getLogger()).toBe(logger);
  });

  it("引数なしで呼ぶと既定の ConsoleLogger に戻す", () => {
    setLogger(new MemoryLogger());

    setLogger();

    expect(getLogger()).toBeInstanceOf(ConsoleLogger);
  });
});
