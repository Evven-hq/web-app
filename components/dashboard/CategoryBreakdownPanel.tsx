"use client";

import { getCategoryMeta } from "@/lib/expense-categories";
import { formatAmount } from "@/lib/format";
import type { CategoryEntry } from "./dashboard-types";

export function CategoryBreakdownPanel({
  categoryEntries,
  maxCategory,
  isLoading,
}: {
  categoryEntries: CategoryEntry[];
  maxCategory: number;
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Spending by category</span>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-5 rounded-full animate-pulse"
              style={{ background: "var(--evven-surface)" }}
            />
          ))}
        </div>
      ) : categoryEntries.length === 0 ? (
        <div
          className="text-center py-6 text-sm"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Log expenses to see a breakdown
        </div>
      ) : (
        <div className="space-y-3">
          {categoryEntries.map(([cat, amt]) => {
            const pct = Math.round((Number(amt) / maxCategory) * 100);
            const barColor = getCategoryMeta(cat).text;
            return (
              <div key={cat} className="flex items-center gap-2">
                <span
                  className="text-xs w-20 shrink-0 truncate"
                  style={{ color: "var(--evven-text-muted)" }}
                >
                  {cat}
                </span>
                <div
                  className="flex-1 rounded-full overflow-hidden"
                  style={{
                    height: 5,
                    background: "var(--evven-surface)",
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <span
                  className="text-xs font-medium min-w-12 text-right shrink-0"
                >
                  {formatAmount(amt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
