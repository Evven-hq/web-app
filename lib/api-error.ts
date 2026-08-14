import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    const message = response?.data?.message;
    if (message) return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getAxiosDetailMessage(error: unknown, fallback = "Something went wrong") {
  if (isAxiosError<{ detail?: string }>(error) && typeof error.response?.data?.detail === "string") {
    return error.response.data.detail;
  }

  return fallback;
}
