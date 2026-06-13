"use client";

const useCases = [
  {
    title: "Finance Teams",
    description: "Centralize approvals, enforce spend policy, and close the books faster with clean audit trails.",
  },
  {
    title: "Multi-Department Orgs",
    description: "Give every department its own workspace while finance keeps a unified view across the company.",
  },
  {
    title: "Global Teams",
    description: "Manage cross-office and cross-currency expenses with consistent policy and reporting everywhere.",
  },
];

export function EnterpriseUseCases() {
  return (
    <section className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Use Cases</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Built for organizations of every size.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="space-y-4">
              <h3 className="text-2xl font-semibold">{useCase.title}</h3>
              <p className="text-[var(--evven-text-muted)] leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}