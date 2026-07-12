import api from "@/lib/api";
import type {
  ApiResponse,
  Ghost,
  GhostBalance,
  GhostCreatePayload,
  GhostDetail,
} from "@/types";

function unwrapData<T>(payload: ApiResponse<T> | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

export async function createGhost(name: string): Promise<Ghost> {
  const payload: GhostCreatePayload = { name };
  const response = await api.post<ApiResponse<Ghost> | Ghost>("/ghosts/", payload);
  return unwrapData(response.data);
}

export async function getGhosts(search?: string): Promise<Ghost[]> {
  const response = await api.get<ApiResponse<Ghost[]> | Ghost[]>("/ghosts/", {
    params: search?.trim() ? { search: search.trim() } : undefined,
  });

  return unwrapData(response.data);
}

export async function getGhostBalance(ghostId: string): Promise<GhostBalance> {
  const response = await api.get<ApiResponse<GhostBalance> | GhostBalance>(
    `/ghosts/${ghostId}/balance`
  );
  return unwrapData(response.data);
}

export async function getGhostDetail(ghostId: string): Promise<GhostDetail> {
  const response = await api.get<ApiResponse<GhostDetail> | GhostDetail>(
    `/ghosts/${ghostId}`
  );
  return unwrapData(response.data);
}

export async function deleteGhost(ghostId: string): Promise<void> {
  await api.delete(`/ghosts/${ghostId}`);
}
