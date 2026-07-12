"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import type { Ghost } from "@/types";
import { getGhostBalanceLabel, getGhostBalanceState, getInitials } from "./friend-utils";
import { Button } from "@/components/ui/button";

interface FriendCardProps {
  friend: Ghost;
  selected?: boolean;
  onSelect?: () => void;
  href?: string;
  onDelete?: () => void;
  compact?: boolean;
}

export function FriendCard({
  friend,
  selected = false,
  onSelect,
  href,
  onDelete,
  compact = false,
}: FriendCardProps) {
  const balanceState = getGhostBalanceState(friend);

  return (
    <div
      className={[
        "group block w-full rounded-[var(--evven-radius-card)] text-left transition-colors",
        selected ? "ring-1 ring-[var(--evven-accent-primary)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: selected
          ? "color-mix(in srgb, var(--evven-accent-secondary) 24%, var(--evven-background))"
          : "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      {href ? (
        <Link
          href={href}
          className="block w-full text-left outline-none transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-inset"
        >
          <CardInner
            friend={friend}
            selected={selected}
            compact={compact}
            balanceState={balanceState}
            selectable
          />
        </Link>
      ) : onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="block w-full text-left outline-none transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-inset"
        >
          <CardInner
            friend={friend}
            selected={selected}
            compact={compact}
            balanceState={balanceState}
            selectable
          />
        </button>
      ) : (
        <CardInner
          friend={friend}
          selected={selected}
          compact={compact}
          balanceState={balanceState}
        />
      )}

      {onDelete ? (
        <div className="flex justify-end px-4 pb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="gap-2 text-muted-foreground"
          >
            <Trash2 size={14} />
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function CardInner({
  friend,
  selected,
  compact,
  balanceState,
  selectable = false,
}: {
  friend: Ghost;
  selected: boolean;
  compact: boolean;
  balanceState: ReturnType<typeof getGhostBalanceState>;
  selectable?: boolean;
}) {
  return (
    <div className={compact ? "p-3" : "p-4"}>
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{
            background:
              balanceState.tone === "negative"
                ? "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))"
                : balanceState.tone === "positive"
                  ? "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-surface))"
                  : "var(--evven-surface)",
            color:
              balanceState.tone === "negative"
                ? "var(--evven-error)"
                : balanceState.tone === "positive"
                  ? "var(--evven-accent-primary)"
                  : "var(--evven-text-muted)",
          }}
        >
          {getInitials(friend.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{friend.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {getGhostBalanceLabel(friend)}
              </p>
            </div>
            {selected ? (
              <span className="rounded-full px-2 py-1 text-[11px] font-medium text-[var(--evven-accent-primary)]">
                Selected
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">{balanceState.helper}</p>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div
              className="inline-flex max-w-[70%] items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background:
                  balanceState.tone === "neutral"
                    ? "var(--evven-surface)"
                    : balanceState.tone === "positive"
                      ? "color-mix(in srgb, var(--evven-accent-secondary) 30%, var(--evven-surface))"
                      : "color-mix(in srgb, var(--evven-error) 10%, var(--evven-surface))",
                color:
                  balanceState.tone === "negative"
                    ? "var(--evven-error)"
                    : balanceState.tone === "positive"
                      ? "var(--evven-accent-primary)"
                      : "var(--evven-text-muted)",
              }}
            >
              <span className="truncate">{balanceState.title}</span>
            </div>

            {selectable ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowRight size={13} />
                Open
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
