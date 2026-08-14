"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Loader2,
  Plus,
  Search,
  UserRound,
  UserRoundPlus,
  UserRoundX,
  Users,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Friend, FriendActivity, FriendDetail, FriendRequest } from "@/types";
import {
  acceptFriendRequest,
  combineFriendHistory,
  createFriendRequest,
  getFriendDetail,
  getFriendRequests,
  getFriends,
  getFriendBalance,
  isActiveFriendDetail,
  rejectFriendRequest,
  unfriend,
} from "@/services/friends";
import {
  formatMoney,
  getDefaultSettlementDirection,
  getFriendBalanceLabel,
  getFriendBalanceState,
  getInitials,
  friendMatchesSearch,
} from "./friend-utils";

function formatDate(value?: string | null) {
  if (!value) return "Recently";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelativeTime(value?: string | null) {
  if (!value) return "just now";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

function getActivityTime(entry: FriendActivity) {
  return entry.date ?? entry.created_at ?? "";
}

function getActivityType(entry: FriendActivity) {
  if (entry.type === "settlement" || entry.settlement_amount) return "settlement";
  return "expense";
}

function getActivityTitle(entry: FriendActivity) {
  return entry.title || (getActivityType(entry) === "settlement" ? "Settlement" : "Expense");
}

function getActivityMeta(entry: FriendActivity, friendName: string) {
  const amount = formatMoney(entry.settlement_amount ?? entry.amount);
  const type = getActivityType(entry);

  if (type === "settlement") {
    const label =
      entry.settlement_direction === "you_owe"
        ? `${friendName} paid`
        : "You paid";
    return {
      label,
      amount,
      tone: entry.settlement_direction === "you_owe" ? "positive" : "negative",
      badge: "Settlement",
    };
  }

  const label =
    entry.direction === "you_owe"
      ? `${friendName} paid`
      : entry.direction === "they_owe"
        ? "You paid"
        : "Expense";

  return {
    label,
    amount,
    tone: entry.direction === "you_owe" ? "positive" : "negative",
    badge: "Expense",
  };
}

function getApiMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    const message = response?.data?.message;
    if (message) return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

type FriendTab = "friend" | "requests" | "friends";

function FriendAvatar({
  friend,
  active = false,
}: {
  friend: Pick<Friend, "name" | "profile_picture">;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold",
        active ? "ring-2 ring-[var(--evven-accent-primary)] ring-offset-2 ring-offset-background" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
        borderColor: "var(--evven-border)",
        color: "var(--evven-accent-primary)",
      }}
    >
      {friend.profile_picture ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={friend.profile_picture} alt={friend.name} className="size-full object-cover" />
      ) : (
        getInitials(friend.name)
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-24 rounded-3xl border border-[var(--evven-border)] bg-[var(--evven-surface)] animate-pulse" />
      ))}
    </div>
  );
}

function ActivityIcon({ type }: { type: "expense" | "settlement" }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full"
      style={{
        background:
          type === "settlement"
            ? "color-mix(in srgb, var(--evven-accent-secondary) 36%, var(--evven-background))"
            : "color-mix(in srgb, var(--evven-error) 12%, var(--evven-background))",
        color: type === "settlement" ? "var(--evven-accent-primary)" : "var(--evven-error)",
      }}
    >
      {type === "settlement" ? <ArrowLeftRight size={16} /> : <Plus size={16} />}
    </div>
  );
}

function AddFriendDialog({
  onCreate,
  triggerClassName,
}: {
  onCreate: (userCode: string) => Promise<Friend | FriendRequest>;
  triggerClassName?: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: onCreate,
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friends"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
      ]);

      if (isActiveFriendDetail(result as FriendDetail)) {
        router.push(`/friends?friend_id=${result.id}`);
        setSuccess("");
      } else if ("status" in result && String(result.status ?? "").toUpperCase() === "ACTIVE") {
        router.push(`/friends?friend_id=${result.id}`);
      } else {
        setSuccess("Request sent. They’ll appear here once they accept.");
      }

      setUserCode("");
      setError("");
    },
    onError: (err) => {
      setError(getApiMessage(err, "Could not send that friend request."));
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setUserCode("");
          setError("");
          setSuccess("");
          mutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <UserRoundPlus />
          Add friend
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "var(--evven-card-background)",
          borderColor: "var(--evven-border)",
          boxShadow: "0 24px 80px rgba(26, 24, 22, 0.14)",
        }}
      >
        <DialogHeader>
          <DialogTitle>Add a friend</DialogTitle>
          <DialogDescription>
            Enter their user code. If they already have you pending, the relationship activates immediately.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4 rounded-[24px] border bg-[var(--evven-background)] p-4 sm:p-5"
          style={{ borderColor: "var(--evven-border)" }}
          onSubmit={(event) => {
            event.preventDefault();
            const next = userCode.trim().toUpperCase();
            if (!next) {
              setError("Enter a user code.");
              return;
            }
            mutation.mutate(next);
          }}
        >
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              User code
            </label>
            <input
              autoFocus
              value={userCode}
              onChange={(event) => setUserCode(event.target.value.toUpperCase())}
              placeholder="E.g. EVV-4821"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
              style={{
                background: "var(--evven-background)",
                borderColor: "var(--evven-border)",
              }}
            />
          </div>

          {success ? (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                background: "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-accent-primary) 20%, var(--evven-border))",
              }}
            >
              {success}
            </div>
          ) : null}

          {error ? (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
                color: "var(--evven-error)",
              }}
            >
              {error}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              {mutation.isPending ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UnfriendDialog({
  friend,
  balance,
  onConfirm,
  onOpenSettlement,
}: {
  friend: FriendDetail | null;
  balance: number;
  onConfirm: () => Promise<void>;
  onOpenSettlement: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: onConfirm,
    onSuccess: () => {
      setOpen(false);
      setError("");
    },
    onError: (err) => {
      setError(getApiMessage(err, "Could not remove this friend right now."));
    },
  });

  const blocked = balance !== 0;

  if (!friend) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError("");
          mutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <UserRoundX />
          Remove friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{blocked ? "Settle first" : "Remove friend?"}</DialogTitle>
          <DialogDescription>
            {blocked
              ? `You still have a balance of ${formatMoney(balance)}. Settle up before removing ${friend.name}.`
              : `Removing ${friend.name} keeps their history intact, but hides the active friendship until you add them again.`}
          </DialogDescription>
        </DialogHeader>

        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            background: blocked
              ? "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))"
              : "var(--evven-surface)",
            borderColor: blocked
              ? "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))"
              : "var(--evven-border)",
            color: blocked ? "var(--evven-error)" : "var(--evven-text-muted)",
          }}
        >
          {blocked
            ? "Unfriend is blocked until the balance is zero."
            : "This action is reversible later by adding the same person again."}
        </div>

        {error ? (
          <div
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
              borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
              color: "var(--evven-error)",
            }}
          >
            {error}
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          {blocked ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setOpen(false);
                onOpenSettlement();
              }}
            >
              <ArrowLeftRight />
              Settle up
            </Button>
          ) : null}
          <Button
            type="button"
            variant={blocked ? "outline" : "destructive"}
            className="w-full sm:w-auto"
            disabled={blocked || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <X />}
            {blocked ? "Cannot remove" : "Remove now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FriendsWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<FriendTab>("friend");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(
    () => searchParams.get("friend_id") ?? searchParams.get("ghost_id") ?? null
  );

  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    staleTime: 30_000,
  });

  const requestsQuery = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests,
    staleTime: 15_000,
  });

  const friends = useMemo(() => {
    const source = friendsQuery.data ?? [];

    return [...source]
      .sort((a, b) => {
        const aTime = new Date(a.last_activity_at ?? a.updated_at ?? a.created_at ?? 0).getTime();
        const bTime = new Date(b.last_activity_at ?? b.updated_at ?? b.created_at ?? 0).getTime();
        if (aTime !== bTime) return bTime - aTime;
        return a.name.localeCompare(b.name);
      })
      .filter((friend) => friendMatchesSearch(friend, search));
  }, [friendsQuery.data, search]);

  useEffect(() => {
    const nextParam = searchParams.get("friend_id") ?? searchParams.get("ghost_id");
    if (nextParam) {
      setSelectedFriendId(nextParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedFriendId && friends.length > 0) {
      setSelectedFriendId(friends[0].id);
    }
  }, [friends, selectedFriendId]);

  const selectedFriendFromList = useMemo(
    () => friendsQuery.data?.find((friend) => friend.id === selectedFriendId) ?? null,
    [friendsQuery.data, selectedFriendId]
  );

  const detailQuery = useQuery({
    queryKey: ["friend-detail", selectedFriendId],
    queryFn: () => getFriendDetail(selectedFriendId as string),
    enabled: Boolean(selectedFriendId),
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && selectedFriendId) {
        void queryClient.invalidateQueries({ queryKey: ["friend-detail", selectedFriendId] });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [selectedFriendId, queryClient]);

  const selectedFriend = detailQuery.data ?? selectedFriendFromList;
  const friendBalance = selectedFriend ? getFriendBalance(selectedFriend) : 0;
  const friendBalanceState = selectedFriend
    ? getFriendBalanceState(selectedFriend)
    : null;
  const requests = requestsQuery.data ?? { incoming: [], outgoing: [] };
  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async (friend) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friends"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-detail", friend.id] }),
      ]);
      setSelectedFriendId(friend.id);
      setActiveTab("friend");
    },
    onError: (err) => {
      window.alert(getApiMessage(err, "Could not accept that request."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
    onError: (err) => {
      window.alert(getApiMessage(err, "Could not update that request."));
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFriendId) return;
      await unfriend(selectedFriendId);
    },
    onSuccess: async () => {
      const removedId = selectedFriendId;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friends"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
        removedId ? queryClient.invalidateQueries({ queryKey: ["friend-detail", removedId] }) : Promise.resolve(),
      ]);
      const remaining = (friendsQuery.data ?? []).filter((friend) => friend.id !== removedId);
      setSelectedFriendId(remaining[0]?.id ?? null);
      setActiveTab(remaining[0] ? "friend" : "friends");
    },
    onError: (err) => {
      window.alert(getApiMessage(err, "Could not remove that friend."));
    },
  });

  const handleCopyCode = async () => {
    if (!user?.user_code) return;
    await navigator.clipboard.writeText(user.user_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const activeRequestCount = requests.incoming.length;
  const friendCount = friendsQuery.data?.length ?? 0;
  const tabs: Array<{ id: FriendTab; label: string; count?: number }> = [
    { id: "friend", label: "Friend" },
    { id: "requests", label: "Requests", count: activeRequestCount },
    { id: "friends", label: "Friends", count: friendCount },
  ];

  const selectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);
    setActiveTab("friend");
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
              Friends
            </p>
            <h1
              className="mt-2 text-2xl font-medium leading-snug sm:text-[2rem]"
            >
              Friends
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]" style={{ color: "var(--evven-text-muted)" }}>
              Send requests by user code, review pending invites, and open any active friendship to see the full expense trail.
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Button variant="outline" className="min-w-0 flex-1 justify-center" onClick={handleCopyCode}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied code" : "Share my code"}
            </Button>
            <AddFriendDialog onCreate={createFriendRequest} triggerClassName="min-w-0 flex-1" />
          </div>
        </div>

        <div
          className="sticky top-3 z-20 mb-5 overflow-x-auto rounded-full border bg-[var(--evven-card-background)] p-1.5"
          style={{
            borderColor: "var(--evven-border)",
          }}
        >
          <div className="mx-auto flex w-full max-w-xl justify-center gap-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="inline-flex flex-1 basis-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: active ? "var(--evven-text-primary)" : "transparent",
                    color: active ? "var(--evven-text-inverse)" : "var(--evven-text-primary)",
                  }}
                >
                  {tab.label}
                  {typeof tab.count === "number" ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        background: active
                          ? "rgba(255,255,255,0.16)"
                          : "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
                        color: active ? "var(--evven-text-inverse)" : "var(--evven-accent-primary)",
                      }}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] bg-[var(--evven-card-background)] p-4 shadow-[0_12px_40px_rgba(26,24,22,0.04)] sm:p-5 lg:p-6">
          <div key={activeTab} className="animate-[evven-tab-panel-in_220ms_ease-out]">
            {activeTab === "friend" && (
          <section className="space-y-5">
            {!selectedFriend ? (
              <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-10 text-center" style={{ borderColor: "var(--evven-border)" }}>
                <div
                  className="mb-4 flex size-14 items-center justify-center rounded-full"
                  style={{
                    background: "color-mix(in srgb, var(--evven-accent-secondary) 26%, var(--evven-background))",
                    color: "var(--evven-accent-primary)",
                  }}
                >
                  <UserRound size={22} />
                </div>
                <p className="text-base font-medium">Select a friend</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Open an active relationship to review the latest balance, settle up, or add another expense.
                </p>
              </div>
            ) : detailQuery.isLoading ? (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-3xl bg-[var(--evven-surface)]" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-24 animate-pulse rounded-3xl bg-[var(--evven-surface)]" />
                  ))}
                </div>
                <div className="h-56 animate-pulse rounded-3xl bg-[var(--evven-surface)]" />
              </div>
            ) : detailQuery.error || !selectedFriend ? (
              <div className="rounded-3xl border border-[var(--evven-border)] px-4 py-6 text-sm text-destructive">
                Could not load this friend right now.
              </div>
            ) : (
              <div className="space-y-5">
                <div
                  className="rounded-[28px] border bg-[var(--evven-background)] p-5"
                  style={{ borderColor: "var(--evven-border)" }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <FriendAvatar friend={selectedFriend} active />
                      <div className="min-w-0">
                        <p className="truncate text-2xl font-medium">{selectedFriend.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedFriend.user_code ? `Code ${selectedFriend.user_code}` : "Active friend"}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {selectedFriend.last_activity_at ? `Updated ${formatRelativeTime(selectedFriend.last_activity_at)}` : "No activity yet"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border px-4 py-3" style={{ borderColor: "var(--evven-border)", background: "var(--evven-card-background)" }}>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Balance</p>
                      <p className="mt-2 text-3xl font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                        {formatMoney(friendBalance)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{friendBalanceState?.title ?? "Settled"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border px-4 py-4" style={{ borderColor: "var(--evven-border)", background: "var(--evven-card-background)" }}>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status</p>
                    <p className="mt-2 text-sm font-medium">{selectedFriend.status ?? "ACTIVE"}</p>
                  </div>
                  <div className="rounded-3xl border px-4 py-4" style={{ borderColor: "var(--evven-border)", background: "var(--evven-card-background)" }}>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Entries</p>
                    <p className="mt-2 text-sm font-medium">{combineFriendHistory(selectedFriend).length}</p>
                  </div>
                  <div className="rounded-3xl border px-4 py-4" style={{ borderColor: "var(--evven-border)", background: "var(--evven-card-background)" }}>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Settle state</p>
                    <p className="mt-2 text-sm font-medium">
                      {friendBalance === 0 ? "Settle up complete" : "Outstanding balance"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <Button asChild size="sm" className="w-full min-w-0 justify-center">
                    <Link href={`/expenses/new?friend_id=${selectedFriend.id}&direction=${getDefaultSettlementDirection(friendBalance)}`}>
                      <Plus />
                      Add
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="w-full min-w-0 justify-center">
                    <Link href={`/expenses/new?friend_id=${selectedFriend.id}&direction=${getDefaultSettlementDirection(friendBalance)}`}>
                      <ArrowLeftRight />
                      Settle
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full min-w-0 justify-center">
                    <Link href={`/expenses/new?split=true&friend_id=${selectedFriend.id}&direction=${getDefaultSettlementDirection(friendBalance)}`}>
                      <Users />
                      Split
                    </Link>
                  </Button>
                </div>

                <div className="flex justify-end">
                  <UnfriendDialog
                    friend={selectedFriend}
                    balance={friendBalance}
                    onOpenSettlement={() =>
                      router.push(`/expenses/new?friend_id=${selectedFriend.id}&direction=${getDefaultSettlementDirection(friendBalance)}`)
                    }
                    onConfirm={async () => {
                      await unfriendMutation.mutateAsync();
                    }}
                  />
                </div>

                {unfriendMutation.isError ? (
                  <div
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                      background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
                      borderColor: "color-mix(in srgb, var(--evven-error) 20%, var(--evven-border))",
                      color: "var(--evven-error)",
                    }}
                  >
                    Could not remove this friend.
                  </div>
                ) : null}

                <section className="rounded-[28px] border bg-[var(--evven-background)] p-4 sm:p-5" style={{ borderColor: "var(--evven-border)" }}>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Activity</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Expense and settlement history for this friendship.
                    </p>
                  </div>

                  <FriendActivityList friend={selectedFriend} />
                </section>
              </div>
            )}
          </section>
            )}

            {activeTab === "requests" && (
          <section className="space-y-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                  Requests
                </p>
                <h2 className="mt-2 text-lg font-medium sm:text-xl">Incoming and outgoing</h2>
              </div>
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "color-mix(in srgb, var(--evven-accent-secondary) 32%, var(--evven-background))",
                  color: "var(--evven-accent-primary)",
                }}
              >
                <UserRoundPlus size={18} />
              </div>
            </div>

            {requestsQuery.isLoading ? (
              <div className="space-y-3">
                {[0, 1].map((item) => (
                  <div key={item} className="h-24 rounded-3xl border border-[var(--evven-border)] bg-[var(--evven-surface)] animate-pulse" />
                ))}
              </div>
            ) : requests.incoming.length === 0 && requests.outgoing.length === 0 ? (
              <div className="rounded-3xl border border-dashed px-4 py-6 text-sm text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
                No pending requests right now.
              </div>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {requests.incoming.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                      Incoming
                    </p>
                    <div className="space-y-2">
                      {requests.incoming.map((request) => (
                        <RequestRow
                          key={request.id}
                          request={request}
                          onAccept={() => acceptMutation.mutate(request.id)}
                          onReject={() => rejectMutation.mutate(request.id)}
                          busy={acceptMutation.isPending || rejectMutation.isPending}
                          tone="incoming"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {requests.outgoing.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                      Outgoing
                    </p>
                    <div className="space-y-2">
                      {requests.outgoing.map((request) => (
                        <RequestRow
                          key={request.id}
                          request={request}
                          onAccept={() => acceptMutation.mutate(request.id)}
                          onReject={() => rejectMutation.mutate(request.id)}
                          busy={acceptMutation.isPending || rejectMutation.isPending}
                          tone="outgoing"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
            )}

            {activeTab === "friends" && (
          <section className="space-y-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
                  Friends
                </p>
                <h2 className="mt-2 text-lg font-medium sm:text-xl">Active relationships</h2>
              </div>
              <div className="text-sm text-muted-foreground">
                {friendsQuery.isLoading ? "Loading..." : `${friends.length} shown`}
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, code, or balance"
                className="w-full rounded-2xl border px-4 py-3 pl-10 text-sm outline-none transition focus:ring-2"
                style={{
                  background: "var(--evven-card-background)",
                  borderColor: "var(--evven-border)",
                }}
              />
            </div>

            {friendsQuery.isLoading ? (
              <ListSkeleton />
            ) : friendsQuery.error ? (
              <div className="rounded-3xl border border-[var(--evven-border)] px-4 py-6 text-sm text-destructive">
                Could not load friends.
              </div>
            ) : friends.length === 0 ? (
              <div className="rounded-3xl border border-dashed px-4 py-6 text-sm text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
                No friends yet. Add one by user code and your active list will appear here.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {friends.map((friend) => {
                  const active = friend.id === selectedFriendId;
                  const balanceState = getFriendBalanceState(friend);

                  return (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => selectFriend(friend.id)}
                      className={[
                        "flex h-full w-full items-center gap-3 rounded-3xl border px-4 py-4 text-left transition-all hover:-translate-y-0.5",
                        active ? "ring-2 ring-[var(--evven-accent-primary)] ring-offset-2 ring-offset-background" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        background: active
                          ? "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-card-background))"
                          : "var(--evven-card-background)",
                        borderColor: "var(--evven-border)",
                      }}
                    >
                      <FriendAvatar friend={friend} active={active} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{friend.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {friend.user_code ? `Code ${friend.user_code}` : getFriendBalanceLabel(friend)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              balanceState.tone === "positive"
                                ? "var(--evven-accent-primary)"
                                : balanceState.tone === "negative"
                                  ? "var(--evven-error)"
                                  : "var(--evven-text-muted)",
                          }}
                        >
                          {formatMoney(friend.balance ?? friend.net_balance ?? 0)}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {balanceState.title}
                        </p>
                      </div>
                      <ChevronRight size={16} style={{ color: "var(--evven-text-muted)" }} />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestRow({
  request,
  tone,
  onAccept,
  onReject,
  busy,
}: {
  request: FriendRequest;
  tone: "incoming" | "outgoing";
  onAccept: () => void;
  onReject: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="rounded-3xl border px-4 py-4"
      style={{
        background:
          tone === "incoming"
            ? "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-background))"
            : "var(--evven-background)",
        borderColor: "var(--evven-border)",
      }}
    >
      <div className="flex items-start gap-3">
        <FriendAvatar friend={request} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{request.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {tone === "incoming" ? "Waiting for your response" : "Sent from your account"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {request.created_at ? formatRelativeTime(request.created_at) : "Recently"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {tone === "incoming" ? (
          <Button disabled={busy} className="w-full sm:w-auto" onClick={onAccept}>
            {busy ? <Loader2 className="animate-spin" /> : <Check />}
            Accept
          </Button>
        ) : (
          <div className="flex-1 rounded-2xl border px-4 py-2.5 text-xs text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
            Pending approval
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={onReject}
        >
          <X />
          {tone === "incoming" ? "Reject" : "Cancel"}
        </Button>
      </div>
    </div>
  );
}

function FriendActivityList({ friend }: { friend: FriendDetail }) {
  const history = useMemo(() => combineFriendHistory(friend), [friend]);

  if (history.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground" style={{ borderColor: "var(--evven-border)" }}>
        <Clock3 className="mx-auto mb-3" size={18} />
        Nothing here yet. Add an expense or settlement to start the trail.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => {
        const type = getActivityType(entry);
        const meta = getActivityMeta(entry, friend.name);

        return (
          <div
            key={entry.id}
            className="flex items-start gap-3 rounded-3xl border px-4 py-4"
            style={{
              background: "var(--evven-card-background)",
              borderColor: "var(--evven-border)",
            }}
          >
            <ActivityIcon type={type} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{getActivityTitle(entry)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {meta.label} · {formatDate(getActivityTime(entry))}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: meta.tone === "positive" ? "var(--evven-accent-primary)" : "var(--evven-error)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {meta.amount}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {meta.badge}
                  </p>
                </div>
              </div>

              {entry.notes ? (
                <p className="mt-2 text-xs text-muted-foreground">{entry.notes}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
