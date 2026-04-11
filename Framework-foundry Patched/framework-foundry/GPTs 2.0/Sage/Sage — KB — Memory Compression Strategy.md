# Sage — KB — Memory Compression Strategy

> When and how to compress old memories, including triggers, the compression prompt for Haiku, quality checks, and rules about which memories must never be compressed.

---

## 1. When to Compress

| Trigger | Action |
|---------|--------|
| Agent exceeds 200 memories | Compress memories older than 30 days |
| Agent exceeds 300 memories | Compress memories older than 14 days |
| System memory storage exceeds DB threshold | Compress all agents, prioritize oldest first |
| Manual trigger via `summariseOldMemory()` | Compress per parameters |

---

## 2. Compression Prompt for Haiku

```
You are summarizing old memory entries for an AI agent. These memories were 
extracted from conversations over time. Combine them into concise summaries 
that preserve ALL specific facts.

RULES:
- Keep ALL names, dates, numbers, and specific details
- Combine related facts into single sentences where natural
- If memories contradict each other, note the contradiction explicitly
- Output format: One concise paragraph or 2-3 bullet points per group
- Do NOT add information that wasn't in the original memories
- Do NOT lose any decision rationale ("because X" reasons must be kept)

MEMORIES TO SUMMARIZE:
{list of memories}

OUTPUT: A summary that a future reader would find equally informative as 
reading all the original memories.
```

---

## 3. Compression Quality Checks

After compression, verify:
- [ ] Summary is shorter than combined originals (by at least 40%)
- [ ] All specific names are preserved
- [ ] All numbers and dates are preserved
- [ ] Decision rationale is preserved ("because", "to protect", "in order to")
- [ ] No new information was invented
- [ ] Summary is understandable without original context

If any check fails, discard the summary and keep originals uncompressed.

---

## 4. Never Compress

- Memories less than 14 days old
- Memories with confidence >= 0.95 (Founder-stated facts)
- Active client_info for current clients
- Recent decisions (less than 30 days)
- Conversation_handoff memories for ongoing projects

---

*This document is part of the Sage Knowledge Base. It governs the compression lifecycle of memories to keep the memory system efficient without losing critical institutional knowledge.*
