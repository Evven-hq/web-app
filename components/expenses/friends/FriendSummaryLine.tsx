"use client";

import type { PersonalExpense } from "@/types";
import { getFriendExpenseSummary } from "./friend-utils";

interface FriendSummaryLineProps {
  expense: PersonalExpense;
}

export function FriendSummaryLine({ expense }: FriendSummaryLineProps) {
  const summary = getFriendExpenseSummary(expense);
  if (!summary) return null;

  return (
    <p className="mt-1 truncate text-xs font-medium text-primary">{summary}</p>
  );
}
