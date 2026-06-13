"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Personal",
    price: "Free",
    desc: "For individuals and casual groups.",
    features: [
      "Up to 3 groups",
      "Shared expenses",
      "Automatic balances",
    ],
  },
  {
    name: "Teams",
    price: "$9/mo",
    desc: "For active groups managing expenses together.",
    features: [
      "Unlimited groups",
      "Unlimited members",
      "Expense exports",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations with advanced requirements.",
    features: [
      "Admin controls",
      "Audit logs",
      "Priority support",
    ],
  },
];

export function TeamsPricing() {
  return (
    <section
      id="pricing"
      className="section-animate px-6 py-24 sm:py-32 bg-[var(--evven-background)]"
    >
      <div className="mx-auto max-w-5xl">
        <div className="space-y-6 mb-16">
          <p className="section-label">Pricing</p>
          <h2 className="text-5xl sm:text-6xl font-heading tracking-tight">
            Plans that scale with your team.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`space-y-6 p-8 rounded-2xl border ${
                plan.featured
                  ? "border-[var(--evven-accent-primary)] bg-white"
                  : "border-[var(--evven-border)] bg-white"
              }`}
            >
              <div>
                <p className="text-sm uppercase tracking-wide text-[var(--evven-text-muted)]">
                  {plan.name}
                </p>

                <p className="mt-4 text-4xl font-semibold">
                  {plan.price}
                </p>

                <p className="mt-3 text-[var(--evven-text-muted)]">
                  {plan.desc}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <p
                    key={feature}
                    className="text-[var(--evven-text-muted)]"
                  >
                    ✓ {feature}
                  </p>
                ))}
              </div>

              <Link href="/signup">
                <Button className="w-full rounded-full py-3 bg-[var(--evven-accent-primary)] hover:bg-[var(--evven-accent-primary)]/90 text-white">
                  {plan.name === "Enterprise"
                    ? "Contact Sales"
                    : "Get Started"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}