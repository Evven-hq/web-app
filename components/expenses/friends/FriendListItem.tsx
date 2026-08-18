"use client";

import { ChevronRight } from "lucide-react";
import type { Friend } from "@/types";
import {
  formatMoney,
  getFriendBalanceLabel,
  getFriendBalanceState,
} from "./friend-utils";
import { FriendAvatar } from "./FriendAvatar";

export function FriendListItem({
  friend,
  active,
  onSelect,
}: {
  friend: Friend;
  active: boolean;
  onSelect: () => void;
}) {
  const balanceState = getFriendBalanceState(friend);

  return (
    <button
      key={friend.id}
      type="button"
      onClick={onSelect}
      className={[
        "flex h-full w-full items-center gap-3 rounded-3xl border px-4 py-4 text-left transition-all hover:-translate-y-0.5",
        active
          ? "ring-2 ring-[var(--evven-accent-primary)] ring-offset-2 ring-offset-background"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: active
          ? "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-card-background))"
          : "var(--evven-card-background)",
        borderColor: "var(--evven-border)",
      }}
    >
      <FriendAvatar friend={friend} active={active} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{friend.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {friend.user_code
            ? `Code ${friend.user_code}`
            : getFriendBalanceLabel(friend)}
        </p>
      </div>
      <div className="text-right">
        <p
          className="text-sm font-semibold"
          style={{
            color:
              balanceState.tone === "positive"
                ? "var(--evven-accent-primary)"
                : balanceState.tone === "negative"
                  ? "var(--evven-error)"
                  : "var(--evven-text-muted)",
          }}
        >
          {formatMoney(friend.balance ?? friend.net_balance ?? 0)}
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {balanceState.title}
        </p>
      </div>
      <ChevronRight size={16} style={{ color: "var(--evven-text-muted)" }} />
    </button>
  );
}
