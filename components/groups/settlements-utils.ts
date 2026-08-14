import type { DebtBreakdownEntry, GroupBalances, GroupDebtBreakdown } from "@/types";
import type { UserNameFn } from "./group-detail-shared";

export type SettlementsSubTab = "past" | "final" | "receivables" | "breakdown";

export type SettlementEntry = {
  targetId: string;
  amount: number;
};

export type SettlementRow = {
  sourceId: string;
  entries: SettlementEntry[];
  total: number;
};

export type BreakdownCreditor = {
  creditorId: string;
  items: DebtBreakdownEntry[];
  total: number;
};

export type BreakdownRow = {
  debtorId: string;
  creditors: BreakdownCreditor[];
  total: number;
};

export function getDisplayName(userId: string, currentUserId: string | undefined, userName: UserNameFn) {
  return userId === currentUserId ? "You" : userName(userId);
}

export function formatSettlementLine(
  giverId: string,
  receiverId: string,
  currentUserId: string | undefined,
  userName: UserNameFn
) {
  if (giverId === currentUserId) return `you paid ${userName(receiverId)}`;
  if (receiverId === currentUserId) return `${userName(giverId)} paid you`;
  return `${userName(giverId)} paid ${userName(receiverId)}`;
}

export function getNettedBalanceEntries(balances: GroupBalances, currentUserId: string | undefined) {
  return Object.entries(balances)
    .map(([userId, amount]) => [userId, Number(amount)] as const)
    .filter(([userId, amount]) => userId !== currentUserId && Number.isFinite(amount) && Math.abs(amount) > 0.01);
}

export function buildFinalSettlements(balances: GroupBalances, currentUserId: string | undefined) {
  if (!currentUserId) return [];

  const rows = new Map<string, SettlementRow>();

  for (const [userId, amount] of getNettedBalanceEntries(balances, currentUserId)) {
    const sourceId = amount < 0 ? currentUserId : userId;
    const targetId = amount < 0 ? userId : currentUserId;
    const displayAmount = Math.abs(amount);
    const row = rows.get(sourceId) ?? { sourceId, entries: [], total: 0 };

    row.entries.push({ targetId, amount: displayAmount });
    row.total += displayAmount;
    rows.set(sourceId, row);
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      entries: row.entries.sort((left, right) => right.amount - left.amount),
    }))
    .sort((left, right) => right.total - left.total);
}

export function buildReceivableView(balances: GroupBalances, currentUserId: string | undefined) {
  if (!currentUserId) return [];

  const entries = getNettedBalanceEntries(balances, currentUserId)
    .filter(([, amount]) => amount > 0)
    .map(([userId, amount]) => ({ targetId: userId, amount }))
    .sort((left, right) => right.amount - left.amount);

  if (entries.length === 0) return [];

  return [
    {
      sourceId: currentUserId,
      entries,
      total: entries.reduce((sum, entry) => sum + entry.amount, 0),
    },
  ];
}

export function buildDetailedBreakdown(debtBreakdown: GroupDebtBreakdown | null): BreakdownRow[] {
  if (!debtBreakdown?.breakdown) return [];

  return Object.entries(debtBreakdown.breakdown)
    .map(([debtorId, creditors]) => {
      const creditorEntries = Object.entries(creditors)
        .map(([creditorId, items]) => {
          const sortedItems = [...items].sort(
            (left, right) => Number(right.amount) - Number(left.amount)
          );
          const total = sortedItems.reduce((sum, item) => sum + Number(item.amount), 0);

          return { creditorId, items: sortedItems, total };
        })
        .filter(({ items }) => items.length > 0)
        .sort((left, right) => right.total - left.total);

      const total = creditorEntries.reduce((sum, entry) => sum + entry.total, 0);
      return { debtorId, creditors: creditorEntries, total };
    })
    .filter(({ creditors }) => creditors.length > 0)
    .sort((left, right) => right.total - left.total);
}
