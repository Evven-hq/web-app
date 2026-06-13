"use client";

const testimonials = [
  {
    quote:
      "Our team used to argue about who covered the last client lunch. Now everyone can see exactly where things stand.",
    name: "Priya N.",
    role: "Operations Lead",
  },
  {
    quote:
      "Running our club's events got so much easier. Dues, supplies, venue costs — all split and tracked automatically.",
    name: "Marcus T.",
    role: "Club Treasurer",
  },
];

export function TeamsTestimonials() {
  return (
    <section className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Testimonials</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Trusted by teams everywhere.
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