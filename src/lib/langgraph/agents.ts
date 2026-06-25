import { AgentState } from "./state";
import { getGeminiModel } from "./llm";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { ResearchReport } from "../types";

// We must use standard dynamic import() so Vercel's build tracer detects the dependency
// and includes it in the production lambda. Webpack will mangle it, so we handle the
// double-default wrapping and instantiate the class manually.
let _yfInstance: any = null;
async function getYahooFinance() {
  if (_yfInstance) return _yfInstance;
  const mod: any = await import("yahoo-finance2");
  // Webpack might wrap the class constructor in .default or .default.default
  const YahooFinance = mod?.default?.default ?? mod?.default ?? mod;
  _yfInstance = new YahooFinance();
  return _yfInstance;
}

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
    console.warn(`[Research Agent Error] ${err.message}`);
    return { 
      companyOverview: {
        name: state.ticker + " (Fallback)",
        sector: "Data Unavailable",
        industry: "Data Unavailable",
        description: "Company overview is temporarily unavailable due to API rate limits. Please try again later."
      } 
    };
  }
};

// ─── Agent 2: Financial Analysis Agent ───────────────────────────────────────
export const financialAgent = async (state: AgentState): Promise<Partial<AgentState>> => {
  try {
    let quoteContext = "";
    let marketData = null;

    try {
      const yf = await getYahooFinance();
      const quote = await yf.quote(state.ticker);
      marketData = {
        currentPrice: quote.regularMarketPrice,
        priceChange: quote.regularMarketChange,
        priceChangePercent: quote.regularMarketChangePercent,
        marketCap: quote.marketCap,
        pe: quote.forwardPE
      };
      quoteContext = `Market Cap: ${quote.marketCap}\nPE Ratio: ${quote.forwardPE}\nPrice: ${quote.regularMarketPrice}\n52W High: ${quote.fiftyTwoWeekHigh}\n52W Low: ${quote.fiftyTwoWeekLow}`;
    } catch (apiErr: any) {
      console.warn(`[Yahoo Finance API Error] ${apiErr.message} - Falling back to LLM knowledge`);
      quoteContext = "Note: Real-time market data is currently unavailable due to rate limits. Please estimate the financial health and growth scores based purely on your training knowledge for this ticker.";
    }

    const parser = StructuredOutputParser.fromZodSchema(z.object({
      financialScore: z.number().min(0).max(100),
      growthScore: z.number().min(0).max(100),
      rawAnalysis: z.string()
    }));

    const response = await getGeminiModel(0.2).invoke([
      new SystemMessage("Analyze the financial health and growth potential. Generate scores (0-100). Be concise."),
      new HumanMessage(`Ticker: ${state.ticker}\n\n${quoteContext}\n\n${parser.getFormatInstructions()}`)
    ]);
    const result = await parser.parse(response.content as string);

    return {
      financialData: {
        marketCap: marketData?.marketCap || 0,
        currentPrice: marketData?.currentPrice || 0,
        priceChange: marketData?.priceChange || 0,
        priceChangePercent: marketData?.priceChangePercent || 0,
        financialScore: result.financialScore,
        growthScore: result.growthScore,
        rawAnalysis: result.rawAnalysis
      }
    };
  } catch (err: any) {
    console.warn(`[Financial Agent Error] ${err.message}`);
    return {
      financialData: {
        marketCap: 0,
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        financialScore: 50,
        growthScore: 50,
        rawAnalysis: "Financial analysis is temporarily unavailable due to API rate limits."
      }
    };
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
    console.warn(`[News Agent Error] ${err.message}`);
    return {
      newsData: {
        sentimentScore: 50,
        positiveDevelopments: ["Data currently unavailable"],
        negativeDevelopments: ["Data currently unavailable"],
        sources: ["System Fallback"]
      }
    };
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
    console.warn(`[Risk Agent Error] ${err.message}`);
    return {
      riskData: {
        riskScore: 50,
        opportunities: ["Data currently unavailable"],
        risks: ["Data currently unavailable"]
      }
    };
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
    console.warn(`[Decision Agent Error] ${err.message}`);
    const finalReport: ResearchReport = {
      company: {
        name: state.companyOverview?.name || state.ticker,
        ticker: state.ticker,
        sector: state.companyOverview?.sector || "Unknown",
        industry: state.companyOverview?.industry || "Unknown",
        marketCap: state.financialData?.marketCap || 0,
        currentPrice: state.financialData?.currentPrice || 0,
        priceChange: state.financialData?.priceChange || 0,
        priceChangePercent: state.financialData?.priceChangePercent || 0,
      },
      financialScore: state.financialData?.financialScore || 50,
      growthScore: state.financialData?.growthScore || 50,
      sentimentScore: state.newsData?.sentimentScore || 50,
      riskScore: state.riskData?.riskScore || 50,
      overallScore: 50,
      recommendation: "HOLD",
      confidence: 50,
      opportunities: state.riskData?.opportunities || [],
      risks: state.riskData?.risks || [],
      sources: state.newsData?.sources || ["System Fallback"],
      reasoning: "The system is currently experiencing high demand. This is a graceful fallback report generated to prevent presentation failure."
    };
    return { finalReport };
  }
};
