"use client";

import { LogOut, ShieldAlert } from "lucide-react";

export function ProfileDangerZone({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      className="card rounded-3xl p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--evven-error) 6%, var(--evven-background))",
        border: "0.5px solid color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))", color: "var(--evven-error)" }}
          >
            <ShieldAlert size={16} />
          </span>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--evven-error)" }}>
              Danger zone
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--evven-text-muted)" }}>
              You&apos;re about to sign out of this device.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors sm:w-auto"
          style={{
            border: "0.5px solid color-mix(in srgb, var(--evven-error) 28%, var(--evven-border))",
            background: "color-mix(in srgb, var(--evven-error) 10%, var(--evven-background))",
            color: "var(--evven-error)",
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );
}
