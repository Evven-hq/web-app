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
  members,
  userName,
  onSettle,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  members: { user_id: string }[];
  userName: UserNameFn;
  onSettle: SettleFn;
}) {
  const colorFor = (uid: string) => {
    const colorIdx = members.findIndex((member) => member.user_id === uid) % COLORS.length;
    return COLORS[Math.max(0, colorIdx)];
  };
  const balanceEntries = Object.entries(balances)
    .map(([uid, bal]) => [uid, Number(bal)] as const)
    .filter(([, amount]) => Number.isFinite(amount) && Math.abs(amount) > 0.01);

  return (
    <div className="h-full overflow-y-auto pr-1">
      {balanceEntries.length === 0 ? (
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
          {balanceEntries.map(([uid, n]) => {
            const isMe = uid === currentUserId;
            const displayAmount = Math.abs(n);
            const youOwe = n < 0;
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
                    style={{
                      color: youOwe ? "#A32D2D" : "#0F6E56",
                    }}
                  >
                    {youOwe
                      ? `you owe ${formatAmount(displayAmount)}`
                      : `owes you ${formatAmount(displayAmount)}`}
                  </p>
                </div>
                {!isMe && youOwe ? (
                  <button
                    onClick={() => onSettle(uid, displayAmount)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white shrink-0"
                    style={{ background: "var(--evven-accent-primary)" }}
                  >
                    Settle
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
