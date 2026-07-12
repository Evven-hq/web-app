"use client";

import { useMemo, useState } from "react";
import { Loader2, Search, UserRound } from "lucide-react";
import { FriendCreateDialog } from "./FriendCreateDialog";
import { FriendCard } from "./FriendCard";
import { useFriendsDirectory } from "./use-friends-directory";

export function FriendsSection() {
  const { friends, loading, error, setError, createFriend, removeFriend } = useFriendsDirectory();
  const [search, setSearch] = useState("");

  const filteredFriends = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return friends;

    return friends.filter((friend) => friend.name.toLowerCase().includes(normalized));
  }, [friends, search]);

  const handleDelete = async (friendId: string) => {
    setError("");

    try {
      await removeFriend(friendId);
    } catch {
      setError("Could not delete this friend until the balance is settled.");
    }
  };

  return (
    <section
      className="mb-4 rounded-(--evven-radius-card) p-5 sm:p-6"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Friends
          </p>
          <h2 className="text-sm font-medium">Manage your friends</h2>
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "var(--evven-accent-secondary)",
            color: "var(--evven-accent-primary)",
          }}
        >
          <UserRound size={18} />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search friends"
            className="w-full rounded-(--evven-radius-card) py-2.5 pl-10 pr-4 text-sm outline-none"
            style={{
              background: "var(--evven-surface)",
              border: "0.5px solid var(--evven-border)",
            }}
          />
        </div>
        <FriendCreateDialog
          onCreate={createFriend}
          triggerLabel="Create friend"
          title="Create a friend"
          description="Give them a short name so you can add them to expenses later."
        />
      </div>

      {error && <p className="mb-4 text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <Loader2 size={18} className="animate-spin text-primary" />
        </div>
      ) : filteredFriends.length === 0 ? (
        <div
          className="rounded-(--evven-radius-card) p-5 text-center"
          style={{ background: "var(--evven-surface)" }}
        >
          <p className="text-sm font-medium">
            {friends.length === 0 ? "No friends yet" : "No matching friends"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {friends.length === 0
              ? "Create a friend to attach them to personal expenses."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFriends.map((friend, index) => (
            <FriendCard
              key={`${friend.id}-${index}`}
              friend={friend}
              compact
              href={`/friends?ghost_id=${friend.id}`}
              onDelete={() => void handleDelete(friend.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
