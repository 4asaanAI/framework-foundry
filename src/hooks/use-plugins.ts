import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PluginRow = Tables<"plugins">;

export function usePlugins() {
  return useQuery({
    queryKey: ["plugins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plugins")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as PluginRow[];
    },
  });
}
