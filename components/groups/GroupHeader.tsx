"use client";

import Link from "next/link";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import type { Group, GroupMember } from "@/types";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { COLORS, getInitials } from "./group-detail-utils";
import type { UserAvatarFn, UserNameFn } from "./group-detail-shared";

export function GroupHeader({
  group,
  members,
  membersCount,
  expensesCount,
  userName,
  userAvatar,
  onAddMember,
  onAddExpense,
}: {
  group: Group;
  members: GroupMember[];
  membersCount: number;
  expensesCount: number;
  userName: UserNameFn;
  userAvatar: UserAvatarFn;
  onAddMember: () => void;
  onAddExpense: () => void;
}) {
  const visibleMembers = members.slice(0, 4);
  const hiddenMembersCount = Math.max(0, members.length - visibleMembers.length);

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
          {visibleMembers.length > 0 && (
            <AvatarGroup className="mt-3">
              {visibleMembers.map((member, index) => {
                const color = COLORS[index % COLORS.length];

                return (
                  <Avatar key={member.id} size="sm" aria-label={userName(member.user_id)}>
                    <AvatarImage src={userAvatar(member.user_id) ?? undefined} alt={userName(member.user_id)} />
                    <AvatarFallback
                      className="text-[10px] font-semibold"
                      style={{ background: color.bg, color: color.text }}
                    >
                      {getInitials(userName(member.user_id))}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {hiddenMembersCount > 0 && (
                <AvatarGroupCount className="text-[10px] font-semibold">
                  +{hiddenMembersCount}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onAddMember}
            className="card flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:opacity-80"
            style={{ color: "var(--evven-text-primary)" }}
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
