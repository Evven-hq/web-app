"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Plus, Users, ChevronRight, Loader2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroups, createGroup } from "@/services/groups";
import type { Group } from "@/types";
import { COLORS } from "@/components/groups/group-detail-utils";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function GroupsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: (group) => {
      queryClient.setQueryData<Group[]>(["groups"], (prev) =>
        prev ? [group, ...prev] : [group]
      );
      router.push(`/groups/${group.id}`);
    },
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createMutation.mutate(newName.trim(), {
      onSuccess: () => {
        setShowCreate(false);
        setNewName("");
      },
      onError: () => {},
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--evven-background)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--evven-text-muted)" }}>
              Groups · {isLoading ? "loading" : `${groups.length} active`}
            </p>
            <h1 className="text-2xl font-medium" style={{ color: "var(--evven-text-primary)" }}>
              Groups
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
          >
            <Plus size={15} />
            New group
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl animate-pulse"
                style={{ background: "var(--evven-surface)" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="card rounded-[var(--evven-radius-card)] p-4 text-sm" style={{ color: "var(--evven-error)" }}>
            Failed to load groups.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && groups.length === 0 && (
          <div className="card rounded-[var(--evven-radius-card)] p-10 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--evven-accent-secondary)" }}
            >
              <Users size={24} style={{ color: "var(--evven-accent-primary)" }} />
            </div>
            <p className="font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>
              No groups yet
            </p>
            <p className="text-sm mb-5" style={{ color: "var(--evven-text-muted)" }}>
              Create a group to start splitting expenses with people you share costs with.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
            >
              <Plus size={15} />
              Create your first group
            </button>
          </div>
        )}

        {/* Groups list */}
        {!isLoading && groups.length > 0 && (
          <div className="space-y-2">
            {groups.map((g, i) => {
              const color = COLORS[i % COLORS.length];
              return (
                <Link
                  key={g.id}
                  href={`/groups/${g.id}`}
                  onMouseEnter={() => router.prefetch(`/groups/${g.id}`)}
                  className="card flex items-center gap-4 rounded-[var(--evven-radius-card)] px-4 py-3.5 transition-all hover:bg-(--evven-surface) group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {getInitials(g.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--evven-text-primary)" }}>
                      {g.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                      Created {formatDate(g.created_at)}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--evven-text-muted)" }} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Create group modal */}
      {showCreate && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="premium-modal-backdrop absolute inset-0"
            onClick={() => setShowCreate(false)}
          />
          <div
            className="premium-modal-panel card relative w-full max-w-sm rounded-[var(--evven-radius-hero)] p-6 shadow-xl"
          >
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ background: "var(--evven-surface)" }}
            >
              <X size={15} />
            </button>

            <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>
              New group
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--evven-text-muted)" }}>
              Give your group a name — trip, flat, team, whatever fits.
            </p>

            <input
              autoFocus
              type="text"
              placeholder="e.g. Goa Trip 2025"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 mb-3"
              style={{
                borderColor: "var(--evven-border)",
                background: "var(--evven-surface)",
                color: "var(--evven-text-primary)",
              }}
            />

            {createMutation.isError && (
              <p className="text-xs mb-3" style={{ color: "var(--evven-error)" }}>
                Could not create group. Try again.
              </p>
            )}

            <button
              onClick={handleCreate}
              disabled={!newName.trim() || createMutation.isPending}
              className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
              style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
            >
              {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {createMutation.isPending ? "Creating…" : "Create group"}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
