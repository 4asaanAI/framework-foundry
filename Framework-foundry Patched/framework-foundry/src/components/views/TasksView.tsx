import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useUpdateTaskStatus } from "@/hooks/use-update-task";
import { Circle, Clock, AlertCircle, CheckCircle2, Loader2, Plus, Play, XCircle, Pencil, ListChecks, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { toast } from "sonner";
import { parseTaskMeta, PRIORITY_CONFIG, isOverdue, isDueSoon, type TaskPriority } from "@/lib/tasks";

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
  const updateStatus = useUpdateTaskStatus();
  const rawTasks = dbTasks && dbTasks.length > 0 ? dbTasks : MOCK_TASKS;
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  // Parse metadata and sort
  const tasks = rawTasks.map((t: any) => {
    const { meta, cleanDescription } = parseTaskMeta(t.description || "");
    return { ...t, meta, cleanDescription };
  }).sort((a: any, b: any) => {
    if (sortBy === "priority") {
      return (PRIORITY_CONFIG[a.meta.priority as TaskPriority]?.sortOrder ?? 2) - (PRIORITY_CONFIG[b.meta.priority as TaskPriority]?.sortOrder ?? 2);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="animate-pulse flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
            <div className="w-4 h-4 rounded-full bg-muted" />
            <div className="flex-1 space-y-2"><div className="h-3 bg-muted rounded w-48" /><div className="h-2 bg-muted rounded w-32" /></div>
            <div className="h-4 bg-muted rounded w-16" />
            <div className="h-3 bg-muted rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const handleStatusChange = (id: string, status: "pending" | "running" | "completed" | "failed" | "awaiting_approval") => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => toast.success(`Task marked as ${status}`),
      onError: (err: any) => toast.error(err.message || "Failed to update"),
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between px-3 sm:px-6 py-4 sm:py-5 border-b border-border bg-background">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Agent-created and user-assigned tasks with approval tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSortBy(sortBy === "date" ? "priority" : "date")}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200">
            <SortAsc className="h-3.5 w-3.5" /> {sortBy === "date" ? "By Date" : "By Priority"}
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>
      <div className="px-6 py-4 space-y-2">
        {tasks.map((task: any) => {
          const cfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
          const dueLabel = task.due_date
            ? (typeof task.due_date === "string" && task.due_date.length <= 10 ? task.due_date : (() => { try { return format(new Date(task.due_date), "MMM d"); } catch { return task.due_date; } })())
            : "No date";
          const isMock = typeof task.id === "string" && task.id.length === 1;
          return (
            <div key={task.id} className={cn("flex items-center gap-3 sm:gap-4 rounded-xl border bg-card px-3 sm:px-4 py-3 transition-all duration-200 group",
              isOverdue(task.due_date) && task.status !== "completed" ? "border-destructive/30 bg-destructive/5" :
              isDueSoon(task.due_date) && task.status !== "completed" ? "border-warning/30 bg-warning/5" : "border-border hover:border-primary/20"
            )}>
              <cfg.icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate">{task.title}</p>
                  {/* Priority badge */}
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full border shrink-0", PRIORITY_CONFIG[task.meta.priority as TaskPriority]?.color || PRIORITY_CONFIG.P2.color)}>
                    {task.meta.priority}
                  </span>
                  {/* Subtask count */}
                  {task.meta.subtasks.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5 shrink-0">
                      <ListChecks className="h-3 w-3" />
                      {task.meta.subtasks.filter((s: any) => s.done).length}/{task.meta.subtasks.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Assigned to {task.agent_name || "agent"}</p>
              </div>
              <span className={cn("text-xs px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline", cfg.color, "border-current/20")}>{cfg.label}</span>
              <span className={cn("text-xs shrink-0", isOverdue(task.due_date) && task.status !== "completed" ? "text-destructive font-medium" : "text-muted-foreground")}>{dueLabel}</span>
              {!isMock && (
                <button onClick={() => setEditTask(task)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all" title="Edit">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {!isMock && task.status !== "completed" && task.status !== "failed" && (
                <div className="flex items-center gap-1 shrink-0">
                  {task.status === "pending" && (
                    <button onClick={() => handleStatusChange(task.id, "running")} title="Start" className="p-1 rounded hover:bg-primary/10 text-primary transition-all duration-200">
                      <Play className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {task.status === "running" && (
                    <button onClick={() => handleStatusChange(task.id, "completed")} title="Mark done" className="p-1 rounded hover:bg-success/10 text-success transition-all duration-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleStatusChange(task.id, "failed")} title="Mark failed" className="p-1 rounded hover:bg-destructive/10 text-destructive transition-all duration-200">
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <NewTaskDialog open={showNew} onOpenChange={setShowNew} />
      {editTask && <EditTaskDialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)} task={editTask} />}
    </div>
  );
}
