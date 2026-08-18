"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/format";

export function MobileFloatingChrome({
  user,
  showAddExpense,
}: {
  user: ReturnType<typeof useAuthStore.getState>["user"];
  showAddExpense: boolean;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 md:hidden"
      style={{
        paddingTop:
          "calc(var(--safe-area-inset-top, env(safe-area-inset-top, 0px)) + 0.625rem)",
      }}
    >
      <Link
        href="/profile"
        className="pointer-events-auto flex size-11 items-center justify-center overflow-hidden rounded-full text-xs font-semibold shadow-lg"
        style={{
          background:
            "color-mix(in srgb, var(--evven-accent-secondary) 45%, transparent)",
          color: "var(--evven-accent-primary)",
          border: "1px solid var(--evven-border)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
        aria-label="Profile"
      >
        {user?.profile_picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profile_picture}
            alt={user.name ?? "Profile"}
            className="size-full object-cover"
          />
        ) : user?.name ? (
          getInitials(user.name)
        ) : (
          "?"
        )}
      </Link>

      {showAddExpense ? (
        <Link
          href="/expenses?new=1"
          aria-label="Add expense"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:opacity-90"
        >
          <Plus size={16} />
        </Link>
      ) : null}
    </div>
  );
}
