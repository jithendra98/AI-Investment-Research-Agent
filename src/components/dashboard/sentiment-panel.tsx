"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResearchReport } from "@/lib/types";
import { Newspaper } from "lucide-react";

export function SentimentPanel({ report }: { report: ResearchReport }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="h-5 w-5 text-blue-400" />
          News & Media Sources
        </CardTitle>
        <CardDescription>Primary sources driving the sentiment score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <span className="font-medium">Sentiment Score</span>
            <span className="text-xl font-bold text-blue-400">{report.sentimentScore}/100</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Analyzed Sources</h4>
            <div className="flex flex-wrap gap-2">
              {report.sources.map((source, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full border border-border">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
