import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface Memory {
  id: string;
  key: string;
  value: string;
  confidence: number;
  category: string;
  updated_at: string;
  source: "context" | "agent";
  source_id: string;
}

interface RetrievalOptions {
  contextId?: string;
  agentId?: string;
  query?: string;
  limit?: number;
}

function computeRelevance(memory: Memory, queryTerms: string[]): number {
  if (!queryTerms.length) return memory.confidence;

  const text = `${memory.key} ${memory.value}`.toLowerCase();
  const matchCount = queryTerms.filter((t) => text.includes(t)).length;
  const keywordScore = matchCount / queryTerms.length;

  const ageMs = Date.now() - new Date(memory.updated_at).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const recencyDecay = Math.exp(-0.05 * ageDays);

  return keywordScore * 0.6 + recencyDecay * 0.25 + memory.confidence * 0.15;
}

/** Fetch relevant memories by keyword match, recency, and confidence. */
export async function retrieveMemories(
  supabase: SupabaseClient,
  options: RetrievalOptions
): Promise<Memory[]> {
  const { contextId, agentId, query, limit = 10 } = options;
  const results: Memory[] = [];

  if (contextId) {
    const { data } = await supabase
      .from("context_memories")
      .select("*")
      .eq("context_id", contextId);

    if (data) {
      results.push(
        ...data.map((m: Record<string, unknown>) => ({
          ...m,
          source: "context" as const,
          source_id: contextId,
        })) as Memory[]
      );
    }
  }

  if (agentId) {
    const { data } = await supabase
      .from("agent_memories")
      .select("*")
      .eq("agent_id", agentId);

    if (data) {
      results.push(
        ...data.map((m: Record<string, unknown>) => ({
          ...m,
          source: "agent" as const,
          source_id: agentId,
        })) as Memory[]
      );
    }
  }

  if (!contextId && !agentId) {
    const [{ data: ctxMem }, { data: agentMem }] = await Promise.all([
      supabase.from("context_memories").select("*"),
      supabase.from("agent_memories").select("*"),
    ]);

    if (ctxMem) {
      results.push(
        ...ctxMem.map((m: Record<string, unknown>) => ({
          ...m,
          source: "context" as const,
          source_id: (m as Record<string, string>).context_id,
        })) as Memory[]
      );
    }
    if (agentMem) {
      results.push(
        ...agentMem.map((m: Record<string, unknown>) => ({
          ...m,
          source: "agent" as const,
          source_id: (m as Record<string, string>).agent_id,
        })) as Memory[]
      );
    }
  }

  const queryTerms = query
    ? query.toLowerCase().split(/\s+/).filter(Boolean)
    : [];

  return results
    .map((m) => ({ memory: m, score: computeRelevance(m, queryTerms) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.memory);
}

/** Format memories as a [Relevant Memories] block for system prompt injection. */
export function formatMemoriesForPrompt(memories: Memory[]): string {
  if (!memories.length) return handleEmptyMemories();

  const lines = memories.map(
    (m) =>
      `- [${m.category}] ${m.key}: ${m.value} (source: ${m.source}, updated: ${m.updated_at.split("T")[0]})`
  );

  return `[Relevant Memories]\n${lines.join("\n")}`;
}

/** Graceful handling when no memories are found. */
export function handleEmptyMemories(): string {
  return "[Relevant Memories]\nNo relevant memories found for this context.";
}

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/memory/retrieve") {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const contextId = url.searchParams.get("context_id") ?? undefined;
      const agentId = url.searchParams.get("agent_id") ?? undefined;
      const query = url.searchParams.get("q") ?? undefined;
      const limit = url.searchParams.get("limit")
        ? parseInt(url.searchParams.get("limit")!, 10)
        : undefined;

      const memories = await retrieveMemories(supabase, { contextId, agentId, query, limit });
      const formatted = formatMemoriesForPrompt(memories);

      return new Response(
        JSON.stringify({ memories, formatted_block: formatted }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
});
