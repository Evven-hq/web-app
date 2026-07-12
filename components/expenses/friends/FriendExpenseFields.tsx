"use client";

import { UserRoundPlus } from "lucide-react";
import { FriendCreateDialog } from "./FriendCreateDialog";
import { getGhostBalanceLabel, getInitials, getDefaultSettlementDirection } from "./friend-utils";
import { useFriendsDirectory } from "./use-friends-directory";
import type { Ghost, SettlementDirection } from "@/types";

interface FriendExpenseValues {
  ghost_id: string;
  settlement_direction: SettlementDirection;
  settlement_amount: string;
}

interface FriendExpenseFieldsProps {
  amount: string;
  values: FriendExpenseValues;
  onChange: (updates: Partial<FriendExpenseValues>) => void;
}

export function FriendExpenseFields({ amount, values, onChange }: FriendExpenseFieldsProps) {
  const { friends, loading, error, createFriend } = useFriendsDirectory();
  const activeFriend = friends.find((friend) => friend.id === values.ghost_id) ?? null;

  const handleFriendCreated = (friend: Ghost) => {
    onChange({
      ghost_id: friend.id,
      settlement_direction: getDefaultSettlementDirection(friend.net_balance),
      settlement_amount: amount || values.settlement_amount || "",
    });
  };

  return (
    <section
      className="rounded-xl p-4"
      style={{
        background: "var(--evven-surface)",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "var(--color-background-primary, var(--evven-background))",
            color: "var(--evven-accent-primary)",
          }}
        >
          <UserRoundPlus size={17} />
        </div>
        <div>
          <p className="text-sm font-medium">Friend</p>
          <p className="text-xs text-muted-foreground">
            Optional context for who owes whom.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Select friend
          </label>
          <select
            value={values.ghost_id}
            onChange={(event) => {
              const ghostId = event.target.value;
              const friend = friends.find((item) => item.id === ghostId) ?? null;
              onChange({
                ghost_id: ghostId,
                settlement_direction: friend
                  ? getDefaultSettlementDirection(friend.net_balance)
                  : values.settlement_direction,
                settlement_amount: ghostId ? values.settlement_amount || amount : "",
              });
            }}
            disabled={loading}
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
              borderColor: "var(--evven-border)",
            }}
          >
            <option value="">{loading ? "Loading friends..." : "No friend selected"}</option>
            {friends.map((friend, index) => (
              <option key={`${friend.id}-${index}`} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FriendCreateDialog
            compact
            onCreate={createFriend}
            triggerLabel="Create new friend"
            title="Create a friend"
            description="Create someone once and attach them to this expense right away."
            onCreated={handleFriendCreated}
          />
          {activeFriend ? (
            <div className="flex min-w-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium"
              style={{
                background: "var(--color-background-primary, var(--evven-background))",
                color: "var(--evven-text-muted)",
              }}
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ background: "var(--evven-surface)" }}
              >
                {getInitials(activeFriend.name)}
              </span>
              <span className="truncate">{getGhostBalanceLabel(activeFriend)}</span>
            </div>
          ) : null}
        </div>

        {error && <p className="text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

        {values.ghost_id && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Direction
              </label>
              <select
                value={values.settlement_direction}
                onChange={(event) =>
                  onChange({
                    settlement_direction: event.target.value as SettlementDirection,
                  })
                }
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                style={{
                  background: "var(--color-background-primary, var(--evven-background))",
                  borderColor: "var(--evven-border)",
                }}
              >
                <option value="they_owe">
                  {activeFriend ? `${activeFriend.name} owes you` : "They owe you"}
                </option>
                <option value="you_owe">
                  {activeFriend ? `You owe ${activeFriend.name}` : "You owe them"}
                </option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Expense amount
              </label>
              <div
                className="flex w-full items-center rounded-xl border px-4 py-2.5 text-sm"
                style={{
                  background: "var(--color-background-primary, var(--evven-background))",
                  borderColor: "var(--evven-border)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  ₹{Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This mirrors the main expense amount above.
              </p>
            </div>
          </div>
        )}

        {values.ghost_id && activeFriend && amount && (
          <p className="text-xs text-muted-foreground">
            {values.settlement_direction === "you_owe"
              ? `You will give ${activeFriend.name} ₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}.`
              : `You will get ₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })} from ${activeFriend.name}.`}
          </p>
        )}
      </div>
    </section>
  );
}
