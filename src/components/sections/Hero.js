import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/globe.svg"
          alt="Background grid"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 text-center md:py-32">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
          <Sparkles size={14} />
          Zerodha + AI copilot
        </div>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
          Trade with confidence. PulseIQ watches your Zerodha portfolio 24/7.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/70 md:text-xl">
          Connect Kite in 90 seconds, stream live P&L, and let our research-grade
          AI push timely buy/sell nudges, risk flags, and curated news the moment
          things change.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button as="a" href="/dashboard" className="gap-2 text-base">
            Launch dashboard
            <ArrowRight size={16} />
          </Button>
          <Button
            as="a"
            href="https://demo.pulseiq.money"
            variant="secondary"
            className="gap-2 text-base"
          >
            <PlayCircle size={16} />
            Watch 2-min demo
          </Button>
        </div>
        <div className="glass glow mx-auto w-full max-w-4xl rounded-3xl border border-white/10 p-6 text-left">
          <p className="text-sm text-white/60">Live insight example</p>
          <p className="mt-3 text-lg text-white">
            “Raise stop loss on TCS (+18% gain). Q3 earnings beat + bullish
            options flow. Consider trimming 20% before Friday close.”
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">
              AI conviction: 87%
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Confidence: high
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Time to act: 2h
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

