const integrations = [
  { label: "Zerodha", desc: "Kite Connect + Console" },
  { label: "OpenAI", desc: "GPT-4o insights" },
  { label: "Stripe", desc: "Subscription billing" },
  { label: "MongoDB Atlas", desc: "Portfolio vault" },
  { label: "NewsAPI / Finnhub", desc: "Market news" },
  { label: "Clerk", desc: "Passwordless auth" },
];

export function Integrations() {
  return (
    <section className="border-b border-white/5 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-white/60">
          Connected ecosystem
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {integrations.map((integration) => (
            <article
              key={integration.label}
              className="glass rounded-2xl border border-white/10 p-6 text-center"
            >
              <p className="text-lg font-semibold text-white">
                {integration.label}
              </p>
              <p className="text-sm text-white/60">{integration.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

