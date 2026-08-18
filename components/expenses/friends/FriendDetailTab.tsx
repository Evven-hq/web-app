"use client";

import { UserRound } from "lucide-react";
import type { FriendDetail } from "@/types";
import { getFriendBalanceState } from "./friend-utils";
import { FriendDetailHeader } from "./FriendDetailHeader";

type FriendBalanceState = NonNullable<ReturnType<typeof getFriendBalanceState>>;

export function FriendDetailTab({
  selectedFriend,
  isLoading,
  isError,
  balance,
  balanceState,
  onOpenSettlement,
  onConfirmUnfriend,
  unfriendError,
}: {
  selectedFriend: FriendDetail | null;
  isLoading: boolean;
  isError: boolean;
  balance: number;
  balanceState: FriendBalanceState | null;
  onOpenSettlement: () => void;
  onConfirmUnfriend: () => Promise<void>;
  unfriendError: boolean;
}) {
  if (!selectedFriend) {
    return (
      <div
        className="flex min-h-[20rem] flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-10 text-center"
        style={{ borderColor: "var(--evven-border)" }}
      >
        <div
          className="mb-4 flex size-14 items-center justify-center rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--evven-accent-secondary) 26%, var(--evven-background))",
            color: "var(--evven-accent-primary)",
          }}
        >
          <UserRound size={22} />
        </div>
        <p className="text-base font-medium">Select a friend</p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Open an active relationship to review the latest balance, settle up,
          or add another expense.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-3xl bg-[var(--evven-surface)]" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-3xl bg-[var(--evven-surface)]"
            />
          ))}
        </div>
        <div className="h-56 animate-pulse rounded-3xl bg-[var(--evven-surface)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-[var(--evven-border)] px-4 py-6 text-sm text-destructive">
        Could not load this friend right now.
      </div>
    );
  }

  return (
    <FriendDetailHeader
      friend={selectedFriend}
      balance={balance}
      balanceState={balanceState}
      onOpenSettlement={onOpenSettlement}
      onConfirmUnfriend={onConfirmUnfriend}
      unfriendError={unfriendError}
    />
  );
}
