"use client";

import { useState } from "react";

import { Button } from "../ui/button";

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleCheckout}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
          Pro plan
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">₹999 / month</p>
        <p className="text-white/60">14-day free trial. Cancel anytime.</p>
      </div>
      <ul className="space-y-2 text-sm text-white/70">
        <li>✓ Intraday AI insights</li>
        <li>✓ Unlimited alerts & news</li>
        <li>✓ WhatsApp automation</li>
      </ul>
      <Button type="submit" disabled={loading}>
        {loading ? "Redirecting..." : "Secure checkout"}
      </Button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}

