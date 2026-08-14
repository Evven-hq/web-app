"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2, UserRound, UserRoundPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Friend, SplitMode, SplitParticipant } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getFriends } from "@/services/friends";
import { getInitials } from "./friend-utils";

interface FriendSplitValues {
  split_mode: SplitMode;
  split_participants: SplitParticipant[];
}

interface FriendSplitSectionProps {
  amount: string;
  values: FriendSplitValues;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onChange: (updates: Partial<FriendSplitValues>) => void;
  initialFriendId?: string;
}

function toMoney(value: number) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from({ length: count }, (_, index) => (baseCents + (index < remainder ? 1 : 0)) / 100);
}

function splitByPercentage(total: number, participants: SplitParticipant[]) {
  if (participants.length === 0) return [];

  return participants.map((participant) => {
    const percentage = Number(participant.split_percentage ?? 0);
    return Math.round(total * (percentage / 100) * 100) / 100;
  });
}

function remainderAmount(total: number, allocated: number) {
  const totalCents = Math.round(total * 100);
  const allocatedCents = Math.round(allocated * 100);
  return Math.max(0, (totalCents - allocatedCents) / 100);
}

export function FriendSplitSection({
  amount,
  values,
  enabled,
  onToggle,
  onChange,
  initialFriendId,
}: FriendSplitSectionProps) {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 30_000,
  });
  const [showAddFriend, setShowAddFriend] = useState(false);

  const selectedFriendIds = useMemo(
    () => new Set(values.split_participants.map((participant) => participant.friend_id)),
    [values.split_participants]
  );

  const availableFriends = useMemo(
    () => friends.filter((friend) => !selectedFriendIds.has(friend.id)),
    [friends, selectedFriendIds]
  );

  useEffect(() => {
    if (!enabled || !initialFriendId) return;
    if (values.split_participants.length > 0) return;

    onChange({
      split_participants: [{ friend_id: initialFriendId }],
    });
  }, [enabled, initialFriendId, onChange, values.split_participants.length]);

  const breakdown = useMemo(() => {
    const total = Number(amount || 0);
    if (total <= 0 || values.split_participants.length === 0) return [];

    if (values.split_mode === "equal") {
      return splitEvenly(total, values.split_participants.length + 1);
    }

    if (values.split_mode === "percentage") {
      return splitByPercentage(total, values.split_participants);
    }

    return values.split_participants.map(
      (participant) => Number(participant.split_amount ?? 0)
    );
  }, [amount, values.split_mode, values.split_participants]);

  const totalAmount = Number(amount || 0);
  const totalPercentage = values.split_participants.reduce(
    (sum, participant) => sum + Number(participant.split_percentage ?? 0),
    0
  );
  const userPercentage = Math.max(0, 100 - totalPercentage);
  const friendTotal = values.split_participants.reduce(
    (sum, participant) => sum + Number(participant.split_amount ?? 0),
    0
  );
  const userShareAmount =
    values.split_mode === "equal"
      ? breakdown[0] ?? 0
      : values.split_mode === "percentage"
        ? remainderAmount(totalAmount, breakdown.reduce((sum, value) => sum + value, 0))
        : remainderAmount(totalAmount, friendTotal);

  const updateParticipant = (index: number, updates: Partial<SplitParticipant>) => {
    const nextParticipants = [...values.split_participants];
    nextParticipants[index] = {
      ...nextParticipants[index],
      ...updates,
    };
    onChange({ split_participants: nextParticipants });
  };

  const removeParticipant = (index: number) => {
    onChange({
      split_participants: values.split_participants.filter((_, currentIndex) => currentIndex !== index),
    });
  };

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
          <Users size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={enabled}
                onCheckedChange={(checked) => onToggle(Boolean(checked))}
              />
              <label className="text-sm font-medium">Split between friends</label>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Divide this expense across multiple friends without leaving the current flow.
          </p>
        </div>
      </div>

      {!enabled ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm text-muted-foreground"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
          }}
        >
          Turn this on to pick multiple friends and split the amount automatically.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Split mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["equal", "percentage", "custom"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ split_mode: mode })}
                  className="rounded-2xl border px-3 py-2 text-xs font-medium capitalize transition-all"
                  style={{
                    background:
                      values.split_mode === mode
                        ? "var(--evven-text-primary)"
                        : "var(--evven-background)",
                    color:
                      values.split_mode === mode
                        ? "var(--evven-text-inverse)"
                        : "var(--evven-text-primary)",
                    borderColor:
                      values.split_mode === mode
                        ? "var(--evven-text-primary)"
                        : "var(--evven-border)",
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Split participants
            </label>

            <div className="space-y-2">
              <div
                className="rounded-2xl border p-3"
                style={{
                  background: "var(--evven-background)",
                  borderColor: "var(--evven-border)",
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
                      color: "var(--evven-accent-primary)",
                    }}
                  >
                    <UserRound size={14} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">You</p>
                    <p className="text-[11px] text-muted-foreground">
                      {values.split_mode === "percentage"
                        ? `${toMoney(userPercentage)}% · ₹${toMoney(userShareAmount)}`
                        : `₹${toMoney(userShareAmount)}`}
                    </p>
                  </div>

                  {values.split_mode === "percentage" ? (
                    <div
                      className="rounded-lg border px-2 py-1 text-[11px] text-center"
                      style={{
                        background: "var(--evven-card-background)",
                        borderColor: "var(--evven-border)",
                      }}
                    >
                      {toMoney(userPercentage)}%
                    </div>
                  ) : null}
                </div>
              </div>

              {values.split_participants.map((participant, index) => {
                const friend = friends.find((item) => item.id === participant.friend_id);
                const share = breakdown[index + 1] ?? 0;

                return (
                  <div
                    key={`${participant.friend_id}-${index}`}
                    className="rounded-2xl border p-3"
                    style={{
                      background: "var(--evven-background)",
                      borderColor: "var(--evven-border)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
                          color: "var(--evven-accent-primary)",
                        }}
                      >
                        {friend ? getInitials(friend.name) : "?"}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{friend?.name ?? "Friend"}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {values.split_mode === "percentage"
                            ? `${toMoney(Number(participant.split_percentage ?? 0))}% · ₹${toMoney(share)}`
                            : `₹${toMoney(share)}`}
                        </p>
                      </div>

                      {values.split_mode === "percentage" ? (
                        <input
                          type="number"
                          value={participant.split_percentage ?? 0}
                          onChange={(event) =>
                            updateParticipant(index, {
                              split_percentage: Number(event.target.value),
                            })
                          }
                          min="0"
                          max="100"
                          className="w-16 rounded-lg border px-2 py-1 text-[11px] text-center"
                          style={{
                            background: "var(--evven-card-background)",
                            borderColor: "var(--evven-border)",
                          }}
                          placeholder="%"
                        />
                      ) : null}

                      {values.split_mode === "custom" ? (
                        <input
                          type="number"
                          value={participant.split_amount ?? 0}
                          onChange={(event) =>
                            updateParticipant(index, {
                              split_amount: Number(event.target.value),
                            })
                          }
                          min="0"
                          step="0.01"
                          className="w-20 rounded-lg border px-2 py-1 text-[11px] text-center"
                          style={{
                            background: "var(--evven-card-background)",
                            borderColor: "var(--evven-border)",
                          }}
                          placeholder="₹"
                        />
                      ) : null}

                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-[var(--evven-surface)]"
                        aria-label={`Remove ${friend?.name ?? "friend"}`}
                      >
                        <Trash2 size={14} style={{ color: "var(--evven-error)" }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {showAddFriend ? (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Add friend to split
                </label>
                <select
                  onChange={(event) => {
                    const friendId = event.target.value;
                    if (!friendId) return;

                    onChange({
                      split_participants: [
                        ...values.split_participants,
                        { friend_id: friendId },
                      ],
                    });
                    setShowAddFriend(false);
                  }}
                  className="w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{
                    background: "var(--evven-background)",
                    borderColor: "var(--evven-border)",
                  }}
                  defaultValue=""
                >
                  <option value="">Select a friend</option>
                  {availableFriends.map((friend: Friend) => (
                    <option key={friend.id} value={friend.id}>
                      {friend.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowAddFriend(true)}
                disabled={availableFriends.length === 0 || isLoading}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <UserRoundPlus size={14} />}
                Add another friend
              </Button>
            )}
          </div>

          {values.split_mode === "percentage" && totalPercentage > 100 ? (
            <div
              className="rounded-2xl border px-3 py-2 text-xs"
              style={{
                background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
                color: "var(--evven-error)",
              }}
            >
              Friend percentages total {Math.round(totalPercentage)}%. Keep them at or below 100% so your share can auto-fill the remainder.
            </div>
          ) : null}

          {values.split_mode === "custom" && friendTotal > totalAmount ? (
            <div
              className="rounded-2xl border px-3 py-2 text-xs"
              style={{
                background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
                color: "var(--evven-error)",
              }}
            >
              Friend amounts total ₹{toMoney(friendTotal)}. Keep them below ₹{toMoney(totalAmount)} so your share can auto-fill the remainder.
            </div>
          ) : null}

          <div
            className="rounded-2xl border p-3"
            style={{
              background: "color-mix(in srgb, var(--evven-accent-secondary) 12%, var(--evven-background))",
              borderColor: "color-mix(in srgb, var(--evven-accent-primary) 20%, var(--evven-border))",
            }}
          >
            <p className="text-xs font-medium">
              Splitting ₹{toMoney(totalAmount)} between you and{" "}
              {values.split_participants.length} friend
              {values.split_participants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
