"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "./dock-utils";

export function DesktopIdentityChip({
  user,
}: {
  user: ReturnType<typeof useAuthStore.getState>["user"];
}) {
  return (
    <Link
      href="/profile"
      className={`
        group pointer-events-auto fixed left-6 top-[18px] z-40 hidden items-center gap-3 
        rounded-(--evven-radius-hero) px-4 py-3 
        transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
       
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background
        md:flex
        animate-[fadeIn_0.5s_ease-out]
      `}
      style={
        {
          "--evven-card-background":
            "color-mix(in srgb, white 14%, color-mix(in srgb, var(--evven-background) 72%, var(--evven-surface)))",
          backgroundColor: "var((--evven-card-background))",
        } as CSSProperties
      }
      aria-label="Profile"
    >
      <div
        className={`
          relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full 
          border-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          group-hover:border-[var(--evven-accent-primary)] group-hover:shadow-[0_0_12px_var(--evven-accent-primary)]
        `}
        style={{
          background: "var(--evven-accent-secondary)",
          color: "var(--evven-accent-primary)",
          borderColor: "var(--evven-accent-primary)",
        }}
      >
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={user.name ?? "Profile"}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          />
        ) : user?.name ? (
          <span className="transition-transform duration-500 group-hover:scale-110">
            {getInitials(user.name)}
          </span>
        ) : (
          "?"
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
          {user?.name ?? ""}
        </p>
        <p
          className="truncate text-xs"
          style={{ color: "var(--evven-text-muted)", fontFamily: "var(--font-mono)" }}
        >
          {user?.user_code ?? ""}
        </p>
      </div>
    </Link>
  );
}
