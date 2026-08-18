"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type NavDirection = "forward" | "back";

type NavigationContextValue = {
  isNavigating: boolean;
  navigate: (href: string) => void;
  direction: NavDirection;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const PATH_HIERARCHY: string[] = [
  "/",
  "/login",
  "/signup",
  "/avatar-setup",
  "/dashboard",
  "/expenses",
  "/groups",
  "/friends",
  "/profile",
];

function getPathDepth(path: string): number {
  const clean = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const idx = PATH_HIERARCHY.indexOf(clean);
  if (idx !== -1) return idx;
  for (let i = PATH_HIERARCHY.length - 1; i >= 0; i--) {
    if (
      clean.startsWith(PATH_HIERARCHY[i] + "/") ||
      clean.startsWith(PATH_HIERARCHY[i])
    ) {
      return i;
    }
  }
  return 0;
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [direction, setDirection] = useState<NavDirection>("forward");
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      const prevDepth = getPathDepth(prevPathRef.current);
      const currDepth = getPathDepth(pathname);
      setDirection(currDepth >= prevDepth ? "forward" : "back");
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isPending) {
      const scroller = document.getElementById("app-scroll-container");
      if (scroller) {
        scroller.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [isPending, pathname]);

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href);
      });
    },
    [router],
  );

  const value = useMemo<NavigationContextValue>(
    () => ({ isNavigating: isPending, navigate, direction }),
    [isPending, navigate, direction],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
}
