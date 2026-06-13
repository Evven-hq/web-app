"use client";

export function TeamsHowItWorks() {
  const steps = [
    {
      step: "Create",
      title: "Spin up a workspace",
      desc: "Set up a shared space for your team, project, or club and invite everyone in seconds.",
    },
    {
      step: "Assign",
      title: "Log and split costs",
      desc: "Add expenses as they happen and split them by share, role, or custom rules — Evven handles the math.",
    },
    {
      step: "Reconcile",
      title: "Stay in sync",
      desc: "Track balances across the team, send reminders, and close out shared costs without back-and-forth.",
    },
  ];

  return (
    <section id="how-it-works" className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">How It Works</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Three simple steps to manage team expenses.
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