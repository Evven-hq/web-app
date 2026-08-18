import axios from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  isDesktop,
  redirectToDesktopLogin,
  shouldRefreshDesktopAccessToken,
  storeAuthTokens,
} from "./desktop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshStoredAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh", { refresh_token: refreshToken })
      .then((response) => {
        const tokens = response.data?.tokens ?? response.data;

        if (!tokens?.access_token) {
          return null;
        }

        storeAuthTokens(tokens);
        return tokens.access_token as string;
      })
      .catch(() => {
        clearAuthTokens();
        if (isDesktop()) {
          redirectToDesktopLogin("session-expired");
        }
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    let token = getAccessToken();

    if (isDesktop() && shouldRefreshDesktopAccessToken()) {
      const refreshedToken = await refreshStoredAccessToken();
      if (refreshedToken) {
        token = refreshedToken;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      typeof window === "undefined" ||
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    const newAccessToken = await refreshStoredAccessToken();
    if (!newAccessToken || !originalRequest) {
      clearAuthTokens();
      if (typeof window !== "undefined" && isDesktop()) {
        redirectToDesktopLogin("session-expired");
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);

export default api;
