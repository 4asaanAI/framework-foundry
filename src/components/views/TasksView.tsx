import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useUpdateTaskStatus } from "@/hooks/use-update-task";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { Circle, Clock, AlertCircle, CheckCircle2, Plus, Play, XCircle, Pencil, ListChecks, ArrowUp, ArrowDown, Lock, RefreshCw, CalendarDays, List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { TaskCalendarView } from "@/components/views/TaskCalendarView";
import { toast } from "sonner";
import { parseTaskMeta, PRIORITY_CONFIG, isOverdue, isDueSoon, type TaskPriority } from "@/lib/tasks";

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string; bg: string }> = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending", bg: "bg-muted/50" },
  running: { icon: Clock, color: "text-info", label: "In Progress", bg: "bg-info/10" },
  completed: { icon: CheckCircle2, color: "text-success", label: "Done", bg: "bg-success/10" },
  failed: { icon: AlertCircle, color: "text-destructive", label: "Failed", bg: "bg-destructive/10" },
  awaiting_approval: { icon: AlertCircle, color: "text-warning", label: "Needs Approval", bg: "bg-warning/10" },
};

type SortField = "title" | "status" | "priority" | "due_date" | "created_at" | "agent";
type SortDir = "asc" | "desc";
type ViewMode = "table" | "calendar";

export function TasksView() {
  const { data: dbTasks, isLoading } = useTasks();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const updateStatus = useUpdateTaskStatus();
  const rawTasks = dbTasks && dbTasks.length > 0 ? dbTasks : [];
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  // Parse and enrich tasks
  const tasks = rawTasks.map((t: any) => {
    const { meta, cleanDescription } = parseTaskMeta(t.description || "");
    const agent = agents.find((a: any) => a.id === t.assigned_agent_id);
    return { ...t, meta, cleanDescription, agent_name: agent?.name || t.agent_name || "Unassigned" };
  })
  .filter((t: any) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.meta.priority !== priorityFilter) return false;
    return true;
  })
  .sort((a: any, b: any) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "title": return dir * a.title.localeCompare(b.title);
      case "status": return dir * (a.status || "").localeCompare(b.status || "");
      case "priority": return dir * ((PRIORITY_CONFIG[a.meta.priority as TaskPriority]?.sortOrder ?? 2) - (PRIORITY_CONFIG[b.meta.priority as TaskPriority]?.sortOrder ?? 2));
      case "due_date": return dir * ((new Date(a.due_date || "2099-12-31")).getTime() - (new Date(b.due_date || "2099-12-31")).getTime());
      case "agent": return dir * (a.agent_name || "").localeCompare(b.agent_name || "");
      case "created_at":
      default: return dir * ((new Date(a.created_at || 0)).getTime() - (new Date(b.created_at || 0)).getTime());
    }
  });

  // Check if a task is blocked
  const isBlocked = (task: any) => {
    if (!task.meta.dependencies?.length) return false;
    return task.meta.dependencies.some((depId: string) => {
      const dep = rawTasks.find((t: any) => t.id === depId);
      return dep && dep.status !== "completed";
    });
  };

  const handleStatusChange = (id: string, status: "pending" | "running" | "completed" | "failed" | "awaiting_approval") => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => toast.success(`Task marked as ${status}`),
      onError: (err: any) => toast.error(err.message || "Failed to update"),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="animate-pulse flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
            <div className="w-4 h-4 rounded-full bg-muted" />
            <div className="flex-1 space-y-2"><div className="h-3 bg-muted rounded w-48" /><div className="h-2 bg-muted rounded w-32" /></div>
            <div className="h-4 bg-muted rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-4 sm:py-5 border-b border-border bg-background shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tasks.length} tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted">
            <button onClick={() => setViewMode("table")} className={cn("p-1.5 rounded-md transition-colors", viewMode === "table" ? "bg-card shadow-sm" : "hover:bg-card/50")}>
              <List className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode("calendar")} className={cn("p-1.5 rounded-md transition-colors", viewMode === "calendar" ? "bg-card shadow-sm" : "hover:bg-card/50")}>
              <CalendarDays className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Status filter */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {/* Priority filter */}
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground">
            <option value="all">All Priorities</option>
            <option value="P0">P0 — Critical</option>
            <option value="P1">P1 — High</option>
            <option value="P2">P2 — Medium</option>
            <option value="P3">P3 — Low</option>
          </select>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "calendar" ? (
        <TaskCalendarView tasks={tasks} onTaskClick={setEditTask} />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none" onClick={() => toggleSort("title")}>
                  <span className="flex items-center gap-1">Name <SortIcon field="title" /></span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none w-32" onClick={() => toggleSort("agent")}>
                  <span className="flex items-center gap-1">Assigned To <SortIcon field="agent" /></span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none w-36" onClick={() => toggleSort("status")}>
                  <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none w-20" onClick={() => toggleSort("priority")}>
                  <span className="flex items-center gap-1">Priority <SortIcon field="priority" /></span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none w-28" onClick={() => toggleSort("due_date")}>
                  <span className="flex items-center gap-1">Deadline <SortIcon field="due_date" /></span>
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none w-28" onClick={() => toggleSort("created_at")}>
                  <span className="flex items-center gap-1">Created <SortIcon field="created_at" /></span>
                </th>
                <th className="w-20 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    No tasks yet. Click "New Task" to create one.
                  </td>
                </tr>
              )}
              {tasks.map((task: any) => {
                const cfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const dueDate = task.due_date ? (() => { try { return format(new Date(task.due_date), "MMM d, yyyy"); } catch { return task.due_date; } })() : "—";
                const createdDate = task.created_at ? (() => { try { return format(new Date(task.created_at), "MMM d, yyyy"); } catch { return "—"; } })() : "—";
                const isMock = typeof task.id === "string" && task.id.length === 1;
                const blocked = isBlocked(task);

                return (
                  <tr key={task.id} className={cn(
                    "border-b border-border/50 hover:bg-muted/30 transition-colors group",
                    blocked && "opacity-60",
                    isOverdue(task.due_date) && task.status !== "completed" && "bg-destructive/5",
                    isDueSoon(task.due_date) && task.status !== "completed" && !isOverdue(task.due_date) && "bg-warning/5"
                  )}>
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {blocked && <Lock className="h-3 w-3 text-warning shrink-0" title="Blocked by dependency" />}
                        {task.is_recurring && <RefreshCw className="h-3 w-3 text-primary shrink-0" title="Recurring" />}
                        <span className="text-foreground font-medium">{task.title}</span>
                        {task.meta.subtasks.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <ListChecks className="h-3 w-3" />
                            {task.meta.subtasks.filter((s: any) => s.done).length}/{task.meta.subtasks.length}
                          </span>
                        )}
                      </div>
                      {blocked && task.meta.dependencies?.length > 0 && (
                        <p className="text-xs text-warning mt-0.5 flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5" />
                          Blocked by {task.meta.dependencies.length} task{task.meta.dependencies.length > 1 ? "s" : ""}
                        </p>
                      )}
                      {task.cleanDescription && !blocked && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">{task.cleanDescription}</p>
                      )}
                    </td>
                    {/* Assigned To */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-foreground">{task.agent_name}</span>
                    </td>
                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium", cfg.bg, cfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    {/* Priority */}
                    <td className="px-3 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", PRIORITY_CONFIG[task.meta.priority as TaskPriority]?.color || PRIORITY_CONFIG.P2.color)}>
                        {task.meta.priority}
                      </span>
                    </td>
                    {/* Deadline */}
                    <td className="px-3 py-3">
                      <span className={cn("text-xs", isOverdue(task.due_date) && task.status !== "completed" ? "text-destructive font-medium" : "text-muted-foreground")}>
                        {dueDate}
                      </span>
                    </td>
                    {/* Created */}
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{createdDate}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isMock && (
                          <button onClick={() => setEditTask(task)} className="p-1 rounded hover:bg-muted transition-all" title="Edit">
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        )}
                        {!isMock && task.status === "pending" && !blocked && (
                          <button onClick={() => handleStatusChange(task.id, "running")} title="Start" className="p-1 rounded hover:bg-primary/10 text-primary transition-all">
                            <Play className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {!isMock && task.status === "running" && (
                          <button onClick={() => handleStatusChange(task.id, "completed")} title="Done" className="p-1 rounded hover:bg-success/10 text-success transition-all">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {!isMock && task.status !== "completed" && task.status !== "failed" && (
                          <button onClick={() => handleStatusChange(task.id, "failed")} title="Failed" className="p-1 rounded hover:bg-destructive/10 text-destructive transition-all">
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewTaskDialog open={showNew} onOpenChange={setShowNew} />
      {editTask && <EditTaskDialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)} task={editTask} />}
    </div>
  );
}
