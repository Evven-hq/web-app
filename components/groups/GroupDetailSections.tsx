"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Receipt,
  Scale,
  Trash2,
  UserPlus,
  Users,
  Loader2,
  CheckCircle,
} from "lucide-react";
import type {
  Group,
  GroupBalances,
  GroupDebtBreakdown,
  GroupExpense,
  GroupMember,
  Settlement,
} from "@/types";
import { getCategoryMeta, EXPENSE_CATEGORIES } from "@/lib/expense-categories";
import { COLORS, formatAmount, formatDate, getInitials } from "./group-detail-utils";

export type Tab = "expenses" | "balances" | "members";
type UserNameFn = (id: string) => string;
type SettleFn = (userId: string, amount: number) => void;

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

export function SectionWarning({ message }: { message: string }) {
  return (
    <div
      className="mb-5 rounded-2xl border px-4 py-3 text-sm"
      style={{
        background: "#FFF8E7",
        borderColor: "#F3D08A",
        color: "#7A4A00",
      }}
    >
      {message}
    </div>
  );
}

export function BalanceSummary({
  balances,
  currentUserId,
  userName,
  onSettle,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  userName: UserNameFn;
  onSettle: SettleFn;
}) {
  const myBalances = Object.entries(balances).filter(([uid]) => uid !== currentUserId);

  if (myBalances.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 mb-5 border"
      style={{ background: "white", borderColor: "var(--evven-border)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Your balances
      </p>
      <div className="space-y-2">
        {Object.entries(balances)
          .filter(([uid]) => uid !== currentUserId)
          .map(([uid, bal]) => {
            const n = parseFloat(bal);
            const owesYou = n > 0;
            return (
              <div key={uid} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--evven-text-primary)" }}>
                  {userName(uid)}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: owesYou ? "#0F6E56" : "#A32D2D" }}
                  >
                    {owesYou
                      ? `owes you ${formatAmount(Math.abs(n))}`
                      : `you owe ${formatAmount(Math.abs(n))}`}
                  </span>
                  {!owesYou && (
                    <button
                      onClick={() => onSettle(uid, Math.abs(n))}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium text-white"
                      style={{ background: "var(--evven-accent-primary)" }}
                    >
                      Settle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export function GroupTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "var(--evven-surface)" }}>
      {(["expenses", "balances", "members"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium capitalize transition-all"
          style={{
            background: tab === t ? "white" : "transparent",
            color: tab === t ? "var(--evven-text-primary)" : "var(--evven-text-muted)",
            boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {t === "expenses" && <Receipt size={12} />}
          {t === "balances" && <Scale size={12} />}
          {t === "members" && <Users size={12} />}
          {t}
        </button>
      ))}
    </div>
  );
}

export function ExpensesTab({
  expenses,
  currentUserId,
  isCreator,
  userName,
  onViewExpense,
  onEditExpense,
  onDeleteExpense,
}: {
  expenses: GroupExpense[];
  currentUserId?: string;
  isCreator: boolean;
  userName: UserNameFn;
  onViewExpense: (expense: GroupExpense) => void;
  onEditExpense: (expense: GroupExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center border"
        style={{ background: "white", borderColor: "var(--evven-border)" }}
      >
        <Receipt size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
        <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>
          No expenses yet
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--evven-text-muted)" }}>
          Log the first expense for this group.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((exp) => (
        <div
          key={exp.id}
          onClick={() => void onViewExpense(exp)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void onViewExpense(exp);
            }
          }}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all hover:opacity-80"
          style={{ background: "white", borderColor: "var(--evven-border)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: exp.category
                ? getCategoryMeta(exp.category).bg
                : "var(--evven-accent-secondary)",
            }}
          >
            {exp.category ? (
              (() => {
                const Icon = getCategoryMeta(exp.category).icon;
                return <Icon size={18} />;
              })()
            ) : (
              <Receipt size={15} style={{ color: "var(--evven-accent-primary)" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
              {exp.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
              Paid by {userName(exp.paid_by)} · {formatDate(exp.created_at)} · {exp.split_type}
              {exp.category ? ` · ${getCategoryMeta(exp.category).label}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
              {formatAmount(exp.amount)}
            </span>
            {exp.paid_by === currentUserId && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void onEditExpense(exp);
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-(--evven-surface)"
              >
                <Edit3 size={13} style={{ color: "var(--evven-text-muted)" }} />
              </button>
            )}
            {(isCreator || exp.paid_by === currentUserId) && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  void onDeleteExpense(exp.id);
                }}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
              >
                <Trash2 size={13} style={{ color: "#A32D2D" }} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BalancesTab({
  balances,
  currentUserId,
  members,
  settlements,
  debtBreakdown,
  breakdownError,
  userName,
  onSettle,
  onReloadBreakdown,
}: {
  balances: GroupBalances;
  currentUserId?: string;
  members: GroupMember[];
  settlements: Settlement[];
  debtBreakdown: GroupDebtBreakdown | null;
  breakdownError: string | null;
  userName: UserNameFn;
  onSettle: SettleFn;
  onReloadBreakdown: () => void;
}) {
  const detailedBreakdown = (() => {
    if (!debtBreakdown?.breakdown) return [];

    return Object.entries(debtBreakdown.breakdown)
      .map(([debtorId, creditors]) => {
        const creditorEntries = Object.entries(creditors)
          .map(([creditorId, items]) => {
            const sortedItems = [...items].sort(
              (left, right) => Number(right.amount) - Number(left.amount)
            );
            const total = sortedItems.reduce((sum, item) => sum + Number(item.amount), 0);

            return { creditorId, items: sortedItems, total };
          })
          .filter(({ items }) => items.length > 0)
          .sort((left, right) => right.total - left.total);

        const total = creditorEntries.reduce((sum, entry) => sum + entry.total, 0);
        return { debtorId, creditors: creditorEntries, total };
      })
      .filter(({ creditors }) => creditors.length > 0)
      .sort((left, right) => right.total - left.total);
  })();

  const colorFor = (uid: string) => {
    const colorIdx = members.findIndex((m) => m.user_id === uid) % COLORS.length;
    return COLORS[Math.max(0, colorIdx)];
  };

  return (
    <div>
      {Object.keys(balances).length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center border"
          style={{ background: "white", borderColor: "var(--evven-border)" }}
        >
          <Scale size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>
            All settled up
          </p>
          <p className="text-xs" style={{ color: "var(--evven-text-muted)" }}>
            No outstanding balances in this group.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(balances).map(([uid, bal]) => {
            const n = parseFloat(bal);
            const isMe = uid === currentUserId;
            const isPos = n > 0;
            const color = colorFor(uid);
            return (
              <div
                key={uid}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ background: color.bg, color: color.text }}
                >
                  {getInitials(userName(uid))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                    {userName(uid)}
                    {isMe ? " (you)" : ""}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: isPos ? "#0F6E56" : "#A32D2D" }}>
                    {n === 0
                      ? "settled"
                      : isPos
                        ? `gets back ${formatAmount(Math.abs(n))}`
                        : `owes ${formatAmount(Math.abs(n))}`}
                  </p>
                </div>
                {n !== 0 && !isMe && !isPos && (
                  <button
                    onClick={() => onSettle(uid, Math.abs(n))}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white shrink-0"
                    style={{ background: "var(--evven-accent-primary)" }}
                  >
                    Settle
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {settlements.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--evven-text-muted)" }}>
            Past settlements
          </p>
          <div className="space-y-2">
            {settlements.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <CheckCircle size={15} style={{ color: "#0F6E56" }} className="shrink-0" />
                <p className="text-sm flex-1" style={{ color: "var(--evven-text-primary)" }}>
                  <span className="font-medium">{userName(s.payer_id)}</span>
                  {" paid "}
                  <span className="font-medium">{userName(s.receiver_id)}</span>
                </p>
                <span className="text-sm font-semibold" style={{ color: "#0F6E56" }}>
                  {formatAmount(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
            Expense breakdown
          </p>
          <button
            type="button"
            onClick={onReloadBreakdown}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
            style={{
              borderColor: "var(--evven-border)",
              background: "white",
              color: "var(--evven-text-primary)",
            }}
          >
            Reload
          </button>
        </div>

        {breakdownError ? (
          <div
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              background: "#FEF2F2",
              borderColor: "#FECACA",
              color: "#B91C1C",
            }}
          >
            {breakdownError}
          </div>
        ) : detailedBreakdown.length === 0 ? (
          <div
            className="rounded-2xl border px-4 py-5 text-center"
            style={{ background: "white", borderColor: "var(--evven-border)" }}
          >
            <Receipt size={18} className="mx-auto mb-2" style={{ color: "var(--evven-text-muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
              No breakdown to show
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--evven-text-muted)" }}>
              Add a few expenses and their splits to see who owes whom.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {detailedBreakdown.map(({ debtorId, creditors }) => (
              <div
                key={debtorId}
                className="rounded-2xl border p-4"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                      {userName(debtorId)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                      Owes across {creditors.length} creditor{creditors.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}
                  >
                    {formatAmount(creditors.reduce((sum, entry) => sum + entry.total, 0))}
                  </span>
                </div>

                <div className="space-y-2">
                  {creditors.map(({ creditorId, items, total }) => (
                    <div
                      key={creditorId}
                      className="rounded-xl p-3"
                      style={{ background: "var(--evven-surface)" }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "var(--evven-text-muted)" }}
                        >
                          To {userName(creditorId)}
                        </p>
                        <p className="text-xs font-medium" style={{ color: "var(--evven-text-primary)" }}>
                          {formatAmount(total)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.expense_id}
                            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                                {item.title}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                                Expense split
                              </p>
                            </div>
                            <span className="text-sm font-semibold shrink-0" style={{ color: "var(--evven-text-primary)" }}>
                              {formatAmount(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="space-y-2">
      {members.map((m, i) => {
        const color = COLORS[i % COLORS.length];
        const isCreatorMember = m.user_id === groupCreatedBy;
        return (
          <div
            key={m.id}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: "white", borderColor: "var(--evven-border)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: color.bg, color: color.text }}
            >
              {getInitials(userName(m.user_id))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                {userName(m.user_id)}
                {m.user_id === currentUserId ? " (you)" : ""}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                {isCreatorMember ? "Admin" : "Member"} · Joined {formatDate(m.joined_at)}
              </p>
            </div>
            {isCreator && !isCreatorMember && (
              <button
                onClick={() => void onRemoveMember(m)}
                disabled={removingMemberId === m.user_id}
                aria-label={`Remove ${userName(m.user_id)}`}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50 shrink-0"
              >
                {removingMemberId === m.user_id ? (
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
