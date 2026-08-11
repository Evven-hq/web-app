"use client";

import Link from "next/link";
import { useMemo } from "react";
import { HandCoins, UserRoundPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Friend, SettlementDirection } from "@/types";
import { Button } from "@/components/ui/button";
import { getFriends } from "@/services/friends";
import {
  getDefaultSettlementDirection,
  getFriendBalanceLabel,
  getFriendExpenseDirectionLabel,
  getInitials,
} from "./friend-utils";

interface FriendExpenseValues {
  friend_id: string;
  settlement_direction: SettlementDirection;
  settlement_amount: string;
}

interface FriendExpenseFieldsProps {
  amount: string;
  values: FriendExpenseValues;
  onChange: (updates: Partial<FriendExpenseValues>) => void;
}

function FriendPill({ friend }: { friend: Friend }) {
  return (
    <div
      className="flex min-w-0 items-center gap-2 rounded-2xl border px-3 py-2"
      style={{
        background: "var(--evven-surface)",
        borderColor: "var(--evven-border)",
      }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
        style={{
          background: "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
          color: "var(--evven-accent-primary)",
        }}
      >
        {getInitials(friend.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">{friend.name}</span>
        <span className="block truncate text-[11px] text-muted-foreground">
          {getFriendBalanceLabel(friend)}
        </span>
      </span>
    </div>
  );
}

export function FriendExpenseFields({ amount, values, onChange }: FriendExpenseFieldsProps) {
  const { data: friends = [], isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 30_000,
  });

  const activeFriend = useMemo(
    () => friends.find((friend) => friend.id === values.friend_id) ?? null,
    [friends, values.friend_id]
  );

  return (
    <section
      className="card rounded-3xl p-4 sm:p-5"
      style={{ background: "var(--evven-card-background)" }}
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--evven-accent-secondary) 38%, var(--evven-background))",
            color: "var(--evven-accent-primary)",
          }}
        >
          <HandCoins size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">Friend</p>
          <p className="text-xs text-muted-foreground">
            Attach this expense to someone you already split with.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Select friend
          </label>
          <select
            value={values.friend_id}
            onChange={(event) => {
              const friendId = event.target.value;
              const friend = friends.find((item) => item.id === friendId) ?? null;
              onChange({
                friend_id: friendId,
                settlement_direction: friend
                  ? getDefaultSettlementDirection(friend.net_balance ?? friend.balance)
                  : values.settlement_direction,
                settlement_amount: friendId ? values.settlement_amount || amount : "",
              });
            }}
            disabled={isLoading}
            className="w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
            style={{
              background: "var(--evven-background)",
              borderColor: "var(--evven-border)",
            }}
          >
            <option value="">{isLoading ? "Loading friends..." : "No friend selected"}</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Need to add someone first? Open the Friends screen and send a request by code.
          </div>
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
            <Link href="/friends">
              <UserRoundPlus />
              Friends
            </Link>
          </Button>
        </div>

        {error ? (
          <p className="text-sm" style={{ color: "var(--evven-error)" }}>
            Could not load your friends.
          </p>
        ) : null}

        {values.friend_id && activeFriend ? (
          <div
            className="flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-3"
            style={{
              background: "color-mix(in srgb, var(--evven-background) 82%, white)",
              borderColor: "var(--evven-border)",
            }}
          >
            <FriendPill friend={activeFriend} />
            <div className="text-xs text-muted-foreground">
              {values.settlement_direction === "you_owe"
                ? `${activeFriend.name} paid ${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}.`
                : `You paid ${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}.`}
            </div>
          </div>
        ) : null}

        {values.friend_id && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Paid by
              </label>
              <select
                value={values.settlement_direction}
                onChange={(event) =>
                  onChange({
                    settlement_direction: event.target.value as SettlementDirection,
                  })
                }
                className="w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{
                  background: "var(--evven-background)",
                  borderColor: "var(--evven-border)",
                }}
              >
                <option value="they_owe">
                  {getFriendExpenseDirectionLabel("they_owe", activeFriend?.name)}
                </option>
                <option value="you_owe">
                  {getFriendExpenseDirectionLabel("you_owe", activeFriend?.name)}
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Settlement amount
              </label>
              <div
                className="flex w-full items-center rounded-2xl border px-4 py-2.5 text-sm"
                style={{
                  background: "var(--evven-background)",
                  borderColor: "var(--evven-border)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  ₹{Number(values.settlement_amount || amount || 0).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
