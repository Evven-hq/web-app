import type { PaymentMethod } from "./common";

export interface Settlement {
  id: string;
  group_id: string;
  payer_id: string;
  receiver_id: string;
  amount: string;
  payment_method?: PaymentMethod | null;
}
 
export interface SettlementCreate {
  receiver_id: string;
  amount: number;
  payment_method?: PaymentMethod;
}