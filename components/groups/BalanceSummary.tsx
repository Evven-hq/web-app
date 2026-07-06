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
      className="rounded-2xl p-4 mb-5 border"
      style={{ background: "white", borderColor: "var(--evven-border)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Your balances
      </p>
      <div className="space-y-2">
        {myBalances
          .map(([uid, n]) => {
            const youOwe = n < 0;
            const displayAmount = Math.abs(n);
            return (
              <div key={uid} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--evven-text-primary)" }}>
                  {userName(uid)}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: youOwe ? "#A32D2D" : "#0F6E56" }}
                  >
                    {youOwe
                      ? `you owe ${formatAmount(displayAmount)}`
                      : `owes you ${formatAmount(displayAmount)}`}
                  </span>
                  {youOwe ? (
                    <button
                      onClick={() => onSettle(uid, displayAmount)}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium text-white"
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
