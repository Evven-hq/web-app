"use client";

import Link from "next/link";
import { COLORS } from "@/lib/avatar";
import { getInitials } from "@/lib/format";
import type { DashboardGroup } from "./dashboard-types";

export function GroupsPanel({
  groups,
  isLoading,
}: {
  groups: DashboardGroup[];
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "var(--color-background-primary, var(--evven-background))",
        border: "0.5px solid var(--evven-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Your groups</span>
        <Link
          href="/groups"
          className="text-xs flex items-center gap-0.5"
          style={{ color: "var(--evven-text-muted)" }}
        >
          All →
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 rounded-2xl animate-pulse"
              style={{ background: "var(--evven-surface)" }}
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No groups yet.{" "}
          <Link href="/groups" className="underline">
            Create one
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {groups.slice(0, 4).map((g, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <Link
                href={`/groups/${g.id}`}
                key={g.id}
                className="flex items-center gap-2.5 py-2 border-b last:border-0 hover:opacity-70 transition-opacity"
                style={{ borderColor: "var(--evven-border)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ background: color.bg, color: color.text }}
                >
                  {getInitials(g.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{g.name}</p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--evven-text-muted)" }}
                  >
                    {new Date(g.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
