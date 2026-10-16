import { DomainError } from "@janken-app/shared-kernel";

import type { JankenErrorCode } from "./JankenErrorCode";

/** JankenError は janken module のドメイン上の失敗を表す例外です。 */
export class JankenError extends DomainError<JankenErrorCode> {
  readonly packageCode = "janken";

  // 基底が入れるクラス名は本番ビルドの minify で短縮されるため、ログで読める名前を文字列で固定する
  override readonly name = "JankenError";
}
