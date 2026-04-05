import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, Brain, FileText, History } from "lucide-react";
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
  const [newMemory, setNewMemory] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState("preference");
  const [customApiKey, setCustomApiKey] = useState("");
  const [customApiBaseUrl, setCustomApiBaseUrl] = useState("");

  const resetForm = (a: AgentRow) => {
    setName(a.name);
    setDescription(a.description);
    setSystemPrompt(a.system_prompt);
    setDefaultModel(a.default_model);
    setLlmProvider(a.llm_provider);
    setBudgetTokens(a.budget_tokens);
    setCustomApiKey((a as any).custom_api_key || "");
    setCustomApiBaseUrl((a as any).custom_api_base_url || "");
  };

  useEffect(() => {
    if (agent && open) resetForm(agent);
  }, [agent, open]);

  // Agent memories
  const { data: memories, refetch: refetchMemories } = useQuery({
    queryKey: ["agent-memories", agent?.id],
    enabled: !!agent?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_memories")
        .select("*")
        .eq("agent_id", agent!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Prompt history from agent's prompt_history JSON
  const promptHistory = agent?.prompt_history ? (agent.prompt_history as any[]) : [];

  const handleSave = async () => {
    if (!agent) return;
    setSaving(true);

    // Build prompt history if prompt changed
    const updates: any = {
      name,
      description,
      system_prompt: systemPrompt,
      default_model: defaultModel,
      llm_provider: llmProvider,
      budget_tokens: budgetTokens,
      custom_api_key: customApiKey,
      custom_api_base_url: customApiBaseUrl,
    };

    if (systemPrompt !== agent.system_prompt) {
      const newHistory = [
        ...promptHistory,
        { version: agent.prompt_version, prompt: agent.system_prompt, updated_at: new Date().toISOString() },
      ];
      updates.prompt_history = newHistory;
      updates.prompt_version = agent.prompt_version + 1;
    }

    const { error } = await supabase
      .from("agents")
      .update(updates)
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

  const addMemory = async () => {
    if (!agent || !newMemory.trim()) return;
    const { error } = await supabase.from("agent_memories").insert({
      agent_id: agent.id,
      content: newMemory.trim(),
      category: newMemoryCategory as any,
      memory_type: "personal" as any,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Memory added");
      setNewMemory("");
      refetchMemories();
    }
  };

  const deleteMemory = async (id: string) => {
    // We don't have DELETE policy but let's try
    const { error } = await supabase.from("agent_memories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else refetchMemories();
  };

  const handleClose = (o: boolean) => {
    onOpenChange(o);
  };

  const MEMORY_CATEGORIES = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent — {agent?.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-1"><Brain className="h-3 w-3" /> Memory</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-3 w-3" /> Prompt History</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-2">
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
            <div className="border-t border-border pt-3 mt-2">
              <p className="text-xs font-semibold text-foreground mb-2">Custom LLM Configuration (Optional)</p>
              <p className="text-[10px] text-muted-foreground mb-3">Leave blank to use the platform's default AI. Set a custom API key to use your own LLM provider.</p>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Custom API Key</Label>
                  <Input type="password" value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} placeholder="sk-... or API key for any provider" />
                </div>
                <div>
                  <Label className="text-xs">Custom API Base URL</Label>
                  <Input value={customApiBaseUrl} onChange={(e) => setCustomApiBaseUrl(e.target.value)} placeholder="https://api.openai.com/v1/chat/completions" />
                  <p className="text-[9px] text-muted-foreground mt-1">Must be OpenAI-compatible endpoint. Leave blank to use Lovable AI gateway.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
            </div>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Add Memory</Label>
              <div className="flex gap-2">
                <select
                  value={newMemoryCategory}
                  onChange={(e) => setNewMemoryCategory(e.target.value)}
                  className="px-2 py-1.5 rounded-md bg-card border border-border text-xs text-foreground"
                >
                  {MEMORY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                  ))}
                </select>
                <Input
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  placeholder="Add a memory entry..."
                  className="flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter") addMemory(); }}
                />
                <Button size="sm" onClick={addMemory}><Plus className="h-3.5 w-3.5" /></Button>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {memories?.map((mem) => (
                <div key={mem.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{mem.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-background text-muted-foreground">{mem.category}</span>
                      <span className="text-[9px] text-muted-foreground">conf: {(mem.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <button onClick={() => deleteMemory(mem.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {(!memories || memories.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-4">No memories stored for this agent</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Current version: <span className="font-mono font-semibold text-foreground">v{agent?.prompt_version}</span></p>
              {promptHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No prompt history yet — changes are tracked when you update the system prompt</p>
              ) : (
                promptHistory.slice().reverse().map((entry: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground">v{entry.version}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(entry.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <pre className="text-[10px] text-muted-foreground font-mono whitespace-pre-wrap max-h-[100px] overflow-y-auto">{entry.prompt}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setSystemPrompt(entry.prompt);
                        toast.info("Prompt restored — switch to General tab and save");
                      }}
                    >
                      Restore this version
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
