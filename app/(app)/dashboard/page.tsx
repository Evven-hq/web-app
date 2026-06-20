"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import api from "@/lib/api";
import { getCategoryMeta } from "@/lib/expense-categories";

const CATEGORY_COLORS: Record<string, string> = {
    Food: "#854F0B",
    Travel: "#185FA5",
    Home: "#3B6D11",
    Uncategorized: "#888780",
    uncategorized: "#888780",
  };

function formatAmount(amount: string | number, currency = "₹") {
  const n = Number(amount);
  return `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const GROUP_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E1F5EE", text: "#0F6E56" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E6F1FB", text: "#185FA5" },
];

type DashboardData = {
  analytics: { total_spent: number; expense_count: number; spending_by_category: Record<string, number> } | null;
  groups: Array<{ id: string; name: string; created_by: string; created_at: string }>;
  personalExpenses: Array<{ id: string; title: string; amount: string; category: string | null; created_at: string }>;
  loading: boolean;
  error: string | null;
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [data, setData] = useState<DashboardData>({
    analytics: null,
    groups: [],
    personalExpenses: [],
    loading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");

  useEffect(() => {
    if (!isAuthenticated) return;

    Promise.allSettled([
      api.get("/expenses/personal-data").then((response) => response.data),
      api.get("/groups/").then((response) => response.data),
      api.get("/expenses/").then((response) => response.data),
    ]).then(([analyticsRes, groupsRes, expensesRes]) => {
      setData({
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
        loading: false,
        error: null,
      });
    });
  }, [isAuthenticated]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const { analytics, groups, personalExpenses, loading } = data;

  const categoryEntries = analytics?.spending_by_category
    ? Object.entries(analytics.spending_by_category)
        .filter(([k]) => k !== "__total__")
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5)
    : [];

  const maxCategory = categoryEntries.length > 0 ? Number(categoryEntries[0][1]) : 1;

  const CATEGORY_COLORS: Record<string, string> = {
    Food: "#854F0B",
    Travel: "#185FA5",
    Home: "#3B6D11",
    Uncategorized: "#888780",
    uncategorized: "#888780",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-medium">
            {greeting()},{" "}
            <span
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              {user?.name?.split(" ")[0] ?? "there"}
            </span>
          </h1>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Total spent",
              value: analytics ? formatAmount(analytics.total_spent) : "—",
              sub: `${analytics?.expense_count ?? 0} personal expenses`,
              color: undefined,
            },
            {
              label: "Active groups",
              value: loading ? "—" : String(groups.length),
              sub: "groups you're part of",
              color: undefined,
            },
            {
              label: "Top category",
              value:
                categoryEntries.length > 0
                  ? categoryEntries[0][0]
                  : "—",
              sub:
                categoryEntries.length > 0
                  ? formatAmount(categoryEntries[0][1])
                  : "no data yet",
              color: undefined,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl p-4"
              style={{ background: "var(--color-background-secondary, #f5f3f0)" }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-1.5"
                style={{ color: "var(--evven-text-muted)" }}
              >
                {m.label}
              </p>
              <p className="text-xl font-medium leading-none">{m.value}</p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--evven-text-muted)" }}
              >
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Two column row */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          {/* Groups panel */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--color-background-primary, white)",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Your groups</span>
              <Link
                href="/groups"
                className="text-xs flex items-center gap-0.5"
                style={{ color: "var(--evven-text-muted)" }}
              >
                All →
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded-lg animate-pulse"
                    style={{ background: "var(--evven-surface)" }}
                  />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No groups yet.{" "}
                <Link href="/groups" className="underline">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {groups.slice(0, 4).map((g, i) => {
                  const color = GROUP_COLORS[i % GROUP_COLORS.length];
                  return (
                    <Link
                      href={`/groups/${g.id}`}
                      key={g.id}
                      className="flex items-center gap-2.5 py-2 border-b last:border-0 hover:opacity-70 transition-opacity"
                      style={{ borderColor: "var(--evven-border)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {getInitials(g.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{g.name}</p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--evven-text-muted)" }}
                        >
                          {new Date(g.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--color-background-primary, white)",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Spending by category</span>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-5 rounded animate-pulse"
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
                        className="text-xs w-20 flex-shrink-0 truncate"
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
                        className="text-xs font-medium min-w-12 text-right flex-shrink-0"
                      >
                        {formatAmount(amt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent expenses */}
        <div
          className="rounded-2xl p-5 mb-3"
          style={{
            background: "var(--color-background-primary, white)",
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
                onClick={() => setActiveTab(tab)}
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
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg animate-pulse"
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
                  <Link href="/expenses" className="underline">
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
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
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
                            {formatDate(exp.created_at)}
                          </p>
                        </div>
                        <span
                          className="text-sm font-medium flex-shrink-0"
                          style={{ color: "#A32D2D" }}
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

        {/* Quick actions */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--color-background-primary, white)",
            border: "0.5px solid var(--evven-border)",
          }}
        >
          <p className="text-sm font-medium mb-3">Quick actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Log expense", href: "/expenses/new", icon: "+" },
              { label: "New group", href: "/groups/new", icon: "⊕" },
              { label: "Check balances", href: "/groups", icon: "⇌" },
              { label: "View profile", href: "/profile", icon: "◉" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors hover:opacity-70"
                style={{
                  border: "0.5px solid var(--evven-border)",
                  color: "var(--evven-text-primary)",
                }}
              >
                <span
                  className="text-base w-5 text-center flex-shrink-0"
                  style={{ color: "var(--evven-text-muted)" }}
                >
                  {action.icon}
                </span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
