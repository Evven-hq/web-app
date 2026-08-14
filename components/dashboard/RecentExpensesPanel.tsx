"use client";

import Link from "next/link";
import { getCategoryMeta } from "@/lib/expense-categories";
import { formatAmount, formatShortDate } from "@/lib/format";
import type { DashboardExpense } from "./dashboard-types";

export function RecentExpensesPanel({
  activeTab,
  onTabChange,
  personalExpenses,
  isLoading,
}: {
  activeTab: "personal" | "group";
  onTabChange: (tab: "personal" | "group") => void;
  personalExpenses: DashboardExpense[];
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-3xl p-5 mb-3"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Recent expenses</span>
        <Link
          href="/expenses"
          className="text-xs"
          style={{ color: "var(--evven-text-muted)" }}
        >
          All →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(["personal", "group"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="text-xs px-3 py-1 rounded-full transition-colors capitalize"
            style={{
              border:
                activeTab === tab
                  ? "0.5px solid var(--evven-border)"
                  : "0.5px solid transparent",
              background:
                activeTab === tab
                  ? "var(--evven-surface)"
                  : "transparent",
              fontWeight: activeTab === tab ? 500 : 400,
              color:
                activeTab === tab
                  ? "var(--evven-text-primary)"
                  : "var(--evven-text-muted)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-2xl animate-pulse"
                  style={{ background: "var(--evven-surface)" }}
                />
              ))}
            </div>
          ) : personalExpenses.length === 0 ? (
            <div
              className="text-center py-6 text-sm"
              style={{ color: "var(--evven-text-muted)" }}
            >
              No personal expenses yet.{" "}
              <Link href="/expenses?new=1" className="underline">
                Add one
              </Link>
            </div>
          ) : (
            <div>
              {personalExpenses.map((exp) => {
                const catMeta = getCategoryMeta(exp.category);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                    style={{ borderColor: "var(--evven-border)" }}
                  >
                    <div
                        className="w-8 h-8 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: catMeta.bg }}
                      >
                        {typeof catMeta.icon === "string" ? (
                          <span className="text-base">{catMeta.icon}</span>
                        ) : (
                          <catMeta.icon size={16} />
                        )}
                      </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{exp.title}</p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--evven-text-muted)" }}
                      >
                        {exp.category ? catMeta.label : "Uncategorised"} ·{" "}
                        {formatShortDate(exp.created_at)}
                      </p>
                    </div>
                    <span
                      className="text-sm font-medium shrink-0"
                      style={{ color: "var(--evven-error)" }}
                    >
                      −{formatAmount(exp.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "group" && (
        <div
          className="text-center py-8 text-sm"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Open a group to see its expenses →{" "}
          <Link href="/groups" className="underline">
            My groups
          </Link>
        </div>
      )}
    </div>
  );
}
