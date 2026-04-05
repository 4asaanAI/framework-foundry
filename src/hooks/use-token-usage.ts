import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTokenUsageLogs(agentId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["token-usage", agentId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase
        .from("token_usage_log")
        .select("*")
        .eq("profile_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(500);
      if (agentId) q = q.eq("agent_id", agentId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useAgentUsageSummary() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["token-usage-summary", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_usage_log")
        .select("agent_id, tokens_in, tokens_out, cost_usd, created_at")
        .eq("profile_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
