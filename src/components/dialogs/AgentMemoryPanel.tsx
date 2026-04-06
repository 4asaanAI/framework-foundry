import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const MEMORY_CATEGORIES = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"];

interface AgentMemoryPanelProps {
  agentId: string;
}

export function AgentMemoryPanel({ agentId }: AgentMemoryPanelProps) {
  const queryClient = useQueryClient();
  const [newMemory, setNewMemory] = useState("");
  const [newCategory, setNewCategory] = useState("preference");
  const [newConfidence, setNewConfidence] = useState(0.8);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editConfidence, setEditConfidence] = useState(0.8);

  const { data: memories, refetch } = useQuery({
    queryKey: ["agent-memories-panel", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_memories")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    const { error } = await supabase.from("agent_memories").insert({
      agent_id: agentId,
      content: newMemory.trim(),
      category: newCategory as any,
      confidence: newConfidence,
      memory_type: "personal" as any,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Memory added");
      setNewMemory("");
      setNewConfidence(0.8);
      refetch();
    }
  };

  const startEdit = (mem: any) => {
    setEditingId(mem.id);
    setEditContent(mem.content);
    setEditCategory(mem.category);
    setEditConfidence(mem.confidence);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("agent_memories").update({
      content: editContent,
      category: editCategory as any,
      confidence: editConfidence,
    }).eq("id", editingId);
    if (error) toast.error(error.message);
    else {
      toast.success("Memory updated");
      setEditingId(null);
      refetch();
    }
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase.from("agent_memories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else refetch();
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Add new memory */}
      <div className="space-y-2 p-3 rounded-lg border border-border bg-background">
        <Label className="text-xs font-semibold">Add Memory</Label>
        <div className="flex gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-2 py-1.5 rounded-md bg-card border border-border text-xs text-foreground"
          >
            {MEMORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-[100px]">
            <span>Conf:</span>
            <Slider
              value={[newConfidence * 100]}
              onValueChange={([v]) => setNewConfidence(v / 100)}
              max={100}
              min={10}
              step={5}
              className="w-16"
            />
            <span className="font-mono w-8">{Math.round(newConfidence * 100)}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Textarea
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Add a memory entry (fact, decision, preference, etc.)..."
            rows={2}
            className="flex-1 text-xs"
          />
          <Button size="sm" onClick={addMemory} className="self-end">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Memory list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {memories?.map((mem) => (
          <div key={mem.id} className="p-3 rounded-lg bg-card border border-border">
            {editingId === mem.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className="text-xs"
                />
                <div className="flex gap-2 items-center">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-2 py-1 rounded-md bg-background border border-border text-xs text-foreground"
                  >
                    {MEMORY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Slider
                      value={[editConfidence * 100]}
                      onValueChange={([v]) => setEditConfidence(v / 100)}
                      max={100}
                      min={10}
                      step={5}
                      className="w-16"
                    />
                    <span className="font-mono w-8">{Math.round(editConfidence * 100)}%</span>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <button onClick={saveEdit} className="p-1 text-success hover:bg-success/10 rounded">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">{mem.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-background text-muted-foreground">
                      {mem.category}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      conf: {Math.round(mem.confidence * 100)}%
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {mem.memory_type}
                    </span>
                    <span className="text-[9px] text-muted-foreground ml-auto">
                      {new Date(mem.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <button onClick={() => startEdit(mem)} className="p-1 text-muted-foreground hover:text-foreground rounded">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => deleteMemory(mem.id)} className="p-1 text-muted-foreground hover:text-destructive rounded">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {(!memories || memories.length === 0) && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No memories stored yet. Memories are auto-extracted from conversations or can be added manually above.
          </p>
        )}
      </div>
    </div>
  );
}
