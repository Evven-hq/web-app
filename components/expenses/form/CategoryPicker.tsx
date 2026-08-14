"use client";

import { EXPENSE_CATEGORIES } from "@/lib/expense-categories";

export function CategoryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Category
      </label>
      <div className="flex flex-wrap gap-2">
        {EXPENSE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange(value === cat.value ? "" : cat.value)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: value === cat.value ? cat.bg : "var(--evven-surface)",
                color: value === cat.value ? cat.text : "var(--evven-text-muted)",
                border: `1px solid ${
                  value === cat.value ? cat.bg : "var(--evven-border)"
                }`,
              }}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
