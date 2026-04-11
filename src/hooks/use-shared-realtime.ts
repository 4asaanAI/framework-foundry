// src/hooks/use-shared-realtime.ts
// Realtime subscription for shared tabs — fires cross-profile notifications
// when data changes in: projects, tasks, approvals, agent_memories, crm_updates_log

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SHARED_TABLES = [
  { table: "projects", label: "Projects", queryKey: "projects" },
  { table: "tasks", label: "Tasks", queryKey: "tasks" },
  { table: "approvals", label: "Approvals", queryKey: "approvals" },
  { table: "agent_memories", label: "Sage Memory", queryKey: "agent_memories" },
] as const;

/**
 * Subscribe to realtime changes on all shared tables.
 * When another profile modifies shared data, show a toast
 * and invalidate the relevant query cache.
 */
export function useSharedRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channels = SHARED_TABLES.map(({ table, label, queryKey }) => {
      return supabase
        .channel(`shared-${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            // Invalidate cache so the UI refreshes
            queryClient.invalidateQueries({ queryKey: [queryKey] });

            // Show notification toast if the change was made by someone else
            const record = payload.new as any;
            const isOwnChange =
              record?.profile_id === user.id ||
              record?.created_by === user.id ||
              record?.created_by_profile === user.id;

            if (!isOwnChange && payload.eventType !== "DELETE") {
              const action =
                payload.eventType === "INSERT" ? "added to" :
                payload.eventType === "UPDATE" ? "updated in" : "changed in";
              toast.info(`${label} ${action} by another user`, { duration: 3000 });
            }
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [user, queryClient]);
}
