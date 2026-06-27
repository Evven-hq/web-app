import {
  getCurrentUser as getUser,
  googleLogin,
  login as loginUser,
  refreshSession,
  register as registerUser,
} from "@/services/auth";
import { User } from "@/types/user";
import { create } from "zustand";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  isDesktop,
  redirectToDesktopLogin,
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
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
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
    const data = await registerUser(name, email, password);
    storeAuthTokens(data.tokens);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  loginWithGoogle: async (credential) => {
    const data = await googleLogin(credential);
    storeAuthTokens(data.tokens);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  logout: () => {
    clearAuthTokens();
    set({ user: null, isAuthenticated: false, token: null });
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

    try {
      if (accessToken) {
        try {
          const data = await getUser();
          finish({
            user: data,
            isAuthenticated: true,
            token: accessToken,
          });
          return;
        } catch {
          if (!refreshToken) {
            throw new Error("Session expired");
          }
        }
      }

      if (refreshToken) {
        const refreshed = await refreshSession(refreshToken);
        storeAuthTokens(refreshed.tokens);
        const data = await getUser();
        finish({
          user: data,
          isAuthenticated: true,
          token: refreshed.tokens.access_token,
        });
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
