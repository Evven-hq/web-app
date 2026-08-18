"use client";

import { Trash2, UserRound } from "lucide-react";
import type { Friend, SplitMode, SplitParticipant } from "@/types";
import { formatNumber } from "@/lib/format";
import { getInitials } from "./friend-utils";

interface FriendSplitValues {
  split_mode: SplitMode;
  split_participants: SplitParticipant[];
}

export function SplitParticipantRows({
  friends,
  participants,
  mode,
  breakdown,
  userPercentage,
  userShareAmount,
  onChange,
}: {
  friends: Friend[];
  participants: SplitParticipant[];
  mode: SplitMode;
  breakdown: number[];
  userPercentage: number;
  userShareAmount: number;
  onChange: (updates: Partial<FriendSplitValues>) => void;
}) {
  const updateParticipant = (
    index: number,
    updates: Partial<SplitParticipant>,
  ) => {
    const nextParticipants = [...participants];
    nextParticipants[index] = {
      ...nextParticipants[index],
      ...updates,
    };
    onChange({ split_participants: nextParticipants });
  };

  const removeParticipant = (index: number) => {
    onChange({
      split_participants: participants.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    });
  };

  return (
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
                {mode === "percentage"
                  ? `${formatNumber(userPercentage)}% · ₹${formatNumber(userShareAmount)}`
                  : `₹${formatNumber(userShareAmount)}`}
              </p>
            </div>

            {mode === "percentage" ? (
              <div
                className="rounded-lg border px-2 py-1 text-[11px] text-center"
                style={{
                  background: "var(--evven-card-background)",
                  borderColor: "var(--evven-border)",
                }}
              >
                {formatNumber(userPercentage)}%
              </div>
            ) : null}
          </div>
        </div>

        {participants.map((participant, index) => {
          const friend = friends.find(
            (item) => item.id === participant.friend_id,
          );
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
                  <p className="truncate text-xs font-medium">
                    {friend?.name ?? "Friend"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {mode === "percentage"
                      ? `${formatNumber(Number(participant.split_percentage ?? 0))}% · ₹${formatNumber(share)}`
                      : `₹${formatNumber(share)}`}
                  </p>
                </div>

                {mode === "percentage" ? (
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

                {mode === "custom" ? (
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
  );
}
