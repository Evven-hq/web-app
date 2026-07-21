"use client";

import Link from "next/link";
import { ArrowLeftRight, Plus, UserRound } from "lucide-react";
import type { Ghost } from "@/types";
import { Button } from "@/components/ui/button";
import { FriendHistoryList } from "./FriendHistoryList";
import { FriendSettlementDialog } from "./FriendSettlementDialog";
import {
  formatSignedMoney,
  getDefaultSettlementDirection,
  getGhostBalanceState,
  getInitials,
} from "./friend-utils";

interface FriendDetailPanelProps {
  friend: Ghost | null;
  loading?: boolean;
  error?: string;
  onOpenSettlement: () => void;
  settlementOpen: boolean;
  onSettlementOpenChange: (open: boolean) => void;
  onRecordSettlement: (payload: {
    amount: number;
    note?: string;
    direction: "you_owe" | "they_owe";
    payment_method: "upi" | "cash";
  }) => Promise<void>;
}

export function FriendDetailPanel({
  friend,
  loading = false,
  error = "",
  onOpenSettlement,
  settlementOpen,
  onSettlementOpenChange,
  onRecordSettlement,
}: FriendDetailPanelProps) {
  if (!friend && !loading && !error) {
    return (
      <div className="card flex min-h-[22rem] items-center justify-center p-5 text-center sm:min-h-[28rem] sm:p-6 rounded-[var(--evven-radius-card)]">
        <div className="max-w-sm">
          <div
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full"
            style={{
              background: "var(--evven-accent-secondary)",
              color: "var(--evven-accent-primary)",
            }}
          >
            <UserRound size={20} />
          </div>
          <p className="text-sm font-medium">Select a friend</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick someone from the list to see their expense history, settle their payment, or add a new expense.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card rounded-[var(--evven-radius-card)] p-5 text-sm" style={{ color: "var(--evven-error)" }}>
        {error}
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="card flex min-h-[22rem] items-center justify-center p-5 sm:min-h-[28rem] sm:p-6 rounded-[var(--evven-radius-card)]">
        <span className="animate-spin text-primary">
          <ArrowLeftRight size={18} />
        </span>
      </div>
    );
  }

  const balanceState = getGhostBalanceState(friend);
  const hasBalance = Number(friend.net_balance ?? 0) !== 0;

  return (
    <div className="space-y-4">
      <section className="card rounded-[var(--evven-radius-card)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              style={{
                background:
                  balanceState.tone === "negative"
                    ? "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))"
                    : balanceState.tone === "positive"
                      ? "color-mix(in srgb, var(--evven-accent-secondary) 35%, var(--evven-surface))"
                      : "var(--evven-background)",
                color:
                  balanceState.tone === "negative"
                    ? "var(--evven-error)"
                    : balanceState.tone === "positive"
                      ? "var(--evven-accent-primary)"
                      : "var(--evven-text-muted)",
              }}
            >
              {getInitials(friend.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-medium">{friend.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{balanceState.helper}</p>
            </div>
          </div>

          <div className="flex items-start justify-start gap-2 sm:items-end sm:justify-end">
            <div
              className="max-w-full rounded-full px-3 py-2 text-xs font-medium"
              style={{
                background:
                  balanceState.tone === "neutral"
                    ? "var(--evven-background)"
                    : balanceState.tone === "positive"
                      ? "color-mix(in srgb, var(--evven-accent-secondary) 25%, var(--evven-surface))"
                      : "color-mix(in srgb, var(--evven-error) 10%, var(--evven-surface))",
                color:
                  balanceState.tone === "negative"
                    ? "var(--evven-error)"
                    : balanceState.tone === "positive"
                      ? "var(--evven-accent-primary)"
                  : "var(--evven-text-muted)",
              }}
            >
              <span className="block max-w-[18rem] truncate">{balanceState.title}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="default" size="sm" className="w-full sm:w-auto">
            <Link
              href={`/expenses/new?ghost_id=${friend.id}&direction=${getDefaultSettlementDirection(
                friend.net_balance
              )}`}
            >
              <Plus />
              Add expense with this friend
            </Link>
          </Button>
          <Button
            variant={hasBalance ? "secondary" : "outline"}
            size="sm"
            type="button"
            onClick={onOpenSettlement}
            className="w-full sm:w-auto"
          >
            <ArrowLeftRight />
            Settle
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="card rounded-[var(--evven-radius-card)] p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Balance</p>
            <p className="mt-2 text-sm font-medium">{formatSignedMoney(friend.net_balance ?? 0)}</p>
          </div>
          <div className="card rounded-[var(--evven-radius-card)] p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Status</p>
            <p className="mt-2 text-sm font-medium">
              {balanceState.tone === "neutral" ? "Settled up" : "Pending"}
            </p>
          </div>
          <div className="card rounded-[var(--evven-radius-card)] p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">History</p>
            <p className="mt-2 text-sm font-medium">{friend.expenses?.length ?? 0} transactions</p>
          </div>
        </div>
      </section>

      <section className="card rounded-[var(--evven-radius-card)] p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div>
            <p className="text-sm font-medium">Transaction history</p>
            <p className="mt-1 text-sm text-muted-foreground">
              See every expense tied to this friend.
            </p>
          </div>
        </div>

        <FriendHistoryList
          expenses={friend.expenses ?? []}
          loading={loading}
          error={loading ? "" : ""}
          emptyLabel="No transactions with this friend yet."
        />
      </section>

      <FriendSettlementDialog
        friend={friend}
        open={settlementOpen}
        onOpenChange={onSettlementOpenChange}
        onSubmit={onRecordSettlement}
      />
    </div>
  );
}