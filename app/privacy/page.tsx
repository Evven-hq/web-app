import Link from "next/link";
import Image from 'next/image';


const sections = [
  { id: "what-we-collect", label: "What We Collect" },
  { id: "how-we-use-it", label: "How We Use It" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "data-retention", label: "Data Retention" },
  { id: "security", label: "Security" },
  { id: "your-rights", label: "Your Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes", label: "Changes" },
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
      className="border-t border-border/30 py-12 first:border-none first:pt-0"
    >
      {title && (
        <h2 className="mb-6 font-[family-name:var(--font-xanh-mono)]    text-2xl tracking-tight text-foreground">
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className="fixed top-5 left-4 z-50 sm:top-6 sm:left-6 md:top-8 md:left-8 lg:left-12"
      >
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
        <div className="mb-16 border-b border-border/30 pb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            EvenUp is built on the belief that your data belongs to you. This
            policy explains exactly what we collect, why we collect it, and
            what control you have over it.
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
            <Section id="what-we-collect" title="What We Collect">
              <p>We collect only what&apos;s needed to run the service.</p>
              <div className="mt-2 space-y-3 rounded-lg border border-border/30 bg-white/[0.02] p-5">
                <Item label="Account data">
                  Your name, username, and email address when you sign up.
                </Item>
                <Item label="Profile data">
                  Any additional info you choose to add — avatar, bio, and so on.
                </Item>
                <Item label="Event data">
                  Events you create, join, or interact with on the platform.
                </Item>
                <Item label="Usage data">
                  Pages visited, features used, and actions taken within the
                  app — used to improve the product.
                </Item>
                <Item label="Device data">
                  Browser type, OS, and IP address — used for security and
                  debugging.
                </Item>
              </div>
              <p className="text-sm">
                We do not collect payment information — we don&apos;t process
                payments directly.
              </p>
            </Section>

            <Section id="how-we-use-it" title="How We Use It">
              <p>Your data is used to:</p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Create and maintain your account.",
                  "Power core features — event creation, discovery, and collaboration.",
                  "Send transactional emails: account verification, password resets, event notifications.",
                  "Detect and prevent abuse, fraud, and security incidents.",
                  "Understand how people use EvenUp so we can make it better.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="rounded-lg border border-border/30 bg-white/[0.02] p-4 text-sm">
                We do not use your data to train ML models or sell it to
                advertisers. There are no ads on EvenUp.
              </p>
            </Section>

            <Section id="third-party-services" title="Third-Party Services">
              <p>
                We rely on a small set of trusted infrastructure providers to
                operate the platform:
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border/30 bg-white/[0.02] p-5">
                <Item label="Supabase">Database and authentication infrastructure.</Item>
                <Item label="Resend">Transactional email delivery.</Item>
                <Item label="Render">Backend hosting and deployment.</Item>
                <Item label="Vercel">Frontend hosting and edge delivery.</Item>
              </div>
              <p className="text-sm">
                Each provider processes only the data necessary for their
                function and is contractually bound to protect it. We share
                your data with no one else.
              </p>
            </Section>

            <Section id="data-retention" title="Data Retention">
              <p>
                Your data is retained for as long as your account is active.
                If you delete your account, we will delete your personal data
                within <span className="font-medium text-foreground">30 days</span>,
                except where retention is required by law or needed to resolve
                an open dispute.
              </p>
            </Section>

            <Section id="security" title="Security">
              <p>
                Passwords are hashed and never stored in plaintext. All data
                in transit is encrypted via TLS. Access to production systems
                is restricted to core team members and protected by
                multi-factor authentication.
              </p>
              <p className="text-sm">
                No system is perfectly secure. If you discover a vulnerability,
                please disclose it responsibly to{" "}
                <span className="font-medium text-foreground">
                  security@evven.xyz
                </span>
                .
              </p>
            </Section>

            <Section id="your-rights" title="Your Rights">
              <p>You have the right to:</p>
              <div className="mt-2 space-y-3 rounded-lg border border-border/30 bg-white/[0.02] p-5">
                <Item label="Access">Request a copy of your personal data.</Item>
                <Item label="Correct">Update inaccurate or incomplete information.</Item>
                <Item label="Delete">Permanently remove your account and associated data.</Item>
                <Item label="Export">Receive your data in a portable, machine-readable format.</Item>
                <Item label="Opt out">Withdraw consent from non-essential communications at any time.</Item>
              </div>
              <p className="text-sm">
                To exercise any of these, email{" "}
                <span className="font-medium text-foreground">hello@evven.xyz</span>{" "}
                with the subject line{" "}
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-foreground">
                  &quot;Privacy Request&quot;
                </span>
                . We will respond within{" "}
                <span className="font-medium text-foreground">14 days</span>.
              </p>
            </Section>

            <Section id="childrens-privacy" title="Children's Privacy">
              <p>
                EvenUp is not intended for users under 13. We do not knowingly
                collect data from children. If you believe a child has created
                an account, contact us and we will delete it promptly.
              </p>
            </Section>

            <Section id="changes" title="Changes to This Policy">
              <p>
                If we make material changes, we will notify you via email and
                update the date above at least{" "}
                <span className="font-medium text-foreground">7 days</span>{" "}
                before changes take effect. Continued use of the service after
                that date constitutes acceptance.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>Questions, concerns, or requests — we&apos;re at:</p>
              <a
                href="mailto:hello@evven.xyz"
                className="mt-2 inline-block font-[family-name:var(--font-xanh-mono)]    text-lg text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
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