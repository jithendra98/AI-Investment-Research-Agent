import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind CSS classes
 * to resolve conflicts (e.g., `p-2 p-4` becomes `p-4`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as USD currency with commas.
 * Example: 1234567.89 -> "$1,234,567.89"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage with 2 decimal places.
 * Example: 12.3456 -> "+12.35%", -5.1 -> "-5.10%"
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Formats large numbers into human-readable B/M/K notation.
 * Example: 2500000000 -> "2.50B", 1500000 -> "1.50M", 45000 -> "45.00K"
 */
export function formatLargeNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(2)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(2)}K`;
  }
  return `${sign}${absValue.toFixed(2)}`;
}

/**
 * Returns a Tailwind text color class based on a 0-100 score.
 * - 80-100: Green (strong)
 * - 60-79:  Green (normal)
 * - 40-59:  Yellow (caution)
 * - 20-39:  Orange/Red (warning)
 * - 0-19:   Red (danger)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-orange-400";
  return "text-red-400";
}

/**
 * Returns a Tailwind text color class based on recommendation type.
 */
export function getRecommendationColor(rec: string): string {
  switch (rec.toUpperCase()) {
    case "STRONG BUY":
      return "text-emerald-400";
    case "BUY":
      return "text-green-400";
    case "HOLD":
      return "text-yellow-400";
    case "SELL":
      return "text-orange-400";
    case "STRONG SELL":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
}
