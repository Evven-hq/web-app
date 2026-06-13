"use client";

const features = [
  {
    title: "No more \"who owes who\"",
    description:
      "Add anyone to a group and every expense logged is instantly visible to everyone. No spreadsheets, no screenshots, no guessing.",
  },
  {
    title: "The math, done for you",
    description:
      "Split evenly, by percentage, or by exact shares. Evven calculates real-time balances so nobody has to pull out a calculator.",
  },
  {
    title: "Settle up in seconds",
    description:
      "See exactly who needs to pay whom, mark it as settled, and move on. No more chasing people for Venmo.",
  },
];

export function Features() {
  return (
    <section id="features" className="section-animate px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-20">
          <p className="section-label">Core Features</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Everything you need to split expenses and settle up.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div key={feature.title} className="feature-card space-y-4 pt-8 pb-8 border-t border-[var(--evven-border)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--evven-accent-secondary)] flex items-center justify-center text-base font-semibold text-[var(--evven-accent-primary)]">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold text-[var(--evven-text-primary)]">{feature.title}</h3>
              <p className="text-[var(--evven-text-muted)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
