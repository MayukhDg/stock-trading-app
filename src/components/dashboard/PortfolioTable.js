export function PortfolioTable({ holdings = [] }) {
  if (!holdings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/60">
        Connect Zerodha to see live holdings here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-white/60">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Avg</th>
            <th className="px-4 py-3">LTP</th>
            <th className="px-4 py-3">P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((row) => (
            <tr key={row.symbol} className="border-t border-white/5">
              <td className="px-4 py-3 font-medium">{row.symbol}</td>
              <td className="px-4 py-3">{row.quantity}</td>
              <td className="px-4 py-3">₹{row.averagePrice?.toFixed(2)}</td>
              <td className="px-4 py-3">₹{row.ltp?.toFixed(2)}</td>
              <td
                className={`px-4 py-3 ${
                  row.pnl >= 0 ? "text-emerald-300" : "text-rose-400"
                }`}
              >
                {row.pnl >= 0 ? "+" : "-"}₹{Math.abs(row.pnl).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

