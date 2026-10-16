import { describe, expect, it } from "vitest";

import { DomainError } from "./DomainError";

type SampleErrorCode = "sample_failed";

/** SampleError は DomainError の振る舞いを確かめるためのテスト用の継承クラスです。 */
class SampleError extends DomainError<SampleErrorCode> {
  readonly packageCode = "sample";
}

describe("constructor", () => {
  it("継承クラスが固定した packageCode と、渡した errorCode・detail を持つ", () => {
    const error = new SampleError("sample_failed", "sample operation failed");

    expect(error.packageCode).toBe("sample");
    expect(error.errorCode).toBe("sample_failed");
    expect(error.detail).toBe("sample operation failed");
  });

  it("message に detail を、name に継承クラスの名前を入れる", () => {
    const error = new SampleError("sample_failed", "sample operation failed");

    expect(error.message).toBe("sample operation failed");
    expect(error.name).toBe("SampleError");
  });

  it("Error としても DomainError としても扱える", () => {
    const error = new SampleError("sample_failed", "sample operation failed");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
  });
});

describe("code", () => {
  it("packageCode と errorCode をドットでつないだ識別子を返す", () => {
    const error = new SampleError("sample_failed", "sample operation failed");

    expect(error.code).toBe("sample.sample_failed");
  });
});
