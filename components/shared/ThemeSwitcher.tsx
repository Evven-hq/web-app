"use client";
import { cn } from "@/lib/utils";
import { ThemeName, useTheme } from "@/providers/theme-context";

type ThemeSwatchKey = "default" | ThemeName;

type ThemeSwatch = {
  label: string;
  ariaLabel: string;
  primary: string;
  secondary: string;
};

const THEME_SWATCHES: Record<ThemeSwatchKey, ThemeSwatch> = {
  default: {
    label: "Evergreen",
    ariaLabel: "Evergreen theme",
    primary: "#2d5a4f",
    secondary: "#e8dcc8",
  },
  L3: {
    label: "Sea Glass",
    ariaLabel: "Sea Glass theme",
    primary: "#2e6f8e",
    secondary: "#d9e8ee",
  },
  L4: {
    label: "Blush",
    ariaLabel: "Blush theme",
    primary: "#6b3a5e",
    secondary: "#f2d9e0",
  },
  "Sunset-market": {
    label: "Ember",
    ariaLabel: "Ember theme",
    primary: "#e0592f",
    secondary: "#fbe0d5",
  },
  Botanical: {
    label: "Grove",
    ariaLabel: "Grove theme",
    primary: "#3f6b45",
    secondary: "#dbe8dc",
  },
  D1: {
    label: "Ember Night",
    ariaLabel: "Ember Night theme",
    primary: "#7a9e8e",
    secondary: "#3a3530",
  },
  D3: {
    label: "Sea Glass Night",
    ariaLabel: "Sea Glass Night theme",
    primary: "#3fa3a3",
    secondary: "#1c363b",
  },
  D4: {
    label: "Pulse",
    ariaLabel: "Pulse theme",
    primary: "#5b8def",
    secondary: "#232a35",
  },
  D5: {
    label: "Blush Night",
    ariaLabel: "Blush Night theme",
    primary: "#a56bc2",
    secondary: "#3a2a41",
  },
  O2: {
    label: "Pulse Night",
    ariaLabel: "Pulse Night theme",
    primary: "#b6ff3c",
    secondary: "#1f2b0a",
  },
  "OLED-forest-green": {
    label: "Grove Night",
    ariaLabel: "Grove Night theme",
    primary: "#2d5a4f",
    secondary: "#12241f",
  },
};

const THEME_GROUPS: ThemeSwatchKey[][] = [
  ["default"],
  ["L3", "D3"],
  ["L4", "D5"],
  ["Sunset-market", "D1"],
  ["Botanical", "OLED-forest-green"],
  ["D4", "O2"],
];

function ThemeSwatchButton({
  swatch,
  active,
  disabled,
  onClick,
}: {
  swatch: ThemeSwatch;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={swatch.ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-3 py-2 transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--evven-card-background)]",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      style={{
        background: active ? "var(--evven-surface)" : "var(--evven-card-background)",
        borderColor: active ? "var(--evven-accent-primary)" : "var(--evven-border)",
        borderWidth: active ? 2 : 1,
      }}
    >
      <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full border border-[var(--evven-border)]">
        <span className="absolute inset-y-0 left-0 w-1/2" style={{ background: swatch.primary }} />
        <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: swatch.secondary }} />
      </span>
      <span
        className={cn("text-sm leading-none tracking-wide whitespace-nowrap", active ? "font-medium" : "")}
        style={{ color: active ? "var(--evven-text-primary)" : "var(--evven-text-muted)" }}
      >
        {swatch.label}
      </span>
    </button>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme, isTransitioning } = useTheme();

  return (
    <div
      className="rounded-[var(--evven-radius-hero)] border p-5 sm:p-6"
      style={{
        background: "var(--evven-card-background)",
        borderColor: "var(--evven-border)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
            Appearance
          </p>
          <h2 className="mt-1 text-base font-medium" style={{ color: "var(--evven-text-primary)" }}>
            Theme
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: "var(--evven-text-muted)" }}>
            Pick by color. Matching palettes sit together.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {THEME_GROUPS.map((group) => (
          <div key={group.join("-")} className="flex flex-wrap items-center gap-3">
            {group.map((key) => {
              const swatch = THEME_SWATCHES[key];
              const active = key === "default" ? theme === null : theme === key;

              return (
                <ThemeSwatchButton
                  key={key}
                  swatch={swatch}
                  active={active}
                  disabled={isTransitioning}
                  onClick={() => setTheme(key === "default" ? null : key)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {isTransitioning && (
        <p className="mt-3 text-xs" style={{ color: "var(--evven-text-muted)" }}>
          Applying theme...
        </p>
      )}
    </div>
  );
}
