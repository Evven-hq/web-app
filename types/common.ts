export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type PaymentMethod = "upi" | "cash";