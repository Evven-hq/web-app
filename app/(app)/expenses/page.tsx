"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseDetailModal } from "@/components/expenses/ExpenseDetailModal";
import { type ExpenseFormValues } from "@/components/expenses/ExpenseForm";
import { AddExpenseModal } from "@/components/expenses/list/AddExpenseModal";
import { CategoryFilterBar } from "@/components/expenses/list/CategoryFilterBar";
import { ExpenseEmptyState } from "@/components/expenses/list/ExpenseEmptyState";
import { ExpenseListItem } from "@/components/expenses/list/ExpenseListItem";
import { ExpensePageHeader } from "@/components/expenses/list/ExpensePageHeader";
import { ExpenseToolbar } from "@/components/expenses/list/ExpenseToolbar";
import { filterExpenses } from "@/components/expenses/list/expense-list-utils";
import { createPersonalExpense, deletePersonalExpense, getPersonalExpenses } from "@/services/expenses";
import type { PersonalExpense } from "@/types";

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<PersonalExpense | null>(null);
  const splitEnabled = searchParams.get("split") === "1" || searchParams.get("split") === "true";

  const initialExpenseValues = useMemo<ExpenseFormValues>(() => {
    const direction = searchParams.get("direction");

    return {
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
      payment_method: "upi",
      friend_id: searchParams.get("friend_id") ?? searchParams.get("ghost_id") ?? "",
      settlement_direction:
        direction === "you_owe" || direction === "they_owe" ? direction : "they_owe",
      settlement_amount: "",
      split_mode: "equal",
      split_participants:
        splitEnabled && (searchParams.get("friend_id") ?? searchParams.get("ghost_id"))
          ? [
              {
                friend_id: searchParams.get("friend_id") ?? searchParams.get("ghost_id") ?? "",
              },
            ]
          : [],
    };
  }, [searchParams]);

  useEffect(() => {
    if (
      searchParams.get("new") === "1" ||
      searchParams.get("split") === "1" ||
      searchParams.get("split") === "true" ||
      searchParams.get("friend_id") ||
      searchParams.get("ghost_id")
    ) {
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

  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, query, categoryFilter),
    [expenses, query, categoryFilter]
  );

  const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const handleDelete = (expense: PersonalExpense) => {
    if (!window.confirm(`Delete "${expense.title}"?`)) return;
    deleteMutation.mutate(expense.id);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <ExpensePageHeader
          count={expenses.length}
          isLoading={isLoading}
          onAdd={() => setShowAddExpense(true)}
        />

        <ExpenseToolbar query={query} onQueryChange={setQuery} total={total} />

        <CategoryFilterBar value={categoryFilter} onChange={setCategoryFilter} />

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
          <ExpenseEmptyState
            hasAnyExpenses={expenses.length > 0}
            onAdd={() => setShowAddExpense(true)}
          />
        ) : (
          <div className="space-y-2">
            {filteredExpenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                expense={expense}
                deletePending={deleteMutation.isPending}
                onSelect={setSelectedExpense}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {selectedExpense ? (
        <ExpenseDetailModal
          expense={selectedExpense}
          open={Boolean(selectedExpense)}
          onClose={() => setSelectedExpense(null)}
          onDelete={(expense) => {
            handleDelete(expense);
            setSelectedExpense(null);
          }}
        />
      ) : null}

      {showAddExpense ? (
        <AddExpenseModal
          initialValues={initialExpenseValues}
          initialSplitEnabled={splitEnabled}
          onClose={closeAddExpenseModal}
          onSubmit={async (expense) => {
            if (Array.isArray(expense)) {
              await Promise.all(expense.map((item) => createPersonalExpense(item)));
            } else {
              await createPersonalExpense(expense);
            }
            await queryClient.invalidateQueries({ queryKey: ["expenses"] });
            closeAddExpenseModal();
          }}
        />
      ) : null}
    </div>
  );
}
