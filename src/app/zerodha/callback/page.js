'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function ZerodhaCallbackPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const request_token = params.get('request_token') || params.get('requestToken');
    if (!request_token) {
      setError('Missing request_token in URL');
      return;
    }

    if (!isSignedIn) {
      const redirect = `/zerodha/callback?request_token=${encodeURIComponent(request_token)}`;
      window.location.href = `/sign-in?redirect=${encodeURIComponent(redirect)}`;
      return;
    }

    (async () => {
      try {
        // Send as application/x-www-form-urlencoded and include cookies
        const body = new URLSearchParams({ requestToken: request_token });

        const res = await fetch('/api/zerodha/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
          credentials: 'include',
        });

        if (res.ok) {
          router.replace('/dashboard?linked=success');
          return;
        }

        const payload = await res.json().catch(() => ({}));
        // If server indicates token expired/invalid, restart the Kite login flow automatically
        if (payload?.error === 'token_expired' && payload?.action) {
          // Start a fresh login flow
          window.location.href = payload.action;
          return;
        }

        setError(payload.error || payload.detail || 'Failed to link Zerodha');
      } catch (err) {
        setError(err.message || 'Network error');
      }
    })();
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="max-w-md rounded-lg border border-white/10 bg-white/5 p-6 text-center">
        {error ? (
          <>
            <h2 className="text-lg font-semibold">Zerodha link error</h2>
            <p className="mt-3 text-sm text-white/70">{error}</p>
            <div className="mt-4">
              <a href="/dashboard" className="underline">Return to dashboard</a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Linking your Zerodha account…</h2>
            <p className="mt-3 text-sm text-white/70">Please wait, this may take a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}
