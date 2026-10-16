/** LogContext はログに添える、その分岐に入った原因を調査するための値です。 */
export type LogContext = Readonly<Record<string, unknown>>;

/**
 * Logger はプロジェクト全体で使うログ出力の公開契約です。
 * 処理側は実装クラスに依存せず、getLogger() で取得した Logger を使います。
 */
export interface Logger {
  /** debug は調査のための詳細な出力です。 */
  debug(message: string, context?: LogContext): void;

  /** info は通常の動作の記録です。 */
  info(message: string, context?: LogContext): void;

  /** warn は処理は続けられるが注意が要る事象の記録です。 */
  warn(message: string, context?: LogContext): void;

  /** error は失敗の記録です。呼び出し元の stack trace は実装が補います。 */
  error(message: string, context?: LogContext): void;
}
