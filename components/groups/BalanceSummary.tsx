"use client";

import type { GroupBalances } from "@/types";
import { formatAmount } from "./group-detail-utils";
import type { SettleFn, UserNameFn } from "./group-detail-shared";

export function BalanceSummary({
  balances,
  currentUserId,
  userName,
  onSettle,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  userName: UserNameFn;
  onSettle: SettleFn;
}) {
  const myBalances = Object.entries(balances)
    .map(([uid, bal]) => [uid, Number(bal)] as const)
    .filter(([uid, amount]) => uid !== currentUserId && Number.isFinite(amount) && Math.abs(amount) > 0.01);

  if (myBalances.length === 0) return null;

  return (
    <div
      className="mb-5 rounded-2xl px-3.5 py-3"
      style={{ background: "var(--evven-surface)", border: "1px solid var(--evven-border)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "var(--evven-accent-primary)" }}
        />
        <p
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--evven-text-muted)" }}
        >
          Your balances
        </p>
      </div>

      <div className="space-y-1.5">
        {myBalances.map(([uid, n]) => {
          const youOwe = n < 0;
          const displayAmount = Math.abs(n);

          return (
            <div key={uid} className="flex items-center justify-between gap-2">
              <span className="text-xs truncate" style={{ color: "var(--evven-text-primary)" }}>
                {userName(uid)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{ color: youOwe ? "var(--evven-destructive-text)" : "var(--evven-success-text)" }}
                >
                  {youOwe ? `you owe ${formatAmount(displayAmount)}` : `owes you ${formatAmount(displayAmount)}`}
                </span>
                {youOwe ? (
                  <button
                    onClick={() => onSettle(uid, displayAmount)}
                    className="text-[11px] px-2 py-1 rounded-lg font-medium text-[var(--evven-text-inverse)]"
                    style={{ background: "var(--evven-accent-primary)" }}
                  >
                    Settle
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
