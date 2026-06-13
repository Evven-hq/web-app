"use client";

const testimonials = [
  {
    quote:
      "Evven made our travel planning so much easier. No more calculating who paid for what — everything is clear and fair.",
    name: "Maya R.",
    role: "Travel group organizer",
  },
  {
    quote:
      "My roommates love it. We finally stayed on top of utilities and groceries without uncomfortable money talks.",
    name: "Jordan L.",
    role: "College student",
  },
  {
    quote:
      "We used to spend an hour every month reconciling who owed what. Now it takes two minutes.",
    name: "Priya S.",
    role: "Apartment co-lease, 4 roommates",
  },
];

export function Testimonials() {
  return (
    <section className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Testimonials</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Trusted by groups everywhere.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="space-y-6 pb-12 border-b border-[var(--evven-border)]"
            >
              <p className="text-lg sm:text-xl leading-relaxed text-[var(--evven-text-primary)]">
                "{testimonial.quote}"
              </p>
              <footer className="space-y-1">
                <strong className="block text-base font-semibold text-[var(--evven-text-primary)]">
                  {testimonial.name}
                </strong>
                <p className="text-sm text-[var(--evven-text-muted)]">{testimonial.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
