import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface AgentSummary {
  name: string;
  role: string;
  description: string;
}

/** Get agents assigned to a project. */
export async function getAvailableAgents(
  supabase: SupabaseClient,
  projectId: string,
): Promise<AgentSummary[]> {
  const { data, error } = await supabase
    .from("project_agents")
    .select("agent_id, agents(name, canonical_role, description)")
    .eq("project_id", projectId);

  if (error || !data) return [];

  return data
    .filter((pa: any) => pa.agents)
    .map((pa: any) => ({
      name: pa.agents.name,
      role: pa.agents.canonical_role,
      description: pa.agents.description,
    }));
}
