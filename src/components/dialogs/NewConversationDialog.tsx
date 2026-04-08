import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Team } from "@/types/layaa";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated?: (agentId: string) => void;
}

export function NewConversationDialog({ open, onOpenChange, onConversationCreated }: NewConversationDialogProps) {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const { data: dbAgents } = useAgents();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgents = agents.filter((a) => a.is_active);

  const filtered = useMemo(() => {
    if (!search.trim()) return activeAgents;
    const q = search.toLowerCase();
    return activeAgents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.canonical_role.toLowerCase().includes(q) ||
        a.team.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [activeAgents, search]);

  const teams = [...new Set(filtered.map((a) => a.team))] as Team[];

  const handleSelect = async (agentId: string) => {
    if (!user || creating) return;
    setCreating(true);
    try {
      const agent = agents.find((a) => a.id === agentId);
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          agent_id: agentId,
          profile_id: user.id,
          title: `New chat with ${agent?.name ?? "Agent"}`,
        })
        .select("id")
        .single();
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success(`Started conversation with ${agent?.name}`);
      onConversationCreated?.(agentId);
      onOpenChange(false);
      setSearch("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create conversation");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name, role, or team..."
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-6 pr-1">
          {teams.map((team) => {
            const teamAgents = filtered.filter((a) => a.team === team);
            if (teamAgents.length === 0) return null;
            return (
              <div key={team}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  {TEAM_LABELS[team] ?? team}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {teamAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleSelect(agent.id)}
                      disabled={creating}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all text-left group"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: agent.avatar_color }}
                      >
                        {agent.avatar_initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{agent.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {agent.canonical_role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No agents found matching "{search}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
