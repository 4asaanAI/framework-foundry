import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageCircle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ClarificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvalId: string;
}

export function ClarificationDialog({ open, onOpenChange, approvalId }: ClarificationDialogProps) {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!question.trim() || !user) return;
    setSubmitting(true);
    try {
      // Fetch current approval_messages
      const { data: approval, error: fetchErr } = await supabase
        .from("approvals")
        .select("approval_messages")
        .eq("id", approvalId)
        .single();

      if (fetchErr) throw fetchErr;

      const existing = (approval as any)?.approval_messages ?? [];
      const newMsg = {
        role: "approver",
        content: question.trim(),
        timestamp: new Date().toISOString(),
        author_id: user.id,
      };

      const { error } = await supabase
        .from("approvals")
        .update({ approval_messages: [...existing, newMsg] as any })
        .eq("id", approvalId);

      if (error) throw error;

      toast.success("Clarification question sent");
      setQuestion("");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    } catch (err) {
      console.error("Clarification error:", err);
      toast.error("Failed to send clarification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Ask Clarification
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the agent to clarify something…"
            className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-all duration-200">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || submitting}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Send
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
