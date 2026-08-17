import { describe, expect, it } from "vitest";
import { getCategoryMeta, EXPENSE_CATEGORIES } from "../expense-categories";

describe("EXPENSE_CATEGORIES", () => {
  it("has at least one category", () => {
    expect(EXPENSE_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("each category has required fields", () => {
    for (const cat of EXPENSE_CATEGORIES) {
      expect(cat.value).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.icon).toBeDefined();
    }
  });
});

describe("getCategoryMeta", () => {
  it("returns the matching category", () => {
    const first = EXPENSE_CATEGORIES[0];
    const result = getCategoryMeta(first.value);
    expect(result.value).toBe(first.value);
  });

  it("returns fallback for null/undefined/unknown", () => {
    const fallback = EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
    expect(getCategoryMeta(null).value).toBe(fallback.value);
    expect(getCategoryMeta(undefined).value).toBe(fallback.value);
    expect(getCategoryMeta("nonexistent").value).toBe(fallback.value);
  });
});
