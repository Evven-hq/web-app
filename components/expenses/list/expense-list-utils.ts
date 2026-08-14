import { getGhostExpenseSummary } from "@/components/expenses/friends";
import type { PersonalExpense } from "@/types";

export function filterExpenses(
  expenses: PersonalExpense[],
  query: string,
  categoryFilter: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  return expenses.filter((expense) => {
    const matchesQuery =
      !normalizedQuery ||
      [expense.title, expense.category, expense.notes, expense.friend?.name, expense.ghost?.name, getGhostExpenseSummary(expense)]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      categoryFilter === "all" || (expense.category ?? "").toLowerCase() === categoryFilter;

    return matchesQuery && matchesCategory;
  });
}
