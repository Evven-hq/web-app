import axios from "axios";
import { APP_VERSION } from "./version";
import { useAuthStore } from "@/store/auth-store";

const DEDUPE_KEY_PREFIX = "evven_error_dedupe";
const DEDUPE_WINDOW_MS = 60_000;

const seen = new Map<string, number>();

function djb2(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function isDeduped(hash: string): boolean {
  const prev = seen.get(hash);
  if (prev !== undefined && Date.now() - prev < DEDUPE_WINDOW_MS) {
    return true;
  }
  return false;
}

function markSeen(hash: string): void {
  seen.set(hash, Date.now());

  try {
    const stored = sessionStorage.getItem(DEDUPE_KEY_PREFIX);
    const map: Record<string, number> = stored ? JSON.parse(stored) : {};
    map[hash] = Date.now();
    sessionStorage.setItem(DEDUPE_KEY_PREFIX, JSON.stringify(map));
  } catch {
    // storage full or unavailable — ignore
  }
}

function initDedupeFromStorage(): void {
  try {
    const stored = sessionStorage.getItem(DEDUPE_KEY_PREFIX);
    if (!stored) return;
    const map: Record<string, number> = JSON.parse(stored);
    const now = Date.now();
    for (const [k, v] of Object.entries(map)) {
      if (now - v < DEDUPE_WINDOW_MS) {
        seen.set(k, v);
      }
    }
    sessionStorage.removeItem(DEDUPE_KEY_PREFIX);
  } catch {
    // ignore
  }
}

initDedupeFromStorage();

const errorClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export function reportError(
  error: unknown,
  context?: { route?: string; method?: string }
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  const stack = err.stack ?? "";
  const hash = djb2(stack + err.message);

  if (isDeduped(hash)) return;
  markSeen(hash);

  let route = context?.route;
  if (route === undefined && typeof window !== "undefined") {
    route = window.location.pathname + window.location.search;
  }

  const payload = {
    app: "web" as const,
    version: APP_VERSION,
    message: err.message,
    error_type: err.name,
    stack_trace: stack,
    route,
    method: context?.method,
    user_id: useAuthStore.getState().user?.id ?? null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    client_timestamp: new Date().toISOString(),
  };

  const send = () =>
    errorClient.post("/errors", payload).catch(() => {});

  send().catch(() => {
    setTimeout(send, 800);
  });
}
