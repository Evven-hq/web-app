"use client";

export function EnterpriseHowItWorks() {
  const steps = [
    {
      step: "Onboard",
      title: "Set up your organization",
      desc: "Connect your identity provider, import your org structure, and define departments and roles.",
    },
    {
      step: "Configure",
      title: "Set policies and workflows",
      desc: "Define spend limits, approval chains, and reporting categories that match how your org operates.",
    },
    {
      step: "Monitor",
      title: "Track and report",
      desc: "Get real-time visibility into spend across every department, with exportable reports for audits.",
    },
  ];

  return (
    <section id="how-it-works" className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">How It Works</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Get your organization set up in three steps.
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