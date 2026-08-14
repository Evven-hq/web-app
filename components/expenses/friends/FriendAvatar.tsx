"use client";

import type { Friend } from "@/types";
import { getInitials } from "@/lib/format";

export function FriendAvatar({
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
