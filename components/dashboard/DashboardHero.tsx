"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategoryMeta } from "@/lib/expense-categories";
import { formatAmount, formatRelativeTime, formatShortDate } from "@/lib/format";
import PixelShadowCanvas from "@/components/dashboard/PixelShadowCanvas";
import type { CategoryEntry, DashboardAnalytics, DashboardExpense } from "./dashboard-types";

export function DashboardHero({
  analytics,
  groupsCount,
  isLoading,
  topCategory,
  topCategoryShare,
  avgExpense,
  lastExpense,
}: {
  analytics: DashboardAnalytics | null;
  groupsCount: number;
  isLoading: boolean;
  topCategory: CategoryEntry | undefined;
  topCategoryShare: number;
  avgExpense: number | null;
  lastExpense: DashboardExpense | undefined;
}) {
  return (
    <div
      className="relative isolate mb-4 overflow-hidden rounded-[30px] p-5 sm:p-6"
      style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
    >
      <PixelShadowCanvas />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xl font-medium leading-snug sm:text-2xl">
            You&apos;ve spent {analytics ? formatAmount(analytics.total_spent) : "—"} across {groupsCount} {groupsCount === 1 ? "group" : "groups"} this month.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 opacity-85">
            {isLoading ? (
              "Loading your activity…"
            ) : topCategory ? (
              <>
                <span style={{ fontWeight: 500 }}>{getCategoryMeta(topCategory[0]).label}</span> leads this
                month at {topCategoryShare}% of total spend
                {lastExpense ? ` · last logged ${formatRelativeTime(lastExpense.created_at, formatShortDate)}` : ""}.
              </>
            ) : (
              "Log a few expenses to see where your money's going this month."
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topCategory && (
            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
              style={{ borderColor: "color-mix(in srgb, white 24%, transparent)", background: "color-mix(in srgb, white 10%, transparent)" }}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: getCategoryMeta(topCategory[0]).text }}
              />
              {getCategoryMeta(topCategory[0]).label} · {formatAmount(topCategory[1])}
            </div>
          )}
          <div
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{ borderColor: "color-mix(in srgb, white 24%, transparent)", background: "color-mix(in srgb, white 10%, transparent)" }}
          >
            {avgExpense ? `${formatAmount(avgExpense)} avg / expense` : `${analytics?.expense_count ?? 0} expenses`}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/expenses?new=1"
          className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:opacity-90"
        >
          <Plus size={15} />
          Add expense
        </Link>
        <Link
          href="/groups"
          className="text-sm font-medium underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-80"
        >
          View groups
        </Link>
      </div>
    </div>
  );
}
