"use client";

import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";

export function CategoryFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-xl p-1"
      style={{ background: "var(--evven-surface)" }}
    >
      <button
        onClick={() => onChange("all")}
        className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          background:
            value === "all"
              ? "var(--color-background-primary, var(--evven-background))"
              : "transparent",
          color: value === "all" ? "var(--evven-text-primary)" : "var(--evven-text-muted)",
          border:
            value === "all"
              ? "0.5px solid var(--evven-border)"
              : "0.5px solid transparent",
        }}
      >
        All
      </button>
      {EXPENSE_CATEGORIES.map((cat) => {
        const Icon = cat.icon;

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background:
                value === cat.value
                  ? "var(--color-background-primary, var(--evven-background))"
                  : "transparent",
              color: value === cat.value ? cat.text : "var(--evven-text-muted)",
              border:
                value === cat.value
                  ? "0.5px solid var(--evven-border)"
                  : "0.5px solid transparent",
            }}
          >
            <Icon size={14} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
