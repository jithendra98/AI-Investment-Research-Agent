import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state";
import { researchAgent, financialAgent, newsAgent, riskAgent, decisionAgent } from "./agents";

const channels = {
  ticker: { value: (x: string, y: string) => y ?? x, default: () => "" },
  companyOverview: { value: (x: any, y: any) => y ?? x },
  financialData: { value: (x: any, y: any) => y ?? x },
  newsData: { value: (x: any, y: any) => y ?? x },
  riskData: { value: (x: any, y: any) => y ?? x },
  decisionData: { value: (x: any, y: any) => y ?? x },
  finalReport: { value: (x: any, y: any) => y ?? x },
  messages: { value: (x: any[], y: any[]) => x.concat(y ?? []), default: () => [] },
  error: { value: (x: string, y: string) => y ?? x }
};

const checkAllDone = (s: AgentState) => {
  if (s.error) return END;
  if (s.companyOverview && s.financialData && s.newsData) {
    return "riskAgent";
  }
  return END;
};

const workflow = new StateGraph<AgentState>({ channels: channels as any })
  .addNode("researchAgent", researchAgent)
  .addNode("financialAgent", financialAgent)
  .addNode("newsAgent", newsAgent)
  .addNode("riskAgent", riskAgent)
  .addNode("decisionAgent", decisionAgent)
  
  // Parallel execution of the first 3 agents
  .addEdge(START, "researchAgent")
  .addEdge(START, "financialAgent")
  .addEdge(START, "newsAgent")
  
  // Fan-in: wait for all 3 to complete before moving to Risk
  .addConditionalEdges("researchAgent", checkAllDone)
  .addConditionalEdges("financialAgent", checkAllDone)
  .addConditionalEdges("newsAgent", checkAllDone)
  
  .addConditionalEdges("riskAgent", (s) => s.error ? END : "decisionAgent")
  .addEdge("decisionAgent", END);

export const app = workflow.compile();
