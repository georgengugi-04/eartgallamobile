import { AxiosError } from "axios";
import { getErrorMessage } from "../utils/errors";

describe("getErrorMessage", () => {
  it("uses the server message when present", () => {
    const err = new AxiosError("fail", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 401,
      data: { message: "Invalid email or password" },
    } as never);
    expect(getErrorMessage(err)).toBe("Invalid email or password");
  });

  it("reports a network problem when there is no response", () => {
    expect(getErrorMessage(new AxiosError("Network Error"))).toMatch(/reach the server/);
  });

  it("falls back for unknown errors", () => {
    expect(getErrorMessage(new Error("boom"), "Nope")).toBe("Nope");
  });
});
