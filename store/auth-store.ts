import {
  getCurrentUser as getUser,
  googleLogin,
  login as loginUser,
  logoutSession,
  refreshSession,
  register as registerUser,
  sendOtp,
  verifyOtp as verifyOtpRequest,
} from "@/services/auth";
import { User } from "@/types/user";
import { create } from "zustand";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  isDesktop,
  redirectToDesktopLogin,
  shouldRefreshDesktopAccessToken,
  storeAuthTokens,
} from "@/lib/desktop";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  resendOtp: (email: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  token: typeof window !== "undefined" ? getAccessToken() : null,

  login: async (email, password) => {
    const data = await loginUser(email, password);
    storeAuthTokens(data.tokens);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  signup: async (name, email, password) => {
    await registerUser(name, email, password);
  },

  verifyOtp: async (email, otp) => {
    const data = await verifyOtpRequest(email, otp);
    storeAuthTokens(data.tokens);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
    return data.user;
  },

  resendOtp: async (email) => {
    await sendOtp(email);
  },

  loginWithGoogle: async (credential) => {
    const data = await googleLogin(credential);
    const provider = data.user.auth_provider?.toLowerCase() ?? "";

    if (!provider.includes("google")) {
      throw new Error(
        "An account with this email already uses a password. Log in with your email and password instead.",
      );
    }

    storeAuthTokens(data.tokens);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  logout: async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutSession(refreshToken);
      }
    } catch {
      // Local logout should still complete if server-side revocation cannot.
    } finally {
      clearAuthTokens();
      set({ user: null, isAuthenticated: false, token: null });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    const finish = (state: Partial<AuthState>) => {
      set({
        isLoading: false,
        isInitialized: true,
        ...state,
      });
    };

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const restoreWithRefreshToken = async () => {
      if (!refreshToken) {
        return false;
      }

      const refreshed = await refreshSession(refreshToken);
      storeAuthTokens(refreshed.tokens);
      const data = await getUser();
      finish({
        user: data,
        isAuthenticated: true,
        token: refreshed.tokens.access_token,
      });
      return true;
    };

    try {
      if (isDesktop() && shouldRefreshDesktopAccessToken() && refreshToken) {
        try {
          if (await restoreWithRefreshToken()) {
            return;
          }
        } catch {
          // Fall back to the access token path below if refresh fails.
        }
      }

      if (accessToken) {
        try {
          const data = await getUser();
          finish({
            user: data,
            isAuthenticated: true,
            token: getAccessToken(),
          });
          return;
        } catch {
          if (!refreshToken) {
            throw new Error("Session expired");
          }
        }
      }

      if (refreshToken) {
        await restoreWithRefreshToken();
        return;
      }

      finish({
        user: null,
        isAuthenticated: false,
        token: null,
      });
    } catch {
      clearAuthTokens();
      if (isDesktop()) {
        redirectToDesktopLogin("session-expired");
      }
      finish({
        user: null,
        isAuthenticated: false,
        token: null,
      });
    }
  },

  setUser: (user) => set({ user }),
}));
