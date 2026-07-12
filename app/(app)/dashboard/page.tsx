"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import api from "@/lib/api";
import { getCategoryMeta } from "@/lib/expense-categories";
import { Plus, Receipt, User, Users } from "lucide-react";

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

function RingStat({
  label,
  value,
  sub,
  progress = 68,
  color = "var(--evven-accent-primary)",
}: {
  label: string;
  value: string;
  sub: string;
  progress?: number;
  color?: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(progress, 100));

  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-3xl p-4"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <svg className="size-12 shrink-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="var(--evven-border)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
        />
      </svg>
      <div className="min-w-0">
        <p className="truncate text-lg font-medium leading-none" style={{ fontFamily: "var(--font-mono)" }}>
          {value}
        </p>
        <p className="mt-1 text-xs font-medium" style={{ color: "var(--evven-text-primary)" }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--evven-text-muted)" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

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
  const topCategory = categoryEntries[0];
  const topCategoryShare =
    topCategory && analytics?.total_spent
      ? Math.round((Number(topCategory[1]) / analytics.total_spent) * 100)
      : 65;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Header */}
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 sm:pr-0">
            {/* <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Overview
            </p> */}
            <h1 className="mt-2 flex min-w-0 flex-wrap items-end gap-x-2 gap-y-1 text-2xl font-medium leading-snug sm:text-[2rem]">
              <span className="shrink-0">{greeting()},</span>
              <span
                className="inline-block max-w-full pr-2"
                style={{
                  color: "var(--evven-primary)",
                  fontFamily: "var(--font-instrument-serif)",
                  fontStyle: "italic",
                  fontSize: "inherit",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  lineHeight: 1.05,
                  marginBottom: "0",
                }}
              >
                {firstName}
              </span>
            </h1>
            <p
              className="mt-2 max-w-xl text-sm leading-6 sm:text-[15px]"
              style={{ color: "var(--evven-text-muted)" }}
            >
              Your shared spending, groups, and recent activity all in one place.
            </p>
          </div>

          <Link
            href="/expenses/new"
            className="hidden shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 sm:inline-flex"
          >
            <Plus size={15} />
            Add expense
          </Link>

        </div>

        {/* Hero */}
        <div
          className="mb-4 overflow-hidden rounded-[30px] p-5 sm:p-6"
          style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              
              <p className="text-xl font-medium leading-snug sm:text-2xl">
                You&apos;ve spent {analytics ? formatAmount(analytics.total_spent) : "—"} across {groups.length} {groups.length === 1 ? "group" : "groups"} this month.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 opacity-85">
                Keep momentum going with a quick view of your activity, recent splits, and the next expense to log.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div
                className="rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: "color-mix(in srgb, white 24%, transparent)", background: "color-mix(in srgb, white 10%, transparent)" }}
              >
                {analytics?.expense_count ?? 0} expenses
              </div>
              <div
                className="rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: "color-mix(in srgb, white 24%, transparent)", background: "color-mix(in srgb, white 10%, transparent)" }}
              >
                {groups.length} active groups
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/expenses/new"
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


        {/* Stat cards */}
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <RingStat
            label="Total spent"
            value={analytics ? formatAmount(analytics.total_spent) : "—"}
            sub={`${analytics?.expense_count ?? 0} personal expenses`}
            progress={72}
          />
          <RingStat
            label="Active groups"
            value={loading ? "—" : String(groups.length)}
            sub="groups you're part of"
            progress={Math.min(75, Math.max(35, groups.length * 15))}
          />
          <RingStat
            label="Top category"
            value={topCategory ? topCategory[0] : "—"}
            sub={topCategory ? formatAmount(topCategory[1]) : "no data yet"}
            progress={topCategoryShare}
            color={topCategory ? getCategoryMeta(topCategory[0]).text : "var(--evven-accent-primary)"}
          />
        </div>

        {/* Two column row */}
        <div className="grid gap-3 mb-3 lg:grid-cols-2">

          {/* Groups panel */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
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
                    className="h-10 rounded-2xl animate-pulse"
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
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
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
            className="rounded-3xl p-5"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
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
        </div>

        {/* Recent expenses */}
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
                  <Link href="/expenses/new" className="underline">
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
                            {formatDate(exp.created_at)}
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
      </div>
    </div>
  );
}
