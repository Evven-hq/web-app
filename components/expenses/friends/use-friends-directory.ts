"use client";

import { useCallback, useEffect, useState } from "react";
import { createGhost, deleteGhost, getGhosts } from "@/services/ghosts";
import type { Ghost } from "@/types";

export function useFriendsDirectory() {
  const [friends, setFriends] = useState<Ghost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getGhosts()
      .then((data) => {
        if (active) setFriends(data);
      })
      .catch(() => {
        if (active) setError("Could not load friends.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getGhosts();
      setFriends(data);
    } catch {
      setError("Could not load friends.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createFriend = useCallback(async (name: string) => {
    const friend = await createGhost(name);
    setFriends((current) => [friend, ...current]);
    return friend;
  }, []);

  const removeFriend = useCallback(async (friendId: string) => {
    await deleteGhost(friendId);
    setFriends((current) => current.filter((friend) => friend.id !== friendId));
  }, []);

  return {
    friends,
    loading,
    error,
    setError,
    refresh,
    createFriend,
    removeFriend,
    setFriends,
  };
}
