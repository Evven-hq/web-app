"use client";

import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";

export function SettlementEmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card rounded-2xl px-4 py-6 text-center">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--evven-surface)]">
        {icon ?? (
          <CheckCircle size={16} style={{ color: "var(--evven-text-muted)" }} />
        )}
      </div>
      <p
        className="text-sm font-medium"
        style={{ color: "var(--evven-text-primary)" }}
      >
        {title}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--evven-text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
