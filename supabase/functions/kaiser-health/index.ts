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

    // 3. Budget alerts with per-agent thresholds + burn rate forecasting
    // Load per-agent thresholds from settings (default 90%)
    const { data: thresholdSettings } = await supabase.from("settings").select("key, value").like("key", "budget_threshold_%");
    const thresholds: Record<string, number> = {};
    for (const s of (thresholdSettings ?? [])) {
      const agentId = s.key.replace("budget_threshold_", "");
      thresholds[agentId] = parseFloat(s.value) / 100; // stored as percentage
    }

    // Calculate burn rate and days remaining for each agent
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysElapsed = Math.max(1, (now.getTime() - monthStart.getTime()) / (24 * 60 * 60 * 1000));
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - Math.floor(daysElapsed);

    const warningAgents: string[] = [];
    const { data: profiles } = await supabase.from("profiles").select("user_id");

    for (const agent of (agents ?? [])) {
      if (!agent.is_active) continue;
      const effective = agent.budget_tokens + agent.budget_loaned;
      if (effective <= 0) continue;

      const threshold = thresholds[agent.id] ?? 0.9;
      const usagePct = agent.budget_used / effective;

      // Per-agent threshold alert
      if (usagePct > threshold && agent.budget_used < effective) {
        warningAgents.push(agent.name);
        const { data: existing } = await supabase.from("notifications")
          .select("id").eq("title", `Budget warning: ${agent.name}`)
          .gte("created_at", new Date(Date.now() - 3600000).toISOString()).limit(1);

        if (!existing || existing.length === 0) {
          for (const p of (profiles ?? [])) {
            await supabase.from("notifications").insert({
              profile_id: p.user_id, title: `Budget warning: ${agent.name}`,
              body: `${agent.name} has used ${Math.round(usagePct * 100)}% of token budget (threshold: ${Math.round(threshold * 100)}%).`,
              source_agent_id: agent.id, category: "budget",
            });
          }
        }
      }

      // Burn rate forecast: alert at 10 days and 5 days remaining
      if (agent.budget_used > 0) {
        const dailyBurn = agent.budget_used / daysElapsed;
        const tokensRemaining = effective - agent.budget_used;
        const daysUntilExhausted = dailyBurn > 0 ? Math.floor(tokensRemaining / dailyBurn) : 999;

        for (const alertDays of [10, 5]) {
          if (daysUntilExhausted <= alertDays && daysUntilExhausted > (alertDays - 1)) {
            const { data: existing } = await supabase.from("notifications")
              .select("id").eq("title", `Budget forecast: ${agent.name} — ${alertDays} days remaining`)
              .gte("created_at", new Date(Date.now() - 86400000).toISOString()).limit(1);

            if (!existing || existing.length === 0) {
              for (const p of (profiles ?? [])) {
                await supabase.from("notifications").insert({
                  profile_id: p.user_id,
                  title: `Budget forecast: ${agent.name} — ${alertDays} days remaining`,
                  body: `At current burn rate (${Math.round(dailyBurn)} tokens/day), ${agent.name} will exhaust their budget in ~${daysUntilExhausted} days. Consider redistributing tokens.`,
                  source_agent_id: agent.id, category: "budget",
                });
              }
            }
          }
        }
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

    // 5b. Task due date reminders — notify admins at 24h and at deadline
    const { data: upcomingTasks } = await supabase.from("tasks")
      .select("id, title, due_date, status, assigned_agent_id")
      .in("status", ["pending", "running", "awaiting_approval"])
      .not("due_date", "is", null);

    for (const task of (upcomingTasks ?? [])) {
      if (!task.due_date) continue;
      const dueTime = new Date(task.due_date).getTime();
      const now = Date.now();
      const hoursUntilDue = (dueTime - now) / (60 * 60 * 1000);

      // Alert at 24h before
      if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
        const { data: existing } = await supabase.from("notifications")
          .select("id").eq("title", `Task due soon: ${task.title}`)
          .gte("created_at", new Date(Date.now() - 86400000).toISOString()).limit(1);
        if (!existing || existing.length === 0) {
          for (const p of (profiles ?? [])) {
            await supabase.from("notifications").insert({
              profile_id: p.user_id, title: `Task due soon: ${task.title}`,
              body: `"${task.title}" is due in ${Math.round(hoursUntilDue)} hours.`,
              category: "task",
            });
          }
        }
      }
      // Alert at deadline (overdue)
      if (hoursUntilDue <= 0 && hoursUntilDue > -1) {
        const { data: existing } = await supabase.from("notifications")
          .select("id").eq("title", `Task overdue: ${task.title}`)
          .gte("created_at", new Date(Date.now() - 86400000).toISOString()).limit(1);
        if (!existing || existing.length === 0) {
          for (const p of (profiles ?? [])) {
            await supabase.from("notifications").insert({
              profile_id: p.user_id, title: `Task overdue: ${task.title}`,
              body: `"${task.title}" has passed its deadline.`,
              category: "task",
            });
          }
        }
      }
    }

    // 6. Auto-compress old memories (>50 per agent → keep newest 40)
    // Sage Memory Intelligence: NEVER compress memories with confidence > 0.9 — these are core instructions
    const compressedAgents: string[] = [];
    for (const agent of (agents ?? [])) {
      const { count } = await supabase.from("agent_memories")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", agent.id).eq("is_compressed", false);

      if (count && count > 50) {
        const { data: oldest } = await supabase.from("agent_memories")
          .select("id, confidence").eq("agent_id", agent.id).eq("is_compressed", false)
          .order("created_at", { ascending: true }).limit(count - 40);

        for (const mem of (oldest ?? [])) {
          // Protect high-confidence memories from compression
          if (Number(mem.confidence) > 0.9) continue;
          await supabase.from("agent_memories").update({ is_compressed: true }).eq("id", mem.id);
        }
        compressedAgents.push(agent.name);
      }
    }
    results.memories_compressed_agents = compressedAgents;

    // 7. Kaiser Daily Briefing (runs once per day, 8am IST, or on demand via action: "daily_briefing")
    if (action === "daily_briefing" || action === "health_check") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const ydayISO = yesterday.toISOString();
      const todayISO = todayStart.toISOString();

      // Check if briefing already sent today
      const { data: existingBriefing } = await supabase.from("notifications")
        .select("id").eq("title", "Kaiser Daily Briefing")
        .gte("created_at", todayISO).limit(1);

      if (!existingBriefing || existingBriefing.length === 0) {
        // Gather yesterday's activity stats
        const { count: msgCount } = await supabase.from("messages")
          .select("*", { count: "exact", head: true })
          .gte("created_at", ydayISO).lt("created_at", todayISO);

        const { count: taskCompleted } = await supabase.from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed")
          .gte("updated_at", ydayISO).lt("updated_at", todayISO);

        const { count: taskCreated } = await supabase.from("tasks")
          .select("*", { count: "exact", head: true })
          .gte("created_at", ydayISO).lt("created_at", todayISO);

        const { count: approvalCount } = await supabase.from("approvals")
          .select("*", { count: "exact", head: true })
          .gte("created_at", ydayISO).lt("created_at", todayISO);

        const { count: memoryCount } = await supabase.from("agent_memories")
          .select("*", { count: "exact", head: true })
          .gte("created_at", ydayISO).lt("created_at", todayISO);

        const { data: tokenLogs } = await supabase.from("token_usage_log")
          .select("tokens_in, tokens_out, cost_usd")
          .gte("created_at", ydayISO).lt("created_at", todayISO);

        const totalTokens = (tokenLogs ?? []).reduce((s: number, l: any) => s + (l.tokens_in || 0) + (l.tokens_out || 0), 0);
        const totalCost = (tokenLogs ?? []).reduce((s: number, l: any) => s + (l.cost_usd || 0), 0);

        // Agent activity breakdown
        const agentStats = (agents ?? [])
          .filter(a => a.is_active && a.budget_used > 0)
          .sort((a, b) => b.budget_used - a.budget_used)
          .slice(0, 5)
          .map(a => `${a.name}: ${a.budget_used.toLocaleString()} tokens used`);

        // Build briefing body
        const briefingBody = [
          `**Yesterday's Activity Summary** (${yesterday.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })})`,
          ``,
          `**Messages:** ${msgCount ?? 0} across all agents`,
          `**Tasks:** ${taskCreated ?? 0} created, ${taskCompleted ?? 0} completed`,
          `**Approvals:** ${approvalCount ?? 0} processed`,
          `**Memories:** ${memoryCount ?? 0} new memories extracted by Sage`,
          `**Token Usage:** ${totalTokens.toLocaleString()} tokens ($${totalCost.toFixed(4)})`,
          ``,
          agentStats.length > 0 ? `**Most Active Agents:**\n${agentStats.map(s => `- ${s}`).join("\n")}` : "",
          ``,
          errorAgents.length > 0 ? `**Agents in Error:** ${errorAgents.map(a => a.name).join(", ")}` : "",
          exhaustedAgents.length > 0 ? `**Budget Exhausted:** ${exhaustedAgents.map(a => a.name).join(", ")}` : "",
          warningAgents.length > 0 ? `**Budget Warnings (>90%):** ${warningAgents.map(a => a.name).join(", ")}` : "",
        ].filter(Boolean).join("\n");

        // Send to both profiles
        const { data: profiles } = await supabase.from("profiles").select("user_id");
        const kaiserId = (agents ?? []).find(a => a.name === "Kaiser")?.id;

        for (const p of (profiles ?? [])) {
          await supabase.from("notifications").insert({
            profile_id: p.user_id,
            title: "Kaiser Daily Briefing",
            body: briefingBody,
            source_agent_id: kaiserId || null,
            category: "system",
          });
        }

        results.daily_briefing = "sent";
      } else {
        results.daily_briefing = "already_sent_today";
      }
    }

    // 8. Log the health check
    await supabase.from("audit_log").insert({
      actor_id: "kaiser-system", actor_type: "agent",
      action: action === "daily_briefing" ? "daily_briefing" : "health_check",
      target_table: "system",
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
