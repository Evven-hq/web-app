import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { isDesktop } from "../desktop";

describe("isDesktop", () => {
  let originalWindow: typeof globalThis.window | undefined;

  beforeEach(() => {
    originalWindow = globalThis.window;
    sessionStorage.clear();
  });

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as Record<string, unknown>).window;
    } else {
      globalThis.window = originalWindow;
    }
    sessionStorage.clear();
  });

  it("returns false when window is undefined (SSR)", () => {
    delete (globalThis as Record<string, unknown>).window;
    expect(isDesktop()).toBe(false);
  });

  it("returns false for a normal browser UA", () => {
    (globalThis as Record<string, unknown>).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
      writable: true,
      configurable: true,
    });
    sessionStorage.removeItem("evven-runtime-mode");
    expect(isDesktop()).toBe(false);
  });

  it("returns true when sessionStorage flag is set", () => {
    (globalThis as Record<string, unknown>).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 Chrome/120.0.0.0" },
      writable: true,
      configurable: true,
    });
    sessionStorage.setItem("evven-runtime-mode", "desktop");
    expect(isDesktop()).toBe(true);
  });

  it("returns true for tauri UA", () => {
    (globalThis as Record<string, unknown>).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 Tauri/1.0" },
      writable: true,
      configurable: true,
    });
    sessionStorage.removeItem("evven-runtime-mode");
    expect(isDesktop()).toBe(true);
  });

  it("returns true for pake UA", () => {
    (globalThis as Record<string, unknown>).window = {};
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: "Mozilla/5.0 Pake/1.0" },
      writable: true,
      configurable: true,
    });
    sessionStorage.removeItem("evven-runtime-mode");
    expect(isDesktop()).toBe(true);
  });
});
