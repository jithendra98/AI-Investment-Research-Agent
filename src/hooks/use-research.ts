"use client";

import { useState, useCallback, useRef } from "react";
import type { ResearchState, AgentProgress } from "@/lib/types";

const initialAgents: AgentProgress[] = [
  { name: "Research Agent", status: "idle", description: "Analyzing company overview, industry, and competitors", progress: 0, icon: "Search" },
  { name: "Financial Analyst", status: "idle", description: "Evaluating revenue growth, profitability, and debt", progress: 0, icon: "TrendingUp" },
  { name: "Sentiment Analyst", status: "idle", description: "Scanning news and market sentiment", progress: 0, icon: "Newspaper" },
  { name: "Risk Analyst", status: "idle", description: "Evaluating market, competition, and regulatory risks", progress: 0, icon: "ShieldAlert" },
  { name: "Investment Decision Agent", status: "idle", description: "Synthesizing data for final recommendation", progress: 0, icon: "Lightbulb" }
];

export function useResearch() {
  const [state, setState] = useState<ResearchState>({ status: "idle", agents: [], report: null, error: null });
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startResearch = useCallback(async (query: string) => {
    clearAllTimers();
    setState({ status: "researching", agents: initialAgents.map(a => ({ ...a, status: "idle", progress: 0 })), report: null, error: null });

    for (let i = 0; i < initialAgents.length; i++) {
      timersRef.current.push(setTimeout(() => {
        setState(prev => ({ ...prev, agents: prev.agents.map((a, idx) => idx === i ? { ...a, status: "running" as const, progress: 10 } : a) }));
      }, i * 400));

      timersRef.current.push(setInterval(() => {
        setState(prev => {
          const current = prev.agents[i];
          if (current.status === "running" && current.progress < 90) {
            return { ...prev, agents: prev.agents.map((a, idx) => idx === i ? { ...a, progress: a.progress + 5 } : a) };
          }
          return prev;
        });
      }, 800));
    }

    try {
      const response = await fetch("/api/research", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ticker: query }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${response.status}: Failed to fetch research report.`);
      }
      const report = await response.json();
      
      clearAllTimers();
      setState(prev => ({ ...prev, status: "completed", agents: prev.agents.map(a => ({ ...a, status: "completed", progress: 100 })), report, error: null }));
    } catch (error: any) {
      clearAllTimers();
      setState(prev => ({ ...prev, status: "error", agents: prev.agents.map(a => ({ ...a, status: "failed" })), error: error.message }));
    }
  }, [clearAllTimers]);

  const reset = useCallback(() => {
    clearAllTimers();
    setState({ status: "idle", agents: [], report: null, error: null });
  }, [clearAllTimers]);

  return { state, startResearch, reset };
}
