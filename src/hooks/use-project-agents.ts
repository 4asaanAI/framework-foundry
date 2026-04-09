import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AgentRow = Tables<"agents">;

/**
 * Fetch agents filtered by project. If projectId is provided, returns only
 * agents assigned to that project. Otherwise returns all agents.
 * If the project has no agents assigned, falls back to all agents.
 */
export function useProjectAgents(projectId: string | null | undefined) {
  return useQuery({
    queryKey: ["project-agents", projectId],
    queryFn: async () => {
      if (!projectId) {
        // No project → all agents
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .order("team")
          .order("name");
        if (error) throw error;
        return data as AgentRow[];
      }

      // Project selected → fetch assigned agent IDs
      const { data: pa, error: paErr } = await supabase
        .from("project_agents")
        .select("agent_id")
        .eq("project_id", projectId);
      if (paErr) throw paErr;

      if (!pa || pa.length === 0) {
        // Empty result → fall back to all agents
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .order("team")
          .order("name");
        if (error) throw error;
        return data as AgentRow[];
      }

      const agentIds = pa.map((r) => r.agent_id);
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .in("id", agentIds)
        .order("team")
        .order("name");
      if (error) throw error;
      return data as AgentRow[];
    },
  });
}
