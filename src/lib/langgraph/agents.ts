import { AgentState } from "./state";
import { getGeminiModel } from "./llm";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { ResearchReport } from "../types";

export const researchAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const parser = StructuredOutputParser.fromZodSchema(z.object({
    name: z.string(),
    sector: z.string(),
    industry: z.string(),
    description: z.string()
  }));

  const response = await getGeminiModel(0.1).invoke([
    new SystemMessage("Extract company overview details. Use the exact ticker symbol to identify the company."),
    new HumanMessage(`Ticker: ${state.ticker}\n\n${parser.getFormatInstructions()}`)
  ]);
  const result = await parser.parse(response.content as string);
  return { companyOverview: result };
};

export const financialAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  // Completely bypass the broken yahoo-finance2 package and fetch from the Yahoo Finance API natively
  const quoteRes = await fetch(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${state.ticker}`, { cache: "no-store" });
  const quoteData = await quoteRes.json();
  const quote = quoteData?.quoteResponse?.result?.[0] || {};
  
  const parser = StructuredOutputParser.fromZodSchema(z.object({
    financialScore: z.number().min(0).max(100),
    growthScore: z.number().min(0).max(100),
    rawAnalysis: z.string()
  }));

  const response = await getGeminiModel(0.2).invoke([
    new SystemMessage("Analyze financial health and growth. Generate scores (0-100)."),
    new HumanMessage(`Ticker: ${state.ticker}\nMarket Cap: ${quote.marketCap}\nPE: ${quote.forwardPE}\n\n${parser.getFormatInstructions()}`)
  ]);
  const result = await parser.parse(response.content as string);

  return {
    financialData: {
      marketCap: quote.marketCap || 0,
      currentPrice: quote.regularMarketPrice || 0,
      priceChange: quote.regularMarketChange || 0,
      priceChangePercent: quote.regularMarketChangePercent || 0,
      ...result
    }
  };
};

export const newsAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const parser = StructuredOutputParser.fromZodSchema(z.object({
    sentimentScore: z.number().min(0).max(100),
    positiveDevelopments: z.array(z.string()),
    negativeDevelopments: z.array(z.string()),
    sources: z.array(z.string())
  }));

  // Simulate or fetch news. Without a reliable free News API here, we use Gemini's internal knowledge of recent events
  const response = await getGeminiModel(0.3).invoke([
    new SystemMessage("Analyze recent news sentiment for the company. Provide a score (0-100) and list positive/negative developments and assumed sources (e.g., Bloomberg, Reuters)."),
    new HumanMessage(`Analyze news for ${state.companyOverview?.name || state.ticker}\n\n${parser.getFormatInstructions()}`)
  ]);
  const result = await parser.parse(response.content as string);
  return { newsData: result };
};

export const riskAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const parser = StructuredOutputParser.fromZodSchema(z.object({
    riskScore: z.number().min(0).max(100).describe("0 = High Risk, 100 = Low Risk (Safe)"),
    opportunities: z.array(z.string()),
    risks: z.array(z.string())
  }));

  const response = await getGeminiModel(0.2).invoke([
    new SystemMessage("Analyze market, regulatory, and competitive risks vs opportunities."),
    new HumanMessage(`Context: ${state.companyOverview?.name}, Negatives: ${state.newsData?.negativeDevelopments.join()}.\n\n${parser.getFormatInstructions()}`)
  ]);
  const result = await parser.parse(response.content as string);
  return { riskData: result };
};

export const decisionAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  const parser = StructuredOutputParser.fromZodSchema(z.object({
    recommendation: z.enum(["STRONG BUY", "BUY", "HOLD", "SELL", "STRONG SELL"]),
    confidence: z.number().min(0).max(100),
    overallScore: z.number().min(0).max(100),
    reasoning: z.string()
  }));

  const response = await getGeminiModel(0.2).invoke([
    new SystemMessage("Synthesize all data into a final recommendation and reasoning."),
    new HumanMessage(`Ticker: ${state.ticker}\nFinScore: ${state.financialData?.financialScore}\nGrowthScore: ${state.financialData?.growthScore}\nSentimentScore: ${state.newsData?.sentimentScore}\nRiskScore: ${state.riskData?.riskScore}\n\n${parser.getFormatInstructions()}`)
  ]);
  const result = await parser.parse(response.content as string);

  const finalReport: ResearchReport = {
    company: {
      name: state.companyOverview!.name,
      ticker: state.ticker,
      sector: state.companyOverview!.sector,
      industry: state.companyOverview!.industry,
      marketCap: state.financialData!.marketCap,
      currentPrice: state.financialData!.currentPrice,
      priceChange: state.financialData!.priceChange,
      priceChangePercent: state.financialData!.priceChangePercent,
    },
    financialScore: state.financialData!.financialScore,
    growthScore: state.financialData!.growthScore,
    sentimentScore: state.newsData!.sentimentScore,
    riskScore: state.riskData!.riskScore,
    overallScore: result.overallScore,
    recommendation: result.recommendation,
    confidence: result.confidence,
    reasoning: result.reasoning,
    opportunities: state.riskData!.opportunities,
    risks: state.riskData!.risks,
    sources: state.newsData!.sources,
  };

  return { decisionData: result, finalReport };
};
