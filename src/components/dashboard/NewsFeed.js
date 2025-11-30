export function NewsFeed({ items = [] }) {
  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/60">
          Relevant articles get summarized and appear here.
        </div>
      )}
      {items.map((news) => (
        <article
          key={news.url}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{news.source}</span>
            <span>{news.publishedAt}</span>
          </div>
          <a
            href={news.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-white hover:text-emerald-300"
          >
            {news.title}
          </a>
          <p className="mt-2 text-sm text-white/70">{news.summary}</p>
        </article>
      ))}
    </div>
  );
}

