import { DomainError } from "@janken-app/shared-kernel";
import { describe, expect, it } from "vitest";

import { JankenError } from "./JankenError";

describe("constructor", () => {
  it("janken module のエラーとして、packageCode と errorCode をつないだ code を持つ", () => {
    const error = new JankenError("random_value_out_of_range", "random value must be in [0, 1)");

    expect(error.packageCode).toBe("janken");
    expect(error.errorCode).toBe("random_value_out_of_range");
    expect(error.code).toBe("janken.random_value_out_of_range");
    expect(error.detail).toBe("random value must be in [0, 1)");
  });

  it("本番ビルドでクラス名が短縮されても、name は JankenError のまま", () => {
    const error = new JankenError("random_value_out_of_range", "random value must be in [0, 1)");

    expect(error.name).toBe("JankenError");
  });

  it("DomainError として扱える", () => {
    const error = new JankenError("random_value_out_of_range", "random value must be in [0, 1)");

    expect(error).toBeInstanceOf(DomainError);
  });
});
