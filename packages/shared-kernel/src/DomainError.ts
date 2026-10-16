/**
 * DomainError はドメイン上の失敗を表す例外の基底クラスです。
 * module ごとの継承クラスが packageCode を固定し、module-local な errorCode との組でエラーを識別します。
 * ログは出力しません。原因の値は throw する直前の処理が logger に出します（rules/development の「エラーハンドリングルール」）。
 */
export abstract class DomainError<TErrorCode extends string = string> extends Error {
  /** packageCode はエラーを出した module の識別子（英語 snake_case）です。継承クラスが固定します。 */
  abstract readonly packageCode: string;

  /** errorCode は module の中でエラーを識別する英語 snake_case の識別子です。 */
  readonly errorCode: TErrorCode;

  /** detail は調査とログで使う、安定した英語の説明です。 */
  readonly detail: string;

  constructor(errorCode: TErrorCode, detail: string) {
    super(detail);
    this.name = new.target.name;
    this.errorCode = errorCode;
    this.detail = detail;
  }

  /** code は packageCode と errorCode をつないだ、module をまたいで一意な識別子です。 */
  get code(): string {
    return `${this.packageCode}.${this.errorCode}`;
  }
}
