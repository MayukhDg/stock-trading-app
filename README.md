## PulseIQ – AI-powered Zerodha copilot

This repository contains a full-stack reference implementation for an AI-enhanced stock analysis platform. It showcases how to combine Zerodha (Kite Connect), MongoDB, Clerk, Stripe, and OpenAI into a cohesive experience that continuously analyses a user’s portfolio and pushes contextual tips.

### Stack

- **Next.js 16 / App Router** with Tailwind 4 for UI
- **Clerk** for auth + middleware-protected dashboard/API routes
- **MongoDB** for holdings, recommendations, and subscription metadata
- **Stripe** for paid plans and webhooks
- **Zerodha Kite Connect** helpers for linking accounts and syncing holdings
- **OpenAI + News API** for summarised insights

### Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `env.example` to `.env.local` and populate the secrets:

```bash
cp env.example .env.local
```

   Required values:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `MONGODB_URI`, `MONGODB_DB`
   - `ZERODHA_API_KEY`, `ZERODHA_API_SECRET`
   - `OPENAI_API_KEY`, `NEWS_API_KEY`
   - `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
   - `CRON_SECRET` for scheduled sync protection

3. Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` for the landing page and `/dashboard` (after signing in via Clerk) for the authenticated experience.

### Key folders

- `src/app` – App Router routes (`/`, `/dashboard`, `/subscribe`, API endpoints)
- `src/components` – marketing sections, dashboard widgets, Stripe form
- `src/lib` – integrations (MongoDB, Zerodha, OpenAI, Stripe, News API)
- `src/app/api` – REST endpoints for portfolio sync, AI, news, Stripe checkout, cron worker, etc.

### Operational notes

- Clerk middleware protects all sensitive routes; update `src/middleware.js` if you add new APIs.
- Stripe webhook route requires the raw body, so deploy on the Node runtime and configure the webhook secret.
- The cron endpoint (`/api/cron/sync`) can be scheduled via Vercel cron / GitHub Actions / Teraform using the `CRON_SECRET` header.
- AI/news endpoints gracefully degrade to mock data until keys are present.

Feel free to extend this baseline with your own automation workflows, analytics, or broker integrations. Contributions are welcome!***
