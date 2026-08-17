import api from "@/lib/api";
import type {
  ApiResponse,
  Friend,
  FriendActivity,
  FriendCreateRequestPayload,
  FriendDetail,
  FriendListItem,
  FriendRequest,
  FriendRequestsResponse,
} from "@/types";

const FRIEND_API_BASE = "/friends";

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function asAmount(...values: unknown[]): string | number {
  for (const value of values) {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  return 0;
}

function asNullableString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string") {
      return value;
    }
  }

  return null;
}

function asNullableAmount(...values: unknown[]): string | number | null {
  for (const value of values) {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeActivity(raw: unknown): FriendActivity {
  const item = isPlainObject(raw) ? raw : {};
  return {
    id: asString(item.id ?? item.friend_activity_id ?? item.expense_id ?? crypto.randomUUID?.() ?? ""),
    type: asString(item.type ?? item.kind ?? item.entry_type ?? "expense") as FriendActivity["type"],
    title: asString(item.title ?? item.name ?? item.description ?? "Untitled"),
    amount: asAmount(item.amount, item.net_amount, item.settlement_amount),
    notes: asNullableString(item.notes, item.note),
    date: asNullableString(item.date, item.created_at),
    created_at: asString(item.created_at ?? item.date ?? ""),
    payment_method: item.payment_method as FriendActivity["payment_method"] | null,
    settlement_direction: (item.settlement_direction ?? item.direction ?? null) as
      | FriendActivity["settlement_direction"]
      | null,
    settlement_amount: asNullableAmount(item.settlement_amount),
    direction: asNullableString(item.direction, item.settlement_direction) as FriendActivity["direction"],
    category: asNullableString(item.category),
  };
}

function normalizeFriend(raw: unknown): Friend {
  const friend = isPlainObject(raw) ? raw : {};
  const balance = asNullableAmount(friend.balance, friend.net_balance, friend.current_balance) ?? 0;
  const history = Array.isArray(friend.history)
    ? friend.history.map(normalizeActivity)
    : Array.isArray(friend.expenses)
      ? friend.expenses.map(normalizeActivity)
      : [];
  const settlements = Array.isArray(friend.settlements)
    ? friend.settlements.map(normalizeActivity)
    : [];

  return {
    // The backend routes friend detail/unfriend/expense actions by friendship group id.
    id: asString(friend.group_id ?? friend.id ?? friend.friend_id ?? friend.ghost_id ?? ""),
    name: asString(friend.name ?? friend.full_name ?? friend.display_name ?? "Friend"),
    user_code: friend.user_code === undefined ? null : asString(friend.user_code),
    profile_picture:
      friend.profile_picture === undefined ? null : asString(friend.profile_picture),
    shadow_group_id:
      friend.shadow_group_id === undefined ? null : asString(friend.shadow_group_id),
    balance,
    net_balance: asNullableAmount(friend.net_balance) ?? balance ?? 0,
    status: friend.status === undefined ? null : asString(friend.status),
    last_activity_at:
      friend.last_activity_at === undefined ? null : asString(friend.last_activity_at),
    created_at: friend.created_at === undefined ? undefined : asString(friend.created_at),
    updated_at: friend.updated_at === undefined ? undefined : asString(friend.updated_at),
    expenses: history,
    history: history.length > 0 ? history : settlements,
    settlements,
  };
}

function normalizeFriendList(payload: unknown): FriendListItem[] {
  const rawList = Array.isArray(payload)
    ? payload
    : isPlainObject(payload)
      ? (payload.friends ?? payload.items ?? payload.data ?? payload.results)
      : [];

  return Array.isArray(rawList) ? rawList.map((item) => normalizeFriend(item)) : [];
}

function normalizeFriendRequest(raw: unknown, direction?: FriendRequest["direction"]): FriendRequest {
  const item = isPlainObject(raw) ? raw : {};
  return {
    id: asString(item.group_id ?? item.id ?? item.request_id ?? item.friend_id ?? crypto.randomUUID?.() ?? ""),
    name: asString(item.name ?? item.user_name ?? item.requester_name ?? "Friend"),
    user_code: item.user_code === undefined ? null : asString(item.user_code),
    profile_picture:
      item.profile_picture === undefined ? null : asString(item.profile_picture),
    created_by: item.created_by === undefined ? null : asString(item.created_by),
    created_by_name:
      item.created_by_name === undefined ? null : asString(item.created_by_name),
    created_by_user_code:
      item.created_by_user_code === undefined ? null : asString(item.created_by_user_code),
    created_at: item.created_at === undefined ? undefined : asString(item.created_at),
    status: item.status === undefined ? undefined : asString(item.status),
    direction:
      (item.direction ?? direction ?? null) as FriendRequest["direction"] | undefined,
  };
}

function normalizeFriendRequests(payload: unknown): FriendRequestsResponse {
  const raw = isPlainObject(payload) ? payload : {};
  const incomingSource = Array.isArray(raw.incoming)
    ? raw.incoming
    : Array.isArray(raw.requests)
      ? raw.requests
      : [];
  const outgoingSource = Array.isArray(raw.outgoing) ? raw.outgoing : [];

  return {
    incoming: incomingSource.map((item) => normalizeFriendRequest(item, "incoming")),
    outgoing: outgoingSource.map((item) => normalizeFriendRequest(item, "outgoing")),
  };
}

function normalizeFriendDetail(payload: unknown): FriendDetail {
  const friend = normalizeFriend(payload);
  const raw = isPlainObject(payload) ? payload : {};
  const history = Array.isArray(raw.history)
    ? raw.history.map(normalizeActivity)
    : Array.isArray(raw.expenses)
      ? raw.expenses.map(normalizeActivity)
      : [];
  const settlements = Array.isArray(raw.settlements)
    ? raw.settlements.map(normalizeActivity)
    : [];

  return {
    ...friend,
    history: history.length > 0 ? history : settlements,
    expenses: history,
    settlements,
  };
}

export function isActiveFriendDetail(friend: Friend | FriendRequest | null | undefined): friend is FriendDetail {
  if (!friend || !("status" in friend)) {
    return false;
  }

  return asString(friend.status ?? "").toUpperCase() === "ACTIVE";
}

export async function getFriends(): Promise<FriendListItem[]> {
  const response = await api.get(FRIEND_API_BASE);
  return normalizeFriendList(unwrapData(response.data));
}

export async function getFriendRequests(): Promise<FriendRequestsResponse> {
  const response = await api.get(`${FRIEND_API_BASE}/requests`);
  return normalizeFriendRequests(unwrapData(response.data));
}

export async function createFriendRequest(userCode: string): Promise<Friend | FriendRequest> {
  const payload: FriendCreateRequestPayload = { user_code: userCode.trim() };
  const response = await api.post(FRIEND_API_BASE, payload);
  const data = unwrapData(response.data);

  if (isPlainObject(data) && ("incoming" in data || "outgoing" in data)) {
    const requests = normalizeFriendRequests(data);
    return requests.incoming[0] ?? requests.outgoing[0] ?? normalizeFriend(data);
  }

  return normalizeFriend(data);
}

export async function acceptFriendRequest(friendId: string): Promise<FriendDetail> {
  const response = await api.post(`${FRIEND_API_BASE}/${friendId}/accept`);
  return normalizeFriendDetail(unwrapData(response.data));
}

export async function rejectFriendRequest(friendId: string): Promise<void> {
  await api.delete(`${FRIEND_API_BASE}/${friendId}/reject`);
}

export async function getFriendDetail(friendId: string): Promise<FriendDetail> {
  const response = await api.get(`${FRIEND_API_BASE}/${friendId}`);
  return normalizeFriendDetail(unwrapData(response.data));
}

export async function unfriend(friendId: string): Promise<void> {
  await api.delete(`${FRIEND_API_BASE}/${friendId}`);
}

export function combineFriendHistory(friend: FriendDetail | FriendListItem | Friend): FriendActivity[] {
  const items = [
    ...(friend.history ?? []),
    ...(friend.expenses ?? []),
    ...(friend.settlements ?? []),
  ];

  return items
    .map(normalizeActivity)
    .sort((a, b) => {
      const left = new Date(a.date ?? a.created_at ?? 0).getTime();
      const right = new Date(b.date ?? b.created_at ?? 0).getTime();
      return right - left;
    });
}

export function getFriendBalance(friend: Pick<Friend, "balance" | "net_balance">) {
  return asNumber(friend.balance ?? friend.net_balance) ?? 0;
}
