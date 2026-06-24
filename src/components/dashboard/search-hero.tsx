"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const popularTickers = [
  { label: "AAPL", name: "Apple" },
  { label: "GOOGL", name: "Google" },
  { label: "MSFT", name: "Microsoft" },
  { label: "TSLA", name: "Tesla" },
  { label: "AMZN", name: "Amazon" },
  { label: "NVDA", name: "Nvidia" },
];

export function SearchHero({ onSearch, isLoading }: SearchHeroProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSearch(query.trim());
      }
    },
    [query, isLoading, onSearch]
  );

  const handleTickerClick = useCallback(
    (ticker: string) => {
      setQuery(ticker);
      if (!isLoading) {
        onSearch(ticker);
      }
    },
    [isLoading, onSearch]
  );

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Floating Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[128px]" />
        <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-purple-500/10 blur-[128px]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            Powered by LangGraph & GPT-4o
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="text-foreground">Investment Research</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Enter a company name or ticker symbol to generate a comprehensive
            AI-driven investment analysis report.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="group relative flex items-center rounded-2xl border border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10">
            <Search className="ml-5 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-blue-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company or ticker (e.g., AAPL, Tesla, RELIANCE.NS)"
              disabled={isLoading}
              className="h-14 flex-1 bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:h-16 md:text-lg"
            />
            <div className="pr-2">
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className={cn(
                  "h-10 rounded-xl px-6 text-sm font-semibold md:h-12 md:px-8 md:text-base",
                  "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
                  "transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110",
                  "disabled:opacity-50 disabled:shadow-none"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        </motion.form>

        {/* Quick Access Tickers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="mr-1 text-sm text-muted-foreground">Popular:</span>
          {popularTickers.map((ticker) => (
            <button
              key={ticker.label}
              onClick={() => handleTickerClick(ticker.label)}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm backdrop-blur-sm",
                "text-muted-foreground transition-all duration-200",
                "hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400",
                "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <span className="font-semibold text-foreground/80">
                {ticker.label}
              </span>
              <span className="hidden text-xs sm:inline">{ticker.name}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
