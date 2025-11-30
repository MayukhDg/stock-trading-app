import { Button } from "../ui/button";

export function ConnectZerodhaCard() {
  return (
    <div className="glass rounded-2xl border border-white/10 p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
        Step 1
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">
        Link your Zerodha account
      </h3>
      <p className="mt-2 text-white/70">
        Redirect securely to Kite. We use read-only scopes, encrypt refresh
        tokens, and never store login passwords.
      </p>
      <form action="/api/zerodha/link" method="POST" className="mt-6 space-y-3">
        <input
          type="text"
          name="requestToken"
          placeholder="Paste request token"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
          required
        />
        <Button type="submit" className="w-full">
          Connect Zerodha
        </Button>
      </form>
      <p className="mt-4 text-xs text-white/40">
        Need help? Follow the 2 min guide in docs → Zerodha connect.
      </p>
    </div>
  );
}

