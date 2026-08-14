"use client";

import { ChevronRight, Receipt, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colorForId, formatAmount, getInitials } from "./group-detail-utils";
import type { UserAvatarFn } from "./group-detail-shared";
import type { BreakdownRow } from "./settlements-utils";
import { SettlementEmptyState } from "./SettlementEmptyState";

export function BreakdownPanel({
  breakdown,
  breakdownError,
  displayName,
  userAvatar,
  onReload,
}: {
  breakdown: BreakdownRow[];
  breakdownError: string | null;
  displayName: (userId: string) => string;
  userAvatar: UserAvatarFn;
  onReload: () => void;
}) {
  return (
    <div className="h-full overflow-y-auto pr-1 pb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
          Expense breakdown
        </p>
        <button
          type="button"
          onClick={onReload}
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
      ) : breakdown.length === 0 ? (
        <SettlementEmptyState
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
          {breakdown.map(({ debtorId, creditors, total }) => {
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
  );
}
