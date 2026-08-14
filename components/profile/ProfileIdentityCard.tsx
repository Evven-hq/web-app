"use client";

import { UserRound } from "lucide-react";
import { getInitials } from "@/components/expenses/friends";

export function ProfileIdentityCard({
  profilePicture,
  displayName,
  email,
  authProvider,
  onOpenAvatar,
}: {
  profilePicture: string;
  displayName: string;
  email: string;
  authProvider: string;
  onOpenAvatar: () => void;
}) {
  return (
    <div
      className="mb-4 overflow-hidden rounded-[30px] p-5 sm:p-7"
      style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenAvatar}
            aria-label="Change avatar"
            className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-(--evven-accent-primary)"
          >
            {profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePicture}
                alt={displayName}
                className="size-16 rounded-full object-cover ring-2 ring-white/25 transition-opacity group-hover:opacity-80 sm:size-20"
              />
            ) : (
              <div
                className="flex size-16 items-center justify-center rounded-full text-xl font-medium ring-2 ring-white/25 transition-opacity group-hover:opacity-80 sm:size-20"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {displayName ? getInitials(displayName) : <UserRound size={26} />}
              </div>
            )}
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-wide opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              Change
            </span>
          </button>
          <div className="min-w-0">
            <p className="truncate text-xl font-medium sm:text-2xl">{displayName}</p>
            <p className="mt-0.5 truncate text-sm opacity-80">{email}</p>
            <span
              className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {authProvider} account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
