import { describe, expect, it } from "vitest";
import { getPaymentModeMeta, PAYMENT_MODES } from "../payment-modes";

describe("PAYMENT_MODES", () => {
  it("has at least one mode", () => {
    expect(PAYMENT_MODES.length).toBeGreaterThan(0);
  });
});

describe("getPaymentModeMeta", () => {
  it("returns matching mode", () => {
    const result = getPaymentModeMeta("upi");
    expect(result?.value).toBe("upi");
  });

  it("is case-insensitive", () => {
    expect(getPaymentModeMeta("UPI")?.value).toBe("upi");
    expect(getPaymentModeMeta("Cash")?.value).toBe("cash");
  });

  it("returns null for null/undefined/unknown", () => {
    expect(getPaymentModeMeta(null)).toBeNull();
    expect(getPaymentModeMeta(undefined)).toBeNull();
    expect(getPaymentModeMeta("bitcoin")).toBeNull();
  });
});
