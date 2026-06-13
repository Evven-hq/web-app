"use client";

const features = [
  {
    title: "SSO & SCIM provisioning",
    description:
      "Integrate with your identity provider for secure single sign-on and automated user provisioning across the org.",
  },
  {
    title: "Approval workflows",
    description:
      "Configure custom approval chains by department, spend limit, or category to keep every expense on policy.",
  },
  {
    title: "Audit logs & reporting",
    description:
      "Get a full audit trail of every transaction and export detailed reports for finance and compliance teams.",
  },
];

export function EnterpriseFeatures() {
  return (
    <section id="features" className="section-animate px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-20">
          <p className="section-label">Core Features</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Everything finance and IT need to manage spend at scale.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="feature-card space-y-4 pt-8 pb-8 border-t border-[var(--evven-border)]"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--evven-accent-secondary)] flex items-center justify-center text-base font-semibold text-[var(--evven-accent-primary)]">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold text-[var(--evven-text-primary)]">
                {feature.title}
              </h3>
              <p className="text-[var(--evven-text-muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}