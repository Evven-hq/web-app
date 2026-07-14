"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Ghost, SettlementDirection, PaymentMode } from "@/types";
import { formatMoney, getDefaultSettlementDirection } from "./friend-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getGhostExpenseDirectionLabel } from "./friend-utils";
import { PAYMENT_MODES } from "@/lib/payment-modes";

interface FriendSettlementDialogProps {
  friend: Ghost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    amount: number;
    note?: string;
    direction: SettlementDirection;
    payment_mode: PaymentMode;
  }) => Promise<void>;
}

export function FriendSettlementDialog({
  friend,
  open,
  onOpenChange,
  onSubmit,
}: FriendSettlementDialogProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [direction, setDirection] = useState<SettlementDirection>("they_owe");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("upi");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextAmount = Number(amount);

    if (!Number.isFinite(nextAmount) || nextAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        amount: nextAmount,
        note: note.trim() || undefined,
        direction,
        payment_mode: paymentMode,
      });
      onOpenChange(false);
    } catch {
      setError("Could not record this settlement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && friend) {
          const balance = Number(friend.net_balance ?? 0);
          setAmount(String(Math.abs(balance || 0) || ""));
          setDirection(getDefaultSettlementDirection(balance));
          setNote("");
          setPaymentMode("upi");
          setError("");
        }

        if (!nextOpen) {
          setSaving(false);
          setError("");
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="sm:max-w-md bg-popover"
        style={{ backgroundColor: "var(--popover, white)" }}
      >
        <DialogHeader>
          <DialogTitle>Record settlement</DialogTitle>
          <DialogDescription>
            This records a settlement transaction for{" "}
            <strong>{friend?.name ?? "this friend"}</strong> and updates the running balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Paid by
              </label>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value as SettlementDirection)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                style={{
                  background: "var(--color-background-primary, var(--evven-background))",
                  borderColor: "var(--evven-border)",
                }}
              >
                <option value="they_owe">
                  {getGhostExpenseDirectionLabel("they_owe", friend?.name)}
                </option>
                <option value="you_owe">
                  {getGhostExpenseDirectionLabel("you_owe", friend?.name)}
                </option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Amount
              </label>
              <Input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Payment mode
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_MODES.map((mode) => {
                const Icon = mode.icon;
                const active = paymentMode === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setPaymentMode(mode.value)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                    style={{
                      background: active ? mode.bg : "var(--evven-surface)",
                      color: active ? mode.text : "var(--evven-text-muted)",
                      border: `1px solid ${active ? mode.bg : "var(--evven-border)"}`,
                    }}
                  >
                    <Icon size={14} />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Note
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Optional note"
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                background: "var(--color-background-primary, var(--evven-background))",
                borderColor: "var(--evven-border)",
              }}
            />
          </div>

          <div className="card rounded-[var(--evven-radius-card)] p-4 text-sm">
            <p className="font-medium">Preview</p>
            <p className="mt-1 text-muted-foreground">
              {direction === "you_owe"
                ? `${friend?.name ?? "They"} paid ${formatMoney(amount || 0)}.`
                : `You paid ${formatMoney(amount || 0)}.`}
            </p>
          </div>

          {error && <p className="text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={saving || !amount.trim()} className="w-full sm:w-auto">
              {saving && <Loader2 />}
              {saving ? "Recording..." : "Record settlement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}