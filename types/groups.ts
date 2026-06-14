export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}
 
export interface GroupMember {
  id: string;
  group_id: string;
  name: string;
  user_id: string;
  joined_at: string;
}

export interface DebtBreakdownEntry {
  expense_id: string;
  title: string;
  amount: string | number;
}

export interface GroupDebtBreakdown {
  breakdown: Record<string, Record<string, DebtBreakdownEntry[]>>;
  aggregated: Record<string, Record<string, string | number>>;
  simplified: Record<string, Record<string, string | number>>;
  settled: Record<string, Record<string, string | number>>;
}
