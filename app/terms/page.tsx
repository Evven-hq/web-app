import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "acceptance", label: "Acceptance" },
  { id: "description", label: "What Evven Is" },
  { id: "accounts", label: "Your Account" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "expenses-data", label: "Expense Data" },
  { id: "payments", label: "Payments & Plans" },
  { id: "termination", label: "Termination" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Liability" },
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

export default function TermsPage() {
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
        <div className="mb-16 border-b border-border/30 pb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            By using Evven, you agree to these terms. They&apos;re written to be
            readable — not to bury obligations in legalese. Please take a few
            minutes to go through them.
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
            <Section id="acceptance" title="Acceptance of Terms">
              <p>
                By creating an account or using Evven in any way, you confirm
                that you are at least{" "}
                <span className="font-medium text-foreground">13 years old</span>{" "}
                and that you agree to be bound by these Terms of Service and
                our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-sm">
                If you are using Evven on behalf of an organization, you
                represent that you have the authority to bind that organization
                to these terms.
              </p>
            </Section>

            <Section id="description" title="What Evven Is">
              <p>
                Evven is a shared expense tracking tool. It helps groups of
                people — roommates, travel companions, teams, and organizations
                — log costs, calculate fair splits, and track who owes what.
              </p>
              <p className="text-sm">
                Evven does not process payments, hold funds, or act as a
                financial institution. It is a record-keeping and calculation
                tool only. Settling up between members happens outside of
                Evven, through whatever payment method your group chooses.
              </p>
            </Section>

            <Section id="accounts" title="Your Account">
              <p>
                You are responsible for keeping your login credentials secure
                and for all activity that occurs under your account.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border/30 bg-white/[0.02] p-5">
                <Item label="Accuracy">
                  Provide accurate information when you sign up and keep it
                  up to date.
                </Item>
                <Item label="Security">
                  Use a strong, unique password. Do not share your credentials
                  with anyone.
                </Item>
                <Item label="Notification">
                  Tell us immediately at{" "}
                  <span className="font-medium text-foreground">
                    hello@evven.xyz
                  </span>{" "}
                  if you suspect unauthorized access to your account.
                </Item>
                <Item label="One account">
                  You may only maintain one personal account. Team and
                  enterprise workspaces are separate.
                </Item>
              </div>
            </Section>

            <Section id="acceptable-use" title="Acceptable Use">
              <p>You agree not to use Evven to:</p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Violate any applicable law or regulation.",
                  "Harass, threaten, or defraud other users.",
                  "Attempt to gain unauthorized access to any part of the service or another user's account.",
                  "Scrape, crawl, or systematically extract data from the platform.",
                  "Upload malicious code, files, or content of any kind.",
                  "Impersonate any person or organization.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="rounded-lg border border-border/30 bg-white/[0.02] p-4 text-sm">
                We reserve the right to suspend or terminate accounts that
                violate these rules without prior notice.
              </p>
            </Section>

            <Section id="expenses-data" title="Expense Data">
              <p>
                Expense data you create belongs to you and the members of your
                group. When you add an expense, it becomes visible to all
                members of that group — this is core to how Evven works.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border/30 bg-white/[0.02] p-5">
                <Item label="Your data">
                  You retain ownership of the data you enter. We do not sell
                  it or share it outside your group.
                </Item>
                <Item label="Accuracy">
                  You are responsible for the accuracy of expenses you log.
                  Evven cannot verify amounts or descriptions.
                </Item>
                <Item label="Disputes">
                  Disputes between group members about logged expenses are
                  between those members. Evven does not arbitrate.
                </Item>
              </div>
            </Section>

            <Section id="payments" title="Payments & Plans">
              <p>
                Evven offers a free tier alongside paid Team and Enterprise
                plans. Paid plans are billed in advance on a monthly or annual
                basis.
              </p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Subscription fees are non-refundable except where required by law.",
                  "We may change pricing with at least 30 days' notice before your next billing cycle.",
                  "Downgrading your plan takes effect at the end of the current billing period.",
                  "Failure to pay may result in suspension of your paid features.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="termination" title="Termination">
              <p>
                You can delete your account at any time from your account
                settings. We will delete your personal data within{" "}
                <span className="font-medium text-foreground">30 days</span>{" "}
                of deletion, per our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-sm">
                We may suspend or terminate your account if you violate these
                terms, engage in conduct harmful to other users, or if we
                discontinue the service. Where possible, we will give you
                reasonable notice before doing so.
              </p>
            </Section>

            <Section id="disclaimers" title="Disclaimers">
              <p>
                Evven is provided{" "}
                <span className="font-medium text-foreground">&quot;as is&quot;</span>{" "}
                and{" "}
                <span className="font-medium text-foreground">&quot;as available&quot;</span>{" "}
                without warranties of any kind, either express or implied.
              </p>
              <p className="text-sm">
                We do not warrant that the service will be uninterrupted,
                error-free, or free of harmful components. Evven is a
                calculation and record-keeping tool — financial decisions made
                based on data in Evven are your own responsibility.
              </p>
            </Section>

            <Section id="liability" title="Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Evven and its
                founders, employees, and contractors shall not be liable for
                any indirect, incidental, special, consequential, or punitive
                damages arising from your use of the service.
              </p>
              <p className="rounded-lg border border-border/30 bg-white/[0.02] p-4 text-sm">
                Our total liability to you for any claim arising out of or
                relating to these terms or the service shall not exceed the
                greater of{" "}
                <span className="font-medium text-foreground">$50</span> or
                the amount you paid us in the{" "}
                <span className="font-medium text-foreground">
                  12 months
                </span>{" "}
                preceding the claim.
              </p>
            </Section>

            <Section id="changes" title="Changes to These Terms">
              <p>
                We may update these terms as the product evolves. For material
                changes, we will notify you by email at least{" "}
                <span className="font-medium text-foreground">14 days</span>{" "}
                before they take effect. Continued use of Evven after that date
                means you accept the revised terms.
              </p>
              <p className="text-sm">
                Minor changes — typo fixes, clarifications, reorganizations —
                may be made without notice. The &quot;last updated&quot; date at the
                top of this page always reflects the most recent revision.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>Questions about these terms — we&apos;re at:</p>
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