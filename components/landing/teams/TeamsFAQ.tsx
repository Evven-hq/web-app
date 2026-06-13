"use client";

const faqs = [
  {
    question: "How many people can join a team workspace?",
    answer:
      "Starter workspaces support up to 5 members. Team and Business plans support unlimited members.",
  },
  {
    question: "Can I have multiple workspaces?",
    answer:
      "Yes, Business plans support multiple workspaces — useful for organizations with several departments or projects.",
  },
  {
    question: "Can members have different permission levels?",
    answer:
      "Yes. You can assign admins, members, and viewers so the right people can add, approve, or just monitor spend.",
  },
];

export function TeamsFAQ() {
  return (
    <section id="faq" className="section-animate bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">FAQ</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Got questions? We have answers.
          </h2>
        </div>

        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="space-y-4 pb-8 border-b border-[var(--evven-border)]">
              <h3 className="text-lg font-semibold text-[var(--evven-text-primary)]">
                {faq.question}
              </h3>
              <p className="text-[var(--evven-text-muted)] leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}