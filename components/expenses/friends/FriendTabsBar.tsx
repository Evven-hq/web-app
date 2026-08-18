"use client";

export type FriendTab = "friend" | "requests" | "friends";

export function FriendTabsBar({
  active,
  requestCount,
  friendCount,
  onChange,
}: {
  active: FriendTab;
  requestCount: number;
  friendCount: number;
  onChange: (tab: FriendTab) => void;
}) {
  const tabs: Array<{ id: FriendTab; label: string; count?: number }> = [
    { id: "friend", label: "Friend" },
    { id: "requests", label: "Requests", count: requestCount },
    { id: "friends", label: "Friends", count: friendCount },
  ];

  return (
    <div
      className="sticky top-3 z-20 mb-5 overflow-x-auto rounded-full border bg-[var(--evven-card-background)] p-1.5"
      style={{
        borderColor: "var(--evven-border)",
      }}
    >
      <div className="mx-auto flex w-full max-w-xl justify-center gap-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="inline-flex flex-1 basis-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: isActive
                  ? "var(--evven-accent-primary)"
                  : "transparent",
                color: isActive
                  ? "var(--evven-text-inverse)"
                  : "var(--evven-text-muted)",
              }}
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--evven-text-inverse) 16%, transparent)"
                      : "color-mix(in srgb, var(--evven-accent-secondary) 28%, var(--evven-background))",
                    color: isActive
                      ? "var(--evven-text-inverse)"
                      : "var(--evven-accent-primary)",
                  }}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
