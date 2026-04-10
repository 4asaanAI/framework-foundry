/**
 * Sage Memory Extraction Engine — Task 3
 * Quality-focused memory extraction from conversations.
 * Only saves complete, self-contained facts — never sentence fragments.
 */

export interface MemoryExtraction {
  content: string;
  type: "decision" | "insight" | "context" | "pattern" | "preference";
  category: string;
  confidence: number; // 0-100
  source: "decision_keyword" | "insight_keyword" | "context_keyword" | "pattern_keyword";
  conversationId: string;
  extractedAt: string;
}

const DECISION_KEYWORDS = ["decided", "will do", "we commit", "going forward", "let's go with", "final decision", "approved"];
const INSIGHT_KEYWORDS = ["found that", "problem is", "customers want", "realized", "discovered", "turns out", "key takeaway", "important finding"];
const CONTEXT_KEYWORDS = ["previously", "last time", "for reference", "as discussed"];
const PATTERN_KEYWORDS = ["always", "never", "every time", "tends to", "consistently", "recurring"];
const PREFERENCE_KEYWORDS = ["prefer", "don't like", "avoid", "priority is"];

function findKeywordMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw));
}

function extractSentencesWithKeyword(text: string, keyword: string): string[] {
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
  return sentences.filter(s => s.toLowerCase().includes(keyword)).map(s => s.trim());
}

/**
 * Quality filter: reject sentence fragments, questions, and filler.
 * A memory must be a self-contained, meaningful statement.
 */
function isQualityMemory(text: string): boolean {
  const trimmed = text.trim();

  // Too short to be meaningful
  if (trimmed.length < 25) return false;
  // Too long — probably a whole paragraph, not a single fact
  if (trimmed.length > 500) return false;
  // Starts with a bullet/dash but is just a fragment (no verb)
  const stripped = trimmed.replace(/^[-•*]\s*/, "");
  if (stripped.length < 20) return false;

  // Reject questions — agents asking "Would you like me to..." is not a memory
  if (/^(would|could|should|shall|can|do|does|did|is|are|was|were|how|what|where|when|why|which|tell me|let me know)/i.test(stripped)) return false;
  // Reject prompts/instructions from agent ("Tell me your...", "Please provide...")
  if (/^(tell me|please provide|please share|let me know|feel free|i'd be happy|i can help)/i.test(stripped)) return false;
  // Reject filler phrases
  if (/^(here's|here is|sure|of course|absolutely|certainly|great|okay|alright|no problem|happy to)/i.test(stripped)) return false;
  // Reject incomplete lines starting with "- " that have no subject+verb
  if (/^-\s/.test(trimmed) && !/\b(is|are|was|were|has|have|had|will|would|can|could|should|decided|prefer|want|need|use|chose|agreed|confirmed)\b/i.test(stripped)) return false;
  // Reject if it's just a heading or label
  if (/^(##|###|\*\*[^*]+\*\*:?\s*$)/.test(trimmed)) return false;
  // Must contain at least one verb-like word to be a statement
  if (!/\b(is|are|was|were|has|have|had|will|would|can|could|should|decided|prefer|want|need|use|chose|agreed|confirmed|created|built|launched|set|changed|moved|started|stopped|approved|rejected|scheduled|completed|learned|discovered|found|realized)\b/i.test(stripped)) return false;

  return true;
}

export function extractMemoriesFromMessage(
  messageContent: string,
  role: "user" | "agent",
  conversationId: string = ""
): MemoryExtraction[] {
  // Only extract from user messages — agent responses are mostly generated advice,
  // not facts worth remembering. The server-side LLM extraction handles agent responses.
  if (role === "agent") return [];

  const results: MemoryExtraction[] = [];
  const now = new Date().toISOString();

  // Decision patterns (90-100 confidence)
  const decisionMatches = findKeywordMatches(messageContent, DECISION_KEYWORDS);
  for (const kw of decisionMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
      if (!isQualityMemory(s)) continue;
      results.push({
        content: s, type: "decision", category: "decision",
        confidence: 90 + Math.min(sentences.length * 2, 10),
        source: "decision_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Insight patterns (70-85 confidence)
  const insightMatches = findKeywordMatches(messageContent, INSIGHT_KEYWORDS);
  for (const kw of insightMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
      if (!isQualityMemory(s)) continue;
      results.push({
        content: s, type: "insight", category: "market_data",
        confidence: 70 + Math.min(sentences.length * 3, 15),
        source: "insight_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Context patterns (50-70 confidence)
  const contextMatches = findKeywordMatches(messageContent, CONTEXT_KEYWORDS);
  for (const kw of contextMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
      if (!isQualityMemory(s)) continue;
      results.push({
        content: s, type: "context", category: "company",
        confidence: 50 + Math.min(sentences.length * 5, 20),
        source: "context_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Pattern patterns (60-80 confidence)
  const patternMatches = findKeywordMatches(messageContent, PATTERN_KEYWORDS);
  for (const kw of patternMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
      if (!isQualityMemory(s)) continue;
      results.push({
        content: s, type: "pattern", category: "process",
        confidence: 60 + Math.min(sentences.length * 4, 20),
        source: "pattern_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Preference patterns
  const prefMatches = findKeywordMatches(messageContent, PREFERENCE_KEYWORDS);
  for (const kw of prefMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
      if (!isQualityMemory(s)) continue;
      results.push({
        content: s, type: "preference", category: "preference",
        confidence: 65 + Math.min(sentences.length * 3, 15),
        source: "pattern_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Deduplicate
  return results
    .filter((m, i, arr) => arr.findIndex(a => a.content === m.content) === i);
}

export type ExtractedMemory = MemoryExtraction;

export async function saveExtractedMemories(
  agentId: string,
  memories: MemoryExtraction[]
): Promise<void> {
  const { supabase } = await import("@/integrations/supabase/client");
  for (const mem of memories) {
    const validCategories = ["client_info", "decision", "market_data", "process", "preference", "company", "conversation_handoff"] as const;
    const category = validCategories.includes(mem.category as any) ? mem.category : "preference";
    await supabase.from("agent_memories").insert({
      agent_id: agentId,
      content: mem.content,
      category: category as any,
      confidence: Math.min(1, mem.confidence / 100),
      memory_type: "personal",
    });
  }
}

export function extractMemoriesFromConversation(
  messagesOrConversationId: string | { content: string; role: string }[],
  messagesOrAgentId?: { content: string; role: string }[] | string,
  _agentId?: string
): MemoryExtraction[] {
  // Support both signatures:
  // extractMemoriesFromConversation(messages[]) — SageView calls this way
  // extractMemoriesFromConversation(conversationId, messages[], agentId)
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
  // Deduplicate by content similarity
  return allExtractions.filter((m, i, arr) => arr.findIndex(a => a.content === m.content) === i);
}

export function generateConversationContext(
  _conversationId: string,
  messages: { content: string; role: string }[],
  agentName: string
): string {
  const last10 = messages.slice(-10);
  const topics = new Set<string>();
  const decisions: string[] = [];

  for (const msg of last10) {
    // Extract topic keywords (simple: first 5 words of each message)
    const words = msg.content.split(/\s+/).slice(0, 5).join(" ");
    if (words.length > 10) topics.add(words + "...");

    // Extract decisions
    const decisionMatches = findKeywordMatches(msg.content, DECISION_KEYWORDS);
    if (decisionMatches.length > 0) {
      const firstSentence = msg.content.split(/[.!?\n]/)[0]?.trim();
      if (firstSentence) decisions.push(firstSentence);
    }
  }

  const topicList = [...topics].slice(0, 5).join(", ");
  const decisionList = decisions.length > 0 ? decisions.join("; ") : "None yet";

  return `With ${agentName}, discussed: ${topicList}. Decisions: ${decisionList}. Messages: ${last10.length}.`;
}
