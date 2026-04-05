import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ApprovalRow = Tables<"approvals"> & { agent_name?: string };

export function useApprovals() {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("approvals")
        .select("*, agents!approvals_requesting_agent_id_fkey(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((a: any) => ({
        ...a,
        agent_name: a.agents?.name ?? "Unknown",
      })) as ApprovalRow[];
    },
  });
}

export function useUpdateApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("approvals")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["approvals"] }),
  });
}
