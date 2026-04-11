import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/use-tasks";
import { toast } from "sonner";
import { AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  agentName: string;
  conversationId?: string;
  linkedTaskId?: string | null;
  conversationContext?: any[];
}

export function EscalationDialog({
  open, onOpenChange, agentId, agentName,
  conversationId, linkedTaskId, conversationContext = [],
}: EscalationDialogProps) {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const [taskId, setTaskId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill task_id from linked task
  useEffect(() => {
    if (linkedTaskId) setTaskId(linkedTaskId);
  }, [linkedTaskId]);

  const handleSubmit = async () => {
    if (!taskId || !reason.trim() || !user) return;
    setSubmitting(true);
    try {
      // Create escalation
      const { data: esc, error } = await supabase
        .from("escalations" as any)
        .insert([{
          requesting_agent_id: agentId,
          task_id: taskId,
          profile_id: user.id,
          reason: reason.trim(),
          conversation_context: conversationContext.slice(-20),
          status: "pending",
        }])
        .select("id")
        .single();

      if (error) throw error;

      // Also create an approval entry linked to this escalation
      const { error: appErr } = await supabase
        .from("approvals")
        .insert([{
          requesting_agent_id: agentId,
          profile_id: user.id,
          action_type: "escalation",
          action_description: `${agentName} escalated: ${reason.trim().slice(0, 100)}`,
          action_payload: { escalation_id: (esc as any).id, task_id: taskId } as any,
          status: "pending" as const,
          conversation_id: conversationId || null,
        }]);

      if (appErr) throw appErr;

      toast.success("Escalation submitted — check Approvals for review");
      setReason("");
      onOpenChange(false);
    } catch (err) {
      console.error("Escalation error:", err);
      toast.error("Failed to submit escalation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Escalate to Human Review
          </DialogTitle>
          <DialogDescription>
            {agentName} needs human review on a task. Select the task and explain why.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Task picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Task</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select a task…</option>
              {(tasks ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.status})
                </option>
              ))}
            </select>
            {linkedTaskId && (
              <p className="text-xs text-muted-foreground mt-1">Auto-filled from conversation's linked task</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Reason for escalation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this needs human review…"
              className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Context preview */}
          {conversationContext.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">
                Last {Math.min(conversationContext.length, 20)} messages will be included as context
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!taskId || !reason.trim() || submitting}
            className="px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Escalate
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
