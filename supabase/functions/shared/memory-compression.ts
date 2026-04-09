import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ArchiveResult {
  archived_count: number;
}

interface ArchivedMessage {
  original_message_id: string;
  conversation_id: string;
  project_id: string | null;
  role: string;
  content: string;
  created_at: string;
  archived_at: string;
}

/** Compress messages older than threshold by moving them to message_archives. */
export async function compressOldMessages(
  supabase: SupabaseClient,
  daysThreshold = 7
): Promise<ArchiveResult> {
  const cutoff = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000).toISOString();

  const { data: oldMessages, error: fetchErr } = await supabase
    .from("messages")
    .select("*")
    .lt("created_at", cutoff);

  if (fetchErr) throw fetchErr;
  if (!oldMessages?.length) return { archived_count: 0 };

  const archives = oldMessages.map((m: Record<string, unknown>) => ({
    original_message_id: m.id,
    conversation_id: m.conversation_id,
    project_id: m.project_id ?? null,
    role: m.role,
    content: m.content,
    created_at: m.created_at,
    archived_at: new Date().toISOString(),
  }));

  const { error: insertErr } = await supabase.from("message_archives").insert(archives);
  if (insertErr) throw insertErr;

  const ids = oldMessages.map((m: Record<string, unknown>) => m.id as string);
  const { error: deleteErr } = await supabase.from("messages").delete().in("id", ids);
  if (deleteErr) throw deleteErr;

  return { archived_count: ids.length };
}

/** Full-text search across message_archives. */
export async function searchArchives(
  supabase: SupabaseClient,
  query: string,
  conversationId?: string
): Promise<ArchivedMessage[]> {
  let q = supabase
    .from("message_archives")
    .select("*")
    .textSearch("content", query, { type: "plain" });

  if (conversationId) {
    q = q.eq("conversation_id", conversationId);
  }

  const { data, error } = await q.order("created_at", { ascending: false }).limit(50);

  if (error) throw error;
  return (data ?? []) as ArchivedMessage[];
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === "POST" && url.pathname === "/memory/compress") {
    try {
      const body = await req.json().catch(() => ({}));
      const days = body.days_threshold ?? 7;
      const result = await compressOldMessages(supabase, days);
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

  if (req.method === "GET" && url.pathname === "/memory/search-archives") {
    try {
      const query = url.searchParams.get("q");
      if (!query) {
        return new Response(JSON.stringify({ error: "Query parameter 'q' required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const conversationId = url.searchParams.get("conversation_id") ?? undefined;
      const results = await searchArchives(supabase, query, conversationId);
      return new Response(JSON.stringify({ results, count: results.length }), {
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
