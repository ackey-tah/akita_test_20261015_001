import { describe, expect, it } from "vitest";

import { MemoryLogger } from "./MemoryLogger";

describe("debug", () => {
  it("debug レベルの出力として蓄積する", () => {
    const logger = new MemoryLogger();

    logger.debug("調査用の出力", { round: 1 });

    expect(logger.entries()).toEqual([
      { level: "debug", message: "調査用の出力", context: { round: 1 } },
    ]);
  });
});

describe("info", () => {
  it("info レベルの出力として蓄積する", () => {
    const logger = new MemoryLogger();

    logger.info("情報の出力");

    expect(logger.entries()).toEqual([
      { level: "info", message: "情報の出力", context: undefined },
    ]);
  });
});

describe("warn", () => {
  it("warn レベルの出力として蓄積する", () => {
    const logger = new MemoryLogger();

    logger.warn("警告の出力", { value: 2 });

    expect(logger.entries()).toEqual([
      { level: "warn", message: "警告の出力", context: { value: 2 } },
    ]);
  });
});

describe("error", () => {
  it("error レベルの出力として、呼び出し元の stack を補って蓄積する", function callerOfError() {
    const logger = new MemoryLogger();

    logger.error("失敗の出力", { value: 3 });

    const [entry] = logger.entries();
    expect(entry?.level).toBe("error");
    expect(entry?.message).toBe("失敗の出力");
    expect(entry?.context?.value).toBe(3);
    expect(String(entry?.context?.stack).split("\n")[0]).toContain("callerOfError");
  });

  it("context に既に stack があれば上書きしない", () => {
    const logger = new MemoryLogger();

    logger.error("失敗の出力", { stack: "既存の stack" });

    expect(logger.entries()[0]?.context?.stack).toBe("既存の stack");
  });
});

describe("entries", () => {
  it("出力した順に並べ、内部の蓄積とは別の配列を返す", () => {
    const logger = new MemoryLogger();
    logger.info("1 件目");
    logger.warn("2 件目");

    const entries = logger.entries();
    entries.pop();

    expect(logger.entries().map((entry) => entry.message)).toEqual(["1 件目", "2 件目"]);
  });
});

describe("clear", () => {
  it("蓄積した出力を空にする", () => {
    const logger = new MemoryLogger();
    logger.info("消える出力");

    logger.clear();

    expect(logger.entries()).toEqual([]);
  });
});
