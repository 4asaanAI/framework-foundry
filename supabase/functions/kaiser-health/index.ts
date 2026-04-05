import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action } = await req.json().catch(() => ({ action: "health_check" }));
    const results: Record<string, unknown> = {};

    // 1. Check all agent statuses
    const { data: agents } = await supabase.from("agents").select("id, name, status, budget_used, budget_tokens, budget_loaned, is_active");
    results.agents_total = agents?.length ?? 0;
    results.agents_active = agents?.filter(a => a.is_active).length ?? 0;
    
    // Find agents with errors or budget issues
    const errorAgents = agents?.filter(a => a.status === "error") ?? [];
    const exhaustedAgents = agents?.filter(a => a.budget_used >= (a.budget_tokens + a.budget_loaned)) ?? [];
    results.agents_error = errorAgents.map(a => a.name);
    results.agents_budget_exhausted = exhaustedAgents.map(a => a.name);

    // 2. Auto-recover error agents (reset to idle)
    if (action === "auto_recover" || action === "health_check") {
      for (const agent of errorAgents) {
        await supabase.from("agents").update({ status: "idle" }).eq("id", agent.id);
        await supabase.from("audit_log").insert({
          actor_id: "kaiser-system", actor_type: "agent",
          action: "auto_recover", target_table: "agents", target_id: agent.id,
          payload: { previous_status: "error", new_status: "idle" },
        });
      }
      results.recovered = errorAgents.map(a => a.name);
    }

    // 3. Budget alerts — notify if any agent is >90% usage
    const warningAgents = agents?.filter(a => {
      const effective = a.budget_tokens + a.budget_loaned;
      return effective > 0 && (a.budget_used / effective) > 0.9 && a.budget_used < effective;
    }) ?? [];
    
    for (const agent of warningAgents) {
      // Check if we already sent a notification recently
      const { data: existing } = await supabase.from("notifications")
        .select("id").eq("title", `Budget warning: ${agent.name}`)
        .gte("created_at", new Date(Date.now() - 3600000).toISOString())
        .limit(1);
      
      if (!existing || existing.length === 0) {
        // Get all profiles to notify
        const { data: profiles } = await supabase.from("profiles").select("user_id");
        for (const p of (profiles ?? [])) {
          await supabase.from("notifications").insert({
            profile_id: p.user_id, title: `Budget warning: ${agent.name}`,
            body: `${agent.name} has used over 90% of token budget.`,
            source_agent_id: agent.id, category: "budget",
          });
        }
      }
    }
    results.budget_warnings = warningAgents.map(a => a.name);

    // 4. Check message queue health (pending conversations)
    const { count: pendingCount } = await supabase.from("conversations")
      .select("*", { count: "exact", head: true }).eq("status", "active");
    results.active_conversations = pendingCount;

    // 5. Check pending approvals
    const { count: pendingApprovals } = await supabase.from("approvals")
      .select("*", { count: "exact", head: true }).eq("status", "pending");
    results.pending_approvals = pendingApprovals;

    // 6. Log the health check
    await supabase.from("audit_log").insert({
      actor_id: "kaiser-system", actor_type: "agent",
      action: "health_check", target_table: "system",
      payload: results,
    });

    results.status = "healthy";
    results.timestamp = new Date().toISOString();

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Kaiser error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
