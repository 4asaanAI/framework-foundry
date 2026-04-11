import { useTasks } from "@/hooks/use-tasks";
import { useUpdateTaskStatus } from "@/hooks/use-update-task";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, Loader2, GripVertical, Trash2, X, IndianRupee, User2 } from "lucide-react";
import { parseTaskMeta, PRIORITY_CONFIG, type TaskPriority } from "@/lib/tasks";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import { EditTaskDialog } from "@/components/dialogs/EditTaskDialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_COLUMNS = [
  { id: "pending", label: "To Do", color: "border-muted-foreground" },
  { id: "running", label: "In Progress", color: "border-info" },
  { id: "awaiting_approval", label: "Needs Approval", color: "border-warning" },
  { id: "completed", label: "Done", color: "border-success" },
  { id: "failed", label: "Failed", color: "border-destructive" },
];

export function CRMView() {
  const { data: dbTasks, isLoading } = useTasks();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const updateStatus = useUpdateTaskStatus();
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [showNewForColumn, setShowNewForColumn] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<any>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const tasks = (dbTasks ?? []).filter(t => {
    if (filter === "all") return true;
    return t.assigned_agent_id === filter;
  });

  const handleDrop = (status: string) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === status) { setDraggedTaskId(null); return; }
    // Only allow dropping to valid task_status enum values
    const validStatuses = ["pending", "running", "completed", "failed", "awaiting_approval"];
    if (validStatuses.includes(status)) {
      updateStatus.mutate(
        { id: draggedTaskId, status: status as any },
        {
          onSuccess: () => toast.success(`Task moved to ${status}`),
          onError: (err: any) => toast.error(err.message),
        }
      );
    } else {
      // For custom columns, we can't update DB status but show in UI
      toast.info(`Custom column "${status}" — task status unchanged in database`);
    }
    setDraggedTaskId(null);
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) { toast.error("Failed to delete task"); return; }
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast.success("Task deleted");
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;
    const id = newColumnName.trim().toLowerCase().replace(/\s+/g, "_");
    if (columns.some(c => c.id === id)) { toast.error("Column already exists"); return; }
    setColumns([...columns, { id, label: newColumnName.trim(), color: "border-muted-foreground" }]);
    setNewColumnName("");
    setAddingColumn(false);
    toast.success("Column added");
  };

  const deleteColumn = (colId: string) => {
    const colTasks = tasks.filter(t => t.status === colId);
    if (colTasks.length > 0) { toast.error("Move tasks out of this column first"); return; }
    setColumns(columns.filter(c => c.id !== colId));
    toast.success("Column removed");
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
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground">
            <option value="all">All Agents</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200">
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 min-w-max h-full">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            const isDefaultCol = DEFAULT_COLUMNS.some(d => d.id === col.id);
            return (
              <div
                key={col.id}
                className={cn("w-[280px] flex flex-col rounded-xl bg-card/50 border-t-2", col.color)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    {/* Column deal value total */}
                    {(() => {
                      const total = colTasks.reduce((s, t) => {
                        const { meta } = parseTaskMeta(t.description || "");
                        return s + (meta.dealValue || 0);
                      }, 0);
                      return total > 0 ? <p className="text-xs text-success font-mono">₹{total.toLocaleString("en-IN")}</p> : null;
                    })()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">{colTasks.length}</span>
                    {!isDefaultCol && (
                      <button onClick={() => deleteColumn(col.id)} className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200" title="Delete column">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
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
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-medium text-foreground truncate">{task.title}</p>
                                {(() => { const { meta } = parseTaskMeta(task.description || ""); return meta.priority !== "P2" ? <span className={cn("text-xs px-1 py-0 rounded border", PRIORITY_CONFIG[meta.priority as TaskPriority]?.color)}>{meta.priority}</span> : null; })()}
                              </div>
                              {(() => {
                                const { meta, cleanDescription } = parseTaskMeta(task.description || "");
                                return (
                                  <>
                                    {meta.dealValue && <p className="text-xs text-success font-mono mt-0.5 flex items-center gap-0.5"><IndianRupee className="h-3 w-3" />{meta.dealValue.toLocaleString("en-IN")}</p>}
                                    {meta.contact?.name && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-0.5"><User2 className="h-3 w-3" />{meta.contact.name}{meta.contact.company ? ` · ${meta.contact.company}` : ""}</p>}
                                    {cleanDescription && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cleanDescription}</p>}
                                  </>
                                );
                              })()}
                              <div className="flex items-center gap-2 mt-2">
                                {agent && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold"
                                      style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                                      {agent.avatar_initials}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{agent.name}</span>
                                  </div>
                                )}
                                {task.due_date && (
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {(() => { try { return format(new Date(task.due_date), "MMM d"); } catch { return ""; } })()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteTask(task.id, e)}
                              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                              title="Delete task"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {/* Add card button in column */}
                    {showNewForColumn === col.id ? (
                      <button onClick={() => { setShowNewForColumn(null); setShowNew(true); }}
                        className="w-full p-2 rounded-lg border border-dashed border-primary/50 text-xs text-primary hover:bg-primary/5 transition-colors text-center">
                        Opens New Task dialog...
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowNew(true)}
                        className="flex items-center justify-center gap-1 w-full py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
                      >
                        <Plus className="h-3 w-3" /> Add card
                      </button>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}

          {/* Add column button */}
          {addingColumn ? (
            <div className="w-[280px] shrink-0 flex flex-col gap-2 p-3 rounded-xl bg-card/30 border border-dashed border-border">
              <input
                autoFocus
                value={newColumnName}
                onChange={e => setNewColumnName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addColumn(); if (e.key === "Escape") setAddingColumn(false); }}
                placeholder="Column name..."
                className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <button onClick={addColumn} className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Add</button>
                <button onClick={() => setAddingColumn(false)} className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingColumn(true)}
              className="w-[280px] shrink-0 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors h-fit py-8"
            >
              <Plus className="h-4 w-4" /> Add Column
            </button>
          )}
        </div>
      </div>

      <NewTaskDialog open={showNew} onOpenChange={setShowNew} />
      {editTask && <EditTaskDialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)} task={editTask} />}
    </div>
  );
}
