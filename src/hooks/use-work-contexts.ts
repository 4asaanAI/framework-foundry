/**
 * Work Context Hooks — Layaa OS
 *
 * React hooks for the work_contexts + context_memories tables.
 * Used by the project workspace to manage active contexts, switch projects,
 * and read/write project-scoped memories.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { WorkContext, ContextMemory } from "@/lib/projects";

export function useWorkContexts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["work-contexts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_contexts")
        .select("*, projects(name, description, is_archived)")
        .eq("user_id", user!.id)
        .order("last_used_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as (WorkContext & { projects: any })[];
    },
  });
}

export function useActiveContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["active-context", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("work_contexts")
        .select("*, projects(project_id, name, description, instructions)") as any)
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as (WorkContext & { projects: any }) | null;
    },
  });
}

export function useActivateContext() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (contextId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Deactivate all current active contexts
      await (supabase
        .from("work_contexts")
        .update({ is_active: false } as any) as any)
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Activate the selected context
      const { error } = await supabase
        .from("work_contexts")
        .update({ is_active: true, last_used_at: new Date().toISOString() } as any)
        .eq("context_id", contextId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-contexts"] });
      queryClient.invalidateQueries({ queryKey: ["active-context"] });
    },
  });
}

export function useDeactivateContext() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      await (supabase
        .from("work_contexts")
        .update({ is_active: false } as any) as any)
        .eq("user_id", user.id)
        .eq("is_active", true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-contexts"] });
      queryClient.invalidateQueries({ queryKey: ["active-context"] });
    },
  });
}

export function useContextMemories(contextId: string | undefined) {
  return useQuery({
    queryKey: ["context-memories", contextId],
    enabled: !!contextId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_memories")
        .select("*")
        .eq("context_id", contextId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContextMemory[];
    },
  });
}
