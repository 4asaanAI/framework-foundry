/**
 * Sage Memory Intelligence — Layaa OS
 *
 * The unified context memory engine powering all 22 agents on the Layaa AI platform.
 * Handles: extraction, classification, deduplication, synthesis, injection, and lifecycle.
 *
 * Architecture:
 *   Conversation → Analyzer → Classifier → Dedup → Store (agent_memories)
 *   Store → Synthesizer → Instruction Block → Injection (system prompt)
 *
 * Scalable: uses agentId + profileId as keys — adding new agents/users requires zero code changes.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type MemoryType = "preference" | "decision" | "constraint" | "context_fact" | "pattern";

export interface MemoryExtraction {
  content: string;
  type: MemoryType;
  category: string; // DB enum: client_info | decision | market_data | process | preference | company | conversation_handoff
  confidence: number; // 0–100 (stored as 0–1 in DB)
  source: string;
  conversationId: string;
  extractedAt: string;
}

export type ExtractedMemory = MemoryExtraction;

// Maps the 5 memory types to the existing DB category enum
const TYPE_TO_CATEGORY: Record<MemoryType, string> = {
  preference: "preference",
  decision: "decision",
  constraint: "process",
  context_fact: "company",
  pattern: "process",
};

// Reverse: group DB categories into display domains for synthesis
const CATEGORY_TO_DOMAIN: Record<string, string> = {
  decision: "Decision History",
  preference: "User Preferences",
  process: "Processes & Constraints",
  company: "Company & Project Context",
  client_info: "Client Intelligence",
  market_data: "Market & Industry Data",
  conversation_handoff: "Handoff Notes",
};

// ─── Conversation Analyzer ──────────────────────────────────────────────────

/**
 * Semantic assertion patterns — much richer than simple keyword matching.
 * Each pattern captures the structure of how people state facts, not just words.
 */
const ASSERTION_PATTERNS: { pattern: RegExp; type: MemoryType; baseConfidence: number }[] = [
  // ── Decisions ──
  { pattern: /\b(?:we(?:'ve)?|I(?:'ve)?)\s+(?:decided|chosen|agreed|committed|finalized|approved|confirmed|settled on|locked in|went with|going with)\b/i, type: "decision", baseConfidence: 92 },
  { pattern: /\b(?:final decision|the decision is|decision made|we(?:'re)? (?:going|using|picking|choosing))\b/i, type: "decision", baseConfidence: 90 },
  { pattern: /\b(?:let(?:'s)? go with|we(?:'ll)? use|we(?:'ll)? stick with|moving forward with)\b/i, type: "decision", baseConfidence: 88 },
  { pattern: /\b(?:approved|signed off|green(?:\s|-)?lit|gave the go(?:\s|-)?ahead)\b/i, type: "decision", baseConfidence: 90 },

  // ── Preferences ──
  { pattern: /\b(?:I|we)\s+(?:prefer|like|want|favor|lean toward|would rather|always use)\b/i, type: "preference", baseConfidence: 85 },
  { pattern: /\b(?:don(?:'t|t)|do not|never|avoid|stop|quit|no more)\s+(?:use|do|make|write|send|include|add)\b/i, type: "preference", baseConfidence: 82 },
  { pattern: /\b(?:instead of|rather than|over|not .+? but)\b/i, type: "preference", baseConfidence: 75 },
  { pattern: /\b(?:priority is|focus (?:on|should be)|most important|key thing is)\b/i, type: "preference", baseConfidence: 80 },
  { pattern: /\b(?:default|standard|go-to|always|every time)\s+(?:should be|is|format|approach)\b/i, type: "preference", baseConfidence: 78 },

  // ── Constraints ──
  { pattern: /\b(?:budget|limit|cap|ceiling|maximum|no more than|at most|cannot exceed)\b.*?\b(?:is|of|at|around|approximately|roughly)?\s*(?:[$₹€£]?\s*[\d,]+|[\d,]+\s*(?:k|K|lakh|crore|million|billion)?)\b/i, type: "constraint", baseConfidence: 90 },
  { pattern: /\b(?:deadline|due (?:date|by)|must (?:be done|finish|complete|ship|deliver) by|timeline is|ETA is)\b/i, type: "constraint", baseConfidence: 88 },
  { pattern: /\b(?:limited to|restricted to|only (?:available|possible)|cannot|must not|not allowed|off(?:\s|-)?limits)\b/i, type: "constraint", baseConfidence: 85 },
  { pattern: /\b(?:compliance|regulatory|legal requirement|DPDP|GDPR|mandatory|non-negotiable)\b/i, type: "constraint", baseConfidence: 88 },
  { pattern: /\b(?:bootstrap|bootstrapped|self-funded|no (?:external )?funding|no (?:VC|investors))\b/i, type: "constraint", baseConfidence: 85 },

  // ── Context Facts ──
  { pattern: /\b(?:company|org(?:anization)?|team|brand)\s+(?:is|name is|called|named|known as)\b/i, type: "context_fact", baseConfidence: 80 },
  { pattern: /\b(?:founded|launched|started|incorporated|registered)\s+(?:in|on|at|during)\b/i, type: "context_fact", baseConfidence: 82 },
  { pattern: /\b(?:tech stack|stack is|built (?:with|on|using)|powered by|running on|infrastructure)\b/i, type: "context_fact", baseConfidence: 78 },
  { pattern: /\b(?:our (?:product|service|platform|app|tool)|we (?:build|offer|provide|sell|make))\b/i, type: "context_fact", baseConfidence: 76 },
  { pattern: /\b(?:target (?:market|audience|customer|segment)|ICP is|customer profile)\b/i, type: "context_fact", baseConfidence: 78 },
  { pattern: /\b(?:MRR|ARR|revenue|valuation|runway|burn rate)\s+(?:is|of|at|around)\b/i, type: "context_fact", baseConfidence: 85 },
  { pattern: /\b(?:contact|email|phone|reach .+ at|slack|whatsapp)\b.*?(?:is|at|:)\s*\S+/i, type: "context_fact", baseConfidence: 80 },

  // ── Patterns (behavioral/process) ──
  { pattern: /\b(?:every (?:time|week|month|sprint|meeting)|always (?:do|run|check|send|review)|routine|recurring|habit|SOP|standard (?:practice|procedure))\b/i, type: "pattern", baseConfidence: 72 },
  { pattern: /\b(?:workflow|process|pipeline|steps? (?:are|is)|procedure|protocol)\b/i, type: "pattern", baseConfidence: 70 },
  { pattern: /\b(?:reporting (?:to|structure)|reports to|managed by|leads?|oversees)\b/i, type: "pattern", baseConfidence: 74 },
];

/**
 * Quality gate: rejects fragments, questions, filler, and headings.
 * A memory must be a self-contained, meaningful, standalone statement.
 */
function isQualityMemory(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 25 || trimmed.length > 500) return false;

  const stripped = trimmed.replace(/^[-•*]\s*/, "");
  if (stripped.length < 20) return false;

  // Reject questions
  if (/^(would|could|should|shall|can|do|does|did|is|are|was|were|how|what|where|when|why|which|tell me|let me know|have you)/i.test(stripped)) return false;
  // Reject agent filler
  if (/^(tell me|please provide|please share|let me know|feel free|i'd be happy|i can help|sure|of course|absolutely|certainly|great|okay|alright|no problem|happy to|here's|here is|i'll|i will)/i.test(stripped)) return false;
  // Reject headings/labels
  if (/^(##|###|\*\*[^*]+\*\*:?\s*$)/.test(trimmed)) return false;
  // Must contain at least one verb-like word
  if (!/\b(is|are|was|were|has|have|had|will|would|can|could|should|decided|prefer|want|need|use|chose|agreed|confirmed|created|built|launched|set|changed|moved|started|stopped|approved|rejected|scheduled|completed|learned|discovered|found|realized|using|running|building|planning|considering|targeting|focusing|serving|handling|managing|tracking|monitoring)\b/i.test(stripped)) return false;

  return true;
}

function extractSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
}

/**
 * Normalize text for dedup comparison: lowercase, strip punctuation, collapse whitespace.
 */
function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Calculate similarity ratio between two strings (0–1).
 * Uses a simple token overlap metric — fast and good enough for dedup.
 */
function stringSimilarity(a: string, b: string): number {
  const tokensA = new Set(normalizeForComparison(a).split(" "));
  const tokensB = new Set(normalizeForComparison(b).split(" "));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let overlap = 0;
  for (const t of tokensA) { if (tokensB.has(t)) overlap++; }
  return (2 * overlap) / (tokensA.size + tokensB.size);
}

// ─── Extraction ─────────────────────────────────────────────────────────────

/**
 * Extract memories from a single message.
 * Analyzes both user and agent messages — agent messages contain confirmed decisions,
 * clarified facts, and acknowledgments.
 */
export function extractMemoriesFromMessage(
  messageContent: string,
  role: "user" | "agent",
  conversationId: string = ""
): MemoryExtraction[] {
  const results: MemoryExtraction[] = [];
  const now = new Date().toISOString();
  const sentences = extractSentences(messageContent);

  for (const sentence of sentences) {
    if (!isQualityMemory(sentence)) continue;

    // Test against all assertion patterns
    let bestMatch: { type: MemoryType; confidence: number } | null = null;

    for (const { pattern, type, baseConfidence } of ASSERTION_PATTERNS) {
      if (pattern.test(sentence)) {
        // Agent-sourced memories get slightly lower confidence (they're interpretations)
        const roleModifier = role === "user" ? 0 : -5;
        const confidence = Math.min(100, baseConfidence + roleModifier);
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { type, confidence };
        }
      }
    }

    if (bestMatch) {
      results.push({
        content: sentence,
        type: bestMatch.type,
        category: TYPE_TO_CATEGORY[bestMatch.type],
        confidence: bestMatch.confidence,
        source: `${role}_${bestMatch.type}`,
        conversationId,
        extractedAt: now,
      });
    }
  }

  // Deduplicate within this extraction batch
  return results.filter((m, i, arr) =>
    arr.findIndex(a => stringSimilarity(a.content, m.content) > 0.8) === i
  );
}

/**
 * Extract memories from a full conversation (array of messages).
 * Compatible with both call signatures used across the platform:
 *   extractMemoriesFromConversation(messages[])
 *   extractMemoriesFromConversation(conversationId, messages[], agentId)
 */
export function extractMemoriesFromConversation(
  messagesOrConversationId: string | { content: string; role: string }[],
  messagesOrAgentId?: { content: string; role: string }[] | string,
  _agentId?: string
): MemoryExtraction[] {
  let messages: { content: string; role: string }[];
  let conversationId = "";

  if (Array.isArray(messagesOrConversationId)) {
    messages = messagesOrConversationId;
  } else {
    conversationId = messagesOrConversationId;
    messages = (messagesOrAgentId as { content: string; role: string }[]) || [];
  }

  const allExtractions: MemoryExtraction[] = [];
  for (const msg of messages) {
    const role = msg.role === "user" ? "user" : "agent";
    const extractions = extractMemoriesFromMessage(msg.content, role, conversationId);
    allExtractions.push(...extractions);
  }

  // Cross-message deduplication
  return allExtractions.filter((m, i, arr) =>
    arr.findIndex(a => stringSimilarity(a.content, m.content) > 0.8) === i
  );
}

// ─── Persistence (Dedup-Aware Save) ─────────────────────────────────────────

// Categories that are considered critical for conflict detection
// Conflicts in these categories are flagged for user review instead of auto-resolved
const CRITICAL_CATEGORIES = new Set(["client_info", "decision", "company", "market_data"]);

// Keywords that signal critical content regardless of category
const CRITICAL_KEYWORDS = [
  "budget", "cost", "price", "pricing", "revenue", "mrr", "arr", "funding",
  "₹", "$", "€", "£", "lakh", "crore", "million",
  "client", "customer", "contact", "email", "phone",
  "deadline", "launch date", "go-live", "ship date",
  "equity", "shares", "valuation", "investment",
  "layaa ai", "layaa os", "eduflow", "ca ai",
];

function isCriticalContent(content: string, category: string): boolean {
  if (CRITICAL_CATEGORIES.has(category)) return true;
  const lower = content.toLowerCase();
  return CRITICAL_KEYWORDS.some(kw => lower.includes(kw));
}

export interface MemoryConflict {
  existingId: string;
  existingContent: string;
  newContent: string;
  category: string;
  agentId: string;
}

// In-memory store for unresolved conflicts (displayed in SageView)
let pendingConflicts: MemoryConflict[] = [];

export function getPendingConflicts(): MemoryConflict[] {
  return pendingConflicts;
}

export function resolveConflict(existingId: string, keepNew: boolean): void {
  pendingConflicts = pendingConflicts.filter(c => c.existingId !== existingId);
  // If keepNew, the new memory was already saved. If keepOld, we just discard the conflict.
  // The actual DB operations happen at resolution time in the UI.
}

export function clearConflicts(): void {
  pendingConflicts = [];
}

/**
 * Save extracted memories to the agent_memories table with dedup + conflict detection.
 *
 * Dedup: >80% overlap → merge (bump confidence).
 * Conflict: 40-80% overlap on same topic but different content:
 *   - Critical category → flag for user review (don't auto-save)
 *   - Non-critical → auto-keep newer, archive older
 *
 * Returns the count of memories saved (new + merged).
 */
export async function saveExtractedMemories(
  agentId: string,
  memories: MemoryExtraction[]
): Promise<number> {
  const { supabase } = await import("@/integrations/supabase/client");

  // Fetch existing memories for dedup check
  const { data: existing } = await supabase
    .from("agent_memories")
    .select("id, content, confidence, category")
    .eq("agent_id", agentId)
    .eq("is_compressed", false);

  const existingRows = existing ?? [];
  let savedCount = 0;

  const validCategories = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"] as const;

  for (const mem of memories) {
    const category = validCategories.includes(mem.category as any) ? mem.category : TYPE_TO_CATEGORY[mem.type] || "preference";
    const normalizedConfidence = Math.min(1, mem.confidence / 100);

    // Check for exact duplicate (>80% overlap) → merge
    const exactDuplicate = existingRows.find(e => stringSimilarity(e.content, mem.content) > 0.8);
    if (exactDuplicate) {
      const newConfidence = Math.min(1, Number(exactDuplicate.confidence) + 0.05);
      await supabase.from("agent_memories")
        .update({ confidence: newConfidence, last_refreshed_at: new Date().toISOString() })
        .eq("id", exactDuplicate.id);
      savedCount++;
      continue;
    }

    // Check for potential conflict (40-80% overlap, same category) → different content on same topic
    const conflicting = existingRows.find(e => {
      const sim = stringSimilarity(e.content, mem.content);
      return sim > 0.4 && sim <= 0.8 && e.category === category;
    });

    if (conflicting) {
      const critical = isCriticalContent(mem.content, category) || isCriticalContent(conflicting.content, conflicting.category);

      if (critical) {
        // Flag for user review — don't auto-save
        pendingConflicts.push({
          existingId: conflicting.id,
          existingContent: conflicting.content,
          newContent: mem.content,
          category,
          agentId,
        });
        continue; // Skip saving — user must resolve
      } else {
        // Non-critical: auto-keep newer, compress older
        await supabase.from("agent_memories")
          .update({ is_compressed: true })
          .eq("id", conflicting.id);
      }
    }

    // Insert new memory
    await supabase.from("agent_memories").insert({
      agent_id: agentId,
      content: mem.content,
      category: category as any,
      confidence: normalizedConfidence,
      memory_type: "personal",
    });
    savedCount++;
  }

  return savedCount;
}

// ─── Confidence Reinforcement ───────────────────────────────────────────────

/**
 * Reinforce or weaken a memory based on user feedback.
 * Called when user thumbs-up/down a message that relates to a memory.
 */
export async function reinforceMemory(
  memoryId: string,
  direction: "up" | "down"
): Promise<void> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.from("agent_memories").select("confidence").eq("id", memoryId).single();
  if (!data) return;

  const delta = direction === "up" ? 0.05 : -0.10;
  const newConfidence = Math.max(0, Math.min(1, Number(data.confidence) + delta));

  await supabase.from("agent_memories")
    .update({ confidence: newConfidence, last_refreshed_at: new Date().toISOString() })
    .eq("id", memoryId);
}

// ─── Synthesis (Instruction Generation) ─────────────────────────────────────

interface SynthesizedMemory {
  markdown: string;
  totalMemories: number;
  domains: Record<string, number>;
  lastUpdated: string;
  confidenceAvg: number;
}

/**
 * Synthesize all agent memories into a structured instruction block.
 * Groups by domain, ranks by confidence * recency, deduplicates,
 * and formats as imperative markdown instructions.
 *
 * This is the function Sage uses to generate the "bible" for each agent.
 */
export async function synthesizeAgentMemory(agentId: string): Promise<SynthesizedMemory> {
  const { supabase } = await import("@/integrations/supabase/client");

  const { data: memories } = await supabase
    .from("agent_memories")
    .select("*")
    .eq("agent_id", agentId)
    .eq("is_compressed", false)
    .order("confidence", { ascending: false });

  const rows = memories ?? [];
  if (rows.length === 0) {
    return { markdown: "", totalMemories: 0, domains: {}, lastUpdated: new Date().toISOString(), confidenceAvg: 0 };
  }

  // Apply confidence decay: memories >30 days without refresh lose 0.01/day
  const now = Date.now();
  const DECAY_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;
  const DECAY_PER_DAY = 0.01;

  for (const row of rows) {
    const lastTouch = new Date(row.last_refreshed_at || row.created_at).getTime();
    const age = now - lastTouch;
    if (age > DECAY_THRESHOLD_MS) {
      const daysOverThreshold = Math.floor((age - DECAY_THRESHOLD_MS) / (24 * 60 * 60 * 1000));
      const decay = daysOverThreshold * DECAY_PER_DAY;
      const decayed = Math.max(0.05, Number(row.confidence) - decay);
      if (decayed !== Number(row.confidence)) {
        // Write decay back to DB (fire-and-forget)
        supabase.from("agent_memories").update({ confidence: decayed }).eq("id", row.id).then(() => {});
        (row as any).confidence = decayed;
      }
    }
  }

  // Group by domain
  const domainGroups: Record<string, typeof rows> = {};
  for (const row of rows) {
    const domain = CATEGORY_TO_DOMAIN[row.category] || "General";
    if (!domainGroups[domain]) domainGroups[domain] = [];
    domainGroups[domain].push(row);
  }

  // Sort each group by confidence descending, deduplicate
  const domainCounts: Record<string, number> = {};
  const sections: string[] = [];

  // Priority order for domains
  const domainOrder = [
    "Decision History",
    "Processes & Constraints",
    "User Preferences",
    "Client Intelligence",
    "Company & Project Context",
    "Market & Industry Data",
    "Handoff Notes",
    "General",
  ];

  for (const domain of domainOrder) {
    const group = domainGroups[domain];
    if (!group || group.length === 0) continue;

    // Sort by confidence descending
    group.sort((a, b) => Number(b.confidence) - Number(a.confidence));

    // Deduplicate within group
    const seen: string[] = [];
    const unique = group.filter(m => {
      const dominated = seen.some(s => stringSimilarity(s, m.content) > 0.7);
      if (!dominated) { seen.push(m.content); return true; }
      return false;
    });

    domainCounts[domain] = unique.length;

    const lines = unique
      .slice(0, 25) // Cap per domain to prevent bloat
      .map(m => {
        const conf = Math.round(Number(m.confidence) * 100);
        return `- ${m.content}${conf < 70 ? ` _(${conf}% confidence)_` : ""}`;
      });

    sections.push(`## ${domain}\n${lines.join("\n")}`);
  }

  const totalConfidence = rows.reduce((s, r) => s + Number(r.confidence), 0);
  const avgConfidence = rows.length > 0 ? totalConfidence / rows.length : 0;
  const lastUpdated = new Date().toISOString();

  // Enforce 40KB limit
  let markdown = sections.join("\n\n");
  if (new Blob([markdown]).size > 40960) {
    // Truncate from the bottom (lowest priority domains get cut)
    while (new Blob([markdown]).size > 40960 && sections.length > 1) {
      sections.pop();
      markdown = sections.join("\n\n");
    }
  }

  return {
    markdown,
    totalMemories: rows.length,
    domains: domainCounts,
    lastUpdated,
    confidenceAvg: avgConfidence,
  };
}

/**
 * Build the memory injection block for an agent's system prompt.
 * This is what gets prepended to every conversation — the agent's synthesized knowledge.
 *
 * Format: [SAGE MEMORY CONTEXT — LAYAA OS] ... instructions ... [END SAGE MEMORY]
 */
export async function buildMemoryInjection(agentId: string): Promise<string> {
  const { markdown, totalMemories, confidenceAvg } = await synthesizeAgentMemory(agentId);
  if (!markdown || totalMemories === 0) return "";

  return `\n\n[SAGE MEMORY CONTEXT — LAYAA OS]
The following are synthesized facts, decisions, preferences, and constraints extracted from your conversation history on the Layaa AI platform. Treat these as authoritative context. Apply them automatically — do not re-ask about settled decisions or known preferences. If new information contradicts a memory, follow the new information and note the change.

${markdown}

_${totalMemories} memories | Avg confidence: ${Math.round(confidenceAvg * 100)}% | Powered by Sage Memory Intelligence_
[END SAGE MEMORY]`;
}

// ─── Platform Shared Memory (Sage Collective Sync) ──────────────────────────

/**
 * Sage Collective Sync — scans all agents' personal memories, extracts critical/important
 * items, and writes a synthesized summary to core_context as platform shared memory.
 *
 * This runs every 24 hours (triggered by Sage auto-extraction or manually).
 * The result is injected into EVERY agent's context via core_context loading.
 */
export async function syncPlatformSharedMemory(): Promise<{ agentsScanned: number; memoriesCollected: number }> {
  const { supabase } = await import("@/integrations/supabase/client");

  // Get all agents
  const { data: agents } = await supabase.from("agents").select("id, name, canonical_role").eq("is_active", true);
  if (!agents || agents.length === 0) return { agentsScanned: 0, memoriesCollected: 0 };

  const agentSections: string[] = [];
  let totalCollected = 0;

  for (const agent of agents) {
    // Get this agent's high-confidence memories
    const { data: memories } = await supabase
      .from("agent_memories")
      .select("content, category, confidence")
      .eq("agent_id", agent.id)
      .eq("is_compressed", false)
      .gte("confidence", 0.7)
      .order("confidence", { ascending: false })
      .limit(10);

    if (!memories || memories.length === 0) continue;

    // Filter to only important/critical items
    const important = memories.filter((m: any) =>
      CRITICAL_CATEGORIES.has(m.category) ||
      isCriticalContent(m.content, m.category) ||
      Number(m.confidence) >= 0.85
    );

    if (important.length === 0) continue;

    const lines = important.map((m: any) => `- ${m.content}`).join("\n");
    agentSections.push(`### ${agent.name} (${agent.canonical_role})\n${lines}`);
    totalCollected += important.length;
  }

  if (agentSections.length === 0) return { agentsScanned: agents.length, memoriesCollected: 0 };

  // Build the shared memory document
  const sharedMemory = `# Layaa OS — Platform Shared Memory
*Auto-synthesized by Sage Memory Intelligence on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}*

This is the collective knowledge across all agents on the Layaa AI platform. Every agent has access to this shared context.

${agentSections.join("\n\n")}

---
_${totalCollected} important memories from ${agentSections.length} agents | Next sync in 24 hours_`;

  // Write to core_context table
  const { data: existingCtx } = await supabase
    .from("core_context")
    .select("id")
    .eq("context_key", "sage_shared_memory")
    .limit(1)
    .maybeSingle();

  if (existingCtx) {
    await supabase.from("core_context")
      .update({ content: sharedMemory, version: (existingCtx as any).version ? (existingCtx as any).version + 1 : 2 })
      .eq("context_key", "sage_shared_memory");
  } else {
    await supabase.from("core_context").insert({
      context_key: "sage_shared_memory",
      content: sharedMemory,
      version: 1,
    });
  }

  return { agentsScanned: agents.length, memoriesCollected: totalCollected };
}

/**
 * Get the current platform shared memory content.
 */
export async function getPlatformSharedMemory(): Promise<string> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase
    .from("core_context")
    .select("content")
    .eq("context_key", "sage_shared_memory")
    .limit(1)
    .maybeSingle();
  return data?.content ?? "";
}

// ─── Memory Export ──────────────────────────────────────────────────────────

/**
 * Export an agent's memories or the platform shared memory as a downloadable file.
 * Supports: markdown (.md), plain text disguised as .docx (basic), and .pdf (text-based).
 */
export async function exportMemories(params: {
  type: "agent" | "platform";
  agentId?: string;
  agentName?: string;
  format: "md" | "docx" | "pdf";
}): Promise<void> {
  let content: string;
  let filename: string;

  if (params.type === "platform") {
    content = await getPlatformSharedMemory();
    filename = `layaa-os-shared-memory-${Date.now()}`;
    if (!content) { content = "# Layaa OS — Platform Shared Memory\n\nNo shared memory has been synced yet. Run Sage Collective Sync first."; }
  } else if (params.agentId) {
    const result = await synthesizeAgentMemory(params.agentId);
    content = `# Sage Memory — ${params.agentName || "Agent"}\n*Exported from Layaa OS on ${new Date().toLocaleString()}*\n\n${result.markdown || "No memories to export."}\n\n---\n_${result.totalMemories} memories | Avg confidence: ${Math.round(result.confidenceAvg * 100)}%_`;
    filename = `sage-memory-${(params.agentName || "agent").toLowerCase()}-${Date.now()}`;
  } else {
    return;
  }

  let blob: Blob;
  let ext: string;

  switch (params.format) {
    case "md":
      blob = new Blob([content], { type: "text/markdown" });
      ext = "md";
      break;
    case "docx":
      // Simple DOCX export: rich text XML wrapper around markdown content
      const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${content.split("\n").map(line => `<w:p><w:r><w:t>${line.replace(/[<>&]/g, c => c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;")}</w:t></w:r></w:p>`).join("")}</w:body>
</w:document>`;
      blob = new Blob([docxContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      ext = "docx";
      break;
    case "pdf":
      // Simple text-based PDF export
      const pdfLines = content.split("\n");
      const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Courier>>endobj
4 0 obj<</Length ${pdfLines.length * 20 + 100}>>
stream
BT /F1 10 Tf 36 756 Td 12 TL
${pdfLines.slice(0, 60).map(l => `(${l.replace(/[()\\]/g, "\\$&").slice(0, 90)}) Tj T*`).join("\n")}
ET
endstream
endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref
0
%%EOF`;
      blob = new Blob([pdfContent], { type: "application/pdf" });
      ext = "pdf";
      break;
    default:
      return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── DB Cleanup Utility ─────────────────────────────────────────────────────

/**
 * Purge all auto-extracted memories for all agents.
 * Keeps memories that were manually created (last_refreshed_at IS NOT NULL implies user touched it).
 * This is a one-time cleanup function for transitioning to the new system.
 */
export async function purgeAutoExtractedMemories(): Promise<number> {
  const { supabase } = await import("@/integrations/supabase/client");

  // Delete memories that have never been manually refreshed/touched
  // (last_refreshed_at is NULL means it was only ever auto-created)
  const { data, error } = await supabase
    .from("agent_memories")
    .delete()
    .is("last_refreshed_at", null)
    .select("id");

  if (error) {
    console.error("[Sage] Purge failed:", error);
    return 0;
  }
  return data?.length ?? 0;
}

// ─── Context Generation (Backward Compat) ───────────────────────────────────

/**
 * Generate a brief conversation context string.
 * Used for delegation context and conversation summaries.
 */
export function generateConversationContext(
  _conversationId: string,
  messages: { content: string; role: string }[],
  agentName: string
): string {
  const last10 = messages.slice(-10);
  const topics = new Set<string>();
  const decisions: string[] = [];

  for (const msg of last10) {
    const words = msg.content.split(/\s+/).slice(0, 5).join(" ");
    if (words.length > 10) topics.add(words + "...");

    // Extract decisions using the new patterns
    for (const { pattern, type } of ASSERTION_PATTERNS) {
      if (type === "decision" && pattern.test(msg.content)) {
        const firstSentence = msg.content.split(/[.!?\n]/)[0]?.trim();
        if (firstSentence && firstSentence.length > 15) {
          decisions.push(firstSentence);
          break;
        }
      }
    }
  }

  const topicList = [...topics].slice(0, 5).join(", ");
  const decisionList = decisions.length > 0 ? decisions.slice(0, 3).join("; ") : "None yet";

  return `With ${agentName}, discussed: ${topicList}. Key decisions: ${decisionList}. Messages: ${last10.length}.`;
}
