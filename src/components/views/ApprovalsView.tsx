import { Shield, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_APPROVALS = [
  { id: "1", agent: "Dev", action: "file_write", description: "Write updated assessment module to /src/modules/assessment.tsx", status: "pending", time: "2 min ago" },
  { id: "2", agent: "Mira", action: "send_message", description: "Send finalized hero copy to Abhimanyu via email", status: "pending", time: "15 min ago" },
  { id: "3", agent: "Arjun", action: "create_workflow", description: "Create n8n email sequence workflow for lead nurture", status: "approved", time: "1 hour ago" },
];

export function ApprovalsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Approval Queue</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Tier 2 actions requiring human approval before execution</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {MOCK_APPROVALS.map((item) => (
          <div key={item.id} className={cn(
            "rounded-xl border bg-card p-4 transition-all",
            item.status === "pending" ? "border-warning/30 glow-border" : "border-border"
          )}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Shield className={cn("h-5 w-5 mt-0.5", item.status === "pending" ? "text-warning" : "text-muted-foreground")} />
                <div>
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Requested by <span className="text-foreground font-medium">{item.agent}</span> · {item.action} · {item.time}
                  </p>
                </div>
              </div>
              {item.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              {item.status === "approved" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">Approved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
