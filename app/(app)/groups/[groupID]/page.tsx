"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  removeGroupMember,
  getGroupSettlements,
  createSettlement,
  getGroupExpenseWithSplits,
} from "@/services/groups";
import { useAuthStore } from "@/store/auth-store";
import { formatAmount, splitEvenly } from "@/components/groups/group-detail-utils";
import {
  BalanceSummary,
  BalancesTab,
  ExpensesTab,
  GroupHeader,
  GroupTabs,
  MembersTab,
  SectionWarning,
  SettlementsTab,
  type Tab,
} from "@/components/groups/GroupDetailSections";
import {
  AddMemberModal,
  ExpenseDetailsModal,
  ExpenseEditorModal,
  ConfirmRemoveMemberModal,
  SettleModal,
} from "@/components/groups/GroupDetailModals";
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
type SplitType = "equal" | "exact" | "percentage";

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

export default function GroupDetailPage() {
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
    setSelectedParticipants([]);
    setExpCategory("");
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
    try {
      setBalances(await getGroupBalances(groupID));
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
    setExpError("");
    setSplitInputs({});
    setShowExpenseModal(true);

    try {
      const details = await getGroupExpenseWithSplits(groupID, expense.id);
      setSelectedParticipants(details.splits.map((split) => split.user_id));
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
      await refreshBreakdown();
      setShowSettle(false);
      setSettleReceiver("");
      setSettleAmount("");
    } catch {
      setSettleError("Could not record settlement.");
    } finally {
      setSavingSettle(false);
    }
  };

  const openSettle = (userId: string, amount: number) => {
    setSettleReceiver(userId);
    setSettleAmount(amount.toFixed(2));
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

  const payableDebts = (() => {
    if (!currentUserId || !debtBreakdown?.simplified?.[currentUserId]) return {};

    return Object.fromEntries(
      Object.entries(debtBreakdown.simplified[currentUserId])
        .map(([userId, amount]): [string, number] => [userId, Number(amount)])
        .filter(([, amount]) => Number.isFinite(amount) && amount > 0.01)
    );
  })();

  const splitParticipantIds = (() => {
    const ids = new Set<string>();

    members.forEach((member) => ids.add(member.user_id));
    if (currentUserId) ids.add(currentUserId);
    Object.keys(balances).forEach((id) => ids.add(id));
    expenses.forEach((expense) => ids.add(expense.paid_by));
    settlements.forEach((settlement) => {
      ids.add(settlement.payer_id);
      ids.add(settlement.receiver_id);
    });

    return [...ids];
  })();

  const userName = (id: string) => {
    if (id === currentUserId) return currentUser?.name ?? id.slice(0, 8);
    return memberNames[id] ?? id.slice(0, 8);
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

  // Parse balances: positive = others owe you, negative = you owe
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
    <div className="h-full overflow-hidden" style={{ background: "var(--evven-background)" }}>
      <div className="mx-auto flex h-full max-w-2xl flex-col px-4 py-6">
        <div className="shrink-0">
          <GroupHeader
            group={group}
            membersCount={members.length}
            expensesCount={expenses.length}
            onAddMember={() => setShowAddMember(true)}
            onAddExpense={openAddExpense}
          />

          {sectionError && <SectionWarning message={sectionError} />}

          <BalanceSummary
            balances={balances}
            currentUserId={currentUserId}
            payableDebts={payableDebts}
            userName={userName}
            onSettle={openSettle}
          />

          <GroupTabs tab={tab} onChange={setTab} />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {tab === "expenses" && (
            <ExpensesTab
              expenses={expenses}
              currentUserId={currentUserId}
              isCreator={isCreator}
              userName={userName}
              onViewExpense={handleViewExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {tab === "balances" && (
            <BalancesTab
              balances={balances}
              currentUserId={currentUserId}
              payableDebts={payableDebts}
              members={members}
              userName={userName}
              onSettle={openSettle}
            />
          )}

          {tab === "settlements" && (
            <SettlementsTab
              settlements={settlements}
              debtBreakdown={debtBreakdown}
              breakdownError={breakdownError}
              userName={userName}
              onReloadBreakdown={refreshBreakdown}
            />
          )}

          {tab === "members" && (
            <MembersTab
              members={members}
              groupCreatedBy={group.created_by}
              currentUserId={currentUserId}
              isCreator={isCreator}
              userName={userName}
              onRemoveMember={handleRemoveMember}
              removingMemberId={removingMemberId}
              onAddMember={() => setShowAddMember(true)}
            />
          )}
        </div>
      </div>

      {detailExpense && (
        <ExpenseDetailsModal
          detailExpense={detailExpense}
          detailSplits={detailSplits}
          loadingDetails={loadingDetails}
          detailError={detailError}
          currentUserId={currentUserId}
          userName={userName}
          onClose={() => setDetailExpense(null)}
          onEditExpense={() => void handleEditExpense(detailExpense)}
          canEdit={detailExpense.paid_by === currentUserId}
        />
      )}

      <ExpenseEditorModal
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        editingExpense={editingExpense}
        expTitle={expTitle}
        setExpTitle={setExpTitle}
        expAmount={expAmount}
        setExpAmount={setExpAmount}
        expSplitType={expSplitType}
        expCategory={expCategory}
        setExpCategory={setExpCategory}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
        splitInputs={splitInputs}
        setSplitInputs={setSplitInputs}
        splitParticipantIds={splitParticipantIds}
        currentUserId={currentUserId}
        userName={userName}
        onSelectSplitType={selectSplitType}
        onFillSplitsEqually={fillSplitsEqually}
        onSave={handleSaveExpense}
        expError={expError}
        savingExp={savingExp}
      />

      <AddMemberModal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        memberCode={memberCode}
        setMemberCode={setMemberCode}
        onSubmit={handleAddMember}
        savingMember={savingMember}
        memberError={memberError}
      />

      <ConfirmRemoveMemberModal
        member={memberToRemove}
        memberName={memberToRemove ? userName(memberToRemove.user_id) : ""}
        onClose={() => setMemberToRemove(null)}
        onConfirm={confirmRemoveMember}
        removing={Boolean(memberToRemove && removingMemberId === memberToRemove.user_id)}
      />

      <SettleModal
        open={showSettle}
        onClose={() => setShowSettle(false)}
        settleReceiver={settleReceiver}
        settleAmount={settleAmount}
        setSettleAmount={setSettleAmount}
        userName={userName}
        onSubmit={handleSettle}
        savingSettle={savingSettle}
        settleError={settleError}
      />
    </div>
  );
}
