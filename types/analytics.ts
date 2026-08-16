export interface PersonalAnalytics {
  total_spent: number;
  expense_count: number;
  spending_by_category: Record<string, number>;
  // Backend dependency: consecutive days with >=1 logged expense, served from
  // /expenses/personal-data. Absent until the backend ships it — see the streak
  // fallback in the expense success screen task.
  current_streak?: number;
}

// Map of user_id → net balance (positive = others paid more, negative = you paid more)
export type GroupBalances = Record<string, string | number>;
