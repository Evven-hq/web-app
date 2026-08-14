"use client";

import { getCategoryMeta } from "@/lib/expense-categories";
import { formatAmount } from "@/lib/format";
import { RingStat } from "./RingStat";
import type { CategoryEntry, DashboardAnalytics } from "./dashboard-types";

export function StatCards({
  analytics,
  groupsCount,
  isLoading,
  topCategory,
  topCategoryShare,
}: {
  analytics: DashboardAnalytics | null;
  groupsCount: number;
  isLoading: boolean;
  topCategory: CategoryEntry | undefined;
  topCategoryShare: number;
}) {
  return (
    <div className="mb-5 grid gap-3 md:grid-cols-3">
      <RingStat
        label="Total spent"
        value={analytics ? formatAmount(analytics.total_spent) : "—"}
        sub={`${analytics?.expense_count ?? 0} personal expenses`}
        progress={72}
      />
      <RingStat
        label="Active groups"
        value={isLoading ? "—" : String(groupsCount)}
        sub="groups you're part of"
        progress={Math.min(75, Math.max(35, groupsCount * 15))}
      />
      <RingStat
        label="Top category"
        value={topCategory ? topCategory[0] : "—"}
        sub={topCategory ? formatAmount(topCategory[1]) : "no data yet"}
        progress={topCategoryShare}
        color={topCategory ? getCategoryMeta(topCategory[0]).text : "var(--evven-accent-primary)"}
      />
    </div>
  );
}
