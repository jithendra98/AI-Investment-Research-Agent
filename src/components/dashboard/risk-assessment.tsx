"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResearchReport } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

export function RiskAssessment({ report }: { report: ResearchReport }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Risk & Opportunity Assessment</CardTitle>
        <CardDescription>Key factors influencing the investment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Opportunities
            </h4>
            <ul className="space-y-2">
              {report.opportunities.map((opp, idx) => (
                <li key={idx} className="text-sm text-muted-foreground p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  {opp}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Risks
            </h4>
            <ul className="space-y-2">
              {report.risks.map((risk, idx) => (
                <li key={idx} className="text-sm text-muted-foreground p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
