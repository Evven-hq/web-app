"use client";
import { Check } from "lucide-react";
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
  "sea-glass": {
    label: "Sea Glass",
    ariaLabel: "Sea Glass theme",
    primary: "#2e6f8e",
    secondary: "#d9e8ee",
  },
  blush: {
    label: "Blush",
    ariaLabel: "Blush theme",
    primary: "#6b3a5e",
    secondary: "#f2d9e0",
  },
  ember: {
    label: "Ember",
    ariaLabel: "Ember theme",
    primary: "#e0592f",
    secondary: "#fbe0d5",
  },
  grove: {
    label: "Grove",
    ariaLabel: "Grove theme",
    primary: "#3f6b45",
    secondary: "#dbe8dc",
  },
  "ember-night": {
    label: "Ember Night",
    ariaLabel: "Ember Night theme",
    primary: "#7a9e8e",
    secondary: "#3a3530",
  },
  "sea-glass-night": {
    label: "Sea Glass Night",
    ariaLabel: "Sea Glass Night theme",
    primary: "#3fa3a3",
    secondary: "#1c363b",
  },
  pulse: {
    label: "Pulse",
    ariaLabel: "Pulse theme",
    primary: "#5b8def",
    secondary: "#232a35",
  },
  "blush-night": {
    label: "Blush Night",
    ariaLabel: "Blush Night theme",
    primary: "#a56bc2",
    secondary: "#3a2a41",
  },
  "pulse-night": {
    label: "Pulse Night",
    ariaLabel: "Pulse Night theme",
    primary: "#b6ff3c",
    secondary: "#1f2b0a",
  },
  "grove-night": {
    label: "Grove Night",
    ariaLabel: "Grove Night theme",
    primary: "#2d5a4f",
    secondary: "#12241f",
  },
};

const THEME_ORDER: ThemeSwatchKey[] = [
  "default",
  "sea-glass",
  "blush",
  "ember",
  "grove",
  "ember-night",
  "sea-glass-night",
  "pulse",
  "blush-night",
  "pulse-night",
  "grove-night",
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
        "flex cursor-pointer flex-col items-center gap-[9px] p-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--evven-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--evven-card-background)]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "relative size-11 rounded-full",
          "transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.92]",
        )}
        style={{
          border: "1px solid color-mix(in srgb, var(--evven-text-primary) 18%, transparent)",
          boxShadow: active
            ? "0 0 0 2px var(--evven-card-background), 0 0 0 3.5px var(--evven-accent-primary)"
            : undefined,
        }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0" style={{ background: swatch.secondary }} />
          <span
            className="absolute left-0 top-0 size-11 translate-x-[30%] translate-y-[30%] rounded-full"
            style={{ background: swatch.primary }}
          />
        </span>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex size-[15px] items-center justify-center rounded-full border-[1.5px] border-[var(--evven-card-background)] bg-[var(--evven-accent-primary)] text-[var(--evven-text-inverse)]",
            "transition-all duration-[200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            active ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          <Check size={8} strokeWidth={4} />
        </span>
      </span>
      <span
        className={cn(
          "max-w-[72px] text-center text-[11.5px] font-medium leading-[1.25] transition-colors duration-[180ms] ease-out",
          active ? "font-semibold" : "",
        )}
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
      className="rounded-[var(--evven-radius-hero)] border p-5"
      style={{
        background: "var(--evven-card-background)",
        borderColor: "var(--evven-border)",
      }}
    >
      <p
        className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Appearance
      </p>
      <h2
        className="mt-1.5 text-base font-medium tracking-[-0.01em]"
        style={{ color: "var(--evven-text-primary)" }}
      >
        Theme
      </h2>

      <div className="my-4 h-px opacity-60" style={{ background: "var(--evven-border)" }} />

      {isTransitioning && (
        <p aria-live="polite" className="mb-3 text-xs" style={{ color: "var(--evven-text-muted)" }}>
          Applying theme...
        </p>
      )}

      <div
        className={cn(
          "grid grid-cols-3 gap-x-1 gap-y-5 transition-opacity duration-300 ease-out",
          isTransitioning && "opacity-50",
        )}
      >
        {THEME_ORDER.map((key) => {
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
    </div>
  );
}
