import type { PaymentMethod } from "./common";

export type SplitMode = "equal" | "percentage" | "custom";

export interface SplitParticipant {
  friend_id: string;
  split_amount?: number;
  split_percentage?: number;
}

export interface PersonalExpense {
  id: string;
  user_id: string;
  group_id: string | null;
  group_expense_id: string | null;
  friend_id?: string | null;
  friend?: Friend | null;
  ghost_id?: string | null;
  ghost?: Friend | null;
  title: string;
  amount: string;
  category: string | null;
  date: string | null;
  notes: string | null;
  payment_method?: PaymentMethod | null;
  settlement_direction?: SettlementDirection | null;
  settlement_amount?: string | null;
  created_at: string;
}

export type SettlementDirection = "you_owe" | "they_owe";

export interface Friend {
  id: string;
  name: string;
  user_code?: string | null;
  profile_picture?: string | null;
  shadow_group_id?: string | null;
  balance?: string | number | null;
  net_balance?: string | number | null;
  status?: string | null;
  last_activity_at?: string | null;
  created_at?: string;
  updated_at?: string;
  expenses?: FriendActivity[];
  history?: FriendActivity[];
  settlements?: FriendActivity[];
}

export interface GhostCreatePayload {
  name: string;
}

export interface FriendCreateRequestPayload {
  user_code: string;
}

export interface FriendRequest {
  id: string;
  name: string;
  user_code?: string | null;
  profile_picture?: string | null;
  created_by?: string | null;
  created_by_name?: string | null;
  created_by_user_code?: string | null;
  created_at?: string;
  status?: string;
  direction?: "incoming" | "outgoing";
}

export interface FriendRequestsResponse {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}

export interface FriendActivity {
  id: string;
  type?: "expense" | "settlement" | string;
  title: string;
  amount: string | number;
  notes?: string | null;
  date?: string | null;
  created_at?: string;
  payment_method?: PaymentMethod | null;
  settlement_direction?: SettlementDirection | null;
  settlement_amount?: string | number | null;
  direction?: SettlementDirection | null;
  category?: string | null;
}

export interface FriendListItem extends Friend {
  balance?: string | number | null;
}

export interface FriendBalance {
  friend_id?: string;
  id?: string;
  net_balance: string | number;
  status?: string | null;
}

export interface FriendDetail extends Friend {
  balance?: string | number | null;
  history?: FriendActivity[];
  expenses?: FriendActivity[];
  settlements?: FriendActivity[];
}

export type Ghost = Friend;

export interface GhostBalance extends FriendBalance {
  ghost_id?: string;
}

export interface GhostDetail extends FriendDetail {
  expenses: FriendActivity[];
}
 
export interface GroupExpense {
  id: string;
  group_id: string;
  paid_by: string;
  title: string;
  category? : string;
  amount: string;
  split_type: "equal" | "exact" | "percentage";
  payment_method?: PaymentMethod | null;
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
  payment_method?: PaymentMethod;
  friend_id?: string;
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
  payment_method?: PaymentMethod | null;
  friend_id?: string | null;
  ghost_id?: string | null;
  settlement_direction?: SettlementDirection | null;
  settlement_amount?: number | null;
}
 
export interface GroupExpenseCreate {
  title: string;
  amount: number;
  split_type: "equal" | "exact" | "percentage";
  category? : string;
  payment_method?: PaymentMethod;
  splits_input?: Record<string, number>;
  participant_ids?: string[];
}

export interface GroupExpenseUpdate {
  title?: string;
  amount?: number;
  split_type?: "equal" | "exact" | "percentage";
  category? : string;
  payment_method?: PaymentMethod;
  splits_input?: Record<string, number>;
  participant_ids?: string[];
}
