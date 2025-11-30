const steps = [
  {
    step: "01",
    title: "Link Zerodha",
    copy: "OAuth via Kite Connect with read-only scopes. Tokens are encrypted, rotated, and revocable anytime.",
  },
  {
    step: "02",
    title: "Stream holdings",
    copy: "We hydrate MongoDB with holdings, trades, option greeks, and corporate actions every few minutes.",
  },
  {
    step: "03",
    title: "AI autopilot",
    copy: "An OpenAI worker merges market data + sentiment feeds, then pushes contextual insights and automations.",
  },
];

export function Steps() {
  return (
    <section
      id="automations"
      className="border-b border-white/5 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Launch in minutes. Let automations watch the market for you.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <article
              key={item.step}
              className="glass flex flex-col gap-4 rounded-2xl border border-white/10 p-6"
            >
              <span className="text-sm font-mono text-white/50">{item.step}</span>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-white/70">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

