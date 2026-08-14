"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCards } from "@/components/dashboard/StatCards";
import { GroupsPanel } from "@/components/dashboard/GroupsPanel";
import { CategoryBreakdownPanel } from "@/components/dashboard/CategoryBreakdownPanel";
import { RecentExpensesPanel } from "@/components/dashboard/RecentExpensesPanel";
import type { DashboardData } from "@/components/dashboard/dashboard-types";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [analyticsRes, groupsRes, expensesRes] = await Promise.allSettled([
        api.get("/expenses/personal-data").then((r) => r.data),
        api.get("/groups/").then((r) => r.data),
        api.get("/expenses/").then((r) => r.data),
      ]);
      return {
        analytics:
          analyticsRes.status === "fulfilled" && analyticsRes.value?.data
            ? analyticsRes.value.data
            : null,
        groups:
          groupsRes.status === "fulfilled" && Array.isArray(groupsRes.value?.data)
            ? groupsRes.value.data
            : [],
        personalExpenses:
          expensesRes.status === "fulfilled" && Array.isArray(expensesRes.value?.data)
            ? expensesRes.value.data.slice(0, 5)
            : [],
      };
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const { analytics, groups, personalExpenses } = data ?? {
    analytics: null,
    groups: [],
    personalExpenses: [],
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const categoryEntries = analytics?.spending_by_category
    ? Object.entries(analytics.spending_by_category)
        .filter(([k]) => k !== "__total__")
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5)
    : [];

  const maxCategory = categoryEntries.length > 0 ? Number(categoryEntries[0][1]) : 1;
  const topCategory = categoryEntries[0];
  const topCategoryShare =
    topCategory && analytics?.total_spent
      ? Math.round((Number(topCategory[1]) / analytics.total_spent) * 100)
      : 65;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const avgExpense =
    analytics?.total_spent && analytics.expense_count
      ? analytics.total_spent / analytics.expense_count
      : null;
  const lastExpense = personalExpenses[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">

        <DashboardHeader greeting={greeting()} firstName={firstName} />

        <DashboardHero
          analytics={analytics}
          groupsCount={groups.length}
          isLoading={isLoading}
          topCategory={topCategory}
          topCategoryShare={topCategoryShare}
          avgExpense={avgExpense}
          lastExpense={lastExpense}
        />

        <StatCards
          analytics={analytics}
          groupsCount={groups.length}
          isLoading={isLoading}
          topCategory={topCategory}
          topCategoryShare={topCategoryShare}
        />

        <div className="grid gap-3 mb-3 lg:grid-cols-2">
          <GroupsPanel groups={groups} isLoading={isLoading} />
          <CategoryBreakdownPanel
            categoryEntries={categoryEntries}
            maxCategory={maxCategory}
            isLoading={isLoading}
          />
        </div>

        <RecentExpensesPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          personalExpenses={personalExpenses}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
