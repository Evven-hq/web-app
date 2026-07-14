import type { PaymentMode } from "./common";

export interface PersonalExpense {
  id: string;
  user_id: string;
  group_id: string | null;
  group_expense_id: string | null;
  ghost_id?: string | null;
  ghost?: Ghost | null;
  title: string;
  amount: string;
  category: string | null;
  date: string | null;
  notes: string | null;
  payment_mode?: PaymentMode | null;
  settlement_direction?: SettlementDirection | null;
  settlement_amount?: string | null;
  created_at: string;
}

export type SettlementDirection = "you_owe" | "they_owe";

export interface Ghost {
  id: string;
  name: string;
  user_code?: string | null;
  shadow_group_id?: string | null;
  net_balance?: string | number | null;
  status?: string | null;
  expenses?: PersonalExpense[];
}

export interface GhostCreatePayload {
  name: string;
}

export interface GhostBalance {
  ghost_id?: string;
  net_balance: string | number;
  status?: string | null;
}

export interface GhostDetail extends Ghost {
  expenses: PersonalExpense[];
}
 
export interface GroupExpense {
  id: string;
  group_id: string;
  paid_by: string;
  title: string;
  category? : string;
  amount: string;
  split_type: "equal" | "exact" | "percentage";
  payment_mode?: PaymentMode | null;
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
  payment_mode?: PaymentMode;
  ghost_id?: string;
  settlement_direction?: SettlementDirection;
  settlement_amount?: number;
}
 
export interface PersonalExpenseUpdate {
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
  notes?: string;
  payment_mode?: PaymentMode | null;
  ghost_id?: string | null;
  settlement_direction?: SettlementDirection | null;
  settlement_amount?: number | null;
}
 
export interface GroupExpenseCreate {
  title: string;
  amount: number;
  split_type: "equal" | "exact" | "percentage";
  category? : string;
  payment_mode?: PaymentMode;
  splits_input?: Record<string, number>;
  participant_ids?: string[];
}

export interface GroupExpenseUpdate {
  title?: string;
  amount?: number;
  split_type?: "equal" | "exact" | "percentage";
  category? : string;
  payment_mode?: PaymentMode;
  splits_input?: Record<string, number>;
  participant_ids?: string[];
}