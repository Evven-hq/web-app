"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineBanner({ isOnline }: { isOnline: boolean }) {
  const [mounted, setMounted] = useState(!isOnline);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      requestAnimationFrame(() => {
        setEntered(true);
      });
      return;
    }

    setEntered(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
    }, 280);

    return () => window.clearTimeout(timer);
  }, [isOnline]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4",
        "top-[calc(var(--safe-area-inset-top,env(safe-area-inset-top,0px))+0.75rem)] md:top-auto md:bottom-24"
      )}
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-auto inline-flex w-auto max-w-[min(92vw,18rem)] items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-2xl md:max-w-[18rem] md:px-4 md:py-2.5 md:text-sm",
          "transition-[opacity,transform,filter,backdrop-filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:filter-none",
          entered
            ? "translate-y-0 scale-100 opacity-100 blur-0"
            : "translate-y-2 scale-[0.98] opacity-0 blur-md"
        )}
        style={{
          background:
            "color-mix(in srgb, var(--evven-offline-card) 22%, color-mix(in srgb, var(--evven-background) 84%, white))",
          borderColor: "var(--evven-border)",
          color: "var(--evven-text-primary)",
          backdropFilter: entered ? "blur(18px) saturate(160%)" : "blur(30px) saturate(130%)",
          WebkitBackdropFilter: entered ? "blur(18px) saturate(160%)" : "blur(30px) saturate(130%)",
        }}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full md:size-8"
          style={{
            background: "color-mix(in srgb, var(--evven-background) 72%, white)",
            color: "var(--evven-error)",
          }}
        >
          <WifiOff size={14} />
        </span>
        <span className="min-w-0 truncate leading-none">
          {isOnline ? "Reconnected" : "You’re offline. Check your connection."}
        </span>
      </div>
    </div>
  );
}
