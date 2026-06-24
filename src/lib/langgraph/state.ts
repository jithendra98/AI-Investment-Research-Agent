import { BaseMessage } from "@langchain/core/messages";
import { ResearchReport } from "../types";

export interface AgentState {
  ticker: string;
  
  // Accumulated data
  companyOverview?: {
    name: string;
    sector: string;
    industry: string;
    description: string;
  };
  
  financialData?: {
    marketCap: number;
    currentPrice: number;
    priceChange: number;
    priceChangePercent: number;
    financialScore: number;
    growthScore: number;
    rawAnalysis: string;
  };
  
  newsData?: {
    sentimentScore: number;
    positiveDevelopments: string[];
    negativeDevelopments: string[];
    sources: string[];
  };
  
  riskData?: {
    riskScore: number;
    opportunities: string[];
    risks: string[];
  };
  
  decisionData?: {
    recommendation: "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";
    confidence: number;
    overallScore: number;
    reasoning: string;
  };
  
  finalReport?: ResearchReport;
  messages: BaseMessage[];
  error?: string;
}
