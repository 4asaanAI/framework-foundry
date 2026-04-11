import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAgents } from "@/hooks/use-agents";
import { useTasks } from "@/hooks/use-tasks";
import { MOCK_AGENTS } from "@/constants/agents";
import { toast } from "sonner";
import { serializeTaskMeta, PRIORITY_CONFIG, TASK_TEMPLATES, parseTaskMeta, type TaskPriority, type TaskMeta } from "@/lib/tasks";
import { Lock, RefreshCw } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTaskDialog({ open, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [agentId, setAgentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("P2");
  const [dealValue, setDealValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<"daily" | "weekly" | "monthly">("weekly");
  const qc = useQueryClient();
  const { data: dbAgents } = useAgents();
  const { data: dbTasks } = useTasks();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const existingTasks = dbTasks ?? [];

  const handleCreate = async () => {
    if (!title.trim() || !agentId) {
      toast.error("Title and assigned agent are required");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const meta: TaskMeta = {
        priority,
        subtasks: [],
        dealValue: dealValue ? parseFloat(dealValue) : undefined,
        dependencies: dependencies.length > 0 ? dependencies : undefined,
        recurrence: isRecurring ? { frequency: recurrenceFreq } : undefined,
      };
      const fullDescription = serializeTaskMeta(meta, description.trim());
      const { error } = await supabase.from("tasks").insert({
        title: title.trim(),
        description: fullDescription,
        assigned_agent_id: agentId,
        created_by_profile: user?.id,
        due_date: dueDate || null,
        is_recurring: isRecurring,
      });
      if (error) throw error;
      toast.success(`Task "${title}" created`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
      setTitle(""); setDescription(""); setAgentId(""); setDueDate("");
      setDependencies([]); setIsRecurring(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Draft investor pitch deck" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task details..." rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Assign to Agent</Label>
            <Select value={agentId} onValueChange={setAgentId}>
              <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
              <SelectContent>
                {agents.filter(a => a.is_active).map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name} — {a.canonical_role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date (optional)</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(PRIORITY_CONFIG) as [TaskPriority, any][]).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{key} — {cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deal Value ₹ (optional)</Label>
              <Input type="number" value={dealValue} onChange={(e) => setDealValue(e.target.value)} placeholder="0" />
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Blocked by (optional)</Label>
            <Select value="" onValueChange={(id) => { if (!dependencies.includes(id)) setDependencies([...dependencies, id]); }}>
              <SelectTrigger><SelectValue placeholder="Select blocking task..." /></SelectTrigger>
              <SelectContent>
                {existingTasks.filter((t: any) => t.status !== "completed").map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {dependencies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {dependencies.map(depId => {
                  const depTask = existingTasks.find((t: any) => t.id === depId);
                  return (
                    <span key={depId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                      <Lock className="h-2.5 w-2.5" />
                      {depTask?.title || depId.slice(0, 8)}
                      <button onClick={() => setDependencies(dependencies.filter(d => d !== depId))} className="ml-1 text-destructive hover:text-destructive/80">×</button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recurrence */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">Recurring task</span>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>
          {isRecurring && (
            <Select value={recurrenceFreq} onValueChange={(v) => setRecurrenceFreq(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Template quick-fill */}
          <div>
            <Label className="mb-1.5 block">Quick template (optional)</Label>
            <div className="flex gap-1 flex-wrap">
              {TASK_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setTitle(t.defaultTitle); setDescription(t.defaultDescription); setPriority(t.defaultPriority); if (t.suggestedAgent) setAgentId(t.suggestedAgent); }}
                  className="px-2 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200">
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
