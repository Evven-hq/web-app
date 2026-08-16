"use client";

import { useCallback, useEffect, useMemo, useState, createElement } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import {
  getGroup,
  getGroupMembers,
  getGroupExpenses,
  getUserBalanceInGroup,
  getGroupDebtBreakdown,
  createGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  addGroupMember,
  removeGroupMember,
  getGroupSettlements,
  createSettlement,
  getGroupExpenseWithSplits,
} from "@/services/groups";
import { useAuthStore } from "@/store/auth-store";
import { formatAmount, splitEvenly, colorForId, getInitials } from "./group-detail-utils";
import { getCategoryMeta } from "@/lib/expense-categories";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ExpenseSuccessState } from "@/components/expenses/ExpenseSuccessScreen";
import type {
  Group,
  GroupMember,
  GroupExpense,
  GroupBalances,
  GroupDebtBreakdown,
  Settlement,
  ExpenseSplit,
  GroupExpenseCreate,
  PaymentMethod,
} from "@/types";
import type { Tab } from "./GroupTabs";

export type SplitType = "equal" | "exact" | "percentage";

export function useGroupDetail() {
  const { groupID } = useParams<{ groupID: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const currentUserId = currentUser?.id;

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
  const [expCategory, setExpCategory] = useState("");
  const [expPaymentMethod, setExpPaymentMethod] = useState<PaymentMethod>("upi");
  const [splitInputs, setSplitInputs] = useState<Record<string, string>>({});
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
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
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  // Settle modal
  const [showSettle, setShowSettle] = useState(false);
  const [settleReceiver, setSettleReceiver] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const [settlePaymentMethod, setSettlePaymentMethod] = useState<PaymentMethod>("upi");
  const [savingSettle, setSavingSettle] = useState(false);
  const [settleError, setSettleError] = useState("");

  // Success celebration
  const [success, setSuccess] = useState<ExpenseSuccessState | null>(null);

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
          currentUserId ? getUserBalanceInGroup(groupID, currentUserId) : Promise.resolve({}),
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
  }, [groupID, currentUserId]);

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
    setSelectedParticipants([]);
    setExpCategory("");
    setExpPaymentMethod("upi");
    setSplitInputs({});
    setExpError("");
  };

  const openAddExpense = () => {
    resetExpenseForm();
    setSelectedParticipants(splitParticipantIds);
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
      category: expCategory || undefined,
      payment_method: expPaymentMethod,
    };

    if (selectedParticipants.length === 0) {
      setExpError("Load or add group members before saving an expense.");
      return null;
    }

    if (expSplitType === "equal") {
      payload.participant_ids = selectedParticipants;
      return payload;
    }

    const splits = Object.fromEntries(
      selectedParticipants.map((userId) => [userId, Number(splitInputs[userId] || 0)])
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
    if (!currentUserId) {
      setBalances({});
      return;
    }

    try {
      setBalances(await getUserBalanceInGroup(groupID, currentUserId));
    } catch {
      setSectionError("Balances could not be refreshed yet.");
    }
  };

  const refreshBreakdown = async () => {
    try {
      setBreakdownError(null);
      setDebtBreakdown(await getGroupDebtBreakdown(groupID));
    } catch {
      setBreakdownError("Expense breakdown could not be refreshed yet.");
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
        const category = getCategoryMeta(expCategory);
        setSuccess({
          variant: "group",
          amount: Number(created.amount),
          categoryIcon: createElement(category.icon, { size: 38 }),
          categoryBg: category.bg,
          categoryText: category.text,
          merchant: created.title,
          metaLabel: {
            prefix: "Split with ",
            bold: `${selectedParticipants.length} people`,
            suffix: " · You paid",
          },
          avatars: selectedParticipants.map((userId) => {
            const name = userName(userId);
            const color = colorForId(userId);
            return { initials: getInitials(name), bg: color.bg, text: color.text };
          }),
        });
      }

      setShowExpenseModal(false);
      resetExpenseForm();
      await Promise.all([refreshBalances(), refreshBreakdown()]);
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
    setExpCategory(expense.category ?? "");
    setExpPaymentMethod(expense.payment_method ?? "upi");
    setExpError("");
    setSplitInputs({});
    setShowExpenseModal(true);

    try {
      const details = await getGroupExpenseWithSplits(groupID, expense.id);
      setSelectedParticipants(
        details.splits
          .map((split) => split.user_id)
          .filter((userId) => splitParticipantIds.includes(userId))
      );
      const amount = Number(details.expense.amount);
      const nextInputs = Object.fromEntries(
        details.splits
          .filter((split) => splitParticipantIds.includes(split.user_id))
          .map((split) => [
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
      await Promise.all([refreshBalances(), refreshBreakdown()]);
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
      await refreshBreakdown();
    } catch {
      setMemberError("Could not add member. Check the user code.");
    } finally {
      setSavingMember(false);
    }
  };

  const handleRemoveMember = (member: GroupMember) => {
    setMemberToRemove(member);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    const member = memberToRemove;
    setRemovingMemberId(member.user_id);
    try {
      await removeGroupMember(groupID, member.user_id);
      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      setMemberToRemove(null);
      await Promise.all([refreshBalances(), refreshBreakdown()]);
    } catch {
      setSectionError("Could not remove that member — they may have an outstanding balance.");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleSettle = async () => {
    if (!settleReceiver || !settleAmount || !currentUserId) return;
    setSavingSettle(true);
    setSettleError("");
    try {
      const receiverName = userName(settleReceiver);
      const receiverId = settleReceiver;
      const amount = parseFloat(settleAmount);
      const paymentMethod = settlePaymentMethod;
      await createSettlement(groupID, {
        receiver_id: receiverId,
        amount,
        payment_method: paymentMethod,
      });
      const [set, bal] = await Promise.all([
        getGroupSettlements(groupID),
        getUserBalanceInGroup(groupID, currentUserId),
      ]);
      setSettlements(set);
      setBalances(bal);
      await refreshBreakdown();
      setShowSettle(false);
      setSettleReceiver("");
      setSettleAmount("");
      setSettlePaymentMethod("upi");
      const color = colorForId(receiverId);
      setSuccess({
        variant: "settlement",
        amount,
        categoryIcon: createElement(Check, { size: 38 }),
        categoryBg: "var(--evven-success-bg)",
        categoryText: "var(--evven-success-text)",
        merchant: `Settled with ${receiverName}`,
        metaLabel: {
          prefix: "You paid ",
          bold: receiverName,
          suffix: ` · ${paymentMethod.toUpperCase()}`,
        },
        avatars: [{ initials: getInitials(receiverName), bg: color.bg, text: color.text }],
      });
    } catch {
      setSettleError("Could not record settlement.");
    } finally {
      setSavingSettle(false);
    }
  };

  const openSettle = (userId: string, amount: number) => {
    setSettleReceiver(userId);
    setSettleAmount(amount.toFixed(2));
    setSettlePaymentMethod("upi");
    setShowSettle(true);
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

  const memberAvatars = useMemo(
    () =>
      Object.fromEntries(
        members.map((member) => [member.user_id, member.profile_picture ?? null])
      ),
    [members]
  );

  const splitParticipantIds = (() => {
    const ids = new Set<string>();

    members.forEach((member) => ids.add(member.user_id));
    if (currentUserId) ids.add(currentUserId);

    return [...ids];
  })();

  const userName = (id: string) => {
    if (id === currentUserId) return currentUser?.name ?? id.slice(0, 8);
    return memberNames[id] ?? id.slice(0, 8);
  };

  const userAvatar = (id: string) => {
    if (id === currentUserId) return currentUser?.profile_picture ?? null;
    return memberAvatars[id] ?? null;
  };

  const fillSplitsEqually = () => {
    if (selectedParticipants.length === 0) return;

    if (expSplitType === "exact") {
      const amount = Number(expAmount || 0);
      const values = splitEvenly(amount, selectedParticipants.length);
      setSplitInputs(
        Object.fromEntries(
          selectedParticipants.map((userId, index) => [userId, values[index] ?? "0.00"])
        )
      );
      return;
    }

    const values = splitEvenly(100, selectedParticipants.length);
    setSplitInputs(
      Object.fromEntries(
        selectedParticipants.map((userId, index) => [userId, values[index] ?? "0.00"])
      )
    );
  };

  const selectSplitType = (splitType: SplitType) => {
    setExpSplitType(splitType);
    setExpError("");
  };

  const isCreator = group?.created_by === currentUserId;

  return {
    currentUserId,
    tab,
    setTab,
    group,
    loading,
    error,
    sectionError,
    expenses,
    balances,
    debtBreakdown,
    breakdownError,
    settlements,
    members,
    userName,
    userAvatar,
    isCreator,
    showExpenseModal,
    setShowExpenseModal,
    editingExpense,
    expTitle,
    setExpTitle,
    expAmount,
    setExpAmount,
    expSplitType,
    expCategory,
    setExpCategory,
    expPaymentMethod,
    setExpPaymentMethod,
    splitInputs,
    setSplitInputs,
    selectedParticipants,
    setSelectedParticipants,
    splitParticipantIds,
    savingExp,
    expError,
    detailExpense,
    setDetailExpense,
    detailSplits,
    loadingDetails,
    detailError,
    showAddMember,
    setShowAddMember,
    memberCode,
    setMemberCode,
    savingMember,
    memberError,
    removingMemberId,
    memberToRemove,
    setMemberToRemove,
    showSettle,
    setShowSettle,
    settleReceiver,
    settleAmount,
    setSettleAmount,
    settlePaymentMethod,
    setSettlePaymentMethod,
    savingSettle,
    settleError,
    openAddExpense,
    handleSaveExpense,
    handleViewExpense,
    handleEditExpense,
    handleDeleteExpense,
    handleAddMember,
    handleRemoveMember,
    confirmRemoveMember,
    handleSettle,
    openSettle,
    selectSplitType,
    fillSplitsEqually,
    refreshBreakdown,
    success,
    setSuccess,
  };
}
