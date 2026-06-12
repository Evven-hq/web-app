"use client";

const useCases = [
  {
    title: "Roommates",
    description:
      "Rent, wifi, groceries, and that one person who always 'forgets' their share — Evven keeps it all visible and fair.",
  },
  {
    title: "Trips",
    description:
      "Flights, hotels, that 2am taco run — track it as it happens so settling up after the trip takes minutes, not arguments.",
  },
  {
    title: "Couples",
    description:
      "Shared rent, date nights, joint savings goals — keep your finances transparent without turning every dinner into a budget meeting.",
  },
  {
    title: "Events",
    description:
      "Wedding gifts, group dinners, shared Airbnbs — keep every contribution clear without a single 'wait, did I already pay you back?'",
  },
];

export function UseCases() {
  return (
    <section className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Use Cases</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Works for any group or occasion.
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
