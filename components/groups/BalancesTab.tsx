"use client";

import { Scale } from "lucide-react";
import type { GroupBalances } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { COLORS, formatAmount } from "./group-detail-utils";
import type { SettleFn, UserAvatarFn, UserNameFn } from "./group-detail-shared";
import { getInitials } from "@/lib/format";

export function BalancesTab({
  balances,
  currentUserId,
  members,
  userName,
  userAvatar,
  onSettle,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  members: { user_id: string }[];
  userName: UserNameFn;
  userAvatar: UserAvatarFn;
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
        <div className="card rounded-2xl p-8 text-center">
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
                className="card flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              >
                <Avatar className="size-9" aria-label={userName(uid)}>
                  <AvatarImage src={userAvatar(uid) ?? undefined} alt={userName(uid)} />
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {getInitials(userName(uid))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                    {userName(uid)}
                    {isMe ? " (you)" : ""}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: youOwe ? "var(--evven-destructive-text)" : "var(--evven-success-text)",
                    }}
                  >
                    {youOwe
                      ? `you paid ${formatAmount(displayAmount)} more`
                      : `${userName(uid)} paid ${formatAmount(displayAmount)} more`}
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
