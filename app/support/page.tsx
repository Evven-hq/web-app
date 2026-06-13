import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "faq", label: "Common Questions" },
  { id: "account", label: "Account & Billing" },
  { id: "groups-expenses", label: "Groups & Expenses" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "contact", label: "Contact Support" },
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

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">{q}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export default function SupportPage() {
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
            Help
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Support
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Stuck on something, or just curious how a feature works? Here&apos;s
            a rundown of the most common questions — and how to reach us if
            you need more help.
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
            <Section id="getting-started" title="Getting Started">
              <p>
                New to Evven? Here&apos;s the fastest path to your first
                split expense.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                <div className="flex gap-3">
                  <span className="mt-0.5 min-w-[130px] shrink-0 text-sm font-medium text-foreground">
                    1. Create an account
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Sign up with your email — no credit card required.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 min-w-[130px] shrink-0 text-sm font-medium text-foreground">
                    2. Start a group
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Create a group for your trip, flat, or team and invite
                    others with a link.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 min-w-[130px] shrink-0 text-sm font-medium text-foreground">
                    3. Add an expense
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Log who paid, who&apos;s splitting it, and how — Evven
                    calculates the rest.
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 min-w-[130px] shrink-0 text-sm font-medium text-foreground">
                    4. Settle up
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Check live balances any time and mark payments as settled
                    once they&apos;re made.
                  </span>
                </div>
              </div>
              <p className="text-sm">
                For more guidance on specific features, check out our{" "}
                <Link
                  href="/guides"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Guides
                </Link>
                .
              </p>
            </Section>

            <Section id="faq" title="Common Questions">
              <div className="space-y-6">
                <QA q="Is Evven free to use?">
                  Yes. The Personal plan is free forever and covers unlimited
                  personal expenses and up to 3 groups. Paid Team and
                  Enterprise plans add unlimited groups, recurring expenses,
                  and advanced controls.
                </QA>
                <QA q="Do the people I split with need an account?">
                  They&apos;ll need an account to view balances and add their
                  own expenses, but joining is free and takes seconds via an
                  invite link.
                </QA>
                <QA q="Can I edit or delete an expense after adding it?">
                  Yes — any member who can see the expense can edit its
                  details or remove it. Changes update balances for everyone
                  in the group instantly.
                </QA>
                <QA q="Does Evven handle payments?">
                  No. Evven calculates who owes what, but doesn&apos;t move
                  money. You settle up using whatever payment method your
                  group prefers, then mark it as settled in the app.
                </QA>
              </div>
            </Section>

            <Section id="account" title="Account & Billing">
              <div className="space-y-6">
                <QA q="How do I change my email or password?">
                  Head to your profile settings from the dashboard. If
                  you&apos;ve forgotten your password, use the &quot;Forgot
                  password&quot; link on the login page to reset it via email.
                </QA>
                <QA q="How do I upgrade or downgrade my plan?">
                  Plan changes can be made from your account settings.
                  Upgrades apply immediately; downgrades take effect at the
                  end of your current billing period.
                </QA>
                <QA q="How do I delete my account?">
                  You can delete your account from account settings at any
                  time. Your personal data is removed within 30 days, as
                  described in our{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                  .
                </QA>
              </div>
            </Section>

            <Section id="groups-expenses" title="Groups & Expenses">
              <div className="space-y-6">
                <QA q="How do I invite someone to a group?">
                  Open the group, copy the invite link, and send it however
                  you like — chat, email, text. Anyone with the link can join
                  after creating a free account.
                </QA>
                <QA q="Can I remove someone from a group?">
                  Group admins can remove members. Past expenses involving
                  that member remain visible for record-keeping, but they
                  won&apos;t be included in future splits.
                </QA>
                <QA q="What split options are available?">
                  You can split an expense evenly, by percentage, or by exact
                  custom amounts per person — chosen individually for each
                  expense.
                </QA>
                <QA q="Can I export my group's expense history?">
                  Expense exports are available on Team and Enterprise plans.
                  Export your group&apos;s history as a spreadsheet from the
                  group settings menu.
                </QA>
              </div>
            </Section>

            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <QA q="A balance looks wrong — what should I check?">
                  Double-check the split type and included members on each
                  expense — a single miscategorized expense can throw off the
                  whole balance. If it still looks off after reviewing, reach
                  out and we&apos;ll take a look.
                </QA>
                <QA q="I didn't get a verification or reset email.">
                  Check your spam folder first. If it&apos;s not there, wait a
                  few minutes and try resending — our emails are sent via
                  Resend and occasionally get delayed by provider-side
                  filtering.
                </QA>
                <QA q="The app feels slow or isn't loading.">
                  Try refreshing or clearing your browser cache. If the issue
                  persists, check our{" "}
                  <Link
                    href="/status"
                    className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    status page
                  </Link>{" "}
                  for any ongoing incidents.
                </QA>
              </div>
            </Section>

            <Section id="contact" title="Contact Support">
              <p>
                Can&apos;t find what you&apos;re looking for? We&apos;re a
                small team and read every message ourselves.
              </p>
              <a
                href="mailto:hello@evven.xyz"
                className="mt-2 inline-block font-[family-name:var(--font-xanh-mono)] text-lg text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                support@evven.xyz
              </a>
              <p className="text-sm">
                We typically respond within 1–2 business days.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}