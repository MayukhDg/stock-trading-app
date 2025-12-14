import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { ConnectZerodhaCard } from "@/components/dashboard/ConnectZerodhaCard";
import { UserButtonWrapper } from "@/components/dashboard/UserButtonWrapper";
import { InsightFeed } from "@/components/dashboard/InsightFeed";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PortfolioTable } from "@/components/dashboard/PortfolioTable";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { dbConnect } from "@/lib/db";
import { BrokerLink, Holdings } from "@/models";
import { fetchHoldings } from "@/lib/zerodha";
import { generateInsights } from "@/lib/ai";
import { fetchNews } from "@/lib/news";

function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

function calculateStats(holdings) {
  if (!holdings || holdings.length === 0) {
    return [
      { label: "Net worth", value: "₹0" },
      { label: "Day P&L", value: "₹0" },
      { label: "Total holdings", value: "0" },
    ];
  }

  const netWorth = holdings.reduce((sum, h) => {
    const currentValue = (h.quantity || 0) * (h.ltp || h.last_price || 0);
    return sum + currentValue;
  }, 0);

  const dayPnl = holdings.reduce((sum, h) => {
    const pnl = h.pnl || 0;
    return sum + pnl;
  }, 0);

  const dayPnlPercent =
    netWorth > 0 ? ((dayPnl / (netWorth - dayPnl)) * 100).toFixed(2) : 0;

  return [
    {
      label: "Net worth",
      value: formatCurrency(netWorth),
      delta: dayPnlPercent > 0 ? `+${dayPnlPercent}%` : `${dayPnlPercent}%`,
    },
    {
      label: "Day P&L",
      value: dayPnl >= 0 ? `+${formatCurrency(dayPnl)}` : formatCurrency(dayPnl),
      delta: dayPnlPercent > 0 ? `+${dayPnlPercent}%` : `${dayPnlPercent}%`,
    },
    {
      label: "Total holdings",
      value: `${holdings.length} stocks`,
    },
  ];
}

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  
  if (!userId || !user) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <p>Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  await dbConnect();
  const brokerLink = await BrokerLink.findOne({ userId }).lean();

  const isConnected = !!brokerLink?.accessToken;

  let holdings = [];
  let insights = [];
  let news = [];
  let stats = [];

  console.log("Broker link:", brokerLink);

  
  if (isConnected) {
    try {
      // Fetch holdings from Zerodha
      const holdingsData = await fetchHoldings({
        accessToken: brokerLink.accessToken,
      });

      // Transform holdings data to match expected format
      holdings = (holdingsData?.data || []).map((h) => ({
        symbol: h.tradingsymbol || h.symbol || "N/A",
        quantity: h.quantity || 0,
        averagePrice: h.average_price || 0,
        ltp: h.last_price || h.ltp || 0,
        pnl: h.pnl || 0,
        last_price: h.last_price || h.ltp || 0,
      }));

      // Update holdings in database using Mongoose
      await Holdings.findOneAndUpdate(
        { userId },
        {
          $set: {
            userId,
            holdings,
            syncedAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      // Calculate stats from real holdings
      stats = calculateStats(holdings);

      // Fetch news for holdings
      if (holdings.length > 0) {
        const tickers = holdings.map((h) => h.symbol);
        try {
          const newsData = await fetchNews({ tickers });
          news = (newsData || []).slice(0, 5).map((item, index) => ({
            url: item.url || "#",
            source: item.source?.name || "Unknown",
            title: item.title || "",
            summary: item.description || "",
            publishedAt: item.publishedAt
              ? new Date(item.publishedAt).toLocaleString()
              : "Recently",
          }));
        } catch (error) {
          console.error("Failed to fetch news:", error);
        }

        // Generate AI insights
        try {
          const insightsData = await generateInsights({
            holdings: holdings.map((h) => ({
              symbol: h.symbol,
              quantity: h.quantity,
              pnl: h.pnl,
            })),
            news,
          });
          insights = (insightsData || []).map((insight, index) => ({
            id: `insight-${index}`,
            ticker: insight.ticker || insight.symbol || "N/A",
            recommendation: insight.recommendation || insight.action || "Hold",
            rationale: insight.rationale || insight.reason || "",
            time: "Just now",
          }));
        } catch (error) {
          console.error("Failed to generate insights:", error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Dashboard Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            PulseIQ
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Home
            </Link>
            <UserButtonWrapper />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            PulseIQ dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="text-white/70">
            {isConnected
              ? "Your Zerodha portfolio is protected by live automations and AI monitoring."
              : "Connect your Zerodha account to start analyzing your portfolio with AI."}
          </p>
        </header>

        {isConnected ? (
          <>
            <StatsSummary stats={stats} />
            {holdings.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                  <PortfolioTable holdings={holdings} />
                </div>
                <div className="space-y-6">
                  <InsightFeed insights={insights} />
                  <NewsFeed items={news} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <PortfolioTable holdings={[]} />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-white/70">
                    Your Zerodha account is connected! 
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    Your portfolio holdings will appear here once you have investments in your Zerodha account.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl">
            <ConnectZerodhaCard />
          </div>
        )}
      </div>
    </div>
  );
}