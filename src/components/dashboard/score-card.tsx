"use client";

import { ScoreCardData } from "@/lib/types";

interface ScoreCardProps {
  data: ScoreCardData;
}

export function ScoreCard({ data }: ScoreCardProps) {
  return (
    <div className={`p-4 rounded-xl border border-border/30 bg-card/40 hover:bg-card/60 transition-all shadow-sm ${data.color === 'green' ? 'shadow-emerald-500/10' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-foreground">{data.label}</h4>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold">{data.score}</span>
        <span className="text-sm text-muted-foreground mb-1">/ 100</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{data.description}</p>
    </div>
  );
}
