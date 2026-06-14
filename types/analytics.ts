export interface PersonalAnalytics {
  total_spent: number;
  expense_count: number;
  spending_by_category: Record<string, number>;
}

// Map of user_id → net balance string (positive = owed to you, negative = you owe)
export type GroupBalances = Record<string, string>;