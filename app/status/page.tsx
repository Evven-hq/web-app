import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "System Components" },
  { id: "incidents", label: "Incident History" },
  { id: "uptime", label: "Uptime" },
  { id: "subscribe", label: "Stay Informed" },
];

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-border py-12 first:border-none first:pt-0"
    >
      {title && (
        <h2 className="mb-6 font-[family-name:var(--font-xanh-mono)] text-2xl tracking-tight text-foreground">
          {title}
        </h2>
      )}
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function StatusRow({
  name,
  status,
}: {
  name: string;
  status: "operational" | "degraded" | "outage";
}) {
  const config = {
    operational: { label: "Operational", dot: "bg-emerald-500", text: "text-emerald-600" },
    degraded: { label: "Degraded", dot: "bg-amber-500", text: "text-amber-600" },
    outage: { label: "Outage", dot: "bg-red-500", text: "text-red-600" },
  }[status];

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-4 last:border-none">
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className={`flex items-center gap-2 text-sm font-medium ${config.text}`}>
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    </div>
  );
}

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed top-5 left-4 z-50 sm:top-6 sm:left-6 md:top-8 md:left-8 lg:left-12">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/EvenUp-black.svg"
            alt="EvenUp"
            width={70}
            height={70}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px]"
          />
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        {/* Header */}
        <div className="mb-16 border-b border-border pb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            System Status
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Status
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Real-time status of Evven&apos;s core services. Check here first
            if something seems off.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">
              All systems operational
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-16 xl:gap-24">
          {/* Sticky ToC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
                On this page
              </p>
              <div className="space-y-0.5">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Content */}
          <div>
            <Section id="overview" title="Overview">
              <p>
                This page reflects the current operational status of Evven.
                If you&apos;re experiencing an issue not shown here, it&apos;s
                likely local to your device or network — try refreshing or
                checking{" "}
                <Link
                  href="/support"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Support
                </Link>
                .
              </p>
              <p className="text-sm">
                Status is updated manually by the team as we monitor our
                infrastructure providers. We&apos;re working toward automated,
                real-time status checks.
              </p>
            </Section>

            <Section id="components" title="System Components">
              <div className="rounded-lg border border-border bg-white/[0.02] px-5">
                <StatusRow name="Web app (evven.xyz)" status="operational" />
                <StatusRow name="API & backend services" status="operational" />
                <StatusRow name="Authentication" status="operational" />
                <StatusRow name="Database" status="operational" />
                <StatusRow name="Email delivery" status="operational" />
                <StatusRow name="Expense exports" status="operational" />
              </div>
            </Section>

            <Section id="incidents" title="Incident History">
              <p>No incidents reported in the last 90 days.</p>
              <p className="rounded-lg border border-border bg-white/[0.02] p-4 text-sm">
                When incidents occur, they&apos;ll be logged here with a
                timestamp, affected components, and resolution notes — so you
                can always see what happened and when it was fixed.
              </p>
            </Section>

            <Section id="uptime" title="Uptime">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="font-[family-name:var(--font-xanh-mono)] text-4xl font-bold tracking-tight text-foreground">
                    99.9%
                  </p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
                <div className="space-y-1">
                  <p className="font-[family-name:var(--font-xanh-mono)] text-4xl font-bold tracking-tight text-foreground">
                    99.9%
                  </p>
                  <p className="text-sm text-muted-foreground">Last 90 days</p>
                </div>
                <div className="space-y-1">
                  <p className="font-[family-name:var(--font-xanh-mono)] text-4xl font-bold tracking-tight text-foreground">
                    99.8%
                  </p>
                  <p className="text-sm text-muted-foreground">Last 12 months</p>
                </div>
              </div>
            </Section>

            <Section id="subscribe" title="Stay Informed">
              <p>
                For major planned maintenance or incidents, we&apos;ll notify
                affected users by email. If you run into an issue that
                isn&apos;t reflected here, let us know directly:
              </p>
              <a
                href="mailto:hello@evven.xyz"
                className="mt-2 inline-block font-[family-name:var(--font-xanh-mono)] text-lg text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                hello@evven.xyz
              </a>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}