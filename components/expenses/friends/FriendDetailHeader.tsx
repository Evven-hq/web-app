"use client";

import Link from "next/link";
import { ArrowLeftRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FriendDetail } from "@/types";
import { combineFriendHistory } from "@/services/friends";
import {
  formatMoney,
  getDefaultSettlementDirection,
  getFriendBalanceState,
} from "./friend-utils";
import { formatRelativeTime } from "@/lib/format";
import { FriendAvatar } from "./FriendAvatar";
import { FriendActivityList } from "./FriendActivityList";
import { UnfriendDialog } from "./UnfriendDialog";

type FriendBalanceState = NonNullable<ReturnType<typeof getFriendBalanceState>>;

export function FriendDetailHeader({
  friend,
  balance,
  balanceState,
  onOpenSettlement,
  onConfirmUnfriend,
  unfriendError,
}: {
  friend: FriendDetail;
  balance: number;
  balanceState: FriendBalanceState | null;
  onOpenSettlement: () => void;
  onConfirmUnfriend: () => Promise<void>;
  unfriendError: boolean;
}) {
  const direction = getDefaultSettlementDirection(balance);

  return (
    <div className="space-y-5">
      <div
        className="rounded-[28px] border bg-[var(--evven-background)] p-5"
        style={{ borderColor: "var(--evven-border)" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <FriendAvatar friend={friend} active />
            <div className="min-w-0">
              <p className="truncate text-2xl font-medium">{friend.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {friend.user_code
                  ? `Code ${friend.user_code}`
                  : "Active friend"}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {friend.last_activity_at
                  ? `Updated ${formatRelativeTime(friend.last_activity_at)}`
                  : "No activity yet"}
              </p>
            </div>
          </div>

          <div
            className="rounded-3xl border px-4 py-3"
            style={{
              borderColor: "var(--evven-border)",
              background: "var(--evven-card-background)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Balance
            </p>
            <p
              className="mt-2 text-3xl font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatMoney(balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {balanceState?.title ?? "Settled"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div
          className="rounded-3xl border px-4 py-4"
          style={{
            borderColor: "var(--evven-border)",
            background: "var(--evven-card-background)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Status
          </p>
          <p className="mt-2 text-sm font-medium">
            {friend.status ?? "ACTIVE"}
          </p>
        </div>
        <div
          className="rounded-3xl border px-4 py-4"
          style={{
            borderColor: "var(--evven-border)",
            background: "var(--evven-card-background)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Entries
          </p>
          <p className="mt-2 text-sm font-medium">
            {combineFriendHistory(friend).length}
          </p>
        </div>
        <div
          className="rounded-3xl border px-4 py-4"
          style={{
            borderColor: "var(--evven-border)",
            background: "var(--evven-card-background)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Settle state
          </p>
          <p className="mt-2 text-sm font-medium">
            {balance === 0 ? "Settle up complete" : "Outstanding balance"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Button asChild size="sm" className="w-full min-w-0 justify-center">
          <Link
            href={`/expenses/new?friend_id=${friend.id}&direction=${direction}`}
          >
            <Plus />
            Add
          </Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-full min-w-0 justify-center"
        >
          <Link
            href={`/expenses/new?friend_id=${friend.id}&direction=${direction}`}
          >
            <ArrowLeftRight />
            Settle
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full min-w-0 justify-center"
        >
          <Link
            href={`/expenses/new?split=true&friend_id=${friend.id}&direction=${direction}`}
          >
            <Users />
            Split
          </Link>
        </Button>
      </div>

      <div className="flex justify-end">
        <UnfriendDialog
          friend={friend}
          balance={balance}
          onOpenSettlement={onOpenSettlement}
          onConfirm={onConfirmUnfriend}
        />
      </div>

      {unfriendError ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            background:
              "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
            borderColor:
              "color-mix(in srgb, var(--evven-error) 20%, var(--evven-border))",
            color: "var(--evven-error)",
          }}
        >
          Could not remove this friend.
        </div>
      ) : null}

      <section
        className="rounded-[28px] border bg-[var(--evven-background)] p-4 sm:p-5"
        style={{ borderColor: "var(--evven-border)" }}
      >
        <div className="mb-4">
          <p className="text-sm font-medium">Activity</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Expense and settlement history for this friendship.
          </p>
        </div>

        <FriendActivityList friend={friend} />
      </section>
    </div>
  );
}
