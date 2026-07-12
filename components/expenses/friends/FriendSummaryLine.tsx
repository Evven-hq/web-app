"use client";

import type { PersonalExpense } from "@/types";
import { getGhostExpenseSummary } from "./friend-utils";

interface FriendSummaryLineProps {
  expense: PersonalExpense;
}

export function FriendSummaryLine({ expense }: FriendSummaryLineProps) {
  const summary = getGhostExpenseSummary(expense);
  if (!summary) return null;

  return <p className="mt-1 truncate text-xs font-medium text-primary">{summary}</p>;
}
