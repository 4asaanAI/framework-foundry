import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useAgentMemories } from "@/hooks/use-agent-memories";
import { MOCK_AGENTS } from "@/constants/agents";
import { Brain, Zap, Clock, Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface RightPanelProps {
  selectedAgentId?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  decision: "bg-primary/10 text-primary",
  client_info: "bg-info/10 text-info",
  market_data: "bg-warning/10 text-warning",
  process: "bg-success/10 text-success",
  preference: "bg-accent text-accent-foreground",
  company: "bg-secondary text-secondary-foreground",
  conversation_handoff: "bg-muted text-muted-foreground",
};

export function RightPanel({ selectedAgentId }: RightPanelProps) {
  const { data: dbAgents } = useAgents();
  const queryClient = useQueryClient();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgent = selectedAgentId
    ? agents.find((a) => a.id === selectedAgentId) ?? agents[0]
    : agents[0];

  const { data: memories, isLoading: memoriesLoading } = useAgentMemories(activeAgent?.id);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const budgetPct = Math.round((activeAgent.budget_used / activeAgent.budget_tokens) * 100);

  const invalidateMemories = () => {
    queryClient.invalidateQueries({ queryKey: ["agent_memories", activeAgent?.id] });
  };

  const startEdit = (mem: { id: string; content: string }) => {
    setEditingId(mem.id);
    setEditContent(mem.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("agent_memories").update({ content: editContent }).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Memory updated"); setEditingId(null); invalidateMemories(); }
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase.from("agent_memories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Memory deleted"); invalidateMemories(); }
  };

  return (
    <aside className="w-[320px] h-full border-l border-border bg-background overflow-y-auto shrink-0 hidden xl:block">
      {/* Agent Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
          >
            {activeAgent.avatar_initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{activeAgent.name}</h3>
            <p className="text-xs text-muted-foreground">{activeAgent.canonical_role}</p>
          </div>
        </div>
        {/* Budget */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Token Budget</span>
            <span className={cn("font-mono", budgetPct > 80 ? "text-destructive" : "text-muted-foreground")}>
              {activeAgent.budget_used} / {activeAgent.budget_tokens}
            </span>
          </div>
          <div className="h-2 rounded-full bg-card overflow-hidden">
            <div
              className={cn("h-full rounded-full", budgetPct > 80 ? "bg-destructive" : budgetPct > 50 ? "bg-warning" : "bg-success")}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Memory Panel */}
      <div className="px-4 py-4 border-b border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Brain className="h-3 w-3" /> Relevant Memory
        </h4>
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : memories && memories.length > 0 ? (
          <div className="space-y-2">
            {memories.map((mem) => (
              <div key={mem.id} className="group p-2.5 rounded-lg bg-card border border-border text-xs hover:border-primary/30 transition-colors">
                {editingId === mem.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="text-xs"
                    />
                    <div className="flex gap-1 justify-end">
                      <button onClick={saveEdit} className="p-1 text-success hover:bg-success/10 rounded">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-1">
                      <p className="text-foreground leading-snug flex-1">{mem.content}</p>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEdit(mem)} className="p-0.5 text-muted-foreground hover:text-foreground rounded" title="Edit">
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button onClick={() => deleteMemory(mem.id)} className="p-0.5 text-muted-foreground hover:text-destructive rounded" title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 rounded-full bg-background overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.round(Number(mem.confidence) * 100)}%` }} />
                      </div>
                      <span className="text-muted-foreground font-mono">{Math.round(Number(mem.confidence) * 100)}</span>
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px]", CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground")}>
                        {mem.category.replace(/_/g, " ")}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-background text-muted-foreground text-[10px]">
                        {mem.memory_type}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No memories yet. Chat with this agent to build context.</p>
        )}
      </div>
    </aside>
  );
}
