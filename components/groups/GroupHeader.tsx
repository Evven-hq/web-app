"use client";

import Link from "next/link";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import type { Group } from "@/types";

export function GroupHeader({
  group,
  membersCount,
  expensesCount,
  onAddMember,
  onAddExpense,
}: {
  group: Group;
  membersCount: number;
  expensesCount: number;
  onAddMember: () => void;
  onAddExpense: () => void;
}) {
  return (
    <div className="mb-6">
      <Link
        href="/groups"
        className="inline-flex items-center gap-1.5 text-sm mb-4 transition-opacity hover:opacity-70"
        style={{ color: "var(--evven-text-muted)" }}
      >
        <ArrowLeft size={14} />
        Groups
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: "var(--evven-text-primary)" }}>
            {group.name}
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--evven-text-muted)" }}>
            {membersCount} member{membersCount !== 1 ? "s" : ""} · {expensesCount} expense
            {expensesCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onAddMember}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
            style={{
              borderColor: "var(--evven-border)",
              color: "var(--evven-text-primary)",
              background: "white",
            }}
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            onClick={onAddExpense}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--evven-accent-primary)" }}
          >
            <Plus size={14} />
            Expense
          </button>
        </div>
      </div>
    </div>
  );
}
