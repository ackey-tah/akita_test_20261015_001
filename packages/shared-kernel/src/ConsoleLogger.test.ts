import { afterEach, describe, expect, it, vi } from "vitest";

import { ConsoleLogger } from "./ConsoleLogger";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("debug", () => {
  it("console.debug に message と context を渡す", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => undefined);

    new ConsoleLogger().debug("調査用の出力", { round: 1 });

    expect(spy).toHaveBeenCalledWith("調査用の出力", { round: 1 });
  });
});

describe("info", () => {
  it("console.info に message と context を渡す", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    new ConsoleLogger().info("情報の出力", { round: 1 });

    expect(spy).toHaveBeenCalledWith("情報の出力", { round: 1 });
  });

  it("context が無いときは message だけを渡す", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    new ConsoleLogger().info("情報の出力");

    expect(spy).toHaveBeenCalledWith("情報の出力");
  });
});

describe("warn", () => {
  it("console.warn に message と context を渡す", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    new ConsoleLogger().warn("警告の出力", { value: 2 });

    expect(spy).toHaveBeenCalledWith("警告の出力", { value: 2 });
  });
});

describe("error", () => {
  it("console.error に message と、呼び出し元の stack を補った context を渡す", function callerOfError() {
    const received: unknown[] = [];
    vi.spyOn(console, "error").mockImplementation((...data: unknown[]) => {
      received.push(...data);
    });

    new ConsoleLogger().error("失敗の出力", { value: 3 });

    const [message, context] = received;
    expect(message).toBe("失敗の出力");
    expect(context).toHaveProperty("value", 3);
    // stack の先頭の frame（1 行目）が呼び出し元であること
    expect(context).toHaveProperty("stack", expect.stringMatching(/^[^\n]*callerOfError/u));
  });

  it("context に既に stack があれば上書きしない", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    new ConsoleLogger().error("失敗の出力", { stack: "既存の stack" });

    expect(spy).toHaveBeenCalledWith("失敗の出力", { stack: "既存の stack" });
  });
});
