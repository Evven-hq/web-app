"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeftRight, CheckCircle, Receipt, Split, Banknote } from "lucide-react";
import type { GroupBalances, GroupDebtBreakdown, Settlement } from "@/types";
import { formatAmount } from "./group-detail-utils";
import type { UserNameFn } from "./group-detail-shared";

type SettlementsSubTab = "past" | "final" | "receivables" | "breakdown";
type SettlementEntry = {
  targetId: string;
  amount: number;
};
type SettlementRow = {
  sourceId: string;
  entries: SettlementEntry[];
  total: number;
};

export function SettlementsTab({
  settlements,
  balances,
  debtBreakdown,
  breakdownError,
  currentUserId,
  userName,
  onReloadBreakdown,
}: {
  settlements: Settlement[];
  balances: GroupBalances;
  debtBreakdown: GroupDebtBreakdown | null;
  breakdownError: string | null;
  currentUserId?: string;
  userName: UserNameFn;
  onReloadBreakdown: () => void;
}) {
  const [subTab, setSubTab] = useState<SettlementsSubTab>("past");

  const displayName = (userId: string) => (userId === currentUserId ? "You" : userName(userId));
  const formatGiveLine = (giverId: string, receiverId: string) => {
    if (giverId === currentUserId) return `you will give ${userName(receiverId)}`;
    if (receiverId === currentUserId) return `${userName(giverId)} will give you`;
    return `${userName(giverId)} will give ${userName(receiverId)}`;
  };
  const formatGaveLine = (giverId: string, receiverId: string) => {
    if (giverId === currentUserId) return `you gave ${userName(receiverId)}`;
    if (receiverId === currentUserId) return `${userName(giverId)} gave you`;
    return `${userName(giverId)} gave ${userName(receiverId)}`;
  };
  const nettedBalanceEntries = Object.entries(balances)
    .map(([userId, amount]) => [userId, Number(amount)] as const)
    .filter(([userId, amount]) => userId !== currentUserId && Number.isFinite(amount) && Math.abs(amount) > 0.01);
  const finalSettlements = (() => {
    if (!currentUserId) return [];

    const rows = new Map<string, SettlementRow>();

    for (const [userId, amount] of nettedBalanceEntries) {
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
  })();
  const receivableView = (() => {
    if (!currentUserId) return [];

    const entries = nettedBalanceEntries
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
  })();

  const detailedBreakdown = (() => {
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
  })();

  const subTabs: Array<{
    key: SettlementsSubTab;
    label: string;
    icon: typeof Banknote;
  }> = [
    { key: "past", label: "Settled", icon: CheckCircle },
    { key: "final", label: "Final settlements", icon: ArrowLeftRight },
    { key: "receivables", label: "Will receive", icon: Split },
    { key: "breakdown", label: "Expense breakdown", icon: Receipt },
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="shrink-0 mb-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl p-1 border" style={{ background: "white", borderColor: "var(--evven-border)" }}>
          {subTabs.map(({ key, label, icon: Icon }) => {
            const active = subTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSubTab(key)}
                className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all"
                style={{
                  background: active ? "var(--evven-surface)" : "transparent",
                  color: active ? "var(--evven-text-primary)" : "var(--evven-text-muted)",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
              >
                <Icon size={12} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {subTab === "past" && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
            {settlements.length > 0 ? (
              <div className="space-y-2">
                {settlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                    style={{ background: "white", borderColor: "var(--evven-border)" }}
                  >
                    <CheckCircle size={15} style={{ color: "#0F6E56" }} className="shrink-0" />
                    <p className="text-sm flex-1 font-medium" style={{ color: "var(--evven-text-primary)" }}>
                      {formatGaveLine(settlement.payer_id, settlement.receiver_id)}
                    </p>
                    <span className="text-sm font-semibold" style={{ color: "#0F6E56" }}>
                      {formatAmount(settlement.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No settled payments" description="Payments you mark as settled will show up here." />
            )}
          </div>
        )}

        {subTab === "final" && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
            {finalSettlements.length > 0 ? (
              <div className="space-y-3">
                {finalSettlements.map(({ sourceId, entries, total }) => (
                  <div
                    key={sourceId}
                    className="rounded-2xl border p-4"
                    style={{ background: "white", borderColor: "var(--evven-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                          {displayName(sourceId)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                          Will give to {entries.length} member{entries.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}
                      >
                        {formatAmount(total)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {entries.map(({ targetId, amount }) => (
                        <div
                          key={targetId}
                          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                          style={{ background: "var(--evven-surface)" }}
                        >
                          <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                            {formatGiveLine(sourceId, targetId)}
                          </p>
                          <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                            {formatAmount(amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No final settlements" description="Unsettled balances will show up here." />
            )}
          </div>
        )}

        {subTab === "receivables" && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
            {receivableView.length > 0 ? (
              <div className="space-y-3">
                {receivableView.map(({ sourceId, entries, total }) => (
                  <div
                    key={sourceId}
                    className="rounded-2xl border p-4"
                    style={{ background: "white", borderColor: "var(--evven-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                          {displayName(sourceId)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                          Will receive from {entries.length} member{entries.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}
                      >
                        {formatAmount(total)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {entries.map(({ targetId, amount }) => (
                        <div
                          key={targetId}
                          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                          style={{ background: "var(--evven-surface)" }}
                        >
                          <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                            {formatGiveLine(targetId, sourceId)}
                          </p>
                          <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                            {formatAmount(amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing to receive" description="Members who will give you money will show up here." />
            )}
          </div>
        )}

        {subTab === "breakdown" && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
                Expense breakdown
              </p>
              <button
                type="button"
                onClick={onReloadBreakdown}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                style={{
                  borderColor: "var(--evven-border)",
                  background: "white",
                  color: "var(--evven-text-primary)",
                }}
              >
                Reload
              </button>
            </div>

            {breakdownError ? (
              <div
                className="rounded-2xl border px-4 py-3 text-sm"
                style={{
                  background: "#FEF2F2",
                  borderColor: "#FECACA",
                  color: "#B91C1C",
                }}
              >
                {breakdownError}
              </div>
            ) : detailedBreakdown.length === 0 ? (
              <EmptyState
                title="No breakdown to show"
                description="Add a few expenses and their splits to see who will give whom."
                icon={<Receipt size={18} style={{ color: "var(--evven-text-muted)" }} />}
              />
            ) : (
              <div className="space-y-3">
                {detailedBreakdown.map(({ debtorId, creditors }) => (
                  <div
                    key={debtorId}
                    className="rounded-2xl border p-4"
                    style={{ background: "white", borderColor: "var(--evven-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                          {displayName(debtorId)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                          Will give to {creditors.length} member{creditors.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}
                      >
                        {formatAmount(creditors.reduce((sum, entry) => sum + entry.total, 0))}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {creditors.map(({ creditorId, items, total }) => (
                        <div
                          key={creditorId}
                          className="rounded-xl p-3"
                          style={{ background: "var(--evven-surface)" }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p
                              className="text-xs font-semibold uppercase tracking-widest"
                              style={{ color: "var(--evven-text-muted)" }}
                            >
                              Will give {displayName(creditorId)}
                            </p>
                            <p className="text-xs font-medium" style={{ color: "var(--evven-text-primary)" }}>
                              {formatAmount(total)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.expense_id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                                    {item.title}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                                    Expense split
                                  </p>
                                </div>
                                <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                                  {formatAmount(item.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border px-4 py-6 text-center"
      style={{ background: "white", borderColor: "var(--evven-border)" }}
    >
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--evven-surface)]">
        {icon ?? <CheckCircle size={16} style={{ color: "var(--evven-text-muted)" }} />}
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
        {title}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--evven-text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
