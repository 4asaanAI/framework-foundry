import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AgentRow } from "@/hooks/use-agents";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAgent: AgentRow | null;
  allAgents: AgentRow[];
}

export function TransferTokensDialog({ open, onOpenChange, sourceAgent, allAgents }: Props) {
  const [targetId, setTargetId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  if (!sourceAgent) return null;

  const available = sourceAgent.budget_tokens - sourceAgent.budget_used - sourceAgent.budget_loaned;
  const otherAgents = allAgents.filter((a) => a.id !== sourceAgent.id);

  const handleTransfer = async () => {
    const amt = parseInt(amount);
    if (!targetId || isNaN(amt) || amt <= 0) {
      toast.error("Please select a target agent and enter a valid amount");
      return;
    }
    if (amt > available) {
      toast.error(`Only ${available} tokens available to transfer`);
      return;
    }

    setLoading(true);
    try {
      // Increase source's budget_loaned
      const { error: e1 } = await supabase
        .from("agents")
        .update({ budget_loaned: sourceAgent.budget_loaned + amt })
        .eq("id", sourceAgent.id);
      if (e1) throw e1;

      // Increase target's budget_tokens
      const target = allAgents.find((a) => a.id === targetId)!;
      const { error: e2 } = await supabase
        .from("agents")
        .update({ budget_tokens: target.budget_tokens + amt })
        .eq("id", targetId);
      if (e2) throw e2;

      toast.success(`Transferred ${amt.toLocaleString()} tokens to ${target.name}`);
      qc.invalidateQueries({ queryKey: ["agents"] });
      onOpenChange(false);
      setAmount("");
      setTargetId("");
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Tokens from {sourceAgent.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="text-sm text-muted-foreground">
            Available: <span className="font-mono text-foreground">{available.toLocaleString()}</span> tokens
          </div>
          <div className="space-y-2">
            <Label>Transfer to</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {otherAgents.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name} — {a.canonical_role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (tokens)</Label>
            <Input
              type="number"
              min={1}
              max={available}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={loading}>
            {loading ? "Transferring..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
