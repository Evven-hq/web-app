import Script from "next/script";

export const metadata = {
  title: "Evven",
};

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="evven-desktop-runtime" strategy="beforeInteractive">
        {`
          try {
            window.sessionStorage.setItem("evven-runtime-mode", "desktop");
          } catch (error) {
            // Ignore storage failures and fall back
          }
        `}
      </Script>
      <div className="relative">
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-3 right-3 z-50 select-none rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-muted-foreground shadow-sm backdrop-blur"
        >
          v
        </div>
      </div>
    </>
  );
}
