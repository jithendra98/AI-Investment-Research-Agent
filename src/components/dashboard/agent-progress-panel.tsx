"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Newspaper,
  Building2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AgentProgress, AgentStatus } from "@/lib/types";

interface AgentProgressPanelProps {
  agents: AgentProgress[];
  visible: boolean;
}

const agentIcons: Record<string, React.ReactNode> = {
  "Financial Analyst": <TrendingUp className="h-5 w-5" />,
  "Sentiment Analyst": <Newspaper className="h-5 w-5" />,
  "Industry Analyst": <Building2 className="h-5 w-5" />,
  "Risk Analyst": <ShieldAlert className="h-5 w-5" />,
};

const statusConfig: Record<AgentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  idle: {
    color: "bg-gray-400",
    icon: <Clock className="h-3.5 w-3.5 text-gray-400" />,
    label: "Waiting",
  },
  running: {
    color: "bg-yellow-400",
    icon: <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />,
    label: "Analyzing",
  },
  completed: {
    color: "bg-emerald-400",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    label: "Complete",
  },
  failed: {
    color: "bg-red-400",
    icon: <AlertCircle className="h-3.5 w-3.5 text-red-400" />,
    label: "Failed",
  },
};

export function AgentProgressPanel({ agents, visible }: AgentProgressPanelProps) {
  const allCompleted = agents.length > 0 && agents.every((a) => a.status === "completed");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <Card
            className={cn(
              "transition-shadow duration-700",
              allCompleted && "shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                </div>
                Research Agents
              </CardTitle>
              <CardDescription>
                {allCompleted
                  ? "All agents have completed their analysis."
                  : "AI agents are analyzing the company..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agents.map((agent, index) => {
                const config = statusConfig[agent.status];
                return (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={cn(
                      "rounded-xl border border-border/30 bg-card/40 p-4 transition-all duration-300",
                      agent.status === "running" && "border-yellow-500/30 bg-yellow-500/5",
                      agent.status === "completed" && "border-emerald-500/20 bg-emerald-500/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                          agent.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : agent.status === "running"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {agentIcons[agent.name] || <TrendingUp className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <span className="text-xs text-muted-foreground">{config.label}</span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{agent.description}</p>
                        <div className="mt-2">
                          <Progress value={agent.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

