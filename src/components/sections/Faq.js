import { faqs } from "@/data/faq";

export function Faq() {
  return (
    <section id="faq" className="bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Everything you need to know before connecting Zerodha.
          </h2>
        </div>
        <div className="space-y-6">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-xl font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-white/70">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

