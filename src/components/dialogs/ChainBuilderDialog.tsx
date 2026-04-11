/**
 * Chain Workflow Builder — Layaa OS
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { createChain, getChains, deleteChain, executeChain, type AgentChain } from "@/lib/delegation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Trash2, Play, ArrowRight, ChevronDown, ChevronUp, Link2, Loader2 } from "lucide-react";

interface ChainBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChainBuilderDialog({ open, onOpenChange }: ChainBuilderDialogProps) {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgents = agents.filter(a => a.is_active);

  const [chainName, setChainName] = useState("");
  const [steps, setSteps] = useState<{ agentId: string; agentName: string; instruction: string }[]>([
    { agentId: "", agentName: "", instruction: "" },
  ]);
  const [savedChains, setSavedChains] = useState<AgentChain[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [runningChainId, setRunningChainId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      getChains().then(setSavedChains).catch(() => {});
    }
  }, [open]);

  const handleRunChain = async (chain: AgentChain) => {
    setRunningChainId(chain.id);
    try {
      await executeChain(chain, "Execute this chain workflow");
      const updated = await getChains();
      setSavedChains(updated);
      toast.success("Chain completed");
    } catch (err: any) {
      toast.error(`Chain failed: ${err.message}`);
    } finally {
      setRunningChainId(null);
    }
  };

  const addStep = () => {
    setSteps(prev => [...prev, { agentId: "", agentName: "", instruction: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: string) => {
    setSteps(prev => prev.map((step, i) => {
      if (i !== index) return step;
      if (field === "agentId") {
        const agent = activeAgents.find(a => a.id === value);
        return { ...step, agentId: value, agentName: agent?.name || "" };
      }
      return { ...step, [field]: value };
    }));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    setSteps(prev => {
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  const handleSave = async () => {
    if (!chainName.trim()) { toast.error("Chain name is required"); return; }
    if (steps.some(s => !s.agentId || !s.instruction.trim())) { toast.error("All steps need an agent and instruction"); return; }
    if (!user) { toast.error("Not authenticated"); return; }

    try {
      await createChain(
        chainName.trim(),
        steps.map(s => ({ agent_id: s.agentId, instruction: s.instruction })),
        user.id
      );
      const updated = await getChains();
      setSavedChains(updated);
      toast.success(`Chain "${chainName}" saved with ${steps.length} steps`);
      setChainName("");
      setSteps([{ agentId: "", agentName: "", instruction: "" }]);
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (chainId: string) => {
    try {
      await deleteChain(chainId);
      const updated = await getChains();
      setSavedChains(updated);
      toast.success("Chain deleted");
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Chain Workflow Builder — Layaa OS
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pt-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Chain Name</label>
              <Input value={chainName} onChange={e => setChainName(e.target.value)} placeholder="e.g. Content Review Pipeline" className="text-sm" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps</h3>
            {steps.map((step, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">{i + 1}</span>
                  <select
                    value={step.agentId}
                    onChange={e => updateStep(i, "agentId", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value="">Select agent...</option>
                    {activeAgents.map(a => (
                      <option key={a.id} value={a.id}>{a.name} — {a.canonical_role}</option>
                    ))}
                  </select>
                  <div className="flex gap-0.5 shrink-0">
                    <button onClick={() => moveStep(i, "up")} disabled={i === 0} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all duration-200"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveStep(i, "down")} disabled={i === steps.length - 1} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all duration-200"><ChevronDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeStep(i)} disabled={steps.length <= 1} className="p-1 rounded text-muted-foreground hover:text-destructive disabled:opacity-30 transition-all duration-200"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <Textarea
                  value={step.instruction}
                  onChange={e => updateStep(i, "instruction", e.target.value)}
                  placeholder={`What should ${step.agentName || "this agent"} do?`}
                  rows={2}
                  className="text-xs"
                />
                {i < steps.length - 1 && (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            <button onClick={addStep} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200">
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">Save Chain</Button>
          </div>

          <div className="border-t border-border pt-3">
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-all duration-200">
              {showSaved ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              Saved Chains ({savedChains.length})
            </button>
            {showSaved && savedChains.length > 0 && (
              <div className="mt-2 space-y-2">
                {savedChains.map(chain => (
                  <div key={chain.id} className="p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{chain.name}</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleRunChain(chain)} disabled={runningChainId === chain.id}
                          className="p-1 text-primary hover:bg-primary/10 rounded transition-all duration-200" title="Run chain">
                          {runningChainId === chain.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                        </button>
                        <button onClick={() => handleDelete(chain.id)} className="p-1 text-muted-foreground hover:text-destructive transition-all duration-200"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{chain.steps.length} steps</div>
                  </div>
                ))}
              </div>
            )}
            {showSaved && savedChains.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">No saved chains yet. Create one above.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
