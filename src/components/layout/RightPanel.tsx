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
import { reinforceMemory } from "@/lib/memory";

interface RightPanelProps {
  selectedAgentId?: string | null;
}

// Group DB categories into display domains
const DOMAIN_ORDER = [
  { key: "decision", label: "Decisions", color: "bg-blue-500/10 text-blue-400" },
  { key: "process", label: "Processes & Constraints", color: "bg-purple-500/10 text-purple-400" },
  { key: "preference", label: "Preferences", color: "bg-pink-500/10 text-pink-400" },
  { key: "client_info", label: "Client Intelligence", color: "bg-green-500/10 text-green-400" },
  { key: "company", label: "Company Context", color: "bg-cyan-500/10 text-cyan-400" },
  { key: "market_data", label: "Market Data", color: "bg-yellow-500/10 text-yellow-400" },
  { key: "conversation_handoff", label: "Handoffs", color: "bg-orange-500/10 text-orange-400" },
];

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

  // Group memories by category domain
  const groupedMemories = DOMAIN_ORDER
    .map(domain => ({
      ...domain,
      items: (memories ?? []).filter(m => m.category === domain.key),
    }))
    .filter(g => g.items.length > 0);

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

      {/* Sage Context — Grouped Memory Panel */}
      <div className="px-4 py-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Brain className="h-3 w-3" /> Sage Context
        </h4>
        {memoriesLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : groupedMemories.length > 0 ? (
          <div className="space-y-4">
            {groupedMemories.map(group => (
              <div key={group.key}>
                <h5 className={cn("text-xs font-semibold uppercase tracking-wider mb-1.5 px-1.5 py-0.5 rounded inline-block", group.color)}>
                  {group.label}
                </h5>
                <div className="space-y-1.5 mt-1">
                  {group.items.map((mem) => (
                    <div key={mem.id} className="group p-2 rounded-lg bg-card border border-border text-xs hover:border-primary/30 transition-all duration-200">
                      {editingId === mem.id ? (
                        <div className="space-y-2">
                          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} className="text-xs" />
                          <div className="flex gap-1 justify-end">
                            <button onClick={saveEdit} className="p-1 text-success hover:bg-success/10 rounded"><Check className="h-3.5 w-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded"><X className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-1">
                            <p className="text-foreground leading-snug flex-1">{mem.content}</p>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button onClick={() => startEdit(mem)} className="p-0.5 text-muted-foreground hover:text-foreground rounded" title="Edit"><Pencil className="h-3 w-3" /></button>
                              <button onClick={() => deleteMemory(mem.id)} className="p-0.5 text-muted-foreground hover:text-destructive rounded" title="Delete"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 rounded-full bg-background overflow-hidden">
                              <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.round(Number(mem.confidence) * 100)}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{Math.round(Number(mem.confidence) * 100)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No memories yet. Chat with this agent to build Sage context.</p>
        )}
      </div>
    </aside>
  );
}
