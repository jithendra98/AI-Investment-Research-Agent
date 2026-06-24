import { AgentState } from "./state";
import { getGeminiModel } from "./llm";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { ResearchReport } from "../types";

// Static import — serverExternalPackages in next.config.ts ensures
// Webpack does NOT bundle this, letting Node.js resolve the ESM export correctly.
import yahooFinance from "yahoo-finance2";

// ─── Agent 1: Research Agent ─────────────────────────────────────────────────
export const researchAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    const parser = StructuredOutputParser.fromZodSchema(z.object({
      name: z.string(),
      sector: z.string(),
      industry: z.string(),
      description: z.string()
    }));

    const response = await getGeminiModel(0.1).invoke([
      new SystemMessage("Extract company overview details. Use the exact ticker symbol to identify the company. Be concise."),
      new HumanMessage(`Ticker: ${state.ticker}\n\n${parser.getFormatInstructions()}`)
    ]);
    const result = await parser.parse(response.content as string);
    return { companyOverview: result };
  } catch (err: any) {
    return { error: `Research Agent failed: ${err.message}` };
  }
};

// ─── Agent 2: Financial Analysis Agent ───────────────────────────────────────
export const financialAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    const quote = await (yahooFinance as any).quote(state.ticker);

    const parser = StructuredOutputParser.fromZodSchema(z.object({
      financialScore: z.number().min(0).max(100),
      growthScore: z.number().min(0).max(100),
      rawAnalysis: z.string()
    }));

    const response = await getGeminiModel(0.2).invoke([
      new SystemMessage("Analyze the financial health and growth potential. Generate scores (0-100). Be concise."),
      new HumanMessage(`Ticker: ${state.ticker}\nMarket Cap: ${quote.marketCap}\nPE Ratio: ${quote.forwardPE}\nPrice: ${quote.regularMarketPrice}\n52W High: ${quote.fiftyTwoWeekHigh}\n52W Low: ${quote.fiftyTwoWeekLow}\n\n${parser.getFormatInstructions()}`)
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
  } catch (err: any) {
    return { error: `Financial Agent failed: ${err.message}` };
  }
};

// ─── Agent 3: News & Sentiment Agent ─────────────────────────────────────────
export const newsAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    const parser = StructuredOutputParser.fromZodSchema(z.object({
      sentimentScore: z.number().min(0).max(100),
      positiveDevelopments: z.array(z.string()),
      negativeDevelopments: z.array(z.string()),
      sources: z.array(z.string())
    }));

    const response = await getGeminiModel(0.3).invoke([
      new SystemMessage("Analyze recent news sentiment for the company. Provide a score (0-100) and list positive/negative developments and assumed sources (e.g., Bloomberg, Reuters). Be concise."),
      new HumanMessage(`Analyze news for ${state.companyOverview?.name || state.ticker}\n\n${parser.getFormatInstructions()}`)
    ]);
    const result = await parser.parse(response.content as string);
    return { newsData: result };
  } catch (err: any) {
    return { error: `News Agent failed: ${err.message}` };
  }
};

// ─── Agent 4: Risk Analysis Agent ────────────────────────────────────────────
export const riskAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    const parser = StructuredOutputParser.fromZodSchema(z.object({
      riskScore: z.number().min(0).max(100).describe("0 = High Risk, 100 = Low Risk (Safe)"),
      opportunities: z.array(z.string()),
      risks: z.array(z.string())
    }));

    const negatives = state.newsData?.negativeDevelopments?.join(", ") || "none identified";
    const response = await getGeminiModel(0.2).invoke([
      new SystemMessage("Analyze market, regulatory, and competitive risks vs opportunities. Be concise."),
      new HumanMessage(`Context: ${state.companyOverview?.name}, Sector: ${state.companyOverview?.sector}, Negatives: ${negatives}.\n\n${parser.getFormatInstructions()}`)
    ]);
    const result = await parser.parse(response.content as string);
    return { riskData: result };
  } catch (err: any) {
    return { error: `Risk Agent failed: ${err.message}` };
  }
};

// ─── Agent 5: Investment Decision Agent ──────────────────────────────────────
export const decisionAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    const parser = StructuredOutputParser.fromZodSchema(z.object({
      recommendation: z.enum(["STRONG BUY", "BUY", "HOLD", "SELL", "STRONG SELL"]),
      confidence: z.number().min(0).max(100),
      overallScore: z.number().min(0).max(100),
      reasoning: z.string()
    }));

    const response = await getGeminiModel(0.2).invoke([
      new SystemMessage("Synthesize all data into a final investment recommendation and reasoning. Be concise but thorough."),
      new HumanMessage(`Ticker: ${state.ticker}\nFinancial Score: ${state.financialData?.financialScore}\nGrowth Score: ${state.financialData?.growthScore}\nSentiment Score: ${state.newsData?.sentimentScore}\nRisk Score: ${state.riskData?.riskScore}\n\n${parser.getFormatInstructions()}`)
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
  } catch (err: any) {
    return { error: `Decision Agent failed: ${err.message}` };
  }
};
