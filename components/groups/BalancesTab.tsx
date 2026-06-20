"use client";

import { Scale } from "lucide-react";
import type { GroupBalances } from "@/types";
import { formatAmount } from "./group-detail-utils";
import type { SettleFn, UserNameFn } from "./group-detail-shared";

const COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E1F5EE", text: "#0F6E56" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E6F1FB", text: "#185FA5" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function BalancesTab({
  balances,
  currentUserId,
  payableDebts,
  members,
  userName,
  onSettle,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  payableDebts: Record<string, number>;
  members: { user_id: string }[];
  userName: UserNameFn;
  onSettle: SettleFn;
}) {
  const colorFor = (uid: string) => {
    const colorIdx = members.findIndex((member) => member.user_id === uid) % COLORS.length;
    return COLORS[Math.max(0, colorIdx)];
  };

  return (
    <div className="h-full overflow-y-auto pr-1">
      {Object.keys(balances).length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center border"
          style={{ background: "white", borderColor: "var(--evven-border)" }}
        >
          <Scale size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>
            All settled up
          </p>
          <p className="text-xs" style={{ color: "var(--evven-text-muted)" }}>
            No outstanding balances in this group.
          </p>
        </div>
      ) : (
        <div className="space-y-2 pb-8">
          {Object.entries(balances).map(([uid, bal]) => {
            const n = parseFloat(bal);
            const isMe = uid === currentUserId;
            const payableAmount = payableDebts[uid] ?? 0;
            const youOwe = payableAmount > 0;
            const isPos = !youOwe && n > 0;
            const color = colorFor(uid);

            return (
              <div
                key={uid}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ background: color.bg, color: color.text }}
                >
                  {getInitials(userName(uid))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                    {userName(uid)}
                    {isMe ? " (you)" : ""}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: youOwe ? "#A32D2D" : isPos ? "#0F6E56" : "#A32D2D" }}
                  >
                    {n === 0 && !youOwe
                      ? "settled"
                      : youOwe
                        ? `you owe ${formatAmount(payableAmount)}`
                        : isPos
                          ? `gets back ${formatAmount(Math.abs(n))}`
                          : `owes ${formatAmount(Math.abs(n))}`}
                  </p>
                </div>
                {!isMe && youOwe && (
                  <button
                    onClick={() => onSettle(uid, payableAmount)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white shrink-0"
                    style={{ background: "var(--evven-accent-primary)" }}
                  >
                    Settle
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
