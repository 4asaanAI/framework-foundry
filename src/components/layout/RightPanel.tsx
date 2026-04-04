import { MOCK_AGENTS } from "@/constants/agents";
import { Brain, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_MEMORIES = [
  { type: "decision", content: "Pricing model: per-seat for SMEs under 50 employees", relevance: 82, tags: ["pricing", "SME"] },
  { type: "insight", content: "Indian SMEs prefer WhatsApp over email for support", relevance: 91, tags: ["customer", "India"] },
  { type: "pattern", content: "Email objection: 'too expensive' — counter with ROI calc", relevance: 40, tags: ["sales", "objection"] },
];

const PENDING_APPROVALS = [
  { agent: "Mira", action: "Launch Q2 email campaign", budget: "₹2,500", expires: "47h" },
];

export function RightPanel() {
  const activeAgent = MOCK_AGENTS[0];
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

      {/* Approval Queue */}
      {PENDING_APPROVALS.length > 0 && (
        <div className="px-4 py-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Pending Approvals
          </h4>
          {PENDING_APPROVALS.map((a, i) => (
            <div key={i} className="p-3 rounded-lg bg-card border border-warning/30 text-xs">
              <p className="text-foreground font-medium">{a.action}</p>
              <p className="text-muted-foreground mt-1">By {a.agent} · Budget: {a.budget} · Expires: {a.expires}</p>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1.5 rounded bg-success text-success-foreground font-semibold hover:bg-success/90 transition-colors">
                  Approve
                </button>
                <button className="px-3 py-1.5 rounded bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-colors">
                  Reject
                </button>
                <button className="px-3 py-1.5 rounded bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
                  Later
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
