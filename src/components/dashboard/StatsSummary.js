export function StatsSummary({ stats = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-sm text-white/60">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          {stat.delta && (
            <p
              className={`mt-1 text-sm ${
                stat.delta.startsWith("-")
                  ? "text-rose-400"
                  : "text-emerald-300"
              }`}
            >
              {stat.delta} vs yesterday
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

