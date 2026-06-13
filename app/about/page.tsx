import Link from "next/link";
import Image from "next/image";

const sections = [
  { id: "mission", label: "Mission" },
  { id: "story", label: "The Story" },
  { id: "how-it-works", label: "How It Works" },
  { id: "values", label: "Values" },
  { id: "team", label: "Team" },
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <p className="font-[family-name:var(--font-xanh-mono)] text-4xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AboutPage() {
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
            Company
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-xanh-mono)] font-bold text-5xl tracking-tight md:text-7xl">
            About Evven
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            We built Evven because splitting shared costs with people you care
            about shouldn&apos;t be awkward. Money is already complicated — the
            tools you use to manage it shouldn&apos;t be.
          </p>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <Stat value="2025" label="Year founded" />
            <Stat value="4" label="People building it" />
            <Stat value="$0" label="Raised (bootstrapped)" />
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
            <Section id="mission" title="Mission">
              <p>
                Shared costs are part of every relationship — with roommates,
                travel friends, teammates, and partners. The math is rarely
                the problem. The awkwardness is.
              </p>
              <p>
                Evven exists to make the money part of shared living
                invisible. Not to think about it, not to argue about it — just
                handled. Fair, clear, and out of the way so you can get back
                to the things that actually matter.
              </p>
              <p className="rounded-lg border border-border bg-white/[0.02] p-4 text-sm">
                Our goal: be the last expense-splitting app you ever need to
                download.
              </p>
            </Section>

            <Section id="story" title="The Story">
              <p>
                Evven started as a side project after one too many awkward
                group chat moments trying to figure out who owed what after a
                trip. The existing tools were either too complicated, too
                ugly, or required everyone to sign up before they could see
                a single number.
              </p>
              <p>
                We wanted something that just worked — fast to set up, simple
                to understand at a glance, and fair by default. So we built it.
              </p>
              <p className="text-sm">
                Evven launched publicly in 2025 and has been growing steadily
                through word of mouth ever since — no ads, no growth hacks,
                just people sharing it with the groups they use it with.
              </p>
            </Section>

            <Section id="how-it-works" title="How It Works">
              <p>
                Evven is a shared expense tracker. You create a group, add the
                people in it, and log expenses as they happen. Evven handles
                the math and shows everyone exactly where things stand.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                <Item label="Groups">
                  One space per shared context — a flat, a trip, a team.
                  Everyone in the group sees the same picture.
                </Item>
                <Item label="Expenses">
                  Log who paid, who&apos;s included, and how to split it.
                  Even, by percentage, or custom amounts.
                </Item>
                <Item label="Balances">
                  Live running totals. No spreadsheet, no manual tallying —
                  just who owes what to whom, right now.
                </Item>
                <Item label="Settling up">
                  Mark payments as settled. The balance updates instantly
                  for everyone in the group.
                </Item>
              </div>
            </Section>

            <Section id="values" title="Values">
              <p>
                These are the things we refuse to compromise on, even when
                they make the product harder to build.
              </p>
              <ul className="mt-1 space-y-2 text-sm">
                {[
                  "Transparency first. Every number in Evven should be explainable and verifiable by anyone in the group.",
                  "No dark patterns. We don't hide features behind confusing UI or engineer accidental upgrades.",
                  "Privacy by default. We collect only what we need and never sell your data.",
                  "Fair by design. The default split is always equal — fairness shouldn't require extra steps.",
                  "Honest pricing. The free tier is genuinely useful. Paid plans exist for teams that need more, not to paywalled things that should be free.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="team" title="Team">
                <p>
                    Evven is a tiny team. We&apos;re builders who got frustrated
                    with the tools that existed and decided to make something
                    better.
                </p>

                <div className="mt-2 space-y-3 rounded-lg border border-border bg-white/[0.02] p-5">
                    <Item label="Jagdeep Singh">
                        Founder & Founding Engineer. Building the product and keeping the
                        lights on.
                    </Item>

                    <Item label="Krishna Gupta">
                        Founding Engineer. Helping build and scale Evven from the
                        ground up.
                    </Item>

                    <Item label="Rohit Singh Rajput">
                        Founding Engineer. Contributing to product development and
                        core platform features.
                    </Item>

                    <Item label="Keshav Gupta">
                        Founding Engineer. Focused on engineering, infrastructure,
                        and reliability.
                    </Item>

                    <Item label="Open roles">
                    We&apos;re a small team and not currently hiring, but if
                    you&apos;re passionate about what we&apos;re building, reach
                    out anyway.
                    </Item>
                </div>

                <p className="text-sm">
                    We&apos;re based wherever we have a good internet connection.
                    Evven is a remote-first, async-first team.
                </p>
                </Section>

            <Section id="contact" title="Contact">
              <p>
                Questions, feedback, partnership ideas, or just want to say
                hello — we actually read every email.
              </p>
              <a
                href="mailto:hello@evven.xyz"
                className="mt-2 inline-block font-[family-name:var(--font-xanh-mono)] text-lg text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                hello@evven.xyz
              </a>
              <p className="mt-6 text-sm">
                You can also find us on{" "}
                <a
                  href="https://github.com/Evven-hq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  GitHub
                </a>{" "}
                — the codebase is public and we welcome issues and
                contributions.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}