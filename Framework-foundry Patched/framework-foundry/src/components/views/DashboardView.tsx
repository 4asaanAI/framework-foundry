import { useEffect } from "react";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { Bot, MessageSquare, Zap, DollarSign, Activity, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function useAuditLog() {
  return useQuery({
    queryKey: ["audit_log_recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 15000,
  });
}

export function DashboardView() {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const { data: auditLogs } = useAuditLog();
  const queryClient = useQueryClient();

  // Realtime agent status updates
  useEffect(() => {
    const channel = supabase
      .channel("agents-realtime-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "agents" }, () => {
        queryClient.invalidateQueries({ queryKey: ["agents"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const totalBudget = agents.reduce((s, a) => s + a.budget_tokens, 0);
  const totalUsed = agents.reduce((s, a) => s + a.budget_used, 0);
  const activeAgents = agents.filter((a) => a.status === "thinking").length;
  const errorAgents = agents.filter((a) => a.status === "error").length;
  const idleAgents = agents.filter((a) => a.status === "idle").length;
  const awaitingApproval = agents.filter((a) => a.status === "awaiting_approval").length;

  const stats = [
    { label: "Active Agents", value: `${activeAgents}/${agents.length}`, icon: Bot, color: "text-primary" },
    { label: "Conversations Today", value: "—", icon: MessageSquare, color: "text-info" },
    { label: "Tokens Used", value: `${(totalUsed / 1000).toFixed(0)}k`, icon: Zap, color: "text-warning" },
    { label: "Est. Cost Today", value: "—", icon: DollarSign, color: "text-success" },
  ];

  const healthScore = errorAgents === 0 ? 100 : Math.max(0, Math.round(((agents.length - errorAgents) / agents.length) * 100));
  const healthColor = healthScore >= 90 ? "text-success" : healthScore >= 70 ? "text-warning" : "text-destructive";

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-3 sm:px-6 py-4 sm:py-5 border-b border-border bg-background">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System health, budget overview, and agent performance</p>
      </div>
      <div className="px-3 sm:px-6 py-4 space-y-4 sm:space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Kaiser System Health Widget */}
        <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Kaiser — System Health</h3>
              <p className="text-xs text-muted-foreground">Real-time platform monitoring and agent status</p>
            </div>
            <div className="text-right">
              <p className={cn("text-2xl font-bold font-mono", healthColor)}>{healthScore}%</p>
              <p className="text-xs text-muted-foreground">Health Score</p>
            </div>
          </div>

          {/* Agent Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="rounded-lg bg-background border border-border p-3 text-center">
              <p className="text-lg font-bold text-success font-mono">{idleAgents}</p>
              <p className="text-xs text-muted-foreground">Idle</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3 text-center">
              <p className="text-lg font-bold text-primary font-mono">{activeAgents}</p>
              <p className="text-xs text-muted-foreground">Thinking</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3 text-center">
              <p className="text-lg font-bold text-warning font-mono">{awaitingApproval}</p>
              <p className="text-xs text-muted-foreground">Awaiting Approval</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-3 text-center">
              <p className="text-lg font-bold text-destructive font-mono">{errorAgents}</p>
              <p className="text-xs text-muted-foreground">Error</p>
            </div>
          </div>

          {/* Agent List with statuses */}
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {agents.map((agent) => {
              const statusColors: Record<string, string> = {
                idle: "bg-success",
                thinking: "bg-primary animate-pulse",
                error: "bg-destructive",
                awaiting_approval: "bg-warning",
                budget_exhausted: "bg-muted-foreground",
              };
              const budgetPct = agent.budget_tokens > 0 ? (agent.budget_used / agent.budget_tokens) * 100 : 0;
              return (
                <div key={agent.id} className="flex items-center gap-3 rounded-lg bg-background border border-border px-3 py-2">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", statusColors[agent.status] || "bg-muted")} />
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}
                  >
                    {agent.avatar_initials}
                  </div>
                  <span className="text-xs text-foreground flex-1 truncate">{agent.name}</span>
                  <Badge variant="secondary" className="text-xs capitalize">{agent.status.replace("_", " ")}</Badge>
                  <span className="text-xs text-muted-foreground font-mono w-12 text-right">{budgetPct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Budget */}
        <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">System Budget</h3>
            <span className="text-xs font-mono text-muted-foreground">
              {(totalUsed / 1000).toFixed(0)}k / {(totalBudget / 1000).toFixed(0)}k tokens
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {agents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.avatar_color }} />
                <span>{agent.name}</span>
                <span className="ml-auto font-mono">{agent.budget_tokens > 0 ? ((agent.budget_used / agent.budget_tokens) * 100).toFixed(0) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Log */}
        <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Recent Audit Log</h3>
          </div>
          {(!auditLogs || auditLogs.length === 0) ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No audit entries yet</p>
          ) : (
            <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
              {auditLogs.map((log: any) => (
                <div key={log.id} className="flex items-center gap-3 rounded-lg bg-background border border-border px-3 py-2">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0">
                    {log.actor_type === "agent" ? (
                      <Bot className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Activity className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">
                      <span className="font-medium">{log.action}</span>
                      {log.target_table && <span className="text-muted-foreground"> on {log.target_table}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.actor_type} • {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
