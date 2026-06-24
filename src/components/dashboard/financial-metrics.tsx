"use client";

import { ResearchReport } from "@/lib/types";

export function FinancialMetrics({ report }: { report: ResearchReport }) {
  const metrics = [
    { label: "Market Cap", value: `$${(report.company.marketCap / 1e9).toFixed(2)}B` },
    { label: "Current Price", value: `$${report.company.currentPrice.toFixed(2)}` },
    { label: "Price Change", value: `${report.company.priceChange > 0 ? '+' : ''}${report.company.priceChangePercent.toFixed(2)}%` },
    { label: "Sector", value: report.company.sector },
    { label: "Industry", value: report.company.industry },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="p-4 rounded-xl border border-border/30 bg-card/40 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{m.label}</span>
          <span className="text-lg font-semibold">{m.value}</span>
        </div>
      ))}
    </div>
  );
}
