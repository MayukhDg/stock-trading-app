export function InsightFeed({ insights = [] }) {
  return (
    <div className="space-y-4">
      {insights.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/60">
          AI tips will appear after your first sync.
        </div>
      )}
      {insights.map((insight) => (
        <article
          key={insight.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{insight.ticker}</span>
            <span>{insight.time}</span>
          </div>
          <p className="mt-3 text-lg font-medium text-white">
            {insight.recommendation}
          </p>
          <p className="mt-2 text-sm text-white/70">{insight.rationale}</p>
        </article>
      ))}
    </div>
  );
}

