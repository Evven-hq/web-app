import type { Friend, PersonalExpense, SettlementDirection } from "@/types";

export function formatMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return `₹${Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatSignedMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${prefix}${formatMoney(amount)}`;
}

export { getInitials } from "@/lib/format";

export function normalizeSearchText(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function friendMatchesSearch(
  friend: Pick<Friend, "name" | "user_code" | "balance" | "net_balance">,
  query: string
) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return [friend.name, friend.user_code, getFriendBalanceLabel(friend)]
    .filter(Boolean)
    .some((value) => normalizeSearchText(value).includes(normalizedQuery));
}

export function getFriendBalance(friend: Pick<Friend, "balance" | "net_balance" | "name">) {
  return Number(friend.balance ?? friend.net_balance ?? 0);
}

export function getFriendBalanceLabel(friend: Pick<Friend, "balance" | "net_balance" | "name">) {
  const balance = getFriendBalance(friend);

  if (!Number.isFinite(balance) || balance === 0) {
    return "Settled up";
  }

  return balance > 0
    ? `${friend.name} paid ${formatMoney(balance)} more`
    : `You paid ${formatMoney(balance)} more`;
}

export function getFriendBalanceState(friend: Pick<Friend, "balance" | "net_balance" | "name">) {
  const balance = getFriendBalance(friend);

  if (!Number.isFinite(balance) || balance === 0) {
    return {
      tone: "neutral" as const,
      title: "Settled up",
      helper: "No outstanding balance",
      amount: 0,
    };
  }

  if (balance > 0) {
    return {
      tone: "positive" as const,
      title: `${friend.name} paid ${formatMoney(balance)} more`,
      helper: "They paid more than their share",
      amount: balance,
    };
  }

  return {
    tone: "negative" as const,
    title: `You paid ${formatMoney(balance)} more`,
    helper: "You paid more than your share",
    amount: balance,
  };
}

export function getFriendExpenseDirectionLabel(
  direction: SettlementDirection,
  friendName?: string | null
) {
  if (direction === "they_owe") {
    return "You paid";
  }

  return friendName ? `${friendName} paid` : "They paid";
}

export function getFriendExpenseSummary(expense: PersonalExpense) {
  const friendName = expense.friend?.name ?? expense.ghost?.name ?? null;
  if (!friendName && !expense.friend_id && !expense.ghost_id) return null;

  const amount = expense.settlement_amount ?? expense.amount;
  const displayName = friendName ?? "Friend";

  if (expense.settlement_direction === "you_owe") {
    return `${displayName} paid ${formatMoney(amount)}`;
  }

  if (expense.settlement_direction === "they_owe") {
    return `You paid ${formatMoney(amount)}`;
  }

  return `With ${displayName}`;
}

export function getFriendHistoryStatus(expense: PersonalExpense) {
  if (expense.settlement_amount) {
    return "Settled";
  }

  return "Pending";
}

export function getFriendHistoryDirection(expense: PersonalExpense) {
  if (expense.settlement_direction === "you_owe") {
    return "They paid";
  }

  if (expense.settlement_direction === "they_owe") {
    return "You paid";
  }

  return "Expense";
}

export function getDefaultSettlementDirection(balance: string | number | null | undefined): SettlementDirection {
  const numericBalance = Number(balance ?? 0);
  return numericBalance > 0 ? "they_owe" : "you_owe";
}

export const getGhostBalanceLabel = getFriendBalanceLabel;
export const getGhostBalanceState = getFriendBalanceState;
export const getGhostExpenseDirectionLabel = getFriendExpenseDirectionLabel;
export const getGhostExpenseSummary = getFriendExpenseSummary;
export const getGhostHistoryStatus = getFriendHistoryStatus;
export const getGhostHistoryDirection = getFriendHistoryDirection;
