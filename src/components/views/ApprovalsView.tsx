import { useApprovals, useUpdateApproval } from "@/hooks/use-approvals";
import { Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const MOCK_APPROVALS = [
  { id: "1", agent_name: "Dev", action_type: "file_write", action_description: "Write updated assessment module to /src/modules/assessment.tsx", status: "pending", created_at: new Date(Date.now() - 120000).toISOString() },
  { id: "2", agent_name: "Mira", action_type: "send_message", action_description: "Send finalized hero copy to Abhimanyu via email", status: "pending", created_at: new Date(Date.now() - 900000).toISOString() },
  { id: "3", agent_name: "Arjun", action_type: "create_workflow", action_description: "Create n8n email sequence workflow for lead nurture", status: "approved", created_at: new Date(Date.now() - 3600000).toISOString() },
];

export function ApprovalsView() {
  const { data: dbApprovals, isLoading } = useApprovals();
  const updateApproval = useUpdateApproval();
  const approvals = dbApprovals && dbApprovals.length > 0 ? dbApprovals : MOCK_APPROVALS;

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
        <h1 className="text-lg font-semibold text-foreground">Approval Queue</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Tier 2 actions requiring human approval before execution</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {approvals.map((item: any) => {
          const timeAgo = (() => { try { return formatDistanceToNow(new Date(item.created_at), { addSuffix: true }); } catch { return ""; } })();
          return (
            <div key={item.id} className={cn(
              "rounded-xl border bg-card p-4 transition-all",
              item.status === "pending" ? "border-warning/30 glow-border" : "border-border"
            )}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Shield className={cn("h-5 w-5 mt-0.5", item.status === "pending" ? "text-warning" : "text-muted-foreground")} />
                  <div>
                    <p className="text-sm text-foreground">{item.action_description}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Requested by <span className="text-foreground font-medium">{item.agent_name}</span> · {item.action_type} · {timeAgo}
                    </p>
                  </div>
                </div>
                {item.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateApproval.mutate({ id: item.id, status: "approved" })}
                      className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateApproval.mutate({ id: item.id, status: "rejected" })}
                      className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {item.status === "approved" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">Approved</span>
                )}
                {item.status === "rejected" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Rejected</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
