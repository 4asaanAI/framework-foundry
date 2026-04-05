import { useTasks } from "@/hooks/use-tasks";
import { CheckSquare, Circle, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const MOCK_TASKS = [
  { id: "1", title: "Finalize hero copy — Website", agent_name: "Mira", status: "running", due_date: "Today" },
  { id: "2", title: "Review assessment module PR", agent_name: "Dev", status: "pending", due_date: "Tomorrow" },
  { id: "3", title: "Prepare Q2 financial forecast", agent_name: "Rishi", status: "pending", due_date: "Apr 7" },
  { id: "4", title: "Draft outreach email sequence", agent_name: "Arjun", status: "completed", due_date: "Apr 2" },
  { id: "5", title: "DPDP compliance check — client data", agent_name: "Veda", status: "awaiting_approval", due_date: "Apr 5" },
];

const STATUS_CONFIG = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
  running: { icon: Clock, color: "text-info", label: "Running" },
  completed: { icon: CheckCircle2, color: "text-success", label: "Done" },
  failed: { icon: AlertCircle, color: "text-destructive", label: "Failed" },
  awaiting_approval: { icon: AlertCircle, color: "text-warning", label: "Needs Approval" },
};

export function TasksView() {
  const { data: dbTasks, isLoading } = useTasks();
  const tasks = dbTasks && dbTasks.length > 0 ? dbTasks : MOCK_TASKS;

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
        <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Agent-created and user-assigned tasks with approval tracking</p>
      </div>
      <div className="px-6 py-4 space-y-2">
        {tasks.map((task: any) => {
          const cfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
          const dueLabel = task.due_date
            ? (typeof task.due_date === "string" && task.due_date.length <= 10 ? task.due_date : (() => { try { return format(new Date(task.due_date), "MMM d"); } catch { return task.due_date; } })())
            : "No date";
          return (
            <div key={task.id} className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:glow-border transition-all cursor-pointer">
              <cfg.icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
                <p className="text-[11px] text-muted-foreground">Assigned to {task.agent_name}</p>
              </div>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", cfg.color, "border-current/20")}>{cfg.label}</span>
              <span className="text-[11px] text-muted-foreground">{dueLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
