"use client";

/**
 * components/auth/AuthSlideShell.tsx
 *
 * Client component that owns the slide transition between /login and /signup.
 * Imported by the server layout so the layout itself stays a Server Component.
 *
 * login  → signup : content slides LEFT  (new page enters from right)
 * signup → login  : content slides RIGHT (new page enters from left)
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Dir = "to-signup" | "to-login" | null;
type Phase = "idle" | "exit" | "enter";

const TRANSLATE: Record<string, string> = {
  "to-signup-exit":  "translateX(-40px)",
  "to-signup-enter": "translateX(40px)",
  "to-login-exit":   "translateX(40px)",
  "to-login-enter":  "translateX(-40px)",
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

    const t1 = setTimeout(() => setPhase("enter"), 260);
    const t2 = setTimeout(() => {
      setPhase("idle");
      setDir(null);
      prevPath.current = pathname;
    }, 520);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  const key       = dir && phase !== "idle" ? `${dir}-${phase}` : "";
  const translate = TRANSLATE[key] ?? "translateX(0)";
  const opacity   = phase === "exit" ? 0 : 1;

  return (
    <div className="min-h-screen overflow-hidden">
      <div
        style={{
          transform: translate,
          opacity,
          transition:
            phase !== "idle"
              ? "transform 260ms cubic-bezier(0.4,0,0.2,1), opacity 260ms ease"
              : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}