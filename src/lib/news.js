const NEWS_ENDPOINT =
  process.env.NEWS_API_URL || "https://newsapi.org/v2/everything";

export async function fetchNews({ tickers = [] }) {
  if (!process.env.NEWS_API_KEY) {
    return [
      {
        url: "https://news.placeholder.dev/pulseiq",
        source: "PulseIQ",
        title: "Connect NewsAPI to unlock live coverage",
        summary: "Set NEWS_API_KEY to receive curated updates for your holdings.",
        publishedAt: "Just now",
      },
    ];
  }

  const url = new URL(NEWS_ENDPOINT);
  url.searchParams.set("q", tickers.join(" OR ") || "NSE stocks");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "5");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch news");
  }

  const payload = await response.json();
  return payload.articles.map((article) => ({
    url: article.url,
    source: article.source?.name ?? "News",
    title: article.title,
    summary: article.description,
    publishedAt: article.publishedAt,
  }));
}

