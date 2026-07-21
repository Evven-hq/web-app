"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { createPersonalExpense } from "@/services/expenses";
import { Button } from "@/components/ui/button";
import { FriendCard } from "./FriendCard";
import { FriendCreateDialog } from "./FriendCreateDialog";
import { FriendDetailPanel } from "./FriendDetailPanel";
import { formatMoney } from "./friend-utils";
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

  const { owedToYou, youOwe } = useMemo(() => {
    let positive = 0;
    let negative = 0;
    for (const friend of friends) {
      const balance = Number(friend.net_balance ?? 0);
      if (balance > 0) positive += balance;
      if (balance < 0) negative += Math.abs(balance);
    }
    return { owedToYou: positive, youOwe: negative };
  }, [friends]);

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
    payment_method: "upi" | "cash";
  }) => {
    if (!activeFriend) return;

    setListBusy(true);
    try {
      await createPersonalExpense({
        title: `Settlement with ${activeFriend.name}`,
        amount: payload.amount,
        date: new Date().toISOString(),
        notes: payload.note,
        payment_method: payload.payment_method,
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Friends
            </p>
            <h1 className="mt-2 text-2xl font-medium leading-snug sm:text-[2rem]">
              People you split with
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6" style={{ color: "var(--evven-text-muted)" }}>
              Keep track of who paid what, settle balances, and jump into a new expense.
            </p>
          </div>

          <div className="hidden shrink-0 sm:block">
            <FriendCreateDialog
              onCreate={handleCreateFriend}
              triggerLabel="Add friend"
              title="Create a friend"
              description="Add someone once and reuse them across personal expenses."
            />
          </div>
        </div>

        {/* Hero stats */}
        <div
          className="mb-4 overflow-hidden rounded-[30px] p-5 sm:p-6"
          style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div>
              <p className="text-2xl font-medium sm:text-3xl" style={{ fontFamily: "var(--font-mono)" }}>
                {loading ? "—" : friends.length}
              </p>
              <p className="mt-1 text-xs opacity-80 sm:text-sm">Friends</p>
            </div>
            <div>
              <p className="text-2xl font-medium sm:text-3xl" style={{ fontFamily: "var(--font-mono)" }}>
                {loading ? "—" : formatMoney(owedToYou)}
              </p>
              <p className="mt-1 text-xs opacity-80 sm:text-sm">Paid back to you</p>
            </div>
            <div>
              <p className="text-2xl font-medium sm:text-3xl" style={{ fontFamily: "var(--font-mono)" }}>
                {loading ? "—" : formatMoney(youOwe)}
              </p>
              <p className="mt-1 text-xs opacity-80 sm:text-sm">Paid by you</p>
            </div>
          </div>
        </div>

        {/* Search + mobile add */}
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--evven-text-muted)" }}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search friends"
              className="w-full rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none"
              style={{
                background: "var(--color-background-primary, var(--evven-background))",
                border: "0.5px solid var(--evven-border)",
              }}
            />
          </div>
          <div className="sm:hidden">
            <FriendCreateDialog
              onCreate={handleCreateFriend}
              triggerLabel="Add friend"
              title="Create a friend"
              description="Add someone once and reuse them across personal expenses."
            />
          </div>
        </div>

        {error && (
          <div
            className="mb-4 rounded-2xl p-4 text-sm"
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
          <section ref={detailSectionRef} className="order-1 space-y-5 lg:order-2">
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
              <div
                className="flex h-40 items-center justify-center rounded-3xl"
                style={{ border: "0.5px solid var(--evven-border)", background: "var(--evven-surface)" }}
              >
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            ) : filteredFriends.length === 0 ? (
              <div
                className="rounded-3xl p-6"
                style={{ border: "0.5px solid var(--evven-border)", background: "var(--evven-surface)" }}
              >
                <div
                  className="mb-4 flex size-11 items-center justify-center rounded-full"
                  style={{ background: "var(--evven-accent-secondary)", color: "var(--evven-accent-primary)" }}
                >
                  <Users size={18} />
                </div>
                <p className="text-sm font-medium">
                  {friends.length === 0 ? "No friends yet" : "No matching friends"}
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--evven-text-muted)" }}>
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