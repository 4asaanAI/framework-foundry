# Arush — KB — Self-Learning Framework

> How Arush improves documentation quality over time through feedback collection, pattern recognition, documentation debt tracking, and continuous refinement. Self-learning is not optional — it is how Arush gets better with every document produced.

---

## 1. Self-Learning Principles

1. **Every document teaches you something.** After every significant documentation task, reflect on what worked and what did not.
2. **Patterns beat incidents.** A single piece of feedback is a data point. Three occurrences of the same feedback is a pattern. Patterns trigger process changes.
3. **Corrections are gold.** When a Founder, client, or source agent corrects your documentation, that is the highest-value learning. Save it immediately.
4. **Measure, do not guess.** Track documentation quality with real signals (review pass rates, client feedback, question frequency), not gut feeling.

---

## 2. Learning Triggers and Actions

| Trigger | Action | Memory Category | Confidence |
|---------|--------|----------------|------------|
| Founder corrects a documentation style choice | Save the preference immediately | `preference` | 1.0 |
| Client feedback says a doc was confusing | Identify the specific issue, rewrite, save the pattern | `process` | 0.9 |
| Technical review rejects a claim as inaccurate | Save what was wrong and the correct information | `process` | 0.9 |
| A document gets positive feedback from the client | Save the structure and approach as a successful pattern | `process` | 0.8 |
| 3+ agents ask for the same type of document | Create a reusable template, save to Template Library | `process` | 0.9 |
| A new product or feature launches | Trigger documentation planning checklist | `company` | 1.0 |
| Client requests a format you have not used before | Research best practices, create, save the format decision | `process` | 0.7 |
| An SOP fails in practice (process did not match doc) | Investigate, update the SOP, save the gap as a learning | `process` | 0.9 |
| Sprint velocity data shows docs are a bottleneck | Analyze where time is spent, optimize workflow | `process` | 0.8 |

---

## 3. Feedback Collection System

### Internal Feedback (From Agents and Founders)

**After every technical review:**
- Did the source agent (Ujjawal, Dev, Rohit) flag accuracy issues?
- How many revision cycles were needed before approval?
- Was the document structure appropriate for the content?

**After every stakeholder review:**
- Did the Founder ask for changes to tone, length, or format?
- Were there questions that the document should have anticipated?

**Save internal feedback using:**
```
write_memory(
  agent_id: "arush",
  memory_type: "episodic",
  category: "process",
  content: "[What happened, what was learned, what changes]",
  confidence: [0.7-1.0]
)
```

### External Feedback (From Clients)

Client feedback flows through Arjun. After every client onboarding or major doc delivery, ask Arjun:
- Did the client complete the setup independently using the docs?
- Which documents were referenced most?
- Were there support requests that documentation should have prevented?
- Did the client's team successfully onboard new users with the provided materials?

---

## 4. Documentation Debt Tracking

Documentation debt is the gap between what should be documented and what actually is. Like technical debt, it compounds if ignored.

### Documentation Debt Categories

| Debt Type | Description | Priority |
|-----------|-------------|----------|
| **Missing docs** | A feature, process, or product has no documentation at all | High |
| **Stale docs** | Documentation exists but is outdated (>3 months without review and content has changed) | High |
| **Incomplete docs** | Documentation exists but is missing sections (no troubleshooting, no edge cases) | Medium |
| **Inconsistent docs** | Two documents describe the same thing differently | Medium |
| **Inaccessible docs** | Documentation exists but is hard to find (poor categorization, no cross-references) | Medium |
| **Audience mismatch** | Documentation exists but is written for the wrong reader (technical doc for a non-technical user) | Low-Medium |
| **Format debt** | Documentation works but does not follow current style guide | Low |

### Debt Register Template

Maintain a running register:

| Doc / Topic | Debt Type | Severity | Estimated Effort | Discovered | Status |
|-------------|-----------|----------|-------------------|------------|--------|
| [Doc name or topic] | [Type] | [High/Med/Low] | [Hours] | [Date] | [Open/In Progress/Resolved] |

### Debt Reduction Strategy

- Allocate 20% of documentation time to debt reduction (not just new docs)
- Prioritize by severity and traffic — a stale doc that 50 people read daily is more urgent than a missing doc nobody has asked for
- Every sprint, pick at least one debt item to resolve
- Track debt count over time — it should trend downward

---

## 5. Pattern Recognition

### Patterns to Watch For

**Recurring questions:** If the same question is asked 3+ times, a doc is either missing, incomplete, or hard to find.
- Action: Create or improve the relevant doc, improve searchability

**Common review feedback:** If technical reviewers consistently flag the same type of error, there is a systemic issue.
- Action: Update the Documentation Review Checklist, add a specific check for the pattern

**Format preferences by audience:** Over time, certain audiences consistently prefer certain formats.
- Action: Save as audience profile preferences in memory

**Seasonal documentation needs:** Some documentation needs are cyclical (tax season for CA, exam season for schools).
- Action: Create a documentation calendar aligned with client cycles

**Collaboration patterns:** Some agents are consistently easy to get information from; others require multiple follow-ups.
- Action: Save communication preferences per agent, adjust timelines accordingly

---

## 6. Quality Metrics to Track

| Metric | How to Measure | Target | Action if Below Target |
|--------|---------------|--------|----------------------|
| First-pass review approval rate | Docs approved without revision / total docs reviewed | >70% | Analyze rejection reasons, update checklist |
| Client self-sufficiency rate | Clients completing onboarding without extra support | >80% | Review onboarding docs, identify gaps |
| Documentation coverage | Features with docs / total features | >90% | Prioritize missing docs in next sprint |
| Stale doc ratio | Docs >3 months without review / total docs | <15% | Schedule batch review sessions |
| Average revision cycles | Total revisions / total docs | <2 | Improve upfront accuracy verification |
| Debt backlog size | Open debt items count | Trending down | Increase debt reduction allocation |

---

## 7. Continuous Improvement Cycle

```
Produce Documentation
    |
Collect Feedback (internal + external)
    |
Identify Patterns (3+ occurrences = actionable)
    |
Update Process (style guide, templates, checklists)
    |
Save Learning (write_memory with category and confidence)
    |
Apply to Next Document
    |
[Repeat]
```

### Monthly Self-Assessment Questions

1. What documentation did I produce this month? Was it on time?
2. What feedback did I receive? Are there patterns?
3. Is the documentation debt register growing or shrinking?
4. Did I learn a new format, approach, or technique worth saving?
5. Are clients more self-sufficient than last month?
6. Which collaboration patterns worked well? Which did not?

---

**Cross-references:**
- For the quality standards being improved: see `Arush — KB — Documentation Style Guide.md`
- For the review process generating feedback: see `Arush — KB — Documentation Review Checklist.md`
- For client-specific learnings: see `Arush — KB — Client Enablement Program.md`
- For KB health metrics: see `Arush — KB — Knowledge Base Organization.md`

*Self-learning is the difference between an agent that produces documentation and an agent that produces excellent documentation. Every interaction is training data. Use it.*
