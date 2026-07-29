export type UserNameFn = (id: string) => string;
export type UserAvatarFn = (id: string) => string | null;
export type SettleFn = (userId: string, amount: number) => void;
