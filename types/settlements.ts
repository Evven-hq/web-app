export interface Settlement {
  id: string;
  group_id: string;
  payer_id: string;
  receiver_id: string;
  amount: string;
}
 
export interface SettlementCreate {
  receiver_id: string;
  amount: number;
}
 