import type { Ghost, PersonalExpense, SettlementDirection } from "@/types";

export function formatMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return `₹${Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getGhostBalanceLabel(friend: Ghost) {
  const balance = Number(friend.net_balance ?? 0);

  if (!Number.isFinite(balance) || balance === 0) {
    return "Settled up";
  }

  return balance > 0
    ? `${friend.name} owes you ${formatMoney(balance)}`
    : `You owe ${friend.name} ${formatMoney(balance)}`;
}

export function getGhostExpenseSummary(expense: PersonalExpense) {
  const friendName = expense.ghost?.name ?? null;
  if (!friendName && !expense.ghost_id) return null;

  const amount = expense.settlement_amount ?? expense.amount;
  const displayName = friendName ?? "Friend";

  if (expense.settlement_direction === "you_owe") {
    return `You owe ${displayName} ${formatMoney(amount)}`;
  }

  if (expense.settlement_direction === "they_owe") {
    return `${displayName} owes you ${formatMoney(amount)}`;
  }

  return `With ${displayName}`;
}

export function getDefaultSettlementDirection(balance: string | number | null | undefined): SettlementDirection {
  const numericBalance = Number(balance ?? 0);
  return numericBalance > 0 ? "they_owe" : "you_owe";
}
