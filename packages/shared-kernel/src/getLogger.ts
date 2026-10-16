import { ConsoleLogger } from "./ConsoleLogger";
import type { Logger } from "./Logger";

/** defaultLogger は差し替えが無いときに使う Logger です。 */
const defaultLogger: Logger = new ConsoleLogger();

/** currentLogger は getLogger が返す Logger です。setLogger だけが書き換えます。 */
let currentLogger: Logger = defaultLogger;

/** getLogger は処理側がログを出すための共通の取得口です。 */
export function getLogger(): Logger {
  return currentLogger;
}

/**
 * setLogger は getLogger が返す Logger を差し替えます。composition root とテストが使います。
 * 引数を省くと既定の ConsoleLogger に戻します。
 */
export function setLogger(logger: Logger = defaultLogger): void {
  currentLogger = logger;
}
