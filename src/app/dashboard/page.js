import { currentUser } from "@clerk/nextjs/server";

import { ConnectZerodhaCard } from "@/components/dashboard/ConnectZerodhaCard";
import { InsightFeed } from "@/components/dashboard/InsightFeed";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PortfolioTable } from "@/components/dashboard/PortfolioTable";
import { StatsSummary } from "@/components/dashboard/StatsSummary";

export default async function DashboardPage() {
  const user = await currentUser();

  const holdings = [
    { symbol: "TCS", quantity: 12, averagePrice: 3401, ltp: 3566, pnl: 1974 },
    { symbol: "HDFCBANK", quantity: 20, averagePrice: 1530, ltp: 1502, pnl: -560 },
    { symbol: "RELIANCE", quantity: 8, averagePrice: 2801, ltp: 2951, pnl: 1200 },
  ];

  const insights = [
    {
      id: "1",
      ticker: "TCS",
      recommendation: "Trail stop-loss to ₹3,420",
      rationale:
        "Q3 beat + positive FII flow. Options skew bullish while IV cooling. Capture profits but stay in trend.",
      time: "Just now",
    },
    {
      id: "2",
      ticker: "HDFCBANK",
      recommendation: "Hold - earnings on Friday",
      rationale:
        "AI risk score high because of slowdown commentary. Avoid fresh exposure until mgmt call.",
      time: "15m ago",
    },
  ];

  const news = [
    {
      url: "https://news.example.com/tcs",
      source: "Bloomberg",
      title: "TCS bags $1B AI transformation deal from EU bank",
      summary:
        "Deal lifts FY25 revenue visibility; analysts expect 40 bps margin expansion over next two quarters.",
      publishedAt: "18m ago",
    },
    {
      url: "https://news.example.com/reliance",
      source: "Moneycontrol",
      title: "Reliance retail arm eyes IPO in 2025, says report",
      summary:
        "PulseIQ flagged position impact (+3.2%) due to valuation unlock and ETF inflows to follow.",
      publishedAt: "1h ago",
    },
  ];

  const stats = [
    { label: "Net worth", value: "₹32.4L", delta: "+1.8%" },
    { label: "Day P&L", value: "+₹42,318", delta: "+0.6%" },
    { label: "Alerts fired", value: "12 this week" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            PulseIQ dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="text-white/70">
            Your Zerodha portfolio is protected by live automations and AI
            monitoring.
          </p>
        </header>
        <StatsSummary stats={stats} />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <ConnectZerodhaCard />
            <PortfolioTable holdings={holdings} />
          </div>
          <div className="space-y-6">
            <InsightFeed insights={insights} />
            <NewsFeed items={news} />
          </div>
        </div>
      </div>
    </div>
  );
}

