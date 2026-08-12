import api from "@/lib/api";
import type { User } from "@/types";

export interface UserUpdate {
  name?: string;
  profile_picture?: string | null;
  preferred_theme?: string | null;
}

export interface UpdateCurrentUserOptions {
  timeoutMs?: number;
}

export async function updateCurrentUser(
  data: UserUpdate,
  options?: UpdateCurrentUserOptions,
): Promise<User> {
  const response = await api.put<User>(
    "/users/me",
    data,
    options?.timeoutMs ? { timeout: options.timeoutMs } : undefined,
  );
  return response.data;
}
