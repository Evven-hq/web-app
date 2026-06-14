"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  UserPlus,
  Users,
  Receipt,
  Scale,
  X,
  Loader2,
  Trash2,
  CheckCircle,
  Edit3,
} from "lucide-react";
import {
  getGroup,
  getGroupMembers,
  getGroupExpenses,
  getGroupBalances,
  getGroupDebtBreakdown,
  createGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  addGroupMember,
  getGroupSettlements,
  createSettlement,
  getGroupExpenseWithSplits,
} from "@/services/groups";
import { useAuthStore } from "@/store/auth-store";
import type {
  Group,
  GroupMember,
  GroupExpense,
  GroupBalances,
  GroupDebtBreakdown,
  Settlement,
  ExpenseSplit,
  GroupExpenseCreate,
} from "@/types";

type Tab = "expenses" | "balances" | "members";
type SplitType = "equal" | "exact" | "percentage";

function formatAmount(n: string | number) {
  return `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const COLORS = [
  { bg: "#EEEDFE", text: "#534AB7" },
  { bg: "#E1F5EE", text: "#0F6E56" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E6F1FB", text: "#185FA5" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const response = isRecord(error) ? error.response : undefined;
  const data = isRecord(response) ? response.data : undefined;

  if (isRecord(data)) {
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents - base * count;

  return Array.from({ length: count }, (_, index) =>
    ((base + (index < remainder ? 1 : 0)) / 100).toFixed(2)
  );
}

export default function GroupDetailPage() {
  const { groupID } = useParams<{ groupID: string }>();
  const currentUser = useAuthStore((s) => s.user);

  const [tab, setTab] = useState<Tab>("expenses");
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [expenses, setExpenses] = useState<GroupExpense[]>([]);
  const [balances, setBalances] = useState<GroupBalances>({});
  const [debtBreakdown, setDebtBreakdown] = useState<GroupDebtBreakdown | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);

  // Expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<GroupExpense | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expSplitType, setExpSplitType] = useState<SplitType>("equal");
  const [splitInputs, setSplitInputs] = useState<Record<string, string>>({});
  const [savingExp, setSavingExp] = useState(false);
  const [expError, setExpError] = useState("");
  const [detailExpense, setDetailExpense] = useState<GroupExpense | null>(null);
  const [detailSplits, setDetailSplits] = useState<ExpenseSplit[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberCode, setMemberCode] = useState("");
  const [savingMember, setSavingMember] = useState(false);
  const [memberError, setMemberError] = useState("");

  // Settle modal
  const [showSettle, setShowSettle] = useState(false);
  const [settleReceiver, setSettleReceiver] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const [savingSettle, setSavingSettle] = useState(false);
  const [settleError, setSettleError] = useState("");

  const load = useCallback(async () => {
    if (!groupID) return;
    setLoading(true);
    setError(null);
    setSectionError(null);
    setBreakdownError(null);
    try {
      const g = await getGroup(groupID);
      setGroup(g);

      const [
        membersResult,
        expensesResult,
        balancesResult,
        settlementsResult,
        breakdownResult,
      ] =
        await Promise.allSettled([
          getGroupMembers(groupID),
          getGroupExpenses(groupID),
          getGroupBalances(groupID),
          getGroupSettlements(groupID),
          getGroupDebtBreakdown(groupID),
        ]);

      const nextExpenses =
        expensesResult.status === "fulfilled" ? expensesResult.value : [];

      if (membersResult.status === "fulfilled") {
        setMembers(membersResult.value);
      }
      setExpenses(nextExpenses);
      setBalances(balancesResult.status === "fulfilled" ? balancesResult.value : {});
      setSettlements(
        settlementsResult.status === "fulfilled" ? settlementsResult.value : []
      );
      setDebtBreakdown(
        breakdownResult.status === "fulfilled" ? breakdownResult.value : null
      );

      if (
        membersResult.status === "rejected" ||
        expensesResult.status === "rejected" ||
        balancesResult.status === "rejected" ||
        settlementsResult.status === "rejected"
      ) {
        const detailErrors = [
          membersResult.status === "rejected"
            ? getApiErrorMessage(membersResult.reason, "Members could not be loaded.")
            : null,
          expensesResult.status === "rejected"
            ? getApiErrorMessage(expensesResult.reason, "Expenses could not be loaded.")
            : null,
          balancesResult.status === "rejected"
            ? getApiErrorMessage(balancesResult.reason, "Balances could not be loaded.")
            : null,
          settlementsResult.status === "rejected"
            ? getApiErrorMessage(
                settlementsResult.reason,
                "Settlements could not be loaded."
              )
            : null,
        ].filter(Boolean);

        setSectionError(detailErrors.join(" "));
      }

      if (breakdownResult.status === "rejected") {
        setBreakdownError(
          getApiErrorMessage(
            breakdownResult.reason,
            "Expense breakdown could not be loaded."
          )
        );
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load group."));
    } finally {
      setLoading(false);
    }
  }, [groupID]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const resetExpenseForm = () => {
    setEditingExpense(null);
    setExpTitle("");
    setExpAmount("");
    setExpSplitType("equal");
    setSplitInputs({});
    setExpError("");
  };

  const openAddExpense = () => {
    resetExpenseForm();
    setShowExpenseModal(true);
  };

  const buildExpensePayload = (): GroupExpenseCreate | null => {
    const amount = parseFloat(expAmount);
    if (!expTitle.trim() || !Number.isFinite(amount) || amount <= 0) {
      setExpError("Enter a title and an amount greater than zero.");
      return null;
    }

    const payload: GroupExpenseCreate = {
      title: expTitle.trim(),
      amount,
      split_type: expSplitType,
    };

    if (splitParticipantIds.length === 0) {
      setExpError("Load or add group members before saving an expense.");
      return null;
    }

    if (expSplitType === "equal") {
      payload.equal_member_ids = splitParticipantIds;
      return payload;
    }

    const splits = Object.fromEntries(
      splitParticipantIds.map((userId) => [userId, Number(splitInputs[userId] || 0)])
    );

    if (Object.values(splits).some((value) => !Number.isFinite(value) || value < 0)) {
      setExpError("Split values must be zero or greater.");
      return null;
    }

    const total = Object.values(splits).reduce((sum, value) => sum + value, 0);
    const expectedTotal = expSplitType === "exact" ? amount : 100;

    if (Math.abs(total - expectedTotal) > 0.01) {
      setExpError(
        expSplitType === "exact"
          ? `Exact splits must add up to ${formatAmount(amount)}.`
          : "Percentages must add up to 100%."
      );
      return null;
    }

    payload.splits_input = splits;
    return payload;
  };

  const refreshBalances = async () => {
    try {
      setBalances(await getGroupBalances(groupID));
    } catch {
      setSectionError("Balances could not be refreshed yet.");
    }
  };

  const handleSaveExpense = async () => {
    const payload = buildExpensePayload();
    if (!payload) return;

    setSavingExp(true);
    setExpError("");
    try {
      if (editingExpense) {
        const updated = await updateGroupExpense(groupID, editingExpense.id, payload);
        setExpenses((prev) =>
          prev.map((expense) => (expense.id === updated.id ? updated : expense))
        );
        if (detailExpense?.id === updated.id) {
          await handleViewExpense(updated);
        }
      } else {
        const created = await createGroupExpense(groupID, payload);
        setExpenses((prev) => [created, ...prev]);
      }

      setShowExpenseModal(false);
      resetExpenseForm();
      await refreshBalances();
    } catch {
      setExpError("Could not save expense. Check details and try again.");
    } finally {
      setSavingExp(false);
    }
  };

  const handleViewExpense = async (expense: GroupExpense) => {
    setDetailExpense(expense);
    setDetailSplits([]);
    setDetailError("");
    setLoadingDetails(true);

    try {
      const details = await getGroupExpenseWithSplits(groupID, expense.id);
      setDetailExpense(details.expense);
      setDetailSplits(details.splits);
    } catch {
      setDetailError("Could not load split details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditExpense = async (expense: GroupExpense) => {
    setEditingExpense(expense);
    setExpTitle(expense.title);
    setExpAmount(String(expense.amount));
    setExpSplitType(expense.split_type);
    setExpError("");
    setSplitInputs({});
    setShowExpenseModal(true);

    try {
      const details = await getGroupExpenseWithSplits(groupID, expense.id);
      const amount = Number(details.expense.amount);
      const nextInputs = Object.fromEntries(
        details.splits.map((split) => [
          split.user_id,
          expense.split_type === "percentage" && amount > 0
            ? ((Number(split.amount) / amount) * 100).toFixed(2)
            : String(split.amount),
        ])
      );
      setSplitInputs(nextInputs);
    } catch {
      setExpError("Could not load existing splits. You can still save a new split.");
    }
  };

  const handleDeleteExpense = async (expId: string) => {
    try {
      await deleteGroupExpense(groupID, expId);
      setExpenses((prev) => prev.filter((e) => e.id !== expId));
      const bal = await getGroupBalances(groupID);
      setBalances(bal);
    } catch {
      // silently fail
    }
  };

  const handleAddMember = async () => {
    if (!memberCode.trim()) return;
    setSavingMember(true);
    setMemberError("");
    try {
      const m = await addGroupMember(groupID, memberCode.trim());
      setMembers((prev) => [...prev, m]);
      setShowAddMember(false);
      setMemberCode("");
    } catch {
      setMemberError("Could not add member. Check the user code.");
    } finally {
      setSavingMember(false);
    }
  };

  const handleSettle = async () => {
    if (!settleReceiver || !settleAmount) return;
    setSavingSettle(true);
    setSettleError("");
    try {
      await createSettlement(groupID, {
        receiver_id: settleReceiver,
        amount: parseFloat(settleAmount),
      });
      const [set, bal] = await Promise.all([
        getGroupSettlements(groupID),
        getGroupBalances(groupID),
      ]);
      setSettlements(set);
      setBalances(bal);
      setShowSettle(false);
      setSettleReceiver("");
      setSettleAmount("");
    } catch {
      setSettleError("Could not record settlement.");
    } finally {
      setSavingSettle(false);
    }
  };

  const memberNames = useMemo(
    () =>
      Object.fromEntries(
        members.map((member) => [
          member.user_id,
          member.name?.trim() || member.user_id.slice(0, 8),
        ])
      ),
    [members]
  );

  const detailedBreakdown = useMemo(() => {
    if (!debtBreakdown?.breakdown) return [];

    return Object.entries(debtBreakdown.breakdown)
      .map(([debtorId, creditors]) => {
        const creditorEntries = Object.entries(creditors)
          .map(([creditorId, items]) => {
            const sortedItems = [...items].sort(
              (left, right) => Number(right.amount) - Number(left.amount)
            );
            const total = sortedItems.reduce(
              (sum, item) => sum + Number(item.amount),
              0
            );

            return {
              creditorId,
              items: sortedItems,
              total,
            };
          })
          .filter(({ items }) => items.length > 0)
          .sort((left, right) => right.total - left.total);

        const total = creditorEntries.reduce((sum, entry) => sum + entry.total, 0);

        return {
          debtorId,
          creditors: creditorEntries,
          total,
        };
      })
      .filter(({ creditors }) => creditors.length > 0)
      .sort((left, right) => right.total - left.total);
  }, [debtBreakdown]);

  const splitParticipantIds = (() => {
    const ids = new Set<string>();

    members.forEach((member) => ids.add(member.user_id));
    if (currentUser?.id) ids.add(currentUser.id);
    Object.keys(balances).forEach((id) => ids.add(id));
    expenses.forEach((expense) => ids.add(expense.paid_by));
    settlements.forEach((settlement) => {
      ids.add(settlement.payer_id);
      ids.add(settlement.receiver_id);
    });

    return [...ids];
  })();

  const userName = (id: string) => {
    if (id === currentUser?.id) return currentUser.name;
    return memberNames[id] ?? id.slice(0, 8);
  };

  const fillSplitsEqually = () => {
    if (splitParticipantIds.length === 0) return;

    if (expSplitType === "exact") {
      const amount = Number(expAmount || 0);
      const values = splitEvenly(amount, splitParticipantIds.length);
      setSplitInputs(
        Object.fromEntries(
          splitParticipantIds.map((userId, index) => [userId, values[index] ?? "0.00"])
        )
      );
      return;
    }

    const values = splitEvenly(100, splitParticipantIds.length);
    setSplitInputs(
      Object.fromEntries(
        splitParticipantIds.map((userId, index) => [userId, values[index] ?? "0.00"])
      )
    );
  };

  const selectSplitType = (splitType: SplitType) => {
    setExpSplitType(splitType);
    setExpError("");
  };

  const isCreator = group?.created_by === currentUser?.id;

  // Parse balances: positive = others owe you, negative = you owe
  const myBalances = Object.entries(balances).filter(([uid]) => uid !== currentUser?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin" style={{ color: "var(--evven-accent-primary)" }} />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-sm" style={{ color: "var(--evven-error)" }}>
        {error ?? "Group not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--evven-background)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Back + Header */}
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
                {members.length} member{members.length !== 1 ? "s" : ""} · {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowAddMember(true)}
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
                onClick={openAddExpense}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "var(--evven-accent-primary)" }}
              >
                <Plus size={14} />
                Expense
              </button>
            </div>
          </div>
        </div>

        {/* Partial load warning */}
        {sectionError && (
          <div
            className="mb-5 rounded-2xl border px-4 py-3 text-sm"
            style={{
              background: "#FFF8E7",
              borderColor: "#F3D08A",
              color: "#7A4A00",
            }}
          >
            {sectionError}
          </div>
        )}

        {/* My net balance summary */}
        {myBalances.length > 0 && (
          <div
            className="rounded-2xl p-4 mb-5 border"
            style={{ background: "white", borderColor: "var(--evven-border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--evven-text-muted)" }}>
              Your balances
            </p>
            <div className="space-y-2">
              {Object.entries(balances)
                .filter(([uid]) => uid !== currentUser?.id)
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
                          {owesYou ? `owes you ${formatAmount(Math.abs(n))}` : `you owe ${formatAmount(Math.abs(n))}`}
                        </span>
                        {!owesYou && (
                          <button
                            onClick={() => {
                              setSettleReceiver(uid);
                              setSettleAmount(Math.abs(n).toFixed(2));
                              setShowSettle(true);
                            }}
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
        )}

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-5"
          style={{ background: "var(--evven-surface)" }}
        >
          {(["expenses", "balances", "members"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
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

        {/* Tab: Expenses */}
        {tab === "expenses" && (
          <div>
            {expenses.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <Receipt size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
                <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>No expenses yet</p>
                <p className="text-xs mb-4" style={{ color: "var(--evven-text-muted)" }}>
                  Log the first expense for this group.
                </p>
                <button
                  onClick={openAddExpense}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--evven-accent-primary)" }}
                >
                  <Plus size={14} />
                  Add expense
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => void handleViewExpense(exp)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        void handleViewExpense(exp);
                      }
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all hover:opacity-80"
                    style={{ background: "white", borderColor: "var(--evven-border)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--evven-accent-secondary)" }}
                    >
                      <Receipt size={15} style={{ color: "var(--evven-accent-primary)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                        {exp.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                        Paid by {userName(exp.paid_by)} · {formatDate(exp.created_at)} · {exp.split_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                        {formatAmount(exp.amount)}
                      </span>
                      {exp.paid_by === currentUser?.id && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleEditExpense(exp);
                          }}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--evven-surface)]"
                        >
                          <Edit3 size={13} style={{ color: "var(--evven-text-muted)" }} />
                        </button>
                      )}
                      {(isCreator || exp.paid_by === currentUser?.id) && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDeleteExpense(exp.id);
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
            )}
          </div>
        )}

        {/* Tab: Balances */}
        {tab === "balances" && (
          <div>
            {Object.keys(balances).length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{ background: "white", borderColor: "var(--evven-border)" }}
              >
                <Scale size={20} className="mx-auto mb-3" style={{ color: "var(--evven-text-muted)" }} />
                <p className="text-sm font-medium mb-1" style={{ color: "var(--evven-text-primary)" }}>All settled up</p>
                <p className="text-xs" style={{ color: "var(--evven-text-muted)" }}>No outstanding balances in this group.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(balances).map(([uid, bal]) => {
                  const n = parseFloat(bal);
                  const isMe = uid === currentUser?.id;
                  const isPos = n > 0;
                  const colorIdx = members.findIndex((m) => m.user_id === uid) % COLORS.length;
                  const color = COLORS[Math.max(0, colorIdx)];
                  return (
                    <div
                      key={uid}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
                      style={{ background: "white", borderColor: "var(--evven-border)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {getInitials(userName(uid))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                          {userName(uid)}{isMe ? " (you)" : ""}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: isPos ? "#0F6E56" : "#A32D2D" }}>
                          {n === 0 ? "settled" : isPos ? `gets back ${formatAmount(Math.abs(n))}` : `owes ${formatAmount(Math.abs(n))}`}
                        </p>
                      </div>
                      {n !== 0 && !isMe && !isPos && (
                        <button
                          onClick={() => {
                            setSettleReceiver(uid);
                            setSettleAmount(Math.abs(n).toFixed(2));
                            setShowSettle(true);
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-white flex-shrink-0"
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

            {/* Past settlements */}
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
                      <CheckCircle size={15} style={{ color: "#0F6E56" }} className="flex-shrink-0" />
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
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--evven-text-muted)" }}>
                Expense breakdown
              </p>
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
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "var(--evven-surface)", color: "var(--evven-text-muted)" }}>
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
                              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
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
                                  <span className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--evven-text-primary)" }}>
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
        )}

        {/* Tab: Members */}
        {tab === "members" && (
          <div className="space-y-2">
            {members.map((m, i) => {
              const color = COLORS[i % COLORS.length];
              const isCreatorMember = m.user_id === group.created_by;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
                  style={{ background: "white", borderColor: "var(--evven-border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {getInitials(userName(m.user_id))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--evven-text-primary)" }}>
                      {userName(m.user_id)}
                      {m.user_id === currentUser?.id ? " (you)" : ""}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--evven-text-muted)" }}>
                      {isCreatorMember ? "Admin" : "Member"} · Joined {formatDate(m.joined_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setShowAddMember(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium border-dashed transition-all hover:opacity-70"
              style={{ borderColor: "var(--evven-border)", color: "var(--evven-text-muted)" }}
            >
              <UserPlus size={15} />
              Add member
            </button>
          </div>
        )}
      </div>

      {/* Expense Details Modal */}
      {detailExpense && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDetailExpense(null)} />
          <div
            className="relative w-full max-w-md rounded-3xl p-6 shadow-xl"
            style={{ background: "white", border: "1px solid var(--evven-border)" }}
          >
            <button onClick={() => setDetailExpense(null)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
              <X size={15} />
            </button>

            <div className="pr-8">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--evven-text-muted)" }}>
                Expense details
              </p>
              <h2 className="text-lg font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                {detailExpense.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--evven-text-muted)" }}>
                Paid by {userName(detailExpense.paid_by)} · {formatDate(detailExpense.created_at)}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: "var(--evven-surface)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Total</p>
                <p className="text-base font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                  {formatAmount(detailExpense.amount)}
                </p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "var(--evven-surface)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--evven-text-muted)" }}>Split</p>
                <p className="text-base font-semibold capitalize" style={{ color: "var(--evven-text-primary)" }}>
                  {detailExpense.split_type}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--evven-text-muted)" }}>
                Breakdown
              </p>
              {loadingDetails ? (
                <div className="flex h-20 items-center justify-center">
                  <Loader2 size={18} className="animate-spin" style={{ color: "var(--evven-accent-primary)" }} />
                </div>
              ) : detailError ? (
                <p className="text-sm" style={{ color: "var(--evven-error)" }}>{detailError}</p>
              ) : (
                <div className="space-y-2">
                  {detailSplits.map((split) => (
                    <div key={split.id} className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "var(--evven-surface)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                        {userName(split.user_id)}
                        {split.user_id === currentUser?.id ? " (you)" : ""}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--evven-text-primary)" }}>
                        {formatAmount(split.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {detailExpense.paid_by === currentUser?.id && (
              <button
                onClick={() => void handleEditExpense(detailExpense)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white"
                style={{ background: "var(--evven-accent-primary)" }}
              >
                <Edit3 size={15} />
                Edit expense
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowExpenseModal(false)} />
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-xl"
            style={{ background: "white", border: "1px solid var(--evven-border)" }}
          >
            <button onClick={() => setShowExpenseModal(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
              <X size={15} />
            </button>
            <h2 className="text-base font-semibold mb-4" style={{ color: "var(--evven-text-primary)" }}>
              {editingExpense ? "Edit expense" : "Add expense"}
            </h2>

            <div className="space-y-3">
              <input
                autoFocus
                type="text"
                placeholder="What was it for?"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--evven-text-muted)" }}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                  style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
                />
              </div>
              <div className="flex gap-2">
                {(["equal", "exact", "percentage"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => selectSplitType(t)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                    style={{
                      background: expSplitType === t ? "var(--evven-accent-primary)" : "var(--evven-surface)",
                      color: expSplitType === t ? "white" : "var(--evven-text-muted)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {expSplitType !== "equal" && (
                <div className="rounded-2xl border p-3" style={{ borderColor: "var(--evven-border)" }}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
                      {expSplitType === "exact" ? "Exact amounts" : "Percentages"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium" style={{ color: "var(--evven-text-muted)" }}>
                        {expSplitType === "exact"
                          ? `${formatAmount(Object.values(splitInputs).reduce((sum, value) => sum + Number(value || 0), 0))} / ${formatAmount(Number(expAmount || 0))}`
                          : `${Object.values(splitInputs).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(2)}% / 100%`}
                      </p>
                      <button
                        type="button"
                        onClick={fillSplitsEqually}
                        disabled={splitParticipantIds.length === 0}
                        className="rounded-lg px-2 py-1 text-xs font-medium disabled:opacity-50"
                        style={{
                          background: "var(--evven-surface)",
                          color: "var(--evven-text-primary)",
                        }}
                      >
                        Fill equally
                      </button>
                    </div>
                  </div>
                  {splitParticipantIds.length === 0 ? (
                    <p className="rounded-xl px-3 py-2 text-xs" style={{ background: "var(--evven-surface)", color: "var(--evven-error)" }}>
                      Group members are still loading. Try again in a moment.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {splitParticipantIds.map((userId) => (
                      <div key={userId} className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium" style={{ color: "var(--evven-text-primary)" }}>
                            {userName(userId)}
                            {userId === currentUser?.id ? " (you)" : ""}
                          </p>
                        </div>
                        <div className="relative w-28">
                          {expSplitType === "exact" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--evven-text-muted)" }}>₹</span>
                          )}
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={splitInputs[userId] ?? ""}
                            onChange={(event) =>
                              setSplitInputs((current) => ({
                                ...current,
                                [userId]: event.target.value,
                              }))
                            }
                            className={`w-full rounded-xl border py-2 text-right text-sm outline-none focus:ring-2 ${expSplitType === "exact" ? "pl-6 pr-3" : "px-3"}`}
                            style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
                          />
                          {expSplitType === "percentage" && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--evven-text-muted)" }}>%</span>
                          )}
                        </div>
                      </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {expError && <p className="text-xs mt-2" style={{ color: "var(--evven-error)" }}>{expError}</p>}

            <button
              onClick={handleSaveExpense}
              disabled={!expTitle.trim() || !expAmount || savingExp}
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              {savingExp ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {savingExp ? "Saving…" : editingExpense ? "Save changes" : "Add expense"}
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddMember(false)} />
          <div
            className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
            style={{ background: "white", border: "1px solid var(--evven-border)" }}
          >
            <button onClick={() => setShowAddMember(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
              <X size={15} />
            </button>
            <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>Add member</h2>
            <p className="text-sm mb-4" style={{ color: "var(--evven-text-muted)" }}>
              Enter the person&apos;s user code — they can find it in their profile.
            </p>
            <input
              autoFocus
              type="text"
              placeholder="e.g. USR-XXXX"
              value={memberCode}
              onChange={(e) => setMemberCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 mb-3"
              style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
            />
            {memberError && <p className="text-xs mb-2" style={{ color: "var(--evven-error)" }}>{memberError}</p>}
            <button
              onClick={handleAddMember}
              disabled={!memberCode.trim() || savingMember}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              {savingMember ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
              {savingMember ? "Adding…" : "Add member"}
            </button>
          </div>
        </div>
      )}

      {/* Settle Modal */}
      {showSettle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSettle(false)} />
          <div
            className="relative w-full max-w-sm rounded-3xl p-6 shadow-xl"
            style={{ background: "white", border: "1px solid var(--evven-border)" }}
          >
            <button onClick={() => setShowSettle(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ background: "var(--evven-surface)" }}>
              <X size={15} />
            </button>
            <h2 className="text-base font-semibold mb-1" style={{ color: "var(--evven-text-primary)" }}>Record settlement</h2>
            <p className="text-sm mb-4" style={{ color: "var(--evven-text-muted)" }}>
              Confirm you paid <strong>{userName(settleReceiver)}</strong>.
            </p>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--evven-text-muted)" }}>₹</span>
              <input
                type="number"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                style={{ borderColor: "var(--evven-border)", background: "var(--evven-surface)", color: "var(--evven-text-primary)" }}
              />
            </div>
            {settleError && <p className="text-xs mb-2" style={{ color: "var(--evven-error)" }}>{settleError}</p>}
            <button
              onClick={handleSettle}
              disabled={!settleAmount || savingSettle}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "var(--evven-accent-primary)" }}
            >
              {savingSettle ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {savingSettle ? "Saving…" : "Mark as settled"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
