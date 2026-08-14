import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown; message?: string } } }).response;
    const data = response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
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
