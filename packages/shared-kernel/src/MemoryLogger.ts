import { withCallerStack } from "./callerStack";
import type { LogContext, Logger } from "./Logger";

/** LogLevel はログの重要度です。 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** LogEntry は MemoryLogger が蓄積した 1 件の出力です。 */
export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly context: LogContext | undefined;
}

/**
 * MemoryLogger は出力をメモリに蓄積する Logger の実装です。
 * テストでログの内容を確かめるときに、手書きの logger の代わりに使います（rules/development の「Logger ルール」）。
 */
export class MemoryLogger implements Logger {
  readonly #entries: LogEntry[] = [];

  debug(message: string, context?: LogContext): void {
    this.#entries.push({ level: "debug", message, context });
  }

  info(message: string, context?: LogContext): void {
    this.#entries.push({ level: "info", message, context });
  }

  warn(message: string, context?: LogContext): void {
    this.#entries.push({ level: "warn", message, context });
  }

  // error だけ arrow function のプロパティにしている理由は ConsoleLogger と同じ（stack を切る境界として自分を渡す）
  readonly error = (message: string, context?: LogContext): void => {
    this.#entries.push({
      level: "error",
      message,
      context: withCallerStack(context, this.error),
    });
  };

  /** entries は蓄積した出力を出力順に返します。返した配列を変えても蓄積には影響しません。 */
  entries(): LogEntry[] {
    return [...this.#entries];
  }

  /** clear は蓄積した出力を捨てます。 */
  clear(): void {
    this.#entries.length = 0;
  }
}
