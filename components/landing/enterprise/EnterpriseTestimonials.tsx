"use client";

const testimonials = [
  {
    quote:
      "Rolling out Evven across our offices gave finance a single source of truth for shared expenses for the first time.",
    name: "Daniela K.",
    role: "VP of Finance",
  },
  {
    quote:
      "The approval workflows and audit logs made our quarterly review process dramatically faster and easier.",
    name: "Owen R.",
    role: "IT Director",
  },
];

export function EnterpriseTestimonials() {
  return (
    <section className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Testimonials</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Trusted by finance and IT leaders.
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