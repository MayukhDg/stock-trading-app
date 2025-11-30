import { features } from "@/data/features";

export function Features() {
  return (
    <section id="features" className="border-b border-white/5 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            Intelligent automation
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Built for active investors who want institutional-grade signals.
          </h2>
          <p className="mt-4 text-white/70">
            PulseIQ pairs Zerodha market data with macro feeds, options flow,
            and AI scoring to alert you before risk creeps in. Every insight is
            explainable and backed by live data.
          </p>
        </div>
        <div className="space-y-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="glass rounded-2xl border border-white/10 p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                {feature.badge}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-white/70">{feature.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

