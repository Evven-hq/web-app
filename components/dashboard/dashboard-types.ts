export type DashboardAnalytics = {
  total_spent: number;
  expense_count: number;
  spending_by_category: Record<string, number>;
};

export type DashboardGroup = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};

export type DashboardExpense = {
  id: string;
  title: string;
  amount: string;
  category: string | null;
  created_at: string;
};

export type DashboardData = {
  analytics: DashboardAnalytics | null;
  groups: DashboardGroup[];
  personalExpenses: DashboardExpense[];
};

export type CategoryEntry = [string, number];
