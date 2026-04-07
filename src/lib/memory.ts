/**
 * Sage Memory Extraction Engine — Task 3
 * Keyword-based memory extraction from conversations
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

const DECISION_KEYWORDS = ["decided", "will do", "we commit", "going forward", "should", "must", "we'll", "let's go with", "final decision", "approved"];
const INSIGHT_KEYWORDS = ["insight", "found that", "problem is", "customers want", "realized", "discovered", "turns out", "key takeaway", "important finding"];
const CONTEXT_KEYWORDS = ["background", "previously", "last time", "history", "context", "for reference", "as discussed", "earlier"];
const PATTERN_KEYWORDS = ["always", "never", "every time", "tends to", "usually", "consistently", "pattern", "recurring"];
const PREFERENCE_KEYWORDS = ["prefer", "like", "want", "need", "don't like", "avoid", "favorite", "priority"];

function findKeywordMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter(kw => lower.includes(kw));
}

function extractSentencesWithKeyword(text: string, keyword: string): string[] {
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
  return sentences.filter(s => s.toLowerCase().includes(keyword)).map(s => s.trim());
}

export function extractMemoriesFromMessage(
  messageContent: string,
  role: "user" | "agent",
  conversationId: string = ""
): MemoryExtraction[] {
  const results: MemoryExtraction[] = [];
  const now = new Date().toISOString();

  // Decision patterns (90-100 confidence)
  const decisionMatches = findKeywordMatches(messageContent, DECISION_KEYWORDS);
  for (const kw of decisionMatches) {
    const sentences = extractSentencesWithKeyword(messageContent, kw);
    for (const s of sentences) {
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
      results.push({
        content: s, type: "preference", category: "preference",
        confidence: 65 + Math.min(sentences.length * 3, 15),
        source: "pattern_keyword", conversationId, extractedAt: now,
      });
    }
  }

  // Filter out low confidence and deduplicate
  return results
    .filter(m => m.confidence > 40)
    .filter((m, i, arr) => arr.findIndex(a => a.content === m.content) === i);
}

export function extractMemoriesFromConversation(
  conversationId: string,
  messages: { content: string; role: string }[],
  _agentId: string
): MemoryExtraction[] {
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
