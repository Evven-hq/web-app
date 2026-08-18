"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import type { PersonalExpense } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteExpenseDialog({
  expense,
  open,
  deleting,
  error,
  onOpenChange,
  onConfirm,
}: {
  expense: PersonalExpense | null;
  open: boolean;
  deleting: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "var(--evven-card-background)",
          borderColor: "var(--evven-border)",
          boxShadow: "0 24px 80px rgba(26, 24, 22, 0.14)",
        }}
      >
        <DialogHeader>
          <div
            className="mb-1 flex size-11 items-center justify-center rounded-2xl border"
            style={{
              background:
                "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
              borderColor:
                "color-mix(in srgb, var(--evven-error) 20%, var(--evven-border))",
              color: "var(--evven-error)",
            }}
          >
            <AlertTriangle size={18} />
          </div>
          <DialogTitle>Delete expense?</DialogTitle>
          <DialogDescription>
            {expense
              ? `This will permanently remove "${expense.title}".`
              : "This will permanently remove the expense."}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              color: "var(--evven-error)",
              borderColor:
                "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
              background:
                "color-mix(in srgb, var(--evven-error) 6%, var(--evven-background))",
            }}
          >
            {error}
          </p>
        ) : null}

        <div
          className="rounded-[24px] border p-4 text-sm"
          style={{
            background: "var(--evven-background)",
            borderColor: "var(--evven-border)",
            color: "var(--evven-text-muted)",
          }}
        >
          This action cannot be undone.
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="w-full sm:w-auto"
            style={{
              borderColor:
                "color-mix(in srgb, var(--evven-accent-primary) 18%, var(--evven-border))",
              background:
                "color-mix(in srgb, var(--evven-accent-secondary) 14%, var(--evven-background))",
              color: "var(--evven-accent-primary)",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
            className="w-full gap-2 sm:w-auto"
            style={{
              background:
                "color-mix(in srgb, var(--evven-error) 12%, var(--evven-background))",
              borderColor:
                "color-mix(in srgb, var(--evven-error) 28%, var(--evven-border))",
              color: "var(--evven-error)",
            }}
          >
            <Trash2 size={14} />
            {deleting ? "Deleting…" : "Delete expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
