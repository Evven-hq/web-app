"use client";

import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import type { FriendDetail } from "@/types";
import { combineFriendHistory } from "@/services/friends";
import { formatDate } from "@/lib/format";
import {
  getActivityMeta,
  getActivityTime,
  getActivityTitle,
  getActivityType,
} from "./friend-activity-utils";
import { ActivityIcon } from "./ActivityIcon";

export function FriendActivityList({ friend }: { friend: FriendDetail }) {
  const history = useMemo(() => combineFriendHistory(friend), [friend]);

  if (history.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
        style={{ borderColor: "var(--evven-border)" }}
      >
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
                  <p className="truncate text-sm font-medium">
                    {getActivityTitle(entry)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {meta.label} · {formatDate(getActivityTime(entry))}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color:
                        meta.tone === "positive"
                          ? "var(--evven-accent-primary)"
                          : "var(--evven-error)",
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {entry.notes}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
