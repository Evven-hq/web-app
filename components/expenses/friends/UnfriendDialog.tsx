"use client";

import { useState } from "react";
import { ArrowLeftRight, Loader2, UserRoundX, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FriendDetail } from "@/types";
import { formatMoney } from "./friend-utils";
import { getApiErrorMessage } from "@/lib/api-error";

export function UnfriendDialog({
  friend,
  balance,
  onConfirm,
  onOpenSettlement,
}: {
  friend: FriendDetail | null;
  balance: number;
  onConfirm: () => Promise<void>;
  onOpenSettlement: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: onConfirm,
    onSuccess: () => {
      setOpen(false);
      setError("");
    },
    onError: (err) => {
      setError(getApiErrorMessage(err, "Could not remove this friend right now."));
    },
  });

  const blocked = balance !== 0;

  if (!friend) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError("");
          mutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <UserRoundX />
          Remove friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{blocked ? "Settle first" : "Remove friend?"}</DialogTitle>
          <DialogDescription>
            {blocked
              ? `You still have a balance of ${formatMoney(balance)}. Settle up before removing ${friend.name}.`
              : `Removing ${friend.name} keeps their history intact, but hides the active friendship until you add them again.`}
          </DialogDescription>
        </DialogHeader>

        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            background: blocked
              ? "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))"
              : "var(--evven-surface)",
            borderColor: blocked
              ? "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))"
              : "var(--evven-border)",
            color: blocked ? "var(--evven-error)" : "var(--evven-text-muted)",
          }}
        >
          {blocked
            ? "Unfriend is blocked until the balance is zero."
            : "This action is reversible later by adding the same person again."}
        </div>

        {error ? (
          <div
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
              borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
              color: "var(--evven-error)",
            }}
          >
            {error}
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          {blocked ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setOpen(false);
                onOpenSettlement();
              }}
            >
              <ArrowLeftRight />
              Settle up
            </Button>
          ) : null}
          <Button
            type="button"
            variant={blocked ? "outline" : "destructive"}
            className="w-full sm:w-auto"
            disabled={blocked || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <X />}
            {blocked ? "Cannot remove" : "Remove now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
