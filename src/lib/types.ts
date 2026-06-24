export type Recommendation =
  | "STRONG BUY"
  | "BUY"
  | "HOLD"
  | "SELL"
  | "STRONG SELL";

export type AgentStatus = "idle" | "running" | "completed" | "failed";

export interface AgentProgress {
  name: string;
  status: AgentStatus;
  description: string;
  progress: number; // 0-100
  icon: string; // lucide icon name
}

export interface FinancialMetric {
  label: string;
  value: string;
  change?: number; // percentage change
  trend?: "up" | "down" | "neutral";
}

export interface ScoreCardData {
  label: string;
  score: number; // 0-100
  description: string;
  icon: string;
  color: string; // tailwind color
}

export interface SentimentData {
  overall: "Bullish" | "Bearish" | "Neutral";
  score: number; // -100 to 100
  sources: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  headlines: NewsHeadline[];
}

export interface NewsHeadline {
  title: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  date: string;
  url?: string;
}

export interface RiskFactor {
  category: string;
  level: "Low" | "Medium" | "High" | "Critical";
  description: string;
}

export interface CompanyData {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  marketCap: number;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

export interface ResearchReport {
  company: CompanyData;
  financialScore: number;
  growthScore: number;
  sentimentScore: number;
  riskScore: number;
  overallScore: number;
  recommendation: Recommendation;
  confidence: number;
  reasoning: string;
  opportunities: string[];
  risks: string[];
  sources: string[];
}

export interface ResearchState {
  status: "idle" | "researching" | "completed" | "error";
  agents: AgentProgress[];
  report: ResearchReport | null;
  error: string | null;
}
