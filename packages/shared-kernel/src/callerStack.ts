import type { LogContext } from "./Logger";

/** LoggerMethod は stack から取り除く境界になる、logger の公開メソッドです。 */
type LoggerMethod = (...args: never[]) => unknown;

/**
 * withCallerStack は context に呼び出し元の stack trace を補った context を返します。
 * loggerMethod 自身とそれより内側（logger の内部）の frame は含めず、先頭の frame が呼び出し元になるようにします。
 * context に既に stack があれば、それを優先して上書きしません。
 */
export function withCallerStack(
  context: LogContext | undefined,
  loggerMethod: LoggerMethod,
): LogContext {
  if (context !== undefined && "stack" in context) {
    return context;
  }

  return { ...context, stack: callerStack(loggerMethod) };
}

/**
 * callerStack は loggerMethod より外側の frame だけを並べた stack を返します。
 * Error.captureStackTrace は V8 系（Chrome・Edge・Node）にしか無いため、無い環境では
 * 先頭の "Error" 行だけを落とした stack で代える。logger 内部の frame は残るが、呼び出し元の frame は失わない
 */
function callerStack(loggerMethod: LoggerMethod): string {
  const holder: { stack?: string } = {};

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(holder, loggerMethod);
  } else {
    holder.stack = new Error().stack;
  }

  /* v8 ignore next -- @preserve defensive: Error が stack を持たない実行環境で、ログ出力自体を止めないための最後の保険 */
  if (holder.stack === undefined) {
    return "";
  }

  return framesOf(holder.stack);
}

/** framesOf は stack の文字列から、先頭のエラー名の行を除いた frame の行だけを返します。 */
function framesOf(stack: string): string {
  return stack
    .split("\n")
    .filter((line, index) => !(index === 0 && /^\w*Error\b/u.test(line)))
    .join("\n");
}
