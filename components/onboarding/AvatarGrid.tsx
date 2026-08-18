"use client";

import { AvatarCard } from "./AvatarCard";
import type { AvatarOption } from "./use-avatar-generator";

interface AvatarGridProps {
  options: AvatarOption[];
  selectedSeed: string;
  onSelect: (seed: string) => void;
}

export function AvatarGrid({
  options,
  selectedSeed,
  onSelect,
}: AvatarGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => (
        <AvatarCard
          key={option.seed}
          url={option.url}
          seed={option.seed}
          selected={option.seed === selectedSeed}
          onSelect={() => onSelect(option.seed)}
        />
      ))}
    </div>
  );
}
