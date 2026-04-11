import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/** Insert a change record into crm_updates_log. */
export async function logCrmChange(
  supabase: SupabaseClient,
  taskId: string,
  agentId: string | null,
  field: string,
  oldVal: unknown,
  newVal: unknown,
  reason?: string
): Promise<void> {
  const { error } = await supabase.from("crm_updates_log").insert({
    task_id: taskId,
    agent_id: agentId,
    field_changed: field,
    old_value: oldVal != null ? String(oldVal) : null,
    new_value: newVal != null ? String(newVal) : null,
    reason: reason ?? null,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/** POST /crm-update — update a task and log the change. */
export async function handleCrmUpdate(req: Request): Promise<Response> {
  try {
    const { task_id, status, assignee, due_date, agent_id, reason } = await req.json();

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: "task_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: existing, error: fetchErr } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", task_id)
      .single();

    if (fetchErr || !existing) {
      return new Response(
        JSON.stringify({ error: "Task not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const changes: { field: string; oldVal: unknown; newVal: unknown }[] = [];

    if (status !== undefined && status !== existing.status) {
      updates.status = status;
      changes.push({ field: "status", oldVal: existing.status, newVal: status });
    }
    if (assignee !== undefined && assignee !== existing.assignee) {
      updates.assignee = assignee;
      changes.push({ field: "assignee", oldVal: existing.assignee, newVal: assignee });
    }
    if (due_date !== undefined && due_date !== existing.due_date) {
      updates.due_date = due_date;
      changes.push({ field: "due_date", oldVal: existing.due_date, newVal: due_date });
    }
    if (agent_id !== undefined) {
      updates.modified_by_agent = agent_id;
    }

    if (!changes.length) {
      return new Response(
        JSON.stringify({ task: existing, changes: 0 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: updated, error: updateErr } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", task_id)
      .select("*")
      .single();

    if (updateErr) throw updateErr;

    for (const change of changes) {
      await logCrmChange(supabase, task_id, agent_id ?? null, change.field, change.oldVal, change.newVal, reason);
    }

    return new Response(
      JSON.stringify({ task: updated, changes: changes.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** GET /tasks-shared — all tasks visible on the shared CRM board. */
export async function handleGetSharedTasks(req: Request): Promise<Response> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee_profile:profiles!tasks_assignee_fkey(full_name),
        agent:agents!tasks_modified_by_agent_fkey(name)
      `)
      .eq("crm_board_shared", true)
      .order("updated_at", { ascending: false });

    if (error) {
      const { data: fallbackTasks, error: fbErr } = await supabase
        .from("tasks")
        .select("*")
        .eq("crm_board_shared", true)
        .order("updated_at", { ascending: false });

      if (fbErr) throw fbErr;

      return new Response(JSON.stringify({ tasks: fallbackTasks }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const enriched = await Promise.all(
      (tasks ?? []).map(async (task: Record<string, unknown>) => {
        const { count } = await supabase
          .from("escalations")
          .select("*", { count: "exact", head: true })
          .eq("task_id", task.id);

        return {
          ...task,
          assignee_name: (task.assignee_profile as Record<string, string>)?.full_name ?? null,
          agent_name: (task.agent as Record<string, string>)?.name ?? null,
          escalation_count: count ?? 0,
        };
      })
    );

    return new Response(JSON.stringify({ tasks: enriched }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/crm-update") {
    return handleCrmUpdate(req);
  }
  if (req.method === "GET" && url.pathname === "/tasks-shared") {
    return handleGetSharedTasks(req);
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
});
