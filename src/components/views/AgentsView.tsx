import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import { cn } from "@/lib/utils";
import { Zap, TrendingUp, Loader2 } from "lucide-react";

export function AgentsView() {
  const { data: dbAgents, isLoading } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const teams = [...new Set(agents.map((a) => a.team))];

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
                      className="group rounded-xl border border-border bg-card p-4 hover:glow-border transition-all cursor-pointer"
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
                              agent.status === "thinking" && "bg-primary animate-pulse-glow",
                              agent.status === "error" && "bg-destructive",
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", budgetPct > 80 ? "bg-warning" : "bg-primary/60")}
                            style={{ width: `${budgetPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{budgetPct.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{agent.llm_provider}</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />v{agent.prompt_version}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
