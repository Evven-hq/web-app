export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type PaymentMode = "upi" | "cash";