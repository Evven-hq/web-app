import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "basics", label: "Basics" },
  { id: "groups", label: "Groups" },
  { id: "expenses", label: "Expenses & Splitting" },
  { id: "balances", label: "Balances & Settling" },
  { id: "teams", label: "Teams & Roles" },
  { id: "tips", label: "Tips & Tricks" },
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

function GuideCard({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
          {time}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function GuidesPage() {
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
            Resources
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            Guides
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Short, practical walkthroughs for getting the most out of Evven —
            from your first group to advanced splitting and team workflows.
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
            <Section id="basics" title="Basics">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideCard
                  title="Creating your account"
                  description="Sign up with your name, email, and a password. No credit card needed to get started on the free plan."
                  time="2 min"
                />
                <GuideCard
                  title="Navigating the dashboard"
                  description="A quick tour of your dashboard — where to find your groups, balances, and recent activity at a glance."
                  time="3 min"
                />
              </div>
            </Section>

            <Section id="groups" title="Groups">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideCard
                  title="Creating a group"
                  description="Set up a group for a trip, household, or project and give it a name everyone will recognize."
                  time="2 min"
                />
                <GuideCard
                  title="Inviting members"
                  description="Share an invite link with anyone — they can join in seconds, even if they've never used Evven before."
                  time="2 min"
                />
                <GuideCard
                  title="Managing group members"
                  description="Add, remove, or adjust roles for members as your group changes over time."
                  time="3 min"
                />
                <GuideCard
                  title="Archiving a group"
                  description="Wrap up a finished trip or project by archiving its group — balances stay visible, but new expenses are locked."
                  time="2 min"
                />
              </div>
            </Section>

            <Section id="expenses" title="Expenses & Splitting">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideCard
                  title="Adding your first expense"
                  description="Log who paid, what it was for, and who's splitting it — Evven does the math from there."
                  time="2 min"
                />
                <GuideCard
                  title="Splitting evenly, by percentage, or custom"
                  description="Choose the split type that fits each expense, down to exact amounts per person if needed."
                  time="4 min"
                />
                <GuideCard
                  title="Editing and deleting expenses"
                  description="Fix a typo or remove a duplicate — changes update everyone's balance instantly."
                  time="2 min"
                />
                <GuideCard
                  title="Setting up recurring expenses"
                  description="Automate monthly bills like rent or subscriptions so they're logged without manual entry. (Team plans and above)"
                  time="3 min"
                />
              </div>
            </Section>

            <Section id="balances" title="Balances & Settling">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideCard
                  title="Understanding your balance"
                  description="What 'you owe' and 'you're owed' actually mean, and how Evven nets out multi-person debts."
                  time="3 min"
                />
                <GuideCard
                  title="Marking a payment as settled"
                  description="Once money has changed hands outside Evven, mark it settled so balances reflect reality."
                  time="2 min"
                />
                <GuideCard
                  title="Sending a settle-up reminder"
                  description="Nudge group members who still owe their share, without the awkward group chat message."
                  time="2 min"
                />
              </div>
            </Section>

            <Section id="teams" title="Teams & Roles">
              <div className="grid gap-4 sm:grid-cols-2">
                <GuideCard
                  title="Setting up a team workspace"
                  description="Create a dedicated workspace for your team, club, or department, separate from personal groups."
                  time="3 min"
                />
                <GuideCard
                  title="Assigning roles and permissions"
                  description="Give people admin, member, or viewer access depending on how involved they should be."
                  time="3 min"
                />
                <GuideCard
                  title="Exporting expense reports"
                  description="Download a spreadsheet of your group's full expense history for record-keeping or reimbursement."
                  time="2 min"
                />
              </div>
            </Section>

            <Section id="tips" title="Tips & Tricks">
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Add expenses as they happen — it takes seconds and keeps balances accurate without a big catch-up session later.",
                  "Use descriptive names for expenses ('Friday groceries' vs. 'stuff') so balances make sense weeks later.",
                  "Settle up regularly in smaller groups to avoid large balances building up over time.",
                  "Pin a group's invite link somewhere your group already chats, so new members can join without asking.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="rounded-lg border border-border bg-white/[0.02] p-4 text-sm">
                Still have questions? Visit{" "}
                <Link
                  href="/support"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Support
                </Link>{" "}
                or email{" "}
                <span className="font-medium text-foreground">
                  hello@evven.xyz
                </span>
                .
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}