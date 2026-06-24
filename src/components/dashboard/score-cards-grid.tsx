"use client";

import { motion } from "framer-motion";
import { ResearchReport } from "@/lib/types";
import { ScoreCard } from "./score-card";

interface ScoreCardsGridProps {
  report: ResearchReport;
}

export function ScoreCardsGrid({ report }: ScoreCardsGridProps) {
  const scores = [
    { label: "Overall Rating", score: report.overallScore, description: "Composite score based on all factors.", icon: "Star", color: "purple" },
    { label: "Financial Health", score: report.financialScore, description: "Based on profitability and revenue growth.", icon: "DollarSign", color: "green" },
    { label: "Growth Potential", score: report.growthScore, description: "Future expansion and market opportunities.", icon: "TrendingUp", color: "blue" },
    { label: "Market Sentiment", score: report.sentimentScore, description: "Overall news and media sentiment.", icon: "Newspaper", color: "cyan" },
    { label: "Risk Safety", score: report.riskScore, description: "Inverse risk (100 = completely safe).", icon: "ShieldCheck", color: "yellow" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {scores.map((score, idx) => (
        <motion.div key={score.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
          <ScoreCard data={score} />
        </motion.div>
      ))}
    </div>
  );
}
