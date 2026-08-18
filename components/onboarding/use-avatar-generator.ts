"use client";

import { useCallback, useMemo, useState } from "react";
import { buildAvatarUrl, randomAvatarSeed } from "@/lib/dicebear";

export interface AvatarOption {
  seed: string;
  url: string;
}

const OPTION_COUNT = 9;

function generateOptions(count: number = OPTION_COUNT): AvatarOption[] {
  return Array.from({ length: count }, () => {
    const seed = randomAvatarSeed();
    return { seed, url: buildAvatarUrl(seed) };
  });
}

/**
 * Manages a grid of randomly-seeded DiceBear avatar options plus the
 * current selection. If `initialSeed` is provided (e.g. the seed behind a
 * user's existing profile_picture), it's slotted in as the first option and
 * pre-selected so re-opening the picker doesn't lose their current avatar.
 */
export function useAvatarGenerator(initialSeed?: string | null) {
  const [options, setOptions] = useState<AvatarOption[]>(() => {
    const generated = generateOptions();
    if (initialSeed) {
      generated[0] = { seed: initialSeed, url: buildAvatarUrl(initialSeed) };
    }
    return generated;
  });
  const [selectedSeed, setSelectedSeed] = useState<string>(
    initialSeed || options[0].seed,
  );

  const shuffle = useCallback(() => {
    const next = generateOptions();
    setOptions(next);
    setSelectedSeed(next[0].seed);
  }, []);

  const selectedUrl = useMemo(() => {
    return (
      options.find((option) => option.seed === selectedSeed)?.url ??
      buildAvatarUrl(selectedSeed)
    );
  }, [options, selectedSeed]);

  return {
    options,
    selectedSeed,
    selectedUrl,
    selectSeed: setSelectedSeed,
    shuffle,
  };
}
