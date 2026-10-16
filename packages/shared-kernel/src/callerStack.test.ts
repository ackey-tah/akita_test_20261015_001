import { afterEach, describe, expect, it } from "vitest";

import { withCallerStack } from "./callerStack";
import type { LogContext } from "./Logger";

/** sampleLoggerMethod は logger の公開メソッドに見立てた関数で、この関数より内側の frame が落ちることを確かめます。 */
function sampleLoggerMethod(context?: LogContext): LogContext {
  return withCallerStack(context, sampleLoggerMethod);
}

const captureStackTraceDescriptor = Object.getOwnPropertyDescriptor(Error, "captureStackTrace");

afterEach(() => {
  if (captureStackTraceDescriptor !== undefined) {
    Object.defineProperty(Error, "captureStackTrace", captureStackTraceDescriptor);
  }
});

describe("withCallerStack", () => {
  it("context に呼び出し元の stack を補い、logger の公開メソッドの frame を含めない", function callerOfLogger() {
    const context = sampleLoggerMethod({ round: 1 });

    expect(context.round).toBe(1);
    expect(typeof context.stack).toBe("string");
    const stack = String(context.stack);
    expect(stack.split("\n")[0]).toContain("callerOfLogger");
    expect(stack).not.toContain("sampleLoggerMethod");
  });

  it("context が無くても stack だけを持つ context を返す", () => {
    const context = sampleLoggerMethod();

    expect(Object.keys(context)).toEqual(["stack"]);
  });

  it("context に既に stack があれば上書きしない", () => {
    const context = sampleLoggerMethod({ stack: "既存の stack" });

    expect(context.stack).toBe("既存の stack");
  });

  it("Error.captureStackTrace が無い実行環境でも、先頭の Error 行を除き、呼び出し元の frame を含む stack を補う", function callerOfLogger() {
    // V8 以外のブラウザを模すため、captureStackTrace を取り除く
    Reflect.deleteProperty(Error, "captureStackTrace");

    const stack = String(sampleLoggerMethod().stack);

    expect(stack).not.toMatch(/^Error/u);
    expect(stack).toContain("callerOfLogger");
  });
});
