import SubscribeForm from "@/components/stripe/SubscribeForm";

export const metadata = {
  title: "Subscribe | PulseIQ",
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-center">
        <h1 className="text-4xl font-semibold">Upgrade to PulseIQ Pro</h1>
        <p className="text-white/70">
          Unlock intraday AI nudges, unlimited alerts, and premium automations.
          Billing handled securely by Stripe.
        </p>
        <SubscribeForm />
      </div>
    </div>
  );
}

