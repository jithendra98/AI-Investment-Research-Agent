"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import type { Recommendation } from "@/lib/types";

interface RecommendationBannerProps {
  recommendation: Recommendation;
  confidenceScore: number;
  targetPrice: number;
  currentPrice: number;
  companyName: string;
}

function getRecConfig(rec: Recommendation) {
  const isBuy = rec.includes("BUY");
  const isSell = rec.includes("SELL");
  if (isBuy) return {
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: <TrendingUp className="h-8 w-8" />,
    glow: "shadow-emerald-500/10",
    gaugeColor: "#10b981",
  };
  if (isSell) return {
    gradient: "from-red-500/20 via-red-500/5 to-transparent",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: <TrendingDown className="h-8 w-8" />,
    glow: "shadow-red-500/10",
    gaugeColor: "#ef4444",
  };
  return {
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: <Minus className="h-8 w-8" />,
    glow: "shadow-amber-500/10",
    gaugeColor: "#f59e0b",
  };
}

export function RecommendationBanner({
  recommendation,
  confidenceScore,
  targetPrice,
  currentPrice,
  companyName,
}: RecommendationBannerProps) {
  const config = getRecConfig(recommendation);
  const upside = ((targetPrice - currentPrice) / currentPrice) * 100;
  const isPositive = upside >= 0;

  // SVG gauge params
  const gaugeRadius = 50;
  const gaugeCircumference = Math.PI * gaugeRadius; // semi-circle
  const gaugeFill = (confidenceScore / 100) * gaugeCircumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8"
    >
      <Card className={cn("relative overflow-hidden shadow-xl", config.border, config.glow)}>
        {/* Gradient Background */}
        <div className={cn("absolute inset-0 bg-gradient-to-r", config.gradient)} />

        <CardContent className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Left: Recommendation */}
            <div className="flex items-center gap-4">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-card/60 backdrop-blur-sm", config.text)}>
                {config.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{companyName}</p>
                <h2 className={cn("text-3xl font-bold tracking-tight", config.text)}>
                  {recommendation}
                </h2>
              </div>
            </div>

            {/* Center: Confidence Gauge */}
            <div className="flex flex-col items-center">
              <svg width="120" height="72" viewBox="0 0 120 72" className="overflow-visible">
                {/* Background arc */}
                <path
                  d="M 10 65 A 50 50 0 0 1 110 65"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-border/30"
                />
                {/* Filled arc */}
                <motion.path
                  d="M 10 65 A 50 50 0 0 1 110 65"
                  fill="none"
                  stroke={config.gaugeColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={gaugeCircumference}
                  initial={{ strokeDashoffset: gaugeCircumference }}
                  animate={{ strokeDashoffset: gaugeCircumference - gaugeFill }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 8px ${config.gaugeColor}60)` }}
                />
              </svg>
              <div className="-mt-8 text-center">
                <span className={cn("text-2xl font-bold", config.text)}>{confidenceScore}%</span>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>

            {/* Right: Price Target */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center gap-1 md:justify-end">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Target Price</span>
              </div>
              <p className="mt-1 text-3xl font-bold text-foreground">{formatCurrency(targetPrice)}</p>
              <div className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold",
                isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              )}>
                {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {formatPercentage(Math.abs(upside))} {isPositive ? "upside" : "downside"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
