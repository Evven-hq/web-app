"use client";

import { Loader2, Trash2, UserPlus } from "lucide-react";
import type { GroupMember } from "@/types";
import { COLORS, formatDate, getInitials } from "./group-detail-utils";
import type { UserNameFn } from "./group-detail-shared";

export function MembersTab({
  members,
  groupCreatedBy,
  currentUserId,
  isCreator,
  userName,
  onRemoveMember,
  removingMemberId,
  onAddMember,
}: {
  members: GroupMember[];
  groupCreatedBy: string;
  currentUserId?: string;
  isCreator: boolean;
  userName: UserNameFn;
  onRemoveMember: (member: GroupMember) => void;
  removingMemberId: string | null;
  onAddMember: () => void;
}) {
  return (
    <div className="h-full overflow-y-auto pr-1 pb-8 space-y-2">
      {members.map((member, index) => {
        const color = COLORS[index % COLORS.length];
        const isCreatorMember = member.user_id === groupCreatedBy;

        return (
          <div
            key={member.id}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: "white", borderColor: "var(--evven-border)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: color.bg, color: color.text }}
            >
              {getInitials(userName(member.user_id))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                {userName(member.user_id)}
                {member.user_id === currentUserId ? " (you)" : ""}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                {isCreatorMember ? "Admin" : "Member"} · Joined {formatDate(member.joined_at)}
              </p>
            </div>
            {isCreator && !isCreatorMember && (
              <button
                onClick={() => void onRemoveMember(member)}
                disabled={removingMemberId === member.user_id}
                aria-label={`Remove ${userName(member.user_id)}`}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50 shrink-0"
              >
                {removingMemberId === member.user_id ? (
                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--evven-text-muted)" }} />
                ) : (
                  <Trash2 size={14} style={{ color: "#A32D2D" }} />
                )}
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onAddMember}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium border-dashed transition-all hover:opacity-70"
        style={{ borderColor: "var(--evven-border)", color: "var(--evven-text-muted)" }}
      >
        <UserPlus size={15} />
        Add member
      </button>
    </div>
  );
}
