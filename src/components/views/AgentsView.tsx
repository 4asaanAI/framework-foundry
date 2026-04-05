import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import { cn } from "@/lib/utils";
import { Zap, TrendingUp, Loader2, ArrowRightLeft, Pencil } from "lucide-react";
import { TransferTokensDialog } from "@/components/dialogs/TransferTokensDialog";
import { EditAgentDialog } from "@/components/dialogs/EditAgentDialog";
import type { AgentRow } from "@/hooks/use-agents";

export function AgentsView() {
  const { data: dbAgents, isLoading } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const teams = [...new Set(agents.map((a) => a.team))];
  const [transferAgent, setTransferAgent] = useState<AgentRow | null>(null);
  const [editAgent, setEditAgent] = useState<AgentRow | null>(null);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Agents</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{agents.length} agents across {teams.length} teams — manage prompts, budgets, and status</p>
      </div>
      <div className="px-6 py-4 space-y-6">
        {teams.map((team) => {
          const teamAgents = agents.filter((a) => a.team === team);
          return (
            <div key={team}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {TEAM_LABELS[team] || team}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamAgents.map((agent) => {
                  const budgetPct = agent.budget_tokens > 0 ? (agent.budget_used / agent.budget_tokens) * 100 : 0;
                  return (
                    <div
                      key={agent.id}
                      onClick={() => setEditAgent(agent as AgentRow)}
                      className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}
                        >
                          {agent.avatar_initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{agent.name}</span>
                            <span className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              agent.status === "idle" && "bg-muted-foreground",
                              agent.status === "thinking" && "bg-primary animate-pulse",
                              agent.status === "error" && "bg-destructive",
                              agent.status === "budget_exhausted" && "bg-warning",
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{agent.canonical_role}</p>
                        </div>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {agent.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{agent.description}</p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", budgetPct > 80 ? "bg-warning" : "bg-primary/60")}
                            style={{ width: `${Math.min(budgetPct, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{budgetPct.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{agent.llm_provider}</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />v{agent.prompt_version}</span>
                        {agent.budget_loaned > 0 && (
                          <span className="text-warning">Loaned: {agent.budget_loaned.toLocaleString()}</span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setTransferAgent(agent as AgentRow); }}
                          className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Transfer tokens"
                        >
                          <ArrowRightLeft className="h-3 w-3" /> Transfer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <TransferTokensDialog
        open={!!transferAgent}
        onOpenChange={(o) => !o && setTransferAgent(null)}
        sourceAgent={transferAgent}
        allAgents={agents as AgentRow[]}
      />
      <EditAgentDialog
        open={!!editAgent}
        onOpenChange={(o) => !o && setEditAgent(null)}
        agent={editAgent}
      />
    </div>
  );
}
