"use client";

import {
  BalanceSummary,
  BalancesTab,
  ExpensesTab,
  GroupHeader,
  GroupTabs,
  MembersTab,
  SectionWarning,
  SettlementsTab,
} from "@/components/groups/GroupDetailSections";
import {
  AddMemberModal,
  ExpenseDetailsModal,
  ExpenseEditorModal,
  ConfirmRemoveMemberModal,
  SettleModal,
} from "@/components/groups/GroupDetailModals";
import { useGroupDetail } from "@/components/groups/useGroupDetail";
import { GroupDetailSkeleton } from "@/components/groups/GroupDetailSkeleton";
import { ExpenseSuccessScreen } from "@/components/expenses/ExpenseSuccessScreen";

export default function GroupDetailPage() {
  const {
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
  } = useGroupDetail();

  if (loading) {
    return <GroupDetailSkeleton />;
  }

  if (error || !group) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-8 text-sm"
        style={{ color: "var(--evven-error)" }}
      >
        {error ?? "Group not found."}
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-hidden"
      style={{ background: "var(--evven-background)" }}
    >
      <div className="mx-auto flex h-full max-w-2xl flex-col px-4 py-6">
        <div className="shrink-0">
          <GroupHeader
            group={group}
            members={members}
            membersCount={members.length}
            expensesCount={expenses.length}
            userName={userName}
            userAvatar={userAvatar}
            onAddMember={() => setShowAddMember(true)}
            onAddExpense={openAddExpense}
          />

          {sectionError && <SectionWarning message={sectionError} />}

          <BalanceSummary
            balances={balances}
            currentUserId={currentUserId}
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
              members={members}
              userName={userName}
              userAvatar={userAvatar}
              onSettle={openSettle}
            />
          )}

          {tab === "settlements" && (
            <SettlementsTab
              settlements={settlements}
              balances={balances}
              debtBreakdown={debtBreakdown}
              breakdownError={breakdownError}
              currentUserId={currentUserId}
              userName={userName}
              userAvatar={userAvatar}
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
              userAvatar={userAvatar}
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
        expPaymentMethod={expPaymentMethod}
        setExpPaymentMethod={setExpPaymentMethod}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
        splitInputs={splitInputs}
        setSplitInputs={setSplitInputs}
        splitParticipantIds={splitParticipantIds}
        currentUserId={currentUserId}
        userName={userName}
        userAvatar={userAvatar}
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
        removing={Boolean(
          memberToRemove && removingMemberId === memberToRemove.user_id,
        )}
      />

      <SettleModal
        open={showSettle}
        onClose={() => setShowSettle(false)}
        settleReceiver={settleReceiver}
        settleAmount={settleAmount}
        setSettleAmount={setSettleAmount}
        settlePaymentMethod={settlePaymentMethod}
        setSettlePaymentMethod={setSettlePaymentMethod}
        userName={userName}
        onSubmit={handleSettle}
        savingSettle={savingSettle}
        settleError={settleError}
      />

      {success ? (
        <ExpenseSuccessScreen
          open
          {...success}
          onDone={() => setSuccess(null)}
        />
      ) : null}
    </div>
  );
}
