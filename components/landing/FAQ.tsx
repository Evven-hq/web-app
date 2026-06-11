"use client";

const faqs = [
  {
    question: "Can I use EvenUp for recurring expenses?",
    answer:
      "Yes. You can track subscriptions, monthly bills, and repeated payments with flexible split options.",
  },
  {
    question: "Is my data shared securely?",
    answer:
      "Your expense history is stored securely and only visible to the people in your group.",
  },
  {
    question: "Do I need to pay to start?",
    answer:
      "You can get started for free with the basic plan and upgrade only when your group needs advanced reporting.",
  },
];

export function FAQ() {
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
