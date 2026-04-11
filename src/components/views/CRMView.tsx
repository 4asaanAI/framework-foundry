import { useTasks } from "@/hooks/use-tasks";
import { ProfileViewSwitcher } from "@/components/ProfileViewSwitcher";
import { useUpdateTaskStatus } from "@/hooks/use-update-task";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import {
  Plus, Loader2, GripVertical, Trash2, IndianRupee, User2,
  MoreHorizontal, Calendar, Flag, CheckCircle2, Circle,
  Clock, AlertCircle, ShieldAlert, XCircle, ChevronDown,
  Search, Filter as FilterIcon, LayoutGrid
} from "lucide-react";
import { parseTaskMeta, PRIORITY_CONFIG, type TaskPriority } from "@/lib/tasks";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Column Config ──────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "pending",            label: "To Do",           icon: Circle,         accent: "hsl(var(--muted-foreground))", bgAccent: "hsl(var(--muted-foreground) / 0.08)" },
  { id: "running",            label: "In Progress",     icon: Clock,          accent: "hsl(210 100% 56%)",            bgAccent: "hsl(210 100% 56% / 0.08)" },
  { id: "awaiting_approval",  label: "In Review",       icon: ShieldAlert,    accent: "hsl(38 92% 50%)",             bgAccent: "hsl(38 92% 50% / 0.08)" },
  { id: "completed",          label: "Done",            icon: CheckCircle2,   accent: "hsl(142 71% 45%)",            bgAccent: "hsl(142 71% 45% / 0.08)" },
  { id: "failed",             label: "Cancelled",       icon: XCircle,        accent: "hsl(0 84% 60%)",              bgAccent: "hsl(0 84% 60% / 0.08)" },
];

// ─── Priority Dot ───────────────────────────────────────────────────────────

function PriorityDot({ priority }: { priority: TaskPriority }) {
  const colors: Record<TaskPriority, string> = {
    P0: "bg-red-500",
    P1: "bg-orange-400",
    P2: "bg-blue-400",
    P3: "bg-zinc-400",
  };
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", colors[priority])} title={`Priority: ${priority}`} />
  );
}

// ─── Due Date Badge ─────────────────────────────────────────────────────────

function DueBadge({ date }: { date: string | null }) {
  if (!date) return null;
  const d = new Date(date);
  const overdue = isPast(d) && !isToday(d);
  const today = isToday(d);
  const tomorrow = isTomorrow(d);

  let label: string;
  let className: string;

  if (overdue) {
    label = format(d, "MMM d");
    className = "text-red-400 bg-red-500/10";
  } else if (today) {
    label = "Today";
    className = "text-orange-400 bg-orange-500/10";
  } else if (tomorrow) {
    label = "Tomorrow";
    className = "text-blue-400 bg-blue-500/10";
  } else {
    label = format(d, "MMM d");
    className = "text-muted-foreground bg-muted/50";
  }

  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", className)}>
      <Calendar className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

// ─── Task Card ──────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: any;
  agent: any;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDragStart: () => void;
}

function TaskCard({ task, agent, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const { meta, cleanDescription } = parseTaskMeta(task.description || "");

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      className="group relative p-3 rounded-lg bg-card border border-border/60 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Drag handle — appears on hover */}
      <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab" />
      </div>

      {/* Top row: priority + title + menu */}
      <div className="flex items-start gap-2">
        <PriorityDot priority={meta.priority} />
        <p className="flex-1 text-[13px] font-medium text-foreground leading-snug line-clamp-2">{task.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all shrink-0"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(e as any); }} className="text-destructive focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Deal value */}
      {meta.dealValue && (
        <p className="text-xs font-semibold text-emerald-400 mt-1.5 flex items-center gap-0.5">
          <IndianRupee className="h-3 w-3" />
          {meta.dealValue.toLocaleString("en-IN")}
        </p>
      )}

      {/* Contact */}
      {meta.contact?.name && (
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 truncate">
          <User2 className="h-3 w-3 shrink-0" />
          {meta.contact.name}
          {meta.contact.company && <span className="text-muted-foreground/60">· {meta.contact.company}</span>}
        </p>
      )}

      {/* Description snippet */}
      {cleanDescription && (
        <p className="text-[11px] text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">{cleanDescription}</p>
      )}

      {/* Subtasks progress */}
      {meta.subtasks.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(meta.subtasks.filter(s => s.done).length / meta.subtasks.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {meta.subtasks.filter(s => s.done).length}/{meta.subtasks.length}
            </span>
          </div>
        </div>
      )}

      {/* Footer: agent + due date */}
      <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-border/40">
        {agent && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ring-1 ring-border/50"
              style={{ backgroundColor: agent.avatar_color + "18", color: agent.avatar_color }}
            >
              {agent.avatar_initials}
            </div>
            <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">{agent.name}</span>
          </div>
        )}
        <div className="ml-auto">
          <DueBadge date={task.due_date} />
        </div>
      </div>
    </div>
  );
}

// ─── Main CRM View ──────────────────────────────────────────────────────────

export function CRMView() {
  const { data: dbTasks, isLoading } = useTasks();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const updateStatus = useUpdateTaskStatus();
  const queryClient = useQueryClient();

  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const tasks = useMemo(() => {
    let list = dbTasks ?? [];
    if (filter !== "all") {
      list = list.filter(t => t.assigned_agent_id === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
    }
    return list;
  }, [dbTasks, filter, searchQuery]);

  const totalDealValue = useMemo(() => {
    return tasks.reduce((sum, t) => {
      const { meta } = parseTaskMeta(t.description || "");
      return sum + (meta.dealValue || 0);
    }, 0);
  }, [tasks]);

  const handleDrop = (status: string) => {
    if (!draggedTaskId) return;
    setDragOverCol(null);
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === status) { setDraggedTaskId(null); return; }
    updateStatus.mutate(
      { id: draggedTaskId, status: status as any },
      {
        onSuccess: () => toast.success(`Moved to ${COLUMNS.find(c => c.id === status)?.label || status}`),
        onError: (err: any) => toast.error(err.message),
      }
    );
    setDraggedTaskId(null);
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) { toast.error("Failed to delete task"); return; }
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast.success("Task deleted");
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-border/60">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <h1 className="text-base font-semibold text-foreground">Board</h1>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
              {totalDealValue > 0 && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">₹{totalDealValue.toLocaleString("en-IN")}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setShowSearch(false)}
                  onKeyDown={(e) => e.key === "Escape" && (setSearchQuery(""), setShowSearch(false))}
                  placeholder="Search tasks..."
                  className="h-8 w-56 pl-8 pr-3 rounded-md bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}

            {/* Agent filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 flex items-center gap-1.5 px-2.5 rounded-md hover:bg-muted border border-transparent hover:border-border transition-all text-xs text-muted-foreground">
                  <FilterIcon className="h-3.5 w-3.5" />
                  <span>{filter === "all" ? "All agents" : agents.find(a => a.id === filter)?.name || "Filter"}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilter("all")} className={filter === "all" ? "bg-muted" : ""}>
                  All Agents
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {agents.filter(a => a.is_active).map(a => (
                  <DropdownMenuItem key={a.id} onClick={() => setFilter(a.id)} className={filter === a.id ? "bg-muted" : ""}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                        style={{ backgroundColor: a.avatar_color + "20", color: a.avatar_color }}
                      >
                        {a.avatar_initials}
                      </div>
                      <span>{a.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ProfileViewSwitcher selected={filter === "all" ? "all" : filter} onChange={(v) => setFilter(v === "all" ? "all" : v)} />

            {/* New task */}
            <button
              onClick={() => setShowNew(true)}
              className="h-8 flex items-center gap-1.5 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* ─── Kanban Columns ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            const ColIcon = col.icon;
            const isDragOver = dragOverCol === col.id;
            const colDealTotal = colTasks.reduce((s, t) => {
              const { meta } = parseTaskMeta(t.description || "");
              return s + (meta.dealValue || 0);
            }, 0);

            return (
              <div
                key={col.id}
                className={cn(
                  "w-[300px] flex flex-col rounded-lg transition-all duration-200",
                  isDragOver ? "ring-2 ring-primary/30 bg-primary/[0.02]" : "bg-transparent"
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.id)}
              >
                {/* Column header */}
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ColIcon className="h-3.5 w-3.5" style={{ color: col.accent }} />
                    <span className="text-[13px] font-medium text-foreground">{col.label}</span>
                    <span className="text-[11px] text-muted-foreground/70 tabular-nums">{colTasks.length}</span>
                  </div>
                  {colDealTotal > 0 && (
                    <span className="text-[10px] font-medium text-emerald-400/80 tabular-nums">₹{colDealTotal.toLocaleString("en-IN")}</span>
                  )}
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-1.5 pb-2 space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {colTasks.length === 0 && !isDragOver && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                      <ColIcon className="h-6 w-6 mb-2" />
                      <p className="text-[11px]">No tasks</p>
                    </div>
                  )}
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      agent={agents.find((a) => a.id === task.assigned_agent_id)}
                      onEdit={() => setEditTask(task)}
                      onDelete={(e) => handleDeleteTask(task.id, e)}
                      onDragStart={() => setDraggedTaskId(task.id)}
                    />
                  ))}

                  {/* Add card inline */}
                  <button
                    onClick={() => setShowNew(true)}
                    className="flex items-center gap-1.5 w-full py-2 px-2 rounded-md text-[11px] text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30 transition-all duration-150"
                  >
                    <Plus className="h-3 w-3" /> New
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Dialogs ─────────────────────────────────────────────────────── */}
      <NewTaskDialog open={showNew} onOpenChange={setShowNew} />
      {editTask && <EditTaskDialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)} task={editTask} />}
    </div>
  );
}
