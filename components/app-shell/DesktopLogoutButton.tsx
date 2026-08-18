"use client";

import { LogOut } from "lucide-react";

export function DesktopLogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="fixed right-6 bottom-6 z-40 hidden md:block">
      <button
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="group pointer-events-auto inline-flex h-12 items-center overflow-hidden rounded-(--evven-radius-hero) px-3 py-0  transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className="flex size-8 items-center justify-center rounded-full transition-all duration-200"
          style={{
            background:
              "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))",
            border:
              "0.5px solid color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
            color: "var(--evven-error)",
          }}
        >
          <LogOut size={15} />
        </span>
        <span
          className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-[max-width,opacity,transform] duration-200 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100"
          style={{ color: "var(--evven-error)" }}
        >
          Log out
        </span>
      </button>
    </div>
  );
}
