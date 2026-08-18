"use client";

import { Loader2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarGrid } from "./AvatarGrid";
import { useAvatarGenerator } from "./use-avatar-generator";

interface AvatarPickerProps {
  /** Seeding behind the user's current avatar, if any — kept as the first option. */
  initialSeed?: string | null;
  confirmLabel?: string;
  isSaving?: boolean;
  onConfirm: (avatarUrl: string) => void | Promise<void>;
}

export function AvatarPicker({
  initialSeed,
  confirmLabel = "Confirm avatar",
  isSaving = false,
  onConfirm,
}: AvatarPickerProps) {
  const { options, selectedSeed, selectedUrl, selectSeed, shuffle } =
    useAvatarGenerator(initialSeed);

  return (
    <div className="w-full">
      <AvatarGrid
        options={options}
        selectedSeed={selectedSeed}
        onSelect={selectSeed}
      />

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={shuffle}
          disabled={isSaving}
        >
          <Shuffle size={15} />
          Shuffle
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm(selectedUrl)}
          disabled={isSaving}
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          {isSaving ? "Saving..." : confirmLabel}
        </Button>
      </div>
    </div>
  );
}
