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

// Sequential workflow: each agent feeds into the next.
// This is reliable and ensures each agent can use prior agents' data.
const workflow = new StateGraph<AgentState>({ channels: channels as any })
  .addNode("researchAgent", researchAgent)
  .addNode("financialAgent", financialAgent)
  .addNode("newsAgent", newsAgent)
  .addNode("riskAgent", riskAgent)
  .addNode("decisionAgent", decisionAgent)

  .addEdge(START, "researchAgent")
  .addConditionalEdges("researchAgent", (s) => s.error ? END : "financialAgent")
  .addConditionalEdges("financialAgent", (s) => s.error ? END : "newsAgent")
  .addConditionalEdges("newsAgent", (s) => s.error ? END : "riskAgent")
  .addConditionalEdges("riskAgent", (s) => s.error ? END : "decisionAgent")
  .addEdge("decisionAgent", END);

export const app = workflow.compile();
