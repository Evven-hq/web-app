"use client";

export function HowItWorks() {
  const steps = [
    {
      step: "Track",
      title: "Capture every expense",
      desc: "Log payments instantly, categorize bills, and add notes so your group always knows who paid what.",
    },
    {
      step: "Split",
      title: "Split it your way",
      desc: "Choose split methods for each expense and let Evven handle exact shares for each person.",
    },
    {
      step: "Settle",
      title: "Close the loop",
      desc: "Review group balances, send settlement reminders, and record reimbursements with a few clicks.",
    },
  ];

  return (
    <section id="how-it-works" className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">How It Works</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Three simple steps to manage group expenses.
          </h2>
        </div>

        <div className="space-y-12">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="grid gap-8 sm:grid-cols-[120px_1fr] items-start pb-12 border-b border-[var(--evven-border)]"
            >
              <div>
                <p className="text-sm uppercase tracking-wide text-[var(--evven-text-muted)]">
                  {item.step}
                </p>
                <div className="mt-3 w-10 h-10 rounded-lg bg-[var(--evven-accent-primary)] text-white flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-[var(--evven-text-primary)]">
                  {item.title}
                </h3>
                <p className="text-lg text-[var(--evven-text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
