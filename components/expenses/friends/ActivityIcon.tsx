"use client";

import { ArrowLeftRight, Plus } from "lucide-react";

export function ActivityIcon({ type }: { type: "expense" | "settlement" }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full"
      style={{
        background:
          type === "settlement"
            ? "color-mix(in srgb, var(--evven-accent-secondary) 36%, var(--evven-background))"
            : "color-mix(in srgb, var(--evven-error) 12%, var(--evven-background))",
        color: type === "settlement" ? "var(--evven-accent-primary)" : "var(--evven-error)",
      }}
    >
      {type === "settlement" ? <ArrowLeftRight size={16} /> : <Plus size={16} />}
    </div>
  );
}
