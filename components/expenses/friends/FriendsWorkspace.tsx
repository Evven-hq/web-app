"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import type { FriendDetail } from "@/types";
import {
  acceptFriendRequest,
  getFriendDetail,
  getFriendRequests,
  getFriends,
  getFriendBalance,
  rejectFriendRequest,
  unfriend,
} from "@/services/friends";
import {
  friendMatchesSearch,
  getDefaultSettlementDirection,
  getFriendBalanceState,
} from "./friend-utils";
import { getApiErrorMessage } from "@/lib/api-error";
import { FriendPageHeader } from "./FriendPageHeader";
import { FriendTabsBar } from "./FriendTabsBar";
import type { FriendTab } from "./FriendTabsBar";
import { FriendDetailTab } from "./FriendDetailTab";
import { RequestsTab } from "./RequestsTab";
import { FriendsTab } from "./FriendsTab";

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

  const selectedFriend: FriendDetail | null = detailQuery.data ?? selectedFriendFromList;
  const friendBalance = selectedFriend ? getFriendBalance(selectedFriend) : 0;
  const friendBalanceState = selectedFriend ? getFriendBalanceState(selectedFriend) : null;
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
      // TODO: replace native alert with an in-app error surface.
      window.alert(getApiErrorMessage(err, "Could not accept that request."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
    onError: (err) => {
      // TODO: replace native alert with an in-app error surface.
      window.alert(getApiErrorMessage(err, "Could not update that request."));
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
      // TODO: replace native alert with an in-app error surface.
      window.alert(getApiErrorMessage(err, "Could not remove that friend."));
    },
  });

  const handleCopyCode = async () => {
    if (!user?.user_code) return;
    await navigator.clipboard.writeText(user.user_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenSettlement = () => {
    if (!selectedFriend) return;
    router.push(`/expenses/new?friend_id=${selectedFriend.id}&direction=${getDefaultSettlementDirection(friendBalance)}`);
  };

  const selectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);
    setActiveTab("friend");
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <FriendPageHeader copied={copied} onCopyCode={handleCopyCode} />

        <FriendTabsBar
          active={activeTab}
          requestCount={requests.incoming.length}
          friendCount={friendsQuery.data?.length ?? 0}
          onChange={setActiveTab}
        />

        <div className="rounded-[32px] bg-[var(--evven-card-background)] p-4 shadow-[0_12px_40px_rgba(26,24,22,0.04)] sm:p-5 lg:p-6">
          <div key={activeTab} className="animate-[evven-tab-panel-in_220ms_ease-out]">
            {activeTab === "friend" && (
              <FriendDetailTab
                selectedFriend={selectedFriend}
                isLoading={detailQuery.isLoading}
                isError={Boolean(detailQuery.error)}
                balance={friendBalance}
                balanceState={friendBalanceState}
                onOpenSettlement={handleOpenSettlement}
                onConfirmUnfriend={async () => {
                  await unfriendMutation.mutateAsync();
                }}
                unfriendError={unfriendMutation.isError}
              />
            )}

            {activeTab === "requests" && (
              <RequestsTab
                requests={requests}
                isLoading={requestsQuery.isLoading}
                onAccept={(requestId) => acceptMutation.mutate(requestId)}
                onReject={(requestId) => rejectMutation.mutate(requestId)}
                busy={acceptMutation.isPending || rejectMutation.isPending}
              />
            )}

            {activeTab === "friends" && (
              <FriendsTab
                friends={friends}
                isLoading={friendsQuery.isLoading}
                isError={Boolean(friendsQuery.error)}
                search={search}
                onSearch={setSearch}
                selectedFriendId={selectedFriendId}
                onSelect={selectFriend}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
