"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, Lightbulb, Building2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchHero } from "@/components/dashboard/search-hero";
import { AgentProgressPanel } from "@/components/dashboard/agent-progress-panel";
import { ScoreCardsGrid } from "@/components/dashboard/score-cards-grid";
import { FinancialMetrics } from "@/components/dashboard/financial-metrics";
import { SentimentPanel } from "@/components/dashboard/sentiment-panel";
import { RiskAssessment } from "@/components/dashboard/risk-assessment";
import { ResultsSkeleton } from "@/components/dashboard/results-skeleton";
import { InvestmentThesis } from "@/components/dashboard/investment-thesis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResearch } from "@/hooks/use-research";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function DashboardPage() {
  const { state, startResearch, reset } = useResearch();
  const { status, agents, report } = state;

  const isResearching = status === "researching";
  const isCompleted = status === "completed" && report !== null;
  const allAgentsDone =
    agents.length > 0 && agents.every((a) => a.status === "completed");
  const showSkeleton = isResearching && allAgentsDone;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[1800px] px-4 pb-12 sm:px-6 lg:px-8">
          {/* Search Hero — always visible */}
          <SearchHero onSearch={startResearch} isLoading={isResearching} />

          {/* Error Display */}
          <AnimatePresence>
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400 max-w-2xl mx-auto"
              >
                <p className="font-semibold mb-1">Research Failed</p>
                <p className="text-sm">{state.error}</p>
                {state.error.includes("key not valid") && (
                  <p className="text-xs text-red-300 mt-2">
                    Tip: Check your GOOGLE_API_KEY in .env.local. A valid Gemini API key usually starts with "AIzaSy".
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agent Progress Panel — during research */}
          <AgentProgressPanel agents={agents} visible={isResearching && !allAgentsDone} />

          {/* Skeleton — after agents done, before report */}
          <AnimatePresence>
            {showSkeleton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResultsSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results — when completed */}
          <AnimatePresence>
            {isCompleted && report && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Score Cards Grid */}
                <motion.div {...fadeUp}>
                  <ScoreCardsGrid report={report} />
                </motion.div>

                {/* Two-Column: Financial + Sentiment */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  <FinancialMetrics report={report} />
                  <SentimentPanel report={report} />
                </motion.div>

                {/* Risk Assessment */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                >
                  <RiskAssessment report={report} />
                </motion.div>

                {/* Investment Thesis */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                >
                  <InvestmentThesis report={report} />
                </motion.div>

                {/* Restart Button */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
                >
                  <button
                    onClick={reset}
                    className="text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                  >
                    Start New Research
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
