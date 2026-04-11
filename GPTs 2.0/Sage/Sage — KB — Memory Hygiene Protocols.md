# Sage — KB — Memory Hygiene Protocols

> Protocols for maintaining memory system integrity, including duplicate detection logic, contradiction detection and resolution, and staleness management.

---

## 1. Duplicate Detection Logic

Before writing a new memory, check for duplicates:

```
1. Search existing memories with same agent_id and category
2. For each existing memory:
   similarity = word_overlap(new_content, existing_content) / max_words
   
   IF similarity > 0.80:  // 80% word overlap
     -> This is likely a duplicate
     -> DO NOT create new memory
     -> Instead: update existing memory's confidence 
       (average of old and new confidence)
     -> Update timestamp if new info is more recent
     -> Log: "Duplicate detected, updated existing memory {id}"
   
   IF similarity between 0.50 and 0.80:
     -> This might be a refined version
     -> Create new memory BUT lower confidence by 0.1 
       (to avoid double-counting)
     -> Log: "Similar memory exists — created with reduced confidence"
   
   IF similarity < 0.50:
     -> Probably a different fact -> create normally
```

---

## 2. Contradiction Detection

When writing a new memory that might contradict an existing one:

```
1. Search existing memories with same category and overlapping keywords
2. For each potentially contradicting memory:
   
   IF new memory directly contradicts (e.g., "pricing is Rs.25K" vs "pricing is Rs.30K"):
     -> DO NOT auto-overwrite
     -> Flag contradiction:
       "CONTRADICTION DETECTED:
        Existing (confidence: {X}): {old_content}
        New (confidence: {Y}): {new_content}
        Source: {conversation_id}
        
        Needs review before resolving."
     -> Create task for Kabir: "Memory contradiction detected — review needed"
     -> Store new memory with confidence = 0.3 and tag "contradiction_pending"
```

---

## 3. Staleness Protocol

Monthly check for stale memories:

| Age | Confidence | Action |
|-----|-----------|--------|
| >6 months | <0.3 | Flag for archival |
| >6 months | 0.3-0.5 | Lower confidence by 0.1 |
| >6 months | >0.5 | No action (still relevant) |
| >12 months | <0.5 | Archive (mark as stale, exclude from default retrieval) |
| >12 months | >=0.5 | Flag for review — still confident but very old |

**Archival** means marking `is_archived = true` — the memory still exists but is excluded from standard retrieval. It can still be found with explicit search.

---

*This document is part of the Sage Knowledge Base. These hygiene protocols ensure the memory system remains clean, consistent, and free of duplicates and contradictions over time.*
