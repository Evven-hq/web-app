import type {
  PaymentMethod,
  PersonalExpenseCreate,
  SettlementDirection,
  SplitMode,
  SplitParticipant,
} from "@/types";
import { formatNumber } from "@/lib/format";
import {
  remainderAmount,
  splitByPercentage,
  splitEvenly,
} from "@/lib/split-utils";

export interface ExpenseFormValues {
  title: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
  payment_method: PaymentMethod;
  friend_id: string;
  settlement_direction: SettlementDirection;
  settlement_amount: string;
  split_mode: SplitMode;
  split_participants: SplitParticipant[];
}

export const DEFAULT_VALUES: ExpenseFormValues = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
  payment_method: "upi",
  friend_id: "",
  settlement_direction: "they_owe",
  settlement_amount: "",
  split_mode: "equal",
  split_participants: [],
};

export const fieldInputClass =
  "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2";

export const fieldInputStyle = {
  background: "var(--evven-surface)",
  borderColor: "var(--evven-border)",
};

export function buildSingleExpense(
  values: ExpenseFormValues,
): PersonalExpenseCreate {
  const amount = Number(values.settlement_amount || values.amount);

  const payload: PersonalExpenseCreate = {
    title: values.title.trim(),
    amount,
    category: values.category.trim() || undefined,
    date: values.date
      ? new Date(`${values.date}T00:00:00`).toISOString()
      : undefined,
    notes: values.notes.trim() || undefined,
    payment_method: values.payment_method,
  };

  if (values.friend_id) {
    payload.friend_id = values.friend_id;
    payload.settlement_direction = values.settlement_direction;
    payload.settlement_amount = amount;
  }

  return payload;
}

export function buildSplitExpenses(values: ExpenseFormValues): {
  payloads: PersonalExpenseCreate[];
  error?: string;
} {
  const amount = Number(values.amount);
  const participants = values.split_participants;

  if (participants.length < 1) {
    return {
      payloads: [],
      error: "Add at least one friend to split this expense.",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { payloads: [], error: "Enter an amount greater than zero." };
  }

  const common = {
    title: values.title.trim(),
    category: values.category.trim() || undefined,
    date: values.date
      ? new Date(`${values.date}T00:00:00`).toISOString()
      : undefined,
    notes: values.notes.trim() || undefined,
    payment_method: values.payment_method,
  };

  if (values.split_mode === "equal") {
    const shares = splitEvenly(amount, participants.length + 1);
    const userShare = shares[0] ?? 0;
    return {
      payloads: [
        ...(userShare > 0
          ? [
              {
                ...common,
                amount: userShare,
              },
            ]
          : []),
        ...participants.map((participant, index) => ({
          ...common,
          amount: shares[index + 1] ?? 0,
          friend_id: participant.friend_id,
          settlement_direction: values.settlement_direction,
          settlement_amount: shares[index + 1] ?? 0,
        })),
      ],
    };
  }

  if (values.split_mode === "percentage") {
    const totalPercentage = participants.reduce(
      (sum, participant) => sum + Number(participant.split_percentage ?? 0),
      0,
    );
    if (totalPercentage > 100) {
      return {
        payloads: [],
        error: "Friend percentages must stay at or below 100%.",
      };
    }

    const friendPercentages = participants.map((participant) =>
      Number(participant.split_percentage ?? 0),
    );
    const friendShares = splitByPercentage(amount, friendPercentages);
    const userShare = remainderAmount(
      amount,
      friendShares.reduce((sum, value) => sum + value, 0),
    );

    return {
      payloads: [
        ...(userShare > 0
          ? [
              {
                ...common,
                amount: userShare,
              },
            ]
          : []),
        ...participants.map((participant, index) => ({
          ...common,
          amount: friendShares[index] ?? 0,
          friend_id: participant.friend_id,
          settlement_direction: values.settlement_direction,
          settlement_amount: friendShares[index] ?? 0,
        })),
      ],
    };
  }

  const totalCustom = participants.reduce(
    (sum, participant) => sum + Number(participant.split_amount ?? 0),
    0,
  );

  if (totalCustom > amount) {
    return {
      payloads: [],
      error: `Friend amounts must stay below ₹${formatNumber(amount)}.`,
    };
  }

  const userShare = remainderAmount(amount, totalCustom);

  return {
    payloads: [
      ...(userShare > 0
        ? [
            {
              ...common,
              amount: userShare,
            },
          ]
        : []),
      ...participants.map((participant) => ({
        ...common,
        amount: Number(participant.split_amount ?? 0),
        friend_id: participant.friend_id,
        settlement_direction: values.settlement_direction,
        settlement_amount: Number(participant.split_amount ?? 0),
      })),
    ],
  };
}
