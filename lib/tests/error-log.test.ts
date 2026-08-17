import { describe, expect, it, vi, beforeEach } from "vitest";

const mockPost = vi.fn().mockResolvedValue({});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({ post: mockPost })),
  },
}));

vi.mock("@/store/auth-store", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      user: { id: "test-user-id" },
    })),
  },
}));

describe("reportError deduplication", () => {
  beforeEach(() => {
    mockPost.mockClear();
    sessionStorage.clear();
  });

  it("sends error payload on first call", async () => {
    const { reportError } = await import("../error-log");
    const error = new Error("test error");
    reportError(error);
    expect(mockPost).toHaveBeenCalled();
  });

  it("deduplicates same error within 60s", async () => {
    const { reportError } = await import("../error-log");
    const error = new Error("duplicate me");
    reportError(error);
    reportError(error);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it("allows same error after 60s", async () => {
    vi.useFakeTimers();
    const { reportError } = await import("../error-log");
    const error = new Error("timed out error");
    reportError(error);
    vi.advanceTimersByTime(61_000);
    reportError(error);
    expect(mockPost).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("treats different errors separately", async () => {
    const { reportError } = await import("../error-log");
    reportError(new Error("error A"));
    reportError(new Error("error B"));
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
