const DESKTOP_RUNTIME_KEY = "evven-runtime-mode";
const DESKTOP_RUNTIME_VALUE = "desktop";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const DESKTOP_LOGIN_PATH = "/login";

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

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredAuthToken() {
  return getAccessToken();
}

export function storeAuthTokens(tokens: {
  access_token: string;
  refresh_token?: string;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function redirectToDesktopLogin(reason?: string) {
  if (typeof window === "undefined") return;

  const url = new URL(DESKTOP_LOGIN_PATH, window.location.origin);
  if (reason) {
    url.searchParams.set("reason", reason);
  }

  window.location.replace(url.toString());
}
