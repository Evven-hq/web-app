import { describe, expect, it } from "vitest";
import {
  splitEvenly,
  splitByPercentage,
  remainderAmount,
} from "../split-utils";

describe("splitEvenly", () => {
  it("returns empty array when count is 0", () => {
    expect(splitEvenly(100, 0)).toEqual([]);
  });

  it("splits evenly when divisible", () => {
    const result = splitEvenly(120, 3);
    expect(result).toEqual([40, 40, 40]);
  });

  it("distributes remainder to first N participants", () => {
    const result = splitEvenly(100, 3);
    expect(result).toEqual([33.34, 33.33, 33.33]);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 2);
  });

  it("handles single participant", () => {
    expect(splitEvenly(50, 1)).toEqual([50]);
  });

  it("handles decimal amounts", () => {
    const result = splitEvenly(99.99, 2);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(99.99, 2);
  });
});

describe("splitByPercentage", () => {
  it("returns empty array when no percentages", () => {
    expect(splitByPercentage(100, [])).toEqual([]);
  });

  it("splits by percentage", () => {
    const result = splitByPercentage(100, [50, 50]);
    expect(result).toEqual([50, 50]);
  });

  it("last participant gets the remainder", () => {
    const result = splitByPercentage(100, [33, 33]);
    expect(result[0]).toBe(33);
    expect(result[1]).toBe(67);
  });
});

describe("remainderAmount", () => {
  it("returns 0 when fully allocated", () => {
    expect(remainderAmount(100, 100)).toBe(0);
  });

  it("returns difference", () => {
    expect(remainderAmount(100, 60)).toBe(40);
  });
});
