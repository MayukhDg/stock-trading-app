import { plans } from "@/data/plans";
import { Button } from "../ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-white/5 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Simple pricing for investors, pros, and funds.
          </h2>
          <p className="mt-3 text-white/70">
            Billing via Stripe. Cancel anytime. Pro plan includes 14-day free
            trial and unlimited AI calls with fair-use throttling.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border ${
                plan.featured
                  ? "border-emerald-400 bg-gradient-to-b from-emerald-500/10 to-slate-900"
                  : "border-white/10 bg-slate-900/40"
              } p-6`}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                {plan.name}
              </p>
              <p className="mt-4 text-4xl font-semibold text-white">
                {plan.price}
              </p>
              <p className="mt-2 text-sm text-white/70">{plan.tagline}</p>
              <Button as="a" href={plan.href} className="mt-6 w-full">
                {plan.cta}
              </Button>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

