"use client";

import { Search } from "lucide-react";
import type { Friend } from "@/types";
import { FriendListItem } from "./FriendListItem";
import { ListSkeleton } from "./ListSkeleton";

export function FriendsTab({
  friends,
  isLoading,
  isError,
  search,
  onSearch,
  selectedFriendId,
  onSelect,
}: {
  friends: Friend[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  onSearch: (value: string) => void;
  selectedFriendId: string | null;
  onSelect: (friendId: string) => void;
}) {
  return (
    <section className="space-y-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
            Friends
          </p>
          <h2 className="mt-2 text-lg font-medium sm:text-xl">Active relationships</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${friends.length} shown`}
        </div>
      </div>

      <div className="mb-4 relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--evven-text-muted)" }}
        />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name, code, or balance"
          className="w-full rounded-2xl border px-4 py-3 pl-10 text-sm outline-none transition focus:ring-2"
          style={{
            background: "var(--evven-card-background)",
            borderColor: "var(--evven-border)",
          }}
        />
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <div className="rounded-3xl border border-[var(--evven-border)] px-4 py-6 text-sm text-destructive">
          Could not load friends.
        </div>
      ) : friends.length === 0 ? (
        <div className="rounded-3xl border border-dashed px-4 py-6 text-sm text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
          No friends yet. Add one by user code and your active list will appear here.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {friends.map((friend) => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              active={friend.id === selectedFriendId}
              onSelect={() => onSelect(friend.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
