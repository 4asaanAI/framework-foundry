// src/lib/memory.ts — Sage Memory Extraction Logic
// Phase 0: keyword-based extraction (no LLM calls)

import { supabase } from "@/integrations/supabase/client";
import type { MemoryCategory, MemoryType } from "@/types/layaa";

export interface ExtractedMemory {
  content: string;
  category: MemoryCategory;
  confidence: number;
  memoryType: MemoryType;
}

interface MessageRow {
  id: string;
  role: string;
  content: string;
  [key: string]: unknown;
}

const CATEGORY_KEYWORDS: Record<MemoryCategory, { keywords: string[]; baseConfidence: [number, number] }> = {
  decision: {
    keywords: ["decided", "agreed", "confirmed", "approved", "will go with", "final call", "we chose", "settled on"],
    baseConfidence: [90, 100],
  },
  client_info: {
    keywords: ["client wants", "customer said", "user needs", "feedback from", "client mentioned", "customer expects", "user reported"],
    baseConfidence: [80, 90],
  },
  market_data: {
    keywords: ["market", "competitor", "trend", "growth rate", "industry", "benchmark", "market share", "valuation"],
    baseConfidence: [70, 85],
  },
  process: {
    keywords: ["workflow", "process", "SOP", "always do", "never do", "rule is", "standard procedure", "best practice"],
    baseConfidence: [75, 85],
  },
  preference: {
    keywords: ["I prefer", "we like", "don't use", "always use", "style is", "we avoid", "our go-to", "favorite"],
    baseConfidence: [75, 85],
  },
  company: {
    keywords: ["company policy", "our mission", "team structure", "budget is", "org chart", "company values", "headcount"],
    baseConfidence: [80, 90],
  },
  conversation_handoff: {
    keywords: ["hand off to", "transfer to", "escalate to", "loop in", "bring in", "delegate to"],
    baseConfidence: [85, 95],
  },
};

function computeConfidence(range: [number, number], sentenceLength: number): number {
  const bonus = Math.min(sentenceLength / 200, 1) * (range[1] - range[0]);
  return Math.round(range[0] + bonus);
}

function extractSentence(content: string, keywordIndex: number): string {
  let start = keywordIndex;
  while (start > 0 && !['.', '!', '?', '\n'].includes(content[start - 1])) start--;
  let end = keywordIndex;
  while (end < content.length && !['.', '!', '?', '\n'].includes(content[end])) end++;
  if (end < content.length) end++;
  return content.slice(start, end).trim();
}

export function extractMemoriesFromMessage(content: string): ExtractedMemory[] {
  const memories: ExtractedMemory[] = [];
  const lowerContent = content.toLowerCase();

  for (const [category, { keywords, baseConfidence }] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      const idx = lowerContent.indexOf(keyword.toLowerCase());
      if (idx === -1) continue;

      const sentence = extractSentence(content, idx);
      if (sentence.length < 10) continue;
      if (memories.some((m) => m.content === sentence)) continue;

      memories.push({
        content: sentence,
        category: category as MemoryCategory,
        confidence: computeConfidence(baseConfidence, sentence.length),
        memoryType: category === "preference" || category === "client_info" ? "personal" : "shared",
      });
    }
  }

  return memories;
}

export function extractMemoriesFromConversation(messages: MessageRow[]): ExtractedMemory[] {
  const all: ExtractedMemory[] = [];

  for (const msg of messages) {
    const extracted = extractMemoriesFromMessage(msg.content);
    for (const mem of extracted) {
      const isDuplicate = all.some(
        (existing) =>
          existing.content.includes(mem.content) ||
          mem.content.includes(existing.content)
      );
      if (!isDuplicate) {
        all.push(mem);
      }
    }
  }

  return all;
}

export async function saveExtractedMemories(
  agentId: string,
  memories: ExtractedMemory[]
): Promise<number> {
  if (memories.length === 0) return 0;

  const rows = memories.map((m) => ({
    agent_id: agentId,
    memory_type: m.memoryType,
    category: m.category,
    content: m.content,
    confidence: m.confidence,
    is_compressed: false,
  }));

  const { error } = await supabase.from("agent_memories").insert(rows);
  if (error) {
    console.error("[Sage] Failed to save memories:", error);
    throw error;
  }
  return rows.length;
}
