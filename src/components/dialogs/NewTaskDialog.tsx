import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { toast } from "sonner";
import { serializeTaskMeta, PRIORITY_CONFIG, TASK_TEMPLATES, type TaskPriority, type TaskMeta } from "@/lib/tasks";

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
  const qc = useQueryClient();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

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
      };
      const fullDescription = serializeTaskMeta(meta, description.trim());
      const { error } = await supabase.from("tasks").insert({
        title: title.trim(),
        description: fullDescription,
        assigned_agent_id: agentId,
        created_by_profile: user?.id,
        due_date: dueDate || null,
      });
      if (error) throw error;
      toast.success(`Task "${title}" created`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setAgentId("");
      setDueDate("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
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
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
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
