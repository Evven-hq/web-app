"use client";

const faqs = [
  {
    question: "Does Evven support SSO?",
    answer:
      "Yes. Enterprise plans support SSO via SAML and OIDC, along with SCIM provisioning for automated user management.",
  },
  {
    question: "How is our data secured?",
    answer:
      "All data is encrypted in transit and at rest, with role-based access controls and detailed audit logs for every action.",
  },
  {
    question: "Can we get a custom contract and SLA?",
    answer:
      "Yes. Enterprise and Enterprise Plus plans include custom contracts, dedicated support, and tailored SLAs.",
  },
];

export function EnterpriseFAQ() {
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