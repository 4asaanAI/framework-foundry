import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/** POST /escalate-task — agent escalates a task for human approval. */
export async function handleEscalateTask(req: Request): Promise<Response> {
  try {
    const { task_id, agent_id, reason, conversation_context } = await req.json();

    if (!task_id || !agent_id || !reason) {
      return new Response(
        JSON.stringify({ error: "task_id, agent_id, and reason are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: escalation, error: escErr } = await supabase
      .from("escalations")
      .insert({
        task_id,
        agent_id,
        reason,
        conversation_context: conversation_context ?? [],
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (escErr) throw escErr;

    const { error: queueErr } = await supabase.from("approval_queue").insert({
      escalation_id: escalation.id,
      task_id,
      agent_id,
      agent_context: conversation_context ?? [],
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (queueErr) throw queueErr;

    return new Response(
      JSON.stringify({ escalation_id: escalation.id }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** POST /resolve-escalation — approver approves or rejects an escalation. */
export async function handleResolveEscalation(req: Request): Promise<Response> {
  try {
    const { escalation_id, approved, feedback } = await req.json();

    if (!escalation_id || typeof approved !== "boolean") {
      return new Response(
        JSON.stringify({ error: "escalation_id and approved (boolean) are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const status = approved ? "approved" : "rejected";

    const { data: escalation, error: escErr } = await supabase
      .from("escalations")
      .update({
        status,
        feedback: feedback ?? null,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", escalation_id)
      .select("*")
      .single();

    if (escErr) throw escErr;
    if (!escalation) {
      return new Response(
        JSON.stringify({ error: "Escalation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabase
      .from("approval_queue")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("escalation_id", escalation_id);

    if (!approved) {
      await supabase
        .from("tasks")
        .update({ status: "failed" })
        .eq("id", escalation.task_id);

      await supabase.from("audit_trail").insert({
        entity_type: "escalation",
        entity_id: escalation_id,
        action: "rejected",
        details: { reason: feedback ?? "No feedback provided" },
        created_at: new Date().toISOString(),
      });
    }

    const responseData = approved
      ? {
          escalation_id,
          status,
          context: escalation.conversation_context,
          feedback,
        }
      : { escalation_id, status, feedback };

    return new Response(JSON.stringify(responseData), {
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

/** POST /approval-ask-clarification — approver requests more info from agent. */
export async function handleAskClarification(req: Request): Promise<Response> {
  try {
    const { approval_id, question } = await req.json();

    if (!approval_id || !question) {
      return new Response(
        JSON.stringify({ error: "approval_id and question are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: approval, error: fetchErr } = await supabase
      .from("approval_queue")
      .select("*")
      .eq("id", approval_id)
      .single();

    if (fetchErr || !approval) {
      return new Response(
        JSON.stringify({ error: "Approval entry not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = Array.isArray(approval.approval_messages)
      ? approval.approval_messages
      : [];
    messages.push({
      role: "approver",
      content: question,
      timestamp: new Date().toISOString(),
    });

    const { error: updateErr } = await supabase
      .from("approval_queue")
      .update({ approval_messages: messages })
      .eq("id", approval_id);

    if (updateErr) throw updateErr;

    await supabase.from("notifications").insert({
      type: "clarification_requested",
      agent_id: approval.agent_id,
      reference_id: approval_id,
      message: question,
      read: false,
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ approval_id, messages_count: messages.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** Fetch escalation context + approval result for agent prompt injection. */
export async function handleResumeAfterApproval(
  supabase: SupabaseClient,
  escalationId: string
): Promise<{ context: string; approved: boolean; feedback: string | null }> {
  const { data: escalation, error } = await supabase
    .from("escalations")
    .select("*")
    .eq("id", escalationId)
    .single();

  if (error || !escalation) throw new Error("Escalation not found");

  const { data: approval } = await supabase
    .from("approval_queue")
    .select("approval_messages")
    .eq("escalation_id", escalationId)
    .single();

  const clarifications = approval?.approval_messages ?? [];
  const approved = escalation.status === "approved";

  const contextBlock = [
    `[Escalation Resolution]`,
    `Status: ${escalation.status}`,
    `Original reason: ${escalation.reason}`,
    escalation.feedback ? `Feedback: ${escalation.feedback}` : null,
    clarifications.length
      ? `Clarification thread:\n${clarifications.map((c: { role: string; content: string }) => `  ${c.role}: ${c.content}`).join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return { context: contextBlock, approved, feedback: escalation.feedback };
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/escalate-task") {
    return handleEscalateTask(req);
  }
  if (req.method === "POST" && url.pathname === "/resolve-escalation") {
    return handleResolveEscalation(req);
  }
  if (req.method === "POST" && url.pathname === "/approval-ask-clarification") {
    return handleAskClarification(req);
  }
  if (req.method === "GET" && url.pathname === "/resume-after-approval") {
    try {
      const escalationId = new URL(req.url).searchParams.get("escalation_id");
      if (!escalationId) {
        return new Response(
          JSON.stringify({ error: "escalation_id required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const result = await handleResumeAfterApproval(supabase, escalationId);
      return new Response(JSON.stringify(result), {
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

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
});
