import { useAgents } from "@/hooks/use-agents";
import { useAgentMemories } from "@/hooks/use-agent-memories";
import { MOCK_AGENTS } from "@/constants/agents";
import { Brain, Zap, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  selectedAgentId?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  decision: "bg-primary/10 text-primary",
  client_info: "bg-info/10 text-info",
  market_data: "bg-warning/10 text-warning",
  process: "bg-success/10 text-success",
  preference: "bg-accent text-accent-foreground",
  company: "bg-secondary text-secondary-foreground",
  conversation_handoff: "bg-muted text-muted-foreground",
};

export function RightPanel({ selectedAgentId }: RightPanelProps) {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgent = selectedAgentId
    ? agents.find((a) => a.id === selectedAgentId) ?? agents[0]
    : agents[0];

  const { data: memories, isLoading: memoriesLoading } = useAgentMemories(activeAgent?.id);

  const budgetPct = Math.round((activeAgent.budget_used / activeAgent.budget_tokens) * 100);

  return (
    <aside className="w-[320px] h-full border-l border-border bg-background overflow-y-auto shrink-0 hidden xl:block">
      {/* Agent Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
          >
            {activeAgent.avatar_initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{activeAgent.name}</h3>
            <p className="text-xs text-muted-foreground">{activeAgent.canonical_role}</p>
          </div>
        </div>
        {/* Budget */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Token Budget</span>
            <span className={cn("font-mono", budgetPct > 80 ? "text-destructive" : "text-muted-foreground")}>
              {activeAgent.budget_used} / {activeAgent.budget_tokens}
            </span>
          </div>
          <div className="h-2 rounded-full bg-card overflow-hidden">
            <div
              className={cn("h-full rounded-full", budgetPct > 80 ? "bg-destructive" : budgetPct > 50 ? "bg-warning" : "bg-success")}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Memory Panel */}
      <div className="px-4 py-4 border-b border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Brain className="h-3 w-3" /> Relevant Memory
        </h4>
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : memories && memories.length > 0 ? (
          <div className="space-y-2">
            {memories.map((mem) => (
              <div key={mem.id} className="p-2.5 rounded-lg bg-card border border-border text-xs cursor-pointer hover:border-primary/30 transition-colors">
                <p className="text-foreground leading-snug">{mem.content}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-background overflow-hidden">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.round(Number(mem.confidence) * 100)}%` }} />
                  </div>
                  <span className="text-muted-foreground font-mono">{Math.round(Number(mem.confidence) * 100)}</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px]", CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground")}>
                    {mem.category.replace(/_/g, " ")}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-background text-muted-foreground text-[10px]">
                    {mem.memory_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No memories yet. Chat with this agent to build context.</p>
        )}
      </div>
    </aside>
  );
}
