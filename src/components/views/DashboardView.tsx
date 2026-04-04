import { MOCK_AGENTS } from "@/constants/agents";
import { Bot, MessageSquare, Zap, DollarSign } from "lucide-react";

export function DashboardView() {
  const totalBudget = MOCK_AGENTS.reduce((s, a) => s + a.budget_tokens, 0);
  const totalUsed = MOCK_AGENTS.reduce((s, a) => s + a.budget_used, 0);
  const activeAgents = MOCK_AGENTS.filter((a) => a.status === "thinking").length;

  const stats = [
    { label: "Active Agents", value: `${activeAgents}/${MOCK_AGENTS.length}`, icon: Bot, color: "text-primary" },
    { label: "Conversations Today", value: "12", icon: MessageSquare, color: "text-info" },
    { label: "Tokens Used", value: `${(totalUsed / 1000).toFixed(0)}k`, icon: Zap, color: "text-warning" },
    { label: "Est. Cost Today", value: "$0.84", icon: DollarSign, color: "text-success" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System health, budget overview, and agent performance</p>
      </div>
      <div className="px-6 py-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Budget bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">System Budget</h3>
            <span className="text-xs font-mono text-muted-foreground">
              {(totalUsed / 1000).toFixed(0)}k / {(totalBudget / 1000).toFixed(0)}k tokens
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${(totalUsed / totalBudget) * 100}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {MOCK_AGENTS.slice(0, 4).map((agent) => (
              <div key={agent.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.avatar_color }} />
                <span>{agent.name}</span>
                <span className="ml-auto font-mono">{((agent.budget_used / agent.budget_tokens) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
