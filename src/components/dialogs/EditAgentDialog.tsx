import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AgentRow } from "@/hooks/use-agents";

interface EditAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentRow | null;
}

export function EditAgentDialog({ open, onOpenChange, agent }: EditAgentDialogProps) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [defaultModel, setDefaultModel] = useState("");
  const [llmProvider, setLlmProvider] = useState("");
  const [budgetTokens, setBudgetTokens] = useState(0);

  // Sync form when agent changes
  const resetForm = (a: AgentRow) => {
    setName(a.name);
    setDescription(a.description);
    setSystemPrompt(a.system_prompt);
    setDefaultModel(a.default_model);
    setLlmProvider(a.llm_provider);
    setBudgetTokens(a.budget_tokens);
  };

  // Reset when dialog opens with new agent
  if (agent && open && name === "" && description === "") {
    resetForm(agent);
  }

  const handleSave = async () => {
    if (!agent) return;
    setSaving(true);
    const { error } = await supabase
      .from("agents")
      .update({
        name,
        description,
        system_prompt: systemPrompt,
        default_model: defaultModel,
        llm_provider: llmProvider,
        budget_tokens: budgetTokens,
      })
      .eq("id", agent.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${name} updated`);
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      onOpenChange(false);
    }
    setSaving(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setName("");
      setDescription("");
      setSystemPrompt("");
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent — {agent?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <Label>System Prompt</Label>
            <Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={6} className="font-mono text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>LLM Provider</Label>
              <Input value={llmProvider} onChange={(e) => setLlmProvider(e.target.value)} placeholder="openai" />
            </div>
            <div>
              <Label>Default Model</Label>
              <Input value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)} placeholder="gpt-5-mini" />
            </div>
          </div>
          <div>
            <Label>Token Budget</Label>
            <Input type="number" value={budgetTokens} onChange={(e) => setBudgetTokens(Number(e.target.value))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
