import { useTasks } from "@/hooks/use-tasks";
import { useUpdateTaskStatus } from "@/hooks/use-update-task";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, Loader2, GripVertical } from "lucide-react";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLUMNS = [
  { id: "pending", label: "To Do", color: "border-muted-foreground" },
  { id: "running", label: "In Progress", color: "border-info" },
  { id: "awaiting_approval", label: "Needs Approval", color: "border-warning" },
  { id: "completed", label: "Done", color: "border-success" },
  { id: "failed", label: "Failed", color: "border-destructive" },
] as const;

export function CRMView() {
  const { data: dbTasks, isLoading } = useTasks();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const updateStatus = useUpdateTaskStatus();
  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const tasks = (dbTasks ?? []).filter(t => {
    if (filter === "all") return true;
    return t.assigned_agent_id === filter;
  });

  const handleDrop = (status: string) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === status) { setDraggedTaskId(null); return; }
    updateStatus.mutate(
      { id: draggedTaskId, status: status as any },
      {
        onSuccess: () => toast.success(`Task moved to ${status}`),
        onError: (err: any) => toast.error(err.message),
      }
    );
    setDraggedTaskId(null);
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground">CRM Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Kanban view of all tasks across agents</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 min-w-max h-full">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={cn("w-[280px] flex flex-col rounded-xl bg-card/50 border-t-2", col.color)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <ScrollArea className="flex-1 px-2 pb-2">
                  <div className="space-y-2">
                    {colTasks.map((task) => {
                      const agent = agents.find((a) => a.id === task.assigned_agent_id);
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => setDraggedTaskId(task.id)}
                          onClick={() => setEditTask(task)}
                          className="p-3 rounded-lg bg-card border border-border hover:glow-border transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                              {task.description && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                {agent && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold"
                                      style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                                      {agent.avatar_initials}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{agent.name}</span>
                                  </div>
                                )}
                                {task.due_date && (
                                  <span className="text-[10px] text-muted-foreground ml-auto">
                                    {(() => { try { return format(new Date(task.due_date), "MMM d"); } catch { return ""; } })()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>

      <NewTaskDialog open={showNew} onOpenChange={setShowNew} />
      {editTask && <EditTaskDialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)} task={editTask} />}
    </div>
  );
}
