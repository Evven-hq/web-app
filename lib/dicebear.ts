/**
 * DiceBear avatar helpers.
 *
 * Product decision: only one style is offered app-wide ("notionists-neutral").
 * Variety comes entirely from randomized seeds, not from switching styles.
 * If that ever changes, this is the single place to add a `style` param.
 */

const DICEBEAR_VERSION = "9.x";
const AVATAR_STYLE = "notionists-neutral";

export function buildAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/${DICEBEAR_VERSION}/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(
    seed,
  )}`;
}

export function randomAvatarSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * True if a URL looks like one of our generated DiceBear avatars
 * (as opposed to a custom/imported picture, e.g. from Google sign-in).
 */
export function isDicebearAvatarUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.startsWith(`https://api.dicebear.com/`) &&
    url.includes(`/${AVATAR_STYLE}/`)
  );
}

/**
 * Recovers the seed behind a previously-generated avatar URL so the picker
 * can pre-select the user's actual current avatar (not just a name-derived
 * placeholder). Returns null for non-DiceBear URLs (e.g. a Google photo).
 */
export function extractSeedFromAvatarUrl(
  url: string | null | undefined,
): string | null {
  if (!isDicebearAvatarUrl(url)) return null;
  try {
    const seed = new URL(url as string).searchParams.get("seed");
    return seed ? decodeURIComponent(seed) : null;
  } catch {
    return null;
  }
}

const WASH_TINTS: readonly string[] = [
  "var(--evven-accent-primary)",
  "var(--evven-error)",
  "#1E3A5F",
  "#6E1F2E",
  "var(--evven-text-muted)",
];

export function seedToGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const tint = WASH_TINTS[Math.abs(hash) % WASH_TINTS.length];
  return (
    `linear-gradient(135deg, ` +
    `color-mix(in srgb, ${tint} 8%, var(--evven-surface)), ` +
    `color-mix(in srgb, ${tint} 16%, var(--evven-surface)))`
  );
}
