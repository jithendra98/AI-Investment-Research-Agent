"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResearchReport } from "@/lib/types";

export function InvestmentThesis({ report }: { report: ResearchReport }) {
  return (
    <Card className="h-full border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10 shadow-lg shadow-blue-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-blue-400">Final Recommendation: {report.recommendation}</CardTitle>
            <CardDescription>Confidence: {report.confidence}%</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
          {report.reasoning}
        </div>
      </CardContent>
    </Card>
  );
}
