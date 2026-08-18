"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SplitMode, SplitParticipant } from "@/types";
import { getFriends } from "@/services/friends";
import {
  remainderAmount,
  splitByPercentageWithParticipants,
  splitEvenly,
} from "@/lib/split-utils";
import { SplitAddFriend } from "./SplitAddFriend";
import { SplitFeedback } from "./SplitFeedback";
import { SplitHeader } from "./SplitHeader";
import { SplitModeSelector } from "./SplitModeSelector";
import { SplitParticipantRows } from "./SplitParticipantRows";

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

  const selectedFriendIds = useMemo(
    () =>
      new Set(
        values.split_participants.map((participant) => participant.friend_id),
      ),
    [values.split_participants],
  );

  const availableFriends = useMemo(
    () => friends.filter((friend) => !selectedFriendIds.has(friend.id)),
    [friends, selectedFriendIds],
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
      return splitByPercentageWithParticipants(
        total,
        values.split_participants,
      );
    }

    return values.split_participants.map((participant) =>
      Number(participant.split_amount ?? 0),
    );
  }, [amount, values.split_mode, values.split_participants]);

  const totalAmount = Number(amount || 0);
  const totalPercentage = values.split_participants.reduce(
    (sum, participant) => sum + Number(participant.split_percentage ?? 0),
    0,
  );
  const userPercentage = Math.max(0, 100 - totalPercentage);
  const friendTotal = values.split_participants.reduce(
    (sum, participant) => sum + Number(participant.split_amount ?? 0),
    0,
  );
  const userShareAmount =
    values.split_mode === "equal"
      ? (breakdown[0] ?? 0)
      : values.split_mode === "percentage"
        ? remainderAmount(
            totalAmount,
            breakdown.reduce((sum, value) => sum + value, 0),
          )
        : remainderAmount(totalAmount, friendTotal);

  return (
    <section
      className="card rounded-3xl p-4 sm:p-5"
      style={{ background: "var(--evven-card-background)" }}
    >
      <SplitHeader enabled={enabled} onToggle={onToggle} />

      {!enabled ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm text-muted-foreground"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
          }}
        >
          Turn this on to pick multiple friends and split the amount
          automatically.
        </div>
      ) : (
        <div className="space-y-4">
          <SplitModeSelector
            value={values.split_mode}
            onChange={(mode) => onChange({ split_mode: mode })}
          />

          <SplitParticipantRows
            friends={friends}
            participants={values.split_participants}
            mode={values.split_mode}
            breakdown={breakdown}
            userPercentage={userPercentage}
            userShareAmount={userShareAmount}
            onChange={onChange}
          />

          <SplitAddFriend
            availableFriends={availableFriends}
            isLoading={isLoading}
            onAdd={(friendId) =>
              onChange({
                split_participants: [
                  ...values.split_participants,
                  { friend_id: friendId },
                ],
              })
            }
          />

          <SplitFeedback
            mode={values.split_mode}
            totalAmount={totalAmount}
            totalPercentage={totalPercentage}
            friendTotal={friendTotal}
            participantCount={values.split_participants.length}
          />
        </div>
      )}
    </section>
  );
}
