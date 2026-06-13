"use client";

const useCases = [
  {
    title: "Offices & Departments",
    description: "Track team lunches, supplies, and shared subscriptions without messy spreadsheets.",
  },
  {
    title: "Project Teams",
    description: "Split client dinners, travel, and tools across contributors, even on short-term projects.",
  },
  {
    title: "Clubs & Communities",
    description: "Manage dues, event costs, and group purchases with full transparency for every member.",
  },
];

export function TeamsUseCases() {
  return (
    <section className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Use Cases</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Built for teams of every shape.
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