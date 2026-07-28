const DESKTOP_RUNTIME_KEY = "evven-runtime-mode";
const DESKTOP_RUNTIME_VALUE = "desktop";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const WEB_ACCESS_TOKEN_KEY = "evven_web_access_token";
const DESKTOP_LOGIN_PATH = "/login";
const DESKTOP_REFRESH_SKEW_MS = 2 * 60 * 1000;

export function isDesktop() {
  if (typeof window === "undefined") return false;

  const runtimeMode = sessionStorage.getItem(DESKTOP_RUNTIME_KEY);
  if (runtimeMode === DESKTOP_RUNTIME_VALUE) {
    return true;
  }

  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes("tauri") ||
    ua.includes("pake") ||
    ua.includes("evven")
  );
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  if (isDesktop()) {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  return sessionStorage.getItem(WEB_ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  if (!isDesktop()) return null;

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredAuthToken() {
  return getAccessToken();
}

function decodeJwtExp(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as { exp?: unknown };

    return typeof parsed.exp === "number" ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function shouldRefreshDesktopAccessToken() {
  if (typeof window === "undefined" || !isDesktop()) return false;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const accessToken = getAccessToken();
  if (!accessToken) return true;

  const accessTokenExpiry = decodeJwtExp(accessToken);
  if (!accessTokenExpiry) return false;

  return accessTokenExpiry - Date.now() <= DESKTOP_REFRESH_SKEW_MS;
}

export function storeAuthTokens(tokens: {
  access_token: string;
  refresh_token?: string;
}) {
  if (typeof window === "undefined") return;

  if (isDesktop()) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
    sessionStorage.removeItem(WEB_ACCESS_TOKEN_KEY);
    return;
  }

  sessionStorage.setItem(WEB_ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(WEB_ACCESS_TOKEN_KEY);
}

export function redirectToDesktopLogin(reason?: string) {
  if (typeof window === "undefined") return;

  const url = new URL(DESKTOP_LOGIN_PATH, window.location.origin);
  if (reason) {
    url.searchParams.set("reason", reason);
  }

  window.location.replace(url.toString());
}
