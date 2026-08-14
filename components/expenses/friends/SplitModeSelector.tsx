"use client";

import type { SplitMode } from "@/types";

export function SplitModeSelector({
  value,
  onChange,
}: {
  value: SplitMode;
  onChange: (mode: SplitMode) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Split mode
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(["equal", "percentage", "custom"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className="rounded-2xl border px-3 py-2 text-xs font-medium capitalize transition-all"
            style={{
              background:
                value === mode
                  ? "var(--evven-accent-primary)"
                  : "var(--evven-background)",
              color:
                value === mode
                  ? "var(--evven-text-inverse)"
                  : "var(--evven-text-primary)",
              borderColor:
                value === mode
                  ? "var(--evven-accent-primary)"
                  : "var(--evven-border)",
            }}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
