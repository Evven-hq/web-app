"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { createPersonalExpense } from "@/services/expenses";
import { Button } from "@/components/ui/button";
import { FriendCard } from "./FriendCard";
import { FriendCreateDialog } from "./FriendCreateDialog";
import { FriendDetailPanel } from "./FriendDetailPanel";
import { useFriendDetail } from "./use-friend-detail";
import { useFriendsDirectory } from "./use-friends-directory";

function getGhostIdFromUrl() {
  if (typeof window === "undefined") return "";
  return new URL(window.location.href).searchParams.get("ghost_id") ?? "";
}

export function FriendsWorkspace() {
  const { friends, loading, error, setError, createFriend, removeFriend, refresh } =
    useFriendsDirectory();
  const [query, setQuery] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(() => {
    const initialGhostId = getGhostIdFromUrl();
    return initialGhostId || null;
  });
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [listBusy, setListBusy] = useState(false);
  const detailSectionRef = useRef<HTMLElement | null>(null);

  const filteredFriends = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return friends;
    return friends.filter((friend) => friend.name.toLowerCase().includes(normalized));
  }, [friends, query]);

  const visualSelectedFriendId = selectedFriendId ?? friends[0]?.id ?? null;

  const effectiveSelectedFriendId = useMemo(() => {
    if (selectedFriendId && friends.some((friend) => friend.id === selectedFriendId)) {
      return selectedFriendId;
    }

    return friends[0]?.id ?? null;
  }, [friends, selectedFriendId]);

  const { detail, loading: detailLoading, error: detailError, refresh: refreshDetail } =
    useFriendDetail(effectiveSelectedFriendId);

  const activeFriend =
    detail && detail.id === effectiveSelectedFriendId
      ? detail
      : friends.find((friend) => friend.id === effectiveSelectedFriendId) ?? null;
  const friendDetailLoading = effectiveSelectedFriendId ? detailLoading || listBusy : false;
  const friendDetailError = effectiveSelectedFriendId ? detailError : "";

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      window.requestAnimationFrame(() => {
        detailSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const handleCreateFriend = async (name: string) => {
    const friend = await createFriend(name);
    setSelectedFriendId(friend.id);
    return friend;
  };

  const handleDelete = async (friendId: string) => {
    if (!window.confirm("Remove this friend?")) return;

    setError("");
    try {
      await removeFriend(friendId);
      if (selectedFriendId === friendId) {
        setSelectedFriendId(null);
      }
    } catch {
      setError("Could not remove this friend until the balance is settled.");
    }
  };

  const handleRecordSettlement = async (payload: {
    amount: number;
    note?: string;
    direction: "you_owe" | "they_owe";
  }) => {
    if (!activeFriend) return;

    setListBusy(true);
    try {
      await createPersonalExpense({
        title: `Settlement with ${activeFriend.name}`,
        amount: payload.amount,
        date: new Date().toISOString(),
        notes: payload.note,
        ghost_id: activeFriend.id,
        settlement_direction: payload.direction,
        settlement_amount: payload.amount,
      });
      await refresh();
      await refreshDetail();
    } finally {
      setListBusy(false);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Friends
            </p>
            <h1 className="text-2xl font-medium">People you split with</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Keep a running view of who owes whom, settle balances when needed, and jump straight into a new expense when it is time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FriendCreateDialog
              onCreate={handleCreateFriend}
              triggerLabel="Create friend"
              title="Create a friend"
              description="Add someone once and reuse them across personal expenses."
            />
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search friends"
              className="w-full rounded-[var(--evven-radius-card)] py-2.5 pl-10 pr-4 text-sm outline-none"
              style={{
                background: "var(--color-background-primary, var(--evven-background))",
                border: "0.5px solid var(--evven-border)",
              }}
            />
          </div>
          <div
            className="rounded-[var(--evven-radius-card)] px-4 py-2.5 text-sm"
            style={{
              background: "var(--color-background-primary, var(--evven-background))",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            <span className="text-muted-foreground">Friends </span>
            <span className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
              {loading ? "..." : friends.length}
            </span>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 rounded-[var(--evven-radius-card)] p-4 text-sm"
            style={{
              background: "var(--evven-surface)",
              color: "var(--evven-error)",
              border: "0.5px solid var(--evven-border)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <section
            ref={detailSectionRef}
            className="order-1 space-y-5 lg:order-2"
          >
            <FriendDetailPanel
              friend={activeFriend}
              loading={friendDetailLoading}
              error={friendDetailError}
              onOpenSettlement={() => setSettlementOpen(true)}
              settlementOpen={settlementOpen}
              onSettlementOpenChange={setSettlementOpen}
              onRecordSettlement={handleRecordSettlement}
            />
          </section>

          <aside className="order-2 space-y-3 lg:order-1">
            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-[var(--evven-radius-card)] border border-[var(--evven-border)] bg-[var(--evven-surface)]">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            ) : filteredFriends.length === 0 ? (
              <div
                className="rounded-[var(--evven-radius-card)] border border-[var(--evven-border)] bg-[var(--evven-surface)] p-6"
              >
                <p className="text-sm font-medium">
                  {friends.length === 0 ? "No friends yet" : "No matching friends"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {friends.length === 0
                    ? "Create a friend to keep track of shared spending."
                    : "Try a different search term."}
                </p>
                {friends.length === 0 && (
                  <Button className="mt-4 w-full sm:w-auto" asChild>
                    <Link href="/expenses/new">
                      <Plus />
                      Add expense
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              filteredFriends.map((friend, index) => (
                <FriendCard
                  key={`${friend.id}-${index}`}
                  friend={friend}
                  selected={friend.id === visualSelectedFriendId}
                  onSelect={() => handleSelectFriend(friend.id)}
                  onDelete={() => void handleDelete(friend.id)}
                />
              ))
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
