"use client";

/**
 * components/auth/AuthSlideShell.tsx
 *
 * Enhanced client component that owns the slide transition between /login and /signup.
 * Features smooth, bouncy transitions with scale and opacity animations.
 *
 * login  → signup : content slides LEFT  (new page enters from right)
 * signup → login  : content slides RIGHT (new page enters from left)
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Dir = "to-signup" | "to-login" | null;
type Phase = "idle" | "exit" | "enter";

const TRANSLATE: Record<string, string> = {
  "to-signup-exit":  "translateX(-80px)",
  "to-signup-enter": "translateX(80px)",
  "to-login-exit":   "translateX(80px)",
  "to-login-enter":  "translateX(-80px)",
};

export function AuthSlideShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  const [dir, setDir]     = useState<Dir>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (prevPath.current === pathname) return;

    const next: Dir = pathname === "/signup" ? "to-signup" : "to-login";
    setDir(next);
    setPhase("exit");

    const t1 = setTimeout(() => setPhase("enter"), 350);
    const t2 = setTimeout(() => {
      setPhase("idle");
      setDir(null);
      prevPath.current = pathname;
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const key       = dir && phase !== "idle" ? `${dir}-${phase}` : "";
  const translate = TRANSLATE[key] ?? "translateX(0)";
  const opacity   = phase === "exit" ? 0 : 1;
  const scale = phase === "exit" ? 0.96 : 1;

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div
        style={{
          transform: `${translate} scale(${scale})`,
          opacity,
          transition:
            phase !== "idle"
              ? "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms cubic-bezier(0.4, 0, 0.2, 1), scale 350ms cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}