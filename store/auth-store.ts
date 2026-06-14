import { login as loginUser, register as registerUser, getCurrentUser as getUser } from "@/services/auth";
import { User } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,

  login: async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("access_token", data.tokens.access_token);
    localStorage.setItem("refresh_token", data.tokens.refresh_token);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  signup: async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("access_token", data.tokens.access_token);
    localStorage.setItem("refresh_token", data.tokens.refresh_token);
    set({ user: data.user, isAuthenticated: true, token: data.tokens.access_token });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false, token: null });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const data = await getUser();
        set({ user: data, isAuthenticated: true, isLoading: false, token: accessToken });
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, isAuthenticated: false, isLoading: false, token: null });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false, token: null });
    }
  },
}));