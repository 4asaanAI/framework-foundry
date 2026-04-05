import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { Brain, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  selectedAgentId?: string | null;
}

const MOCK_MEMORIES = [
  { type: "decision", content: "Pricing model: per-seat for SMEs under 50 employees", relevance: 82, tags: ["pricing", "SME"] },
  { type: "insight", content: "Indian SMEs prefer WhatsApp over email for support", relevance: 91, tags: ["customer", "India"] },
  { type: "pattern", content: "Email objection: 'too expensive' — counter with ROI calc", relevance: 40, tags: ["sales", "objection"] },
];

export function RightPanel({ selectedAgentId }: RightPanelProps) {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgent = selectedAgentId
    ? agents.find((a) => a.id === selectedAgentId) ?? agents[0]
    : agents[0];

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
        <div className="space-y-2">
          {MOCK_MEMORIES.map((mem, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-card border border-border text-xs cursor-pointer hover:border-primary/30 transition-colors">
              <p className="text-foreground leading-snug">{mem.content}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1 rounded-full bg-background overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${mem.relevance}%` }} />
                </div>
                <span className="text-muted-foreground font-mono">{mem.relevance}</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {mem.tags.map(t => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-background text-muted-foreground text-[10px]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
