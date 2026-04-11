import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

export type ConversationRow = Tables<"conversations"> & { agent_name?: string };
export type MessageRow = Tables<"messages">;

export function useConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from("conversations")
        .select("*, agents!conversations_agent_id_fkey(name, avatar_initials, avatar_color)")
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      // Filter by profile_id to show only current user's conversations
      if (user?.id) {
        query = query.eq("profile_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MessageRow[];
    },
  });
}
