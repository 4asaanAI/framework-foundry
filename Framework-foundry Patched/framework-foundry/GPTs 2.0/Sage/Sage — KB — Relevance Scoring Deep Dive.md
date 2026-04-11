# Sage — KB — Relevance Scoring Deep Dive

> Detailed walkthrough of the memory relevance scoring algorithm, including worked examples with real calculations and guidance on tuning algorithm weights.

---

## 1. Algorithm Walkthrough with Example

**Query:** "What do we know about pricing for CA firms?"

**Memory 1:** "CA AI Agent Solo tier: Rs.25K + Rs.2.5K/mo" (category: company, confidence: 1.0, created: 3 days ago, not compressed)

```
word_score: "pricing" not matched, but "CA" matched -> 1/5 = 0.2
  Wait — let's tokenize properly:
  query_words = ["pricing", "CA", "firms"]
  memory_words = ["CA", "AI", "Agent", "Solo", "tier", "Rs", "25K", "2.5K", "mo"]
  matched = ["CA"]
  word_score = 1/3 = 0.33 (using significant query words, excluding "what", "do", "we", "know", "about", "for")
  
IDF_weight: "CA" appears in ~5% of memories -> IDF ~ 3.0
  IDF_weight = 3.0

recency_score = 1 / (1 + 3) = 0.25

category_bonus = 0.0 (query is about pricing -> matches "decision" better than "company")

confidence_factor = 1.0

FINAL = (0.33 * 3.0) + (0.25 * 0.3) + (0.0 * 0.2) + (1.0 * 0.1)
      = 0.99 + 0.075 + 0.0 + 0.1
      = 1.165
```

**Memory 2:** "SMS module priced as add-on for EduFlow to protect margins" (category: decision, confidence: 0.95, created: 1 day ago, not compressed)

```
word_score: matched = [] (no "pricing" or "CA" or "firms")
  word_score = 0.0
  
FINAL = (0.0) + (0.5 * 0.3) + (0.2 * 0.2) + (0.95 * 0.1)
      = 0.0 + 0.15 + 0.04 + 0.095
      = 0.285
```

**Memory 3:** "Chose monthly retainer over project-based for CA AI Agent for predictable revenue" (category: decision, confidence: 0.9, created: 7 days ago, compressed)

```
word_score: matched = ["CA"]
  word_score = 1/3 = 0.33
  
IDF_weight: 3.0 (same as above)

recency_score = 1 / (1 + 7) = 0.125

category_bonus = 0.2 (decision matches pricing query)

confidence_factor = 0.9

FINAL = (0.33 * 3.0) + (0.125 * 0.3) + (0.2 * 0.2) + (0.9 * 0.1)
      = 0.99 + 0.0375 + 0.04 + 0.09
      = 1.1575
      
Compression penalty: * 0.5 = 0.579
```

**Ranking:** Memory 1 (1.165) > Memory 3 (0.579) > Memory 2 (0.285)

This correctly surfaces the CA pricing memory first, the CA decision memory second (penalized by compression), and the EduFlow pricing memory last (not relevant to the query).

---

## 2. Tuning the Algorithm

The current weights are starting values. After observing retrieval quality over time:

| Parameter | Current Weight | Increase If... | Decrease If... |
|-----------|---------------|----------------|----------------|
| IDF multiplier | 1.0 (via word_score * IDF) | Common words are drowning out specific results | Rare terms are over-indexed |
| Recency weight | 0.3 | Old irrelevant memories keep surfacing | Recent memories are over-prioritized vs. important old ones |
| Category bonus | 0.2 | Cross-category memories are too noisy | Category matching is too restrictive |
| Confidence weight | 0.1 | Low-confidence junk is surfacing | High-confidence but old memories are missed |
| Compression penalty | 0.5 | Compressed memories are displacing fresher ones | Compressed memories with critical info are being buried |

---

*This document is part of the Sage Knowledge Base. It provides the mathematical detail behind memory retrieval ranking, enabling fine-tuning of the relevance scoring algorithm as the memory system matures.*
