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
  /** Source agent (outbound mode). If null and targetAgent is set, use inbound mode. */
  sourceAgent: AgentRow | null;
  allAgents: AgentRow[];
  /** Target agent (inbound mode) — pick a source to loan tokens TO this agent. */
  targetAgent?: AgentRow | null;
}

export function TransferTokensDialog({ open, onOpenChange, sourceAgent, allAgents, targetAgent }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  // Inbound mode: user picks which agent to take tokens FROM → give to targetAgent
  const isInbound = !sourceAgent && !!targetAgent;

  if (!sourceAgent && !targetAgent) return null;

  const donorAgents = isInbound
    ? allAgents.filter((a) => a.id !== targetAgent!.id && (a.budget_tokens - a.budget_used - a.budget_loaned) > 0)
    : [];

  const selectedDonor = isInbound ? donorAgents.find((a) => a.id === selectedId) : null;
  const availableTokens = isInbound
    ? (selectedDonor ? selectedDonor.budget_tokens - selectedDonor.budget_used - selectedDonor.budget_loaned : 0)
    : (sourceAgent ? sourceAgent.budget_tokens - sourceAgent.budget_used - sourceAgent.budget_loaned : 0);

  const otherAgents = sourceAgent ? allAgents.filter((a) => a.id !== sourceAgent.id) : [];

  const handleTransfer = async () => {
    const amt = parseInt(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amt > availableTokens) {
      toast.error(`Only ${availableTokens} tokens available`);
      return;
    }

    setLoading(true);
    try {
      if (isInbound && selectedDonor && targetAgent) {
        // Increase donor's budget_loaned
        const { error: e1 } = await supabase
          .from("agents")
          .update({ budget_loaned: selectedDonor.budget_loaned + amt })
          .eq("id", selectedDonor.id);
        if (e1) throw e1;

        // Increase target's budget_tokens
        const { error: e2 } = await supabase
          .from("agents")
          .update({ budget_tokens: targetAgent.budget_tokens + amt })
          .eq("id", targetAgent.id);
        if (e2) throw e2;

        toast.success(`Transferred ${amt.toLocaleString()} tokens from ${selectedDonor.name} to ${targetAgent.name}`);
      } else if (sourceAgent) {
        // Outbound mode (original)
        if (!selectedId) { toast.error("Select a target agent"); setLoading(false); return; }
        const { error: e1 } = await supabase
          .from("agents")
          .update({ budget_loaned: sourceAgent.budget_loaned + amt })
          .eq("id", sourceAgent.id);
        if (e1) throw e1;

        const target = allAgents.find((a) => a.id === selectedId)!;
        const { error: e2 } = await supabase
          .from("agents")
          .update({ budget_tokens: target.budget_tokens + amt })
          .eq("id", selectedId);
        if (e2) throw e2;

        toast.success(`Transferred ${amt.toLocaleString()} tokens to ${target.name}`);
      }

      qc.invalidateQueries({ queryKey: ["agents"] });
      onOpenChange(false);
      setAmount("");
      setSelectedId("");
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
          <DialogTitle>
            {isInbound
              ? `Loan Tokens to ${targetAgent!.name}`
              : `Transfer Tokens from ${sourceAgent!.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {isInbound ? (
            <>
              <div className="space-y-2">
                <Label>Take tokens from</Label>
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {donorAgents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {(a.budget_tokens - a.budget_used - a.budget_loaned).toLocaleString()} available
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDonor && (
                <div className="text-sm text-muted-foreground">
                  Available from {selectedDonor.name}: <span className="font-mono text-foreground">{availableTokens.toLocaleString()}</span> tokens
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Available: <span className="font-mono text-foreground">{availableTokens.toLocaleString()}</span> tokens
              </div>
              <div className="space-y-2">
                <Label>Transfer to</Label>
                <Select value={selectedId} onValueChange={setSelectedId}>
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
            </>
          )}
          <div className="space-y-2">
            <Label>Amount (tokens)</Label>
            <Input
              type="number"
              min={1}
              max={availableTokens}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleTransfer} disabled={loading || (isInbound && !selectedId)}>
            {loading ? "Transferring..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
