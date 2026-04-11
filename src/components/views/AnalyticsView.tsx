import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useAgentUsageSummary, useTokenUsageLogs } from "@/hooks/use-token-usage";
import { useConversations } from "@/hooks/use-conversations";
import { MOCK_AGENTS } from "@/constants/agents";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Loader2, TrendingUp, Zap, DollarSign, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const CHART_COLORS = ["#E87A2E", "#2B5797", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#EF4444"];

export function AnalyticsView() {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const { data: usageSummary, isLoading } = useAgentUsageSummary();
  const { data: conversations } = useConversations();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { data: agentLogs } = useTokenUsageLogs(selectedAgentId || undefined);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const logs = usageSummary ?? [];

  // Per-agent totals
  const agentTotals = agents.map((a) => {
    const agentLogs = logs.filter((l: any) => l.agent_id === a.id);
    const totalIn = agentLogs.reduce((s: number, l: any) => s + (l.tokens_in || 0), 0);
    const totalOut = agentLogs.reduce((s: number, l: any) => s + (l.tokens_out || 0), 0);
    const totalCost = agentLogs.reduce((s: number, l: any) => s + (l.cost_usd || 0), 0);
    return { name: a.name, id: a.id, color: a.avatar_color, tokensIn: totalIn, tokensOut: totalOut, total: totalIn + totalOut, cost: totalCost, budget: a.budget_tokens, used: a.budget_used };
  }).sort((a, b) => b.total - a.total);

  // Overall stats
  const totalTokens = agentTotals.reduce((s, a) => s + a.total, 0);
  const totalCost = agentTotals.reduce((s, a) => s + a.cost, 0);
  const totalBudget = agents.reduce((s, a) => s + a.budget_tokens, 0);
  const totalUsed = agents.reduce((s, a) => s + a.budget_used, 0);

  // Daily usage for line chart (last 7 days)
  const dailyUsage = (() => {
    const days: Record<string, { date: string; tokens: number; cost: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { date: key, tokens: 0, cost: 0 };
    }
    logs.forEach((l: any) => {
      const key = (l.created_at || "").slice(0, 10);
      if (days[key]) {
        days[key].tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
        days[key].cost += l.cost_usd || 0;
      }
    });
    return Object.values(days);
  })();

  // Per-agent conversation breakdown for selected agent
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const conversationBreakdown = selectedAgentId && agentLogs
    ? (() => {
        const convMap: Record<string, { name: string; tokens: number; cost: number }> = {};
        agentLogs.forEach((l: any) => {
          const cid = l.conversation_id || "unknown";
          if (!convMap[cid]) {
            const conv = conversations?.find((c: any) => c.id === cid);
            convMap[cid] = { name: conv?.title || "Unknown conversation", tokens: 0, cost: 0 };
          }
          convMap[cid].tokens += (l.tokens_in || 0) + (l.tokens_out || 0);
          convMap[cid].cost += l.cost_usd || 0;
        });
        return Object.values(convMap).sort((a, b) => b.tokens - a.tokens);
      })()
    : [];

  const stats = [
    { label: "Total Tokens Used", value: `${(totalTokens / 1000).toFixed(1)}k`, icon: Zap, color: "text-warning" },
    { label: "Budget Used", value: `${totalBudget > 0 ? ((totalUsed / totalBudget) * 100).toFixed(1) : 0}%`, icon: TrendingUp, color: "text-primary" },
    { label: "Est. Cost", value: `$${totalCost.toFixed(4)}`, icon: DollarSign, color: "text-success" },
    { label: "Active Agents", value: `${agentTotals.filter((a) => a.total > 0).length}/${agents.length}`, icon: Bot, color: "text-accent" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Analytics & Performance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Token usage, cost tracking, and agent performance metrics</p>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={cn("h-4 w-4", s.color)} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Daily usage chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Token Usage — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="tokens" stroke="#E87A2E" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Per-agent bar chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Tokens by Agent</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentTotals.slice(0, 10)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {agentTotals.slice(0, 10).map((entry, i) => (
                    <Cell key={entry.id} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Budget pie chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={agentTotals.filter((a) => a.budget > 0)} dataKey="budget" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {agentTotals.filter((a) => a.budget > 0).map((entry, i) => (
                    <Cell key={entry.id} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-agent details */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Agent Performance</h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedAgentId(null)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", !selectedAgentId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
            >All</button>
            {agents.filter((a) => a.is_active).map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAgentId(a.id)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedAgentId === a.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
              >{a.name}</button>
            ))}
          </div>

          {selectedAgentId && selectedAgent ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] text-muted-foreground">Budget Used</p>
                  <p className="text-lg font-bold font-mono text-foreground">{selectedAgent.budget_used.toLocaleString()} / {selectedAgent.budget_tokens.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] text-muted-foreground">Conversations</p>
                  <p className="text-lg font-bold font-mono text-foreground">{conversations?.filter((c: any) => c.agent_id === selectedAgentId).length ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-[10px] text-muted-foreground">Model</p>
                  <p className="text-sm font-mono text-foreground truncate">{selectedAgent.default_model}</p>
                </div>
              </div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usage by Conversation</h4>
              <ScrollArea className="max-h-[200px]">
                <div className="space-y-1">
                  {conversationBreakdown.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No usage logs yet for this agent</p>}
                  {conversationBreakdown.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
                      <span className="text-xs text-foreground truncate max-w-[60%]">{c.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground">{c.tokens.toLocaleString()} tokens</span>
                        <span className="text-xs font-mono text-muted-foreground">${c.cost.toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-2">
              {agentTotals.filter((a) => a.used > 0 || a.total > 0).map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedAgentId(a.id)}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-xs text-foreground flex-1">{a.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground">{a.used.toLocaleString()} / {a.budget.toLocaleString()}</span>
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${a.budget > 0 ? Math.min((a.used / a.budget) * 100, 100) : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {agentTotals.filter((a) => a.used > 0 || a.total > 0).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No usage data yet — start chatting with agents to see analytics</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
