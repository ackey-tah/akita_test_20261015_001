import { withCallerStack } from "./callerStack";
import type { LogContext, Logger } from "./Logger";

/** ConsoleWrite は console のレベルごとの出力関数です。 */
type ConsoleWrite = (...data: unknown[]) => void;

/**
 * write は context があるときだけ context を添えて出力します。
 * context が無いときに undefined を渡すと、ブラウザのコンソールに毎回 "undefined" が並ぶため
 */
function write(consoleWrite: ConsoleWrite, message: string, context?: LogContext): void {
  if (context === undefined) {
    consoleWrite(message);
  } else {
    consoleWrite(message, context);
  }
}

/** ConsoleLogger はブラウザと Node の console にログを出す Logger の実装です。 */
export class ConsoleLogger implements Logger {
  debug(message: string, context?: LogContext): void {
    write(console.debug, message, context);
  }

  info(message: string, context?: LogContext): void {
    write(console.info, message, context);
  }

  warn(message: string, context?: LogContext): void {
    write(console.warn, message, context);
  }

  // error だけ arrow function のプロパティにしているのは、自分自身を stack を切る境界として
  // withCallerStack に渡すため。prototype のメソッドを値として渡すと this を失う書き方になる
  readonly error = (message: string, context?: LogContext): void => {
    write(console.error, message, withCallerStack(context, this.error));
  };
}
