"use client";

import { useState } from "react";
import { Loader2, UserRoundPlus } from "lucide-react";
import type { Friend } from "@/types";
import { Button } from "@/components/ui/button";

export function SplitAddFriend({
  availableFriends,
  isLoading,
  onAdd,
}: {
  availableFriends: Friend[];
  isLoading: boolean;
  onAdd: (friendId: string) => void;
}) {
  const [showAddFriend, setShowAddFriend] = useState(false);

  return (
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

              onAdd(friendId);
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
  );
}
