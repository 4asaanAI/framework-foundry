import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type TaskRow = Tables<"tasks"> & { agent_name?: string };

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, agents!tasks_assigned_agent_id_fkey(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((t: any) => ({
        ...t,
        agent_name: t.agents?.name ?? "Unknown",
      })) as TaskRow[];
    },
  });
}
