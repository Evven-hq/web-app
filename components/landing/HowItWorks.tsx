"use client";

export function HowItWorks() {
  const steps = [
    {
      step: "Track",
      title: "Capture every expense",
      desc: "Snap a receipt or log it in seconds. Tag who paid and who's in — Evven remembers so you don't have to.",
    },
    {
      step: "Split",
      title: "Split it your way",
      desc: "Even, by percentage, or custom shares — choose per expense. Evven calculates exact amounts so there's never a debate.",
    },
    {
      step: "Settle",
      title: "Close the loop",
      desc: "See live balances, send a settlement reminder, and mark it paid. Done in five minutes, not five arguments.",
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
