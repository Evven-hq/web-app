"use client";

import { useState } from "react";
import type { GroupBalances, GroupDebtBreakdown, Settlement } from "@/types";
import type { UserAvatarFn, UserNameFn } from "./group-detail-shared";
import { PastSettlementsPanel } from "./PastSettlementsPanel";
import { ToSettlePanel } from "./ToSettlePanel";
import { ToCollectPanel } from "./ToCollectPanel";
import { BreakdownPanel } from "./BreakdownPanel";
import { SettlementsSubTabs } from "./SettlementsSubTabs";
import {
  buildDetailedBreakdown,
  buildFinalSettlements,
  buildReceivableView,
  formatSettlementLine,
  getDisplayName,
  type SettlementsSubTab,
} from "./settlements-utils";

export function SettlementsTab({
  settlements,
  balances,
  debtBreakdown,
  breakdownError,
  currentUserId,
  userName,
  userAvatar,
  onReloadBreakdown,
}: {
  settlements: Settlement[];
  balances: GroupBalances;
  debtBreakdown: GroupDebtBreakdown | null;
  breakdownError: string | null;
  currentUserId?: string;
  userName: UserNameFn;
  userAvatar: UserAvatarFn;
  onReloadBreakdown: () => void;
}) {
  const [subTab, setSubTab] = useState<SettlementsSubTab>("past");

  const displayName = (userId: string) => getDisplayName(userId, currentUserId, userName);
  const line = (giverId: string, receiverId: string) =>
    formatSettlementLine(giverId, receiverId, currentUserId, userName);
  const finalSettlements = buildFinalSettlements(balances, currentUserId);
  const receivableView = buildReceivableView(balances, currentUserId);
  const detailedBreakdown = buildDetailedBreakdown(debtBreakdown);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <SettlementsSubTabs subTab={subTab} onChange={setSubTab} />

      <div className="min-h-0 flex-1 overflow-hidden">
        {subTab === "past" && (
          <PastSettlementsPanel settlements={settlements} line={line} />
        )}

        {subTab === "final" && (
          <ToSettlePanel rows={finalSettlements} displayName={displayName} line={line} />
        )}

        {subTab === "receivables" && (
          <ToCollectPanel rows={receivableView} displayName={displayName} line={line} />
        )}

        {subTab === "breakdown" && (
          <BreakdownPanel
            breakdown={detailedBreakdown}
            breakdownError={breakdownError}
            displayName={displayName}
            userAvatar={userAvatar}
            onReload={onReloadBreakdown}
          />
        )}
      </div>
    </div>
  );
}
