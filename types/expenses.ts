export interface PersonalExpense {
  id: string;
  user_id: string;
  group_id: string | null;
  group_expense_id: string | null;
  title: string;
  amount: string;
  category: string | null;
  date: string | null;
  notes: string | null;
  created_at: string;
}
 
export interface GroupExpense {
  id: string;
  group_id: string;
  paid_by: string;
  title: string;
  amount: string;
  split_type: string;
  created_at: string;
}
 
export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount: string;
}
 
export interface PersonalExpenseCreate {
  title: string;
  amount: number;
  category?: string;
  date?: string;
  notes?: string;
}
 
export interface PersonalExpenseUpdate {
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
}
 
export interface GroupExpenseCreate {
  title: string;
  amount: number;
  split_type: "equal" | "exact" | "percentage";
  splits_input?: Record<string, number>;
  equal_member_ids?: string[];
}
 