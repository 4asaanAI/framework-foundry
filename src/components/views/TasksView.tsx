import { CheckSquare, Circle, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_TASKS = [
  { id: "1", title: "Finalize hero copy — Website", agent: "Mira", status: "running", due: "Today" },
  { id: "2", title: "Review assessment module PR", agent: "Dev", status: "pending", due: "Tomorrow" },
  { id: "3", title: "Prepare Q2 financial forecast", agent: "Rishi", status: "pending", due: "Apr 7" },
  { id: "4", title: "Draft outreach email sequence", agent: "Arjun", status: "completed", due: "Apr 2" },
  { id: "5", title: "DPDP compliance check — client data", agent: "Veda", status: "awaiting_approval", due: "Apr 5" },
];

const STATUS_CONFIG = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
  running: { icon: Clock, color: "text-info", label: "Running" },
  completed: { icon: CheckCircle2, color: "text-success", label: "Done" },
  failed: { icon: AlertCircle, color: "text-destructive", label: "Failed" },
  awaiting_approval: { icon: AlertCircle, color: "text-warning", label: "Needs Approval" },
};

export function TasksView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Agent-created and user-assigned tasks with approval tracking</p>
      </div>
      <div className="px-6 py-4 space-y-2">
        {MOCK_TASKS.map((task) => {
          const cfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG];
          return (
            <div key={task.id} className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:glow-border transition-all cursor-pointer">
              <cfg.icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
                <p className="text-[11px] text-muted-foreground">Assigned to {task.agent}</p>
              </div>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", cfg.color, "border-current/20")}>{cfg.label}</span>
              <span className="text-[11px] text-muted-foreground">{task.due}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
