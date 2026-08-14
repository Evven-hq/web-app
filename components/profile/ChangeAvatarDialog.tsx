"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AvatarPicker } from "@/components/onboarding/AvatarPicker";

export function ChangeAvatarDialog({
  open,
  onOpenChange,
  initialSeed,
  isSaving,
  onConfirm,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSeed: string;
  isSaving: boolean;
  onConfirm: (avatarUrl: string) => void;
  error: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-card"
        style={{ backgroundColor: "var(--evven-card-background, white)" }}
      >
        <DialogHeader>
          <DialogTitle>Change avatar</DialogTitle>
          <DialogDescription>
            Pick a new look, or shuffle for more options.
          </DialogDescription>
        </DialogHeader>

        <AvatarPicker
          initialSeed={initialSeed}
          confirmLabel="Save avatar"
          isSaving={isSaving}
          onConfirm={onConfirm}
        />

        {error && (
          <p className="mt-3 text-sm" style={{ color: "var(--evven-error)" }}>
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
