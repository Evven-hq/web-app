import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "data-protection", label: "Data Protection" },
  { id: "access-control", label: "Access Control" },
  { id: "account-security", label: "Account Security" },
  { id: "disclosure", label: "Vulnerability Disclosure" },
  { id: "contact", label: "Contact" },
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

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 min-w-[130px] shrink-0 text-sm font-medium text-foreground">
        {label}
      </span>
      <span className="text-sm text-muted-foreground">{children}</span>
    </div>
  );
}

export default function SecurityPage() {
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
            Trust
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Security
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            We built Evven to handle the financial data of groups, so security
            isn&apos;t an afterthought — it&apos;s part of the foundation.
            Here&apos;s how we keep your data safe.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/60">
            Last updated: June 2026
          </p>
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
                Evven stores information about shared expenses — amounts,
                descriptions, and who&apos;s involved. While we don&apos;t
                handle payments or hold funds, we treat this data with the
                same care as financial information, because to the people
                using it, it is.
              </p>
              <p className="rounded-lg border border-border bg-white/[0.02] p-4 text-sm">
                Our approach: minimize what we collect, encrypt what we store,
                and limit who can access it — including us.
              </p>
            </Section>

            <Section id="infrastructure" title="Infrastructure">
              <p>
                Evven runs on a small set of established, security-audited
                infrastructure providers rather than self-hosted servers.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                <Item label="Hosting">
                  Frontend is served via Vercel&apos;s global edge network;
                  the backend runs on Render.
                </Item>
                <Item label="Database">
                  Supabase provides our managed Postgres database and
                  authentication layer, with encryption at rest by default.
                </Item>
                <Item label="Email">
                  Transactional emails (verification, password resets) are
                  sent via Resend over authenticated, encrypted channels.
                </Item>
                <Item label="Network">
                  All traffic between your browser and Evven is encrypted via
                  TLS 1.2+. We don&apos;t serve any content over plain HTTP.
                </Item>
              </div>
            </Section>

            <Section id="data-protection" title="Data Protection">
              <p>How your data is protected at rest and in transit:</p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Passwords are hashed using industry-standard algorithms and are never stored or logged in plaintext.",
                  "All data in transit is encrypted using TLS — between your device, our servers, and our database.",
                  "Database backups are encrypted and retained on a rolling schedule.",
                  "Group expense data is only visible to members of that group — there is no public access to expense records.",
                  "We do not sell, rent, or share your data with advertisers. There are no ads on Evven.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="access-control" title="Access Control">
              <p>
                Access to production systems and customer data is tightly
                restricted within our team.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                <Item label="Least privilege">
                  Only core team members have access to production
                  infrastructure, and only to the extent their role requires.
                </Item>
                <Item label="MFA">
                  Multi-factor authentication is required for all team access
                  to infrastructure providers and admin tooling.
                </Item>
                <Item label="Audit trails">
                  Administrative actions on infrastructure are logged and
                  reviewable.
                </Item>
                <Item label="Group permissions">
                  Within Evven, only members you&apos;ve added to a group can
                  view or edit that group&apos;s expenses.
                </Item>
              </div>
            </Section>

            <Section id="account-security" title="Account Security">
              <p>Things you can do to keep your own account secure:</p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Use a strong, unique password — ideally generated and stored by a password manager.",
                  "Never share your login credentials, even with people in your group.",
                  "Log out of shared or public devices after use.",
                  "Contact us immediately if you notice activity on your account that you don't recognize.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm">
                For more on how we handle your information, see our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </Section>

            <Section id="disclosure" title="Vulnerability Disclosure">
              <p>
                We take security reports seriously and welcome responsible
                disclosure from researchers and users.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                <Item label="Report to">
                  <span className="font-medium text-foreground">
                    security@evven.xyz
                  </span>
                </Item>
                <Item label="Please include">
                  A clear description of the issue, steps to reproduce, and
                  its potential impact.
                </Item>
                <Item label="Please avoid">
                  Accessing, modifying, or exfiltrating data belonging to
                  other users while investigating.
                </Item>
                <Item label="Response time">
                  We aim to acknowledge reports within{" "}
                  <span className="font-medium text-foreground">48 hours</span>{" "}
                  and provide a resolution timeline shortly after.
                </Item>
              </div>
              <p className="rounded-lg border border-border bg-white/[0.02] p-4 text-sm">
                We&apos;re a small team — we can&apos;t offer a paid bug
                bounty program yet, but we will credit researchers (with
                permission) for valid reports that lead to a fix.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                Questions about our security practices, or found something
                that doesn&apos;t look right — reach out:
              </p>
              <a
                href="mailto:security@evven.xyz"
                className="mt-2 inline-block font-[family-name:var(--font-xanh-mono)] text-lg text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                security@evven.xyz
              </a>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}