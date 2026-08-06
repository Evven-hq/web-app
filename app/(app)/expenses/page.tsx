"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { Edit3, Loader2, Plus, Receipt, Search, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FriendSummaryLine, getGhostExpenseSummary } from "@/components/expenses/friends";
import { ExpenseForm, type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import { createPersonalExpense, deletePersonalExpense, getPersonalExpenses } from "@/services/expenses";
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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddExpense, setShowAddExpense] = useState(false);

  const initialExpenseValues = useMemo<ExpenseFormValues>(() => {
    const direction = searchParams.get("direction");

    return {
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
      payment_method: "upi",
      ghost_id: searchParams.get("ghost_id") ?? "",
      settlement_direction:
        direction === "you_owe" || direction === "they_owe" ? direction : "they_owe",
      settlement_amount: "",
    };
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("new") === "1" || searchParams.get("ghost_id")) {
      setShowAddExpense(true);
    }
  }, [searchParams]);

  const closeAddExpenseModal = () => {
    setShowAddExpense(false);

    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/expenses");
    }
  };

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: getPersonalExpenses,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePersonalExpense,
    onSuccess: (_, id) => {
      queryClient.setQueryData<PersonalExpense[]>(["expenses"], (prev) =>
        prev ? prev.filter((e) => e.id !== id) : []
      );
    },
  });

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

  const handleDelete = (expense: PersonalExpense) => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    deleteMutation.mutate(expense.id);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Expenses · {isLoading ? "isLoading" : `${expenses.length} logged`}
            </p>
            <h1 className="text-2xl font-medium">Expenses</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus size={15} />
            Add expense
          </button>
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
          className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-xl p-1"
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
          <div className="card mb-4 rounded-(--evven-radius-card) p-4 text-sm" style={{ color: "var(--evven-error)" }}>
            Could not load your expenses.
          </div>
        )}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="card rounded-(--evven-radius-card) p-10 text-center">
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
              <button
                type="button"
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <Plus size={15} />
                Add expense
              </button>
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
                  className="card flex items-center gap-3 rounded-(--evven-radius-card) px-4 py-3.5 transition-colors hover:bg-(--evven-surface)"
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
                    disabled={deleteMutation.isPending}
                    aria-label={`Delete ${expense.title}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-(--evven-surface) disabled:opacity-50"
                    style={{ color: deleteMutation.isPending ? "var(--evven-text-muted)" : undefined }}
                  >
                    {deleteMutation.isPending ? (
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

      {showAddExpense && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="premium-modal-backdrop absolute inset-0"
            onClick={closeAddExpenseModal}
          />
          <div className="premium-modal-panel card relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-5 shadow-xl sm:p-6">
            <button
              type="button"
              onClick={closeAddExpenseModal}
              className="absolute right-4 top-4 rounded-lg p-1.5"
              style={{ background: "var(--evven-surface)" }}
              aria-label="Close add expense form"
            >
              <X size={15} />
            </button>

            <div className="mb-5 pr-9">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Personal ledger
              </p>
              <h2 className="text-xl font-medium">Add expense</h2>
            </div>

            <ExpenseForm
              initialValues={initialExpenseValues}
              submitLabel="Add expense"
              onSubmit={async (expense) => {
                await createPersonalExpense(expense);
                await queryClient.invalidateQueries({ queryKey: ["expenses"] });
                closeAddExpenseModal();
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
