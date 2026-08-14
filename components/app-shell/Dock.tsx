"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/components/shared/NavigationProvider";
import { DOCK_ITEMS, isActiveRoute } from "./dock-utils";

export function Dock({
  pathname,
  variant,
  isOnline,
}: {
  pathname: string;
  variant: "mobile" | "desktop";
  isOnline: boolean;
}) {
  const isDesktop = variant === "desktop";
  const { navigate } = useNavigation();
  const router = useRouter();

  return (
    <nav
      className={cn(
        "pointer-events-none fixed z-40",
        isDesktop
          ? "bottom-6 left-1/2 hidden -translate-x-1/2 px-0 md:block"
          : "inset-x-0 bottom-0 px-4 md:hidden"
        )}
      style={
        !isDesktop
          ? { paddingBottom: "calc(var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)) + 1rem)" }
          : undefined
      }
    >
      <div
        className={cn(
          "pointer-events-auto grid items-center rounded-full border shadow-2xl shadow-black/20",
          isDesktop
            ? "grid-flow-col auto-cols-max gap-2 px-3.5 py-3"
            : "mx-auto h-[76px] max-w-md grid-cols-5 gap-1.5 px-3.5 py-0"
        )}
        style={{
          background: "color-mix(in srgb, var(--evven-surface) 92%, var(--evven-card-background))",
          border: "0.5px solid var(--evven-border)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
        }}
      >
        {DOCK_ITEMS.map(({ href, label, icon: Icon, center }) => {
          const active = !center && isActiveRoute(pathname, href);
          const isAdd = Boolean(center);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              onMouseEnter={() => {
                if (!active) router.prefetch(href);
              }}
              onClick={(e) => {
                if (!isOnline) {
                  e.preventDefault();
                  return;
                }
                if (active || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                  return;
                }
                e.preventDefault();
                navigate(href);
              }}
              className={cn(
                "flex items-center justify-center justify-self-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--evven-accent-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isAdd
                  ? "size-14 shadow-md ring-1 ring-black/5 hover:-translate-y-0.5 hover:shadow-lg"
                  : "size-13 hover:-translate-y-0.5"
              )}
              style={{
                background: isAdd
                  ? "var(--evven-accent-primary)"
                  : active
                    ? "color-mix(in srgb, var(--evven-background) 88%, white)"
                    : "transparent",
                color: isAdd
                  ? "var(--evven-text-inverse)"
                  : active
                    ? "var(--evven-accent-primary)"
                    : "var(--evven-text-muted)",
                boxShadow: active
                  ? "0 1px 0 color-mix(in srgb, var(--evven-text-primary) 8%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--evven-border) 80%, transparent)"
                  : undefined,
              }}
            >
              <Icon size={isAdd ? 28 : 24} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
