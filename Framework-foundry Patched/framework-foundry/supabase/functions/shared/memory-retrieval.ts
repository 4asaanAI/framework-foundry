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

// Weight scoring by type priority: decisions > constraints > preferences > context > patterns
const TYPE_WEIGHTS: Record<string, number> = {
  decision: 1.0, process: 0.9, preference: 0.8,
  client_info: 0.85, company: 0.7, market_data: 0.65,
  conversation_handoff: 0.5,
};

function computeRelevance(memory: Memory, queryTerms: string[]): number {
  const text = `${memory.key} ${memory.value}`.toLowerCase();

  // Keyword match score
  let keywordScore = 0;
  if (queryTerms.length) {
    const matchCount = queryTerms.filter((t) => text.includes(t)).length;
    keywordScore = matchCount / queryTerms.length;
  }

  // Recency decay
  const ageMs = Date.now() - new Date(memory.updated_at).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const recencyDecay = Math.exp(-0.03 * ageDays);

  // Type weight
  const typeWeight = TYPE_WEIGHTS[memory.category] ?? 0.5;

  if (queryTerms.length) {
    return keywordScore * 0.45 + recencyDecay * 0.2 + memory.confidence * 0.2 + typeWeight * 0.15;
  }
  return recencyDecay * 0.3 + memory.confidence * 0.4 + typeWeight * 0.3;
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

/** Format memories as a synthesized instruction block for system prompt injection (Sage Memory Intelligence). */
export function formatMemoriesForPrompt(memories: Memory[]): string {
  if (!memories.length) return handleEmptyMemories();

  // Group by domain for structured injection
  const domainMap: Record<string, string> = {
    decision: "Decision History", preference: "User Preferences",
    process: "Processes & Constraints", company: "Company & Project Context",
    client_info: "Client Intelligence", market_data: "Market & Industry Data",
    conversation_handoff: "Handoff Notes",
  };
  const groups: Record<string, string[]> = {};
  for (const m of memories) {
    const domain = domainMap[m.category] || "General";
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(`- ${m.key ? `${m.key}: ` : ""}${m.value}`);
  }
  const domainOrder = ["Decision History", "Processes & Constraints", "User Preferences", "Client Intelligence", "Company & Project Context", "Market & Industry Data", "Handoff Notes", "General"];
  const sections = domainOrder.filter(d => groups[d]?.length).map(d => `### ${d}\n${groups[d]!.join("\n")}`);

  return `[SAGE MEMORY CONTEXT — LAYAA OS]\n${sections.join("\n\n")}\n[END SAGE MEMORY]`;
}

/** Graceful handling when no memories are found. */
export function handleEmptyMemories(): string {
  return "";
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
