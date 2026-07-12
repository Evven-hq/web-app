"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Receipt, Search, Trash2 } from "lucide-react";
import { FriendSummaryLine, getGhostExpenseSummary } from "@/components/expenses/friends";
import { deletePersonalExpense, getPersonalExpenses } from "@/services/expenses";
import { EXPENSE_CATEGORIES, getCategoryMeta } from "@/lib/expense-categories";
import type { PersonalExpense } from "@/types";

function formatAmount(amount: string) {
  return `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(expense: PersonalExpense) {
  return new Date(expense.date ?? expense.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;

    getPersonalExpenses()
      .then((data) => {
        if (active) setExpenses(data);
      })
      .catch(() => {
        if (active) setError("Could not load your expenses.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesQuery =
        !normalizedQuery ||
        [expense.title, expense.category, expense.notes, expense.ghost?.name, getGhostExpenseSummary(expense)]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));

      const matchesCategory =
        categoryFilter === "all" || (expense.category ?? "").toLowerCase() === categoryFilter;

      return matchesQuery && matchesCategory;
    });
  }, [expenses, query, categoryFilter]);

  const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const handleDelete = async (expense: PersonalExpense) => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;

    setDeletingId(expense.id);
    try {
      await deletePersonalExpense(expense.id);
      setExpenses((current) => current.filter((item) => item.id !== expense.id));
    } catch {
      setError("Could not delete that expense.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Expenses · {loading ? "loading" : `${expenses.length} logged`}
            </p>
            <h1 className="text-2xl font-medium">Expenses</h1>
          </div>
          <Link
            href="/expenses/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus size={15} />
            Add expense
          </Link>
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search expenses"
              className="w-full rounded-(--evven-radius-card) py-2.5 pl-10 pr-4 text-sm outline-none"
              style={{
                background: "var(--color-background-primary, var(--evven-background))",
                border: "0.5px solid var(--evven-border)",
              }}
            />
          </div>
          <div
            className="rounded-(--evven-radius-card) px-4 py-2.5 text-sm"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            <span className="text-muted-foreground">Total </span>
            <span className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
              {formatAmount(String(total))}
            </span>
          </div>
        </div>

        <div
          className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-full p-1"
          style={{ background: "var(--evven-surface)" }}
        >
          <button
            onClick={() => setCategoryFilter("all")}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background:
                categoryFilter === "all"
                  ? "var(--color-background-primary, var(--evven-background))"
                  : "transparent",
              color: categoryFilter === "all" ? "var(--evven-text-primary)" : "var(--evven-text-muted)",
              border:
                categoryFilter === "all"
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
                onClick={() => setCategoryFilter(cat.value)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background:
                    categoryFilter === cat.value
                      ? "var(--color-background-primary, var(--evven-background))"
                      : "transparent",
                  color: categoryFilter === cat.value ? cat.text : "var(--evven-text-muted)",
                  border:
                    categoryFilter === cat.value
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

        {error && (
          <div
            className="mb-4 rounded-(--evven-radius-card) p-4 text-sm"
            style={{
              background: "var(--evven-surface)",
              color: "var(--evven-error)",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div
            className="rounded-(--evven-radius-card) p-10 text-center"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            <Receipt size={24} className="mx-auto mb-3 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium">
              {expenses.length === 0 ? "No personal expenses yet" : "No matching expenses"}
            </p>
            <p className="mb-5 text-sm text-muted-foreground">
              {expenses.length === 0
                ? "Log your first expense to start tracking your spending."
                : "Try a different search term."}
            </p>
            {expenses.length === 0 && (
              <Link
                href="/expenses/new"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <Plus size={15} />
                Add expense
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExpenses.map((expense) => {
              const categoryMeta = getCategoryMeta(expense.category);
              const CategoryIcon = categoryMeta.icon;

              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 rounded-(--evven-radius-card) px-4 py-3.5 transition-colors hover:bg-(--evven-surface)"
                  style={{
                    background: "var(--color-background-primary, var(--evven-background))",
                    border: "0.5px solid var(--evven-border)",
                  }}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: categoryMeta.bg,
                    }}
                  >
                    <CategoryIcon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{expense.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {categoryMeta.label} · {formatDate(expense)}
                    </p>
                    <FriendSummaryLine expense={expense} />
                  </div>
                  <span className="shrink-0 text-sm font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatAmount(expense.amount)}
                  </span>
                  <Link
                    href={`/expenses/${expense.id}/edit`}
                    aria-label={`Edit ${expense.title}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => void handleDelete(expense)}
                    disabled={deletingId === expense.id}
                    aria-label={`Delete ${expense.title}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-(--evven-surface) disabled:opacity-50"
                    style={{ color: deletingId === expense.id ? "var(--evven-text-muted)" : undefined }}
                  >
                    {deletingId === expense.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
