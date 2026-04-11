# Sage — KB — Memory System Architecture & Emergency Procedures

> Technical reference for the memory system data model, query patterns, volume estimates, and emergency procedures for system failures, corruption, and context overload.

---

## 1. Data Model

```
agent_memory {
  id:                     string (auto-generated)
  agent_id:               string (FK -> profiles.id)
  memory_type:            "personal" | "shared"
  category:               "client_info" | "decision" | "market_data" | "process" | "preference" | "company" | "conversation_handoff"
  content:                string (the memory text)
  confidence:             float (0.1 - 1.0)
  source_conversation_id: string (FK -> conversations.id, optional)
  source_agent_id:        string (FK -> profiles.id, optional — for shared memories)
  is_compressed:          boolean (default: false)
  compressed_from:        string[] (IDs of original memories, if this is a summary)
  is_archived:            boolean (default: false)
  created:                datetime
  updated:                datetime
}
```

---

## 2. Query Patterns

**Get agent's personal memories:**
```
read_data("agent_memory", 
  filter: "agent_id = '{id}' AND memory_type = 'personal' AND is_archived = false",
  sort: "-created",
  limit: 50)
```

**Get shared memories:**
```
read_data("agent_memory",
  filter: "memory_type = 'shared' AND is_archived = false",
  sort: "-created",
  limit: 50)
```

**Get memories for relevance scoring:**
```
search_data("{topic}", collections: ["agent_memory"])
-> Returns ranked results using the relevance scoring algorithm
```

**Get compression candidates:**
```
read_data("agent_memory",
  filter: "agent_id = '{id}' AND is_compressed = false AND created < '{30_days_ago}'",
  sort: "created",
  limit: 100)
```

---

## 3. Memory Volume Estimates

| Metric | Estimate (Monthly) | Notes |
|--------|-------------------|-------|
| New memories created | 1,500-4,000 | Depends on conversation volume |
| Memories per extraction | 3-8 | From a single conversation segment |
| Compression ratio | 3:1 to 5:1 | 5 memories -> 1 summary |
| Active memories per agent | 50-200 | Before compression |
| Shared memories total | 200-500 | Growing over time |

---

## 4. Emergency Procedures

### 4.1 Memory System Down

If Sage cannot write or read memories:
1. Alert Kaiser immediately (system health issue)
2. Agents can still function — they just lose memory context
3. Once resolved, re-process any conversations that occurred during downtime
4. Verify no data was lost by comparing conversation logs to memory entries

### 4.2 Mass Memory Corruption

If memories are found to be corrupted (wrong content, wrong confidence, wrong agent_id):
1. Stop all memory writes immediately
2. Alert Founders
3. Identify the corruption scope (how many memories affected, time range)
4. Restore from last known good backup (coordinate with Kaiser)
5. Re-extract from conversations since backup point
6. Audit trail review to identify root cause

### 4.3 Context Overload

If an agent's context exceeds model limits:
1. Reduce memory count: lower the retrieval limit temporarily
2. Prioritize higher-confidence, more recent memories
3. Skip compressed memories entirely for this conversation
4. Alert Dev about context management optimization

---

*This document is part of the Sage Knowledge Base. It provides the technical architecture reference and emergency runbook for Layaa AI's institutional memory system. Guard this system like the strategic asset it is.*
