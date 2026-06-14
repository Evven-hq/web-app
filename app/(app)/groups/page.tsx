"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Users, ChevronRight, Loader2, X } from "lucide-react";
import { getGroups, createGroup } from "@/services/groups";
import type { Group } from "@/types";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const GROUP_COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E1F5EE", text: "#0F6E56" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E6F1FB", text: "#185FA5" },
  { bg: "#FEF9E7", text: "#8A6C0A" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(() => setError("Failed to load groups."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const group = await createGroup(newName.trim());
      setGroups((prev) => [group, ...prev]);
      setShowCreate(false);
      setNewName("");
      router.push(`/groups/${group.id}`);
    } catch {
      setCreateError("Could not create group. Try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--evven-background)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--evven-text-muted)" }}>
              Your spaces
            </p>
            <h1 className="text-2xl font-medium" style={{ color: "var(--evven-text-primary)" }}>
              Groups
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--evven-accent-primary)" }}
          >
            <Plus size={15} />
            New group
          </button>
        </div>

        {/* Loading */}
        {loading && (
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
        {error && !loading && (
          <div className="rounded-xl p-4 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C" }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groups.length === 0 && (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ borderColor: "var(--evven-border)", background: "white" }}
          >
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              <Plus size={15} />
              Create your first group
            </button>
          </div>
        )}

        {/* Groups list */}
        {!loading && groups.length > 0 && (
          <div className="space-y-2">
            {groups.map((g, i) => {
              const color = GROUP_COLORS[i % GROUP_COLORS.length];
              return (
                <Link
                  key={g.id}
                  href={`/groups/${g.id}`}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all hover:shadow-sm group"
                  style={{
                    background: "white",
                    borderColor: "var(--evven-border)",
                  }}
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
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div
            className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
            style={{ background: "white", border: "1px solid var(--evven-border)" }}
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

            {createError && (
              <p className="text-xs mb-3" style={{ color: "var(--evven-error)" }}>{createError}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {creating ? "Creating…" : "Create group"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}