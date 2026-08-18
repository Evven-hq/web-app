"use client";

import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import { getRefreshToken, isDesktop } from "@/lib/desktop";
import { updateCurrentUser } from "@/services/users";
import { useAuthStore } from "@/store/auth-store";

export const THEME_OPTIONS = [
  "sea-glass",
  "blush",
  "ember",
  "grove",
  "ember-night",
  "sea-glass-night",
  "pulse",
  "blush-night",
  "pulse-night",
  "grove-night",
] as const;

export type ThemeName = (typeof THEME_OPTIONS)[number];

const THEME_STORAGE_KEY = "evven-theme";
const TRANSITION_CLASS = "evven-theme-transitioning";
const ANIMATION_DURATION = 1300;
const THEME_SYNC_TIMEOUT_MS = 30000;
const THEME_SET = new Set<string>(THEME_OPTIONS);

const THEME_MIGRATION: Record<string, ThemeName> = {
  L3: "sea-glass",
  L4: "blush",
  "Sunset-market": "ember",
  Botanical: "grove",
  D1: "ember-night",
  D3: "sea-glass-night",
  D4: "pulse",
  D5: "blush-night",
  O2: "pulse-night",
  "OLED-forest-green": "grove-night",
};

export function isThemeName(
  value: string | null | undefined,
): value is ThemeName {
  if (typeof value !== "string") return false;
  if (THEME_SET.has(value)) return true;
  return value in THEME_MIGRATION;
}

function migrateTheme(value: string | null | undefined): ThemeName | null {
  if (typeof value !== "string") return null;
  if (THEME_SET.has(value)) return value as ThemeName;
  if (value in THEME_MIGRATION) return THEME_MIGRATION[value];
  return null;
}

interface ThemeContextType {
  theme: ThemeName | null;
  setTheme: (theme: ThemeName | null) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function removeThemeClasses(html: HTMLElement) {
  const classes = Array.from(html.classList);
  for (const cls of classes) {
    if (cls.startsWith("theme-")) {
      html.classList.remove(cls);
    }
  }
}

function applyThemeClass(theme: ThemeName | null) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  removeThemeClasses(html);

  if (theme) {
    html.classList.add(`theme-${theme}`);
  }
}

function readStoredTheme(): ThemeName | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  const migrated = migrateTheme(stored);
  if (migrated && stored !== migrated) {
    window.localStorage.setItem(THEME_STORAGE_KEY, migrated);
  }
  return migrated;
}

export function ThemeProvider({
  children,
  logoGifUrl = "/evven-logo-premium-transition.svg",
}: {
  children: React.ReactNode;
  logoGifUrl?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setUser = useAuthStore((state) => state.setUser);

  const [theme, setThemeState] = useState<ThemeName | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationType, setAnimationType] = useState<ThemeAnimationType>(
    ThemeAnimationType.GIF,
  );
  const pendingThemeRef = useRef<ThemeName | null | undefined>(undefined);
  const transitionTimerRef = useRef<number | null>(null);

  const persistTheme = useCallback((nextTheme: ThemeName | null) => {
    if (typeof window === "undefined") return;

    if (nextTheme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, []);

  const canSyncThemeToBackend = useCallback(() => {
    if (isDesktop()) {
      return true;
    }

    // Older web sessions from before refresh-token persistence cannot safely
    // recover a failed write, so we skip the network call and keep the local UI.
    return Boolean(getRefreshToken());
  }, []);

  const commitTheme = useCallback(
    (nextTheme: ThemeName | null, syncBackend: boolean) => {
      applyThemeClass(nextTheme);
      setThemeState(nextTheme);
      persistTheme(nextTheme);
      pendingThemeRef.current = undefined;

      if (typeof document !== "undefined") {
        document.documentElement.classList.remove(TRANSITION_CLASS);
      }

      if (!syncBackend) {
        return;
      }

      if (!canSyncThemeToBackend()) {
        return;
      }

      void (async () => {
        try {
          const updatedUser = await updateCurrentUser(
            { preferred_theme: nextTheme },
            { timeoutMs: THEME_SYNC_TIMEOUT_MS },
          );
          setUser(updatedUser);
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            (error.code === "ECONNABORTED" ||
              error.response?.status === 401 ||
              error.message.toLowerCase().includes("timeout"))
          ) {
            return;
          }

          console.error("Failed to sync theme preference.", error);
        }
      })();
    },
    [canSyncThemeToBackend, persistTheme, setUser],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const img = new window.Image();
    const onLoad = () => setAnimationType(ThemeAnimationType.GIF);
    const onError = () => setAnimationType(ThemeAnimationType.BLUR_CIRCLE);

    img.onload = onLoad;
    img.onerror = onError;
    img.decoding = "sync";
    img.src = logoGifUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [logoGifUrl]);

  const onThemeChange = useCallback(() => {
    const nextTheme = pendingThemeRef.current;
    if (nextTheme === undefined) return;

    commitTheme(nextTheme, true);
  }, [commitTheme]);

  const { ref: animationRef, toggleSwitchTheme } = useModeAnimation({
    animationType,
    gifUrl: animationType === ThemeAnimationType.GIF ? logoGifUrl : undefined,
    blurAmount: 8,
    duration: ANIMATION_DURATION,
    globalClassName: TRANSITION_CLASS,
    onDarkModeChange: onThemeChange,
  });

  useLayoutEffect(() => {
    const storedTheme = readStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(storedTheme);
    applyThemeClass(storedTheme);
    persistTheme(storedTheme);
  }, [persistTheme]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const backendTheme = migrateTheme(user?.preferred_theme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(backendTheme);
    applyThemeClass(backendTheme);
    persistTheme(backendTheme);
  }, [isInitialized, persistTheme, user?.preferred_theme]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const setTheme = useCallback(
    (nextTheme: ThemeName | null) => {
      if (nextTheme === theme) {
        return;
      }

      pendingThemeRef.current = nextTheme;

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }

      setIsTransitioning(true);

      const canAnimate =
        typeof document !== "undefined" &&
        typeof (document as Document & { startViewTransition?: unknown })
          .startViewTransition === "function" &&
        !(
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );

      if (!canAnimate) {
        commitTheme(nextTheme, true);
        setIsTransitioning(false);
        return;
      }

      document.documentElement.classList.add(TRANSITION_CLASS);

      void toggleSwitchTheme().catch((error) => {
        console.error("Theme transition failed.", error);
        commitTheme(nextTheme, true);
        setIsTransitioning(false);
        if (transitionTimerRef.current !== null) {
          window.clearTimeout(transitionTimerRef.current);
          transitionTimerRef.current = null;
        }
      });

      transitionTimerRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove(TRANSITION_CLASS);
        setIsTransitioning(false);
        transitionTimerRef.current = null;
      }, ANIMATION_DURATION);
    },
    [commitTheme, theme, toggleSwitchTheme],
  );

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      isTransitioning,
    }),
    [isTransitioning, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <button
        ref={animationRef}
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
