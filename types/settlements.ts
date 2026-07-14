import type { PaymentMode } from "./common";

export interface Settlement {
  id: string;
  group_id: string;
  payer_id: string;
  receiver_id: string;
  amount: string;
  payment_mode?: PaymentMode | null;
}
 
export interface SettlementCreate {
  receiver_id: string;
  amount: number;
  payment_mode?: PaymentMode;
}