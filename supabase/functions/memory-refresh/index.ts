import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY")!;
const CLAUDE_HAIKU_MODEL = "claude-3-5-haiku-20241022";

interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
  context_id?: string;
  agent_id?: string;
}

interface ExtractedMemory {
  key: string;
  value: string;
  confidence: number;
  category: "fact" | "decision" | "preference" | "action_item";
}

interface RefreshResult {
  refreshed_contexts: number;
  memories_extracted: number;
  messages_archived: number;
}

async function extractMemories(messages: Message[]): Promise<ExtractedMemory[]> {
  if (!messages.length) return [];

  const conversationText = messages
    .map((m) => `[${m.role}] ${m.content}`)
    .join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_HAIKU_MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Extract key facts, decisions, preferences, and action items from this conversation. Return ONLY a JSON array of objects with fields: key (short label), value (detail), confidence (0-1), category (fact|decision|preference|action_item).\n\nConversation:\n${conversationText}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "[]";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]) as ExtractedMemory[];
  } catch {
    return [];
  }
}

async function refreshContext(
  supabase: SupabaseClient,
  contextId: string,
  lastRefreshAt: string | null
): Promise<{ memoriesExtracted: number; messagesArchived: number }> {
  const since = lastRefreshAt ?? new Date(0).toISOString();

  const { data: messages, error: msgErr } = await supabase
    .from("messages")
    .select("*")
    .eq("context_id", contextId)
    .gt("created_at", since)
    .order("created_at", { ascending: true });

  if (msgErr) throw msgErr;
  if (!messages?.length) return { memoriesExtracted: 0, messagesArchived: 0 };

  const memories = await extractMemories(messages as Message[]);

  for (const mem of memories) {
    await supabase.from("context_memories").upsert(
      {
        context_id: contextId,
        key: mem.key,
        value: mem.value,
        confidence: mem.confidence,
        category: mem.category,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "context_id,key" }
    );
  }

  const agentIds = [...new Set(messages.filter((m: Message) => m.agent_id).map((m: Message) => m.agent_id))];
  for (const agentId of agentIds) {
    const agentMessages = messages.filter((m: Message) => m.agent_id === agentId);
    const agentMemories = await extractMemories(agentMessages as Message[]);
    for (const mem of agentMemories) {
      await supabase.from("agent_memories").upsert(
        {
          agent_id: agentId,
          key: mem.key,
          value: mem.value,
          confidence: mem.confidence,
          category: mem.category,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "agent_id,key" }
      );
    }
  }

  await supabase
    .from("work_contexts")
    .update({ last_refresh_at: new Date().toISOString() })
    .eq("id", contextId);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: oldMessages } = await supabase
    .from("messages")
    .select("*")
    .eq("context_id", contextId)
    .lt("created_at", sevenDaysAgo);

  let messagesArchived = 0;
  if (oldMessages?.length) {
    const archives = oldMessages.map((m: Message) => ({
      original_message_id: m.id,
      conversation_id: m.conversation_id,
      context_id: contextId,
      role: m.role,
      content: m.content,
      created_at: m.created_at,
      archived_at: new Date().toISOString(),
    }));

    const { error: archiveErr } = await supabase.from("message_archives").insert(archives);
    if (!archiveErr) {
      const ids = oldMessages.map((m: Message) => m.id);
      await supabase.from("messages").delete().in("id", ids);
      messagesArchived = ids.length;
    }
  }

  return { memoriesExtracted: memories.length, messagesArchived };
}

/** Runs the daily 12:00 PM IST memory refresh across all active contexts. */
export async function handleScheduledRefresh(): Promise<RefreshResult> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: contexts, error } = await supabase
    .from("work_contexts")
    .select("id, last_refresh_at")
    .eq("status", "active");

  if (error) throw error;

  let totalMemories = 0;
  let totalArchived = 0;
  let refreshedCount = 0;

  for (const ctx of contexts ?? []) {
    const result = await refreshContext(supabase, ctx.id, ctx.last_refresh_at);
    if (result.memoriesExtracted > 0 || result.messagesArchived > 0) {
      refreshedCount++;
    }
    totalMemories += result.memoriesExtracted;
    totalArchived += result.messagesArchived;
  }

  return {
    refreshed_contexts: refreshedCount,
    memories_extracted: totalMemories,
    messages_archived: totalArchived,
  };
}

/** POST /memory/refresh — on-demand refresh for a specific context or all contexts. */
export async function handleOnDemandRefresh(req: Request): Promise<Response> {
  try {
    const { context_id } = await req.json().catch(() => ({ context_id: null }));
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    if (context_id) {
      const { data: ctx, error } = await supabase
        .from("work_contexts")
        .select("id, last_refresh_at")
        .eq("id", context_id)
        .single();

      if (error || !ctx) {
        return new Response(JSON.stringify({ error: "Context not found" }), { status: 404 });
      }

      const result = await refreshContext(supabase, ctx.id, ctx.last_refresh_at);
      return new Response(
        JSON.stringify({
          refreshed_contexts: 1,
          memories_extracted: result.memoriesExtracted,
          messages_archived: result.messagesArchived,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await handleScheduledRefresh();
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

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/memory/refresh") {
    return handleOnDemandRefresh(req);
  }

  if (req.method === "POST" && url.pathname === "/memory/scheduled-refresh") {
    try {
      const result = await handleScheduledRefresh();
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
