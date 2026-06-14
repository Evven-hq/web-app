import api from "@/lib/api";
import type { User } from "@/types";

export interface UserUpdate {
  name?: string;
  profile_picture?: string | null;
}

export async function updateCurrentUser(data: UserUpdate): Promise<User> {
  const response = await api.put<User>("/users/me", data);
  return response.data;
}
