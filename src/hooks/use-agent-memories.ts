import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AgentMemoryRow = Tables<"agent_memories">;

export function useAgentMemories(agentId: string | undefined) {
  return useQuery({
    queryKey: ["agent_memories", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_memories")
        .select("*")
        .eq("agent_id", agentId!)
        .eq("is_compressed", false)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AgentMemoryRow[];
    },
  });
}
