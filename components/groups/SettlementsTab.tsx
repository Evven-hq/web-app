"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeftRight, CheckCircle, ChevronRight, Receipt, RefreshCw, Split, Banknote } from "lucide-react";
import type { GroupBalances, GroupDebtBreakdown, Settlement } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { COLORS, formatAmount, getInitials } from "./group-detail-utils";
import type { UserAvatarFn, UserNameFn } from "./group-detail-shared";

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

function colorForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

export function SettlementsTab({
  settlements,
  balances,
  debtBreakdown,
  breakdownError,
  currentUserId,
  userName,
  userAvatar,
  onReloadBreakdown,
}: {
  settlements: Settlement[];
  balances: GroupBalances;
  debtBreakdown: GroupDebtBreakdown | null;
  breakdownError: string | null;
  currentUserId?: string;
  userName: UserNameFn;
  userAvatar: UserAvatarFn;
  onReloadBreakdown: () => void;
}) {
  const [subTab, setSubTab] = useState<SettlementsSubTab>("past");

  const displayName = (userId: string) => (userId === currentUserId ? "You" : userName(userId));
  const formatGiveLine = (giverId: string, receiverId: string) => {
    if (giverId === currentUserId) return `you paid ${userName(receiverId)}`;
    if (receiverId === currentUserId) return `${userName(giverId)} paid you`;
    return `${userName(giverId)} paid ${userName(receiverId)}`;
  };
  const formatGaveLine = (giverId: string, receiverId: string) => {
    if (giverId === currentUserId) return `you paid ${userName(receiverId)}`;
    if (receiverId === currentUserId) return `${userName(giverId)} paid you`;
    return `${userName(giverId)} paid ${userName(receiverId)}`;
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
    { key: "final", label: "To settle", icon: ArrowLeftRight },
    { key: "receivables", label: "To collect", icon: Split },
    { key: "breakdown", label: "Breakdown", icon: Receipt },
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Compact 4-up segmented control: icon-over-label, tighter grid instead of
          the previous 2x2 card grid, so it reads as one control, not a second
          stacked tab bar. */}
      <div
        className="shrink-0 mb-4 grid grid-cols-4 gap-1 rounded-2xl p-1"
        style={{ background: "var(--evven-surface)", border: "1px solid var(--evven-border)" }}
        role="tablist"
      >
        {subTabs.map(({ key, label, icon: Icon }) => {
          const active = subTab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSubTab(key)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-[10.5px] font-medium leading-tight transition-all"
              style={{
                background: active ? "var(--evven-accent-secondary)" : "transparent",
                color: active ? "var(--evven-warning-text)" : "var(--evven-text-muted)",
              }}
            >
              <Icon size={14} />
              <span className="truncate w-full text-center">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {subTab === "past" && (
          <div className="h-full overflow-y-auto pr-1 pb-8">
            {settlements.length > 0 ? (
              <div className="space-y-2">
                {settlements.map((settlement) => (
                  <div
                    key={settlement.id}
                    className="card flex items-center gap-3 rounded-2xl px-4 py-3"
                  >
                    <CheckCircle size={15} style={{ color: "var(--evven-success-text)" }} className="shrink-0" />
                    <p className="text-sm flex-1 font-medium" style={{ color: "var(--evven-text-primary)" }}>
                      {formatGaveLine(settlement.payer_id, settlement.receiver_id)}
                    </p>
                    <span className="text-sm font-semibold" style={{ color: "var(--evven-success-text)" }}>
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
                    className="card rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                          {displayName(sourceId)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                          Needs to settle with {entries.length} member{entries.length !== 1 ? "s" : ""}
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
              <EmptyState title="No payments to settle" description="Unsettled payments will show up here." />
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
                    className="card rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                          {displayName(sourceId)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                          To collect from {entries.length} member{entries.length !== 1 ? "s" : ""}
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
              <EmptyState title="Nothing to collect" description="Members you can collect from will show up here." />
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
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                style={{
                  borderColor: "var(--evven-border)",
                  background: "var(--evven-card-background)",
                  color: "var(--evven-text-primary)",
                }}
              >
                <RefreshCw size={12} />
                Reload
              </button>
            </div>

            {breakdownError ? (
              <div
                className="card rounded-2xl px-4 py-3 text-sm"
                style={{
                  background: "var(--evven-error-bg)",
                  borderColor: "var(--evven-error-border)",
                  color: "var(--evven-error-text)",
                }}
              >
                {breakdownError}
              </div>
            ) : detailedBreakdown.length === 0 ? (
              <EmptyState
                title="No breakdown to show"
                description="Add a few expenses and their splits to see who paid whom."
                icon={<Receipt size={18} style={{ color: "var(--evven-text-muted)" }} />}
              />
            ) : (
              // One card per debtor holding everyone they owe, instead of a card
              // nested inside a card inside a card. A header row identifies who
              // owes, internal dividers separate each creditor, and a thin rule
              // groups that creditor's line items — so the hierarchy reads through
              // spacing and rules rather than repeated borders.
              <div className="space-y-3">
                {detailedBreakdown.map(({ debtorId, creditors, total }) => {
                  const color = colorForId(debtorId);
                  return (
                    <div key={debtorId} className="card rounded-2xl overflow-hidden">
                      <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: "1px solid var(--evven-border)" }}
                      >
                        <Avatar aria-label={displayName(debtorId)}>
                          <AvatarImage src={userAvatar(debtorId) ?? undefined} alt={displayName(debtorId)} />
                          <AvatarFallback
                            className="text-[11px] font-semibold"
                            style={{ background: color.bg, color: color.text }}
                          >
                            {getInitials(displayName(debtorId))}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--evven-text-primary)" }}>
                            {displayName(debtorId)}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                            pays {creditors.length} member{creditors.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                          {formatAmount(total)}
                        </span>
                      </div>

                      <div>
                        {creditors.map(({ creditorId, items, total: creditorTotal }, index) => (
                          <div
                            key={creditorId}
                            className="px-4 py-3"
                            style={{
                              borderBottom:
                                index < creditors.length - 1 ? "1px solid var(--evven-border)" : "none",
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-2">
                              <ChevronRight size={12} style={{ color: "var(--evven-text-muted)" }} />
                              <p className="text-xs font-medium flex-1" style={{ color: "var(--evven-text-muted)" }}>
                                to {displayName(creditorId)}
                              </p>
                              <p className="text-xs font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                                {formatAmount(creditorTotal)}
                              </p>
                            </div>
                            <div
                              className="space-y-1.5 pl-3"
                              style={{ borderLeft: "2px solid var(--evven-border)" }}
                            >
                              {items.map((item) => (
                                <div key={item.expense_id} className="flex items-center justify-between gap-3">
                                  <span
                                    className="text-xs truncate"
                                    style={{ color: "var(--evven-text-primary)" }}
                                  >
                                    {item.title}
                                  </span>
                                  <span
                                    className="text-xs font-medium shrink-0"
                                    style={{ color: "var(--evven-text-muted)" }}
                                  >
                                    {formatAmount(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
      className="card rounded-2xl px-4 py-6 text-center"
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
