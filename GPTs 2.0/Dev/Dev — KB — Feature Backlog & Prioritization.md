# Dev — KB — Feature Backlog & Prioritization

> Current feature backlog ranked by priority, the scoring methodology used for evaluation, and templates for processing new feature requests. Dev maintains this as the definitive backlog — every feature request flows through this system.

---

## 1. Current Backlog (Ranked by Priority)

### P0 — Critical (Must Do Before/During Pilot)

| Feature | Effort | Impact | Risk | Dependencies | Status |
|---------|--------|--------|------|-------------|--------|
| RLS Security Tightening | 4-6 hrs | Critical — security vulnerability, blocks multi-user | High if delayed | None | Pre-SSA launch |
| DELEGATION_MAP Expansion (6 → 22 agents) | 30 min | High — delegation broken for 16 agents | Low | None | Queued |
| Sage Sidebar Addition | 2 min | Medium — memory agent not accessible from nav | Low | None | Queued |

### P1 — High (Weeks 2-4)

| Feature | Effort | Impact | Risk | Dependencies | Status |
|---------|--------|--------|------|-------------|--------|
| Conversation Agent Picker | 3-4 hrs | High — UX improvement for switching between agents | Low | None | Week 2 |
| CRM Board Kanban View | 4-6 hrs | High — visual pipeline management for deals | Medium | CRM data model | Week 2-3 |
| Projects Details View | 6-8 hrs | High — project context display and task aggregation | Medium | Projects table | Week 3 |
| Plugins Disconnect Option | 1-2 hrs | Medium — user control over integrations | Low | Plugins system | Week 2 |

### P2 — Medium (Phase 1)

| Feature | Effort | Impact | Risk | Dependencies | Status |
|---------|--------|--------|------|-------------|--------|
| KB Integration (RAG/Semantic Search) | 8-12 hrs | High — agents search docs intelligently | Medium | n8n, embeddings | Phase 1 |
| n8n Full Activation (7 workflows) | 6-10 hrs | High — background automation for all agents | Medium | n8n deployment | Phase 1 |
| Streaming Responses (SSE/WebSocket) | 4-6 hrs | Medium — better UX, real-time feel | Low | SSE or WebSocket | Phase 1 |
| Local Folder Sync | 4-6 hrs | Medium — file system access for doc management | Medium | Browser File API | Phase 1 |

### P3 — Low (Phase 2+)

| Feature | Effort | Impact | Risk | Dependencies | Status |
|---------|--------|--------|------|-------------|--------|
| Multi-Agent Split View | 8-12 hrs | Medium — side-by-side agent conversations | Low | Layout rework | Phase 2 |
| Activity Feed | 4-6 hrs | Medium — real-time awareness of system events | Low | WebSocket | Phase 2 |
| Voice Notes | 6-8 hrs | Low-Medium — audio input for agents | Medium | Speech API | Phase 2+ |
| Browser Extension | 8-12 hrs | Low — capture context from browser | High | Extension API | Phase 3+ |
| Knowledge Graph View | 12-16 hrs | Low — memory/relationship visualization | High | Graph library | Phase 3+ |

---

## 2. Prioritization Scoring Methodology

**Score = (Impact x 0.35) + (Strategic Alignment x 0.25) + (Effort Inverse x 0.20) + (Risk Reduction x 0.10) + (Dependency Score x 0.10)**

| Factor | Scale (1-5) | Description |
|--------|-------------|-------------|
| Impact | 1-5 | How many users affected, how significant the improvement |
| Strategic Alignment | 1-5 | Does this directly advance the current phase goals? |
| Effort Inverse | 1-5 | 5 = quick win (<2 hrs), 3 = medium (4-8 hrs), 1 = large (>12 hrs) |
| Risk Reduction | 1-5 | Does this reduce a security, stability, or business risk? |
| Dependency Score | 1-5 | 5 = unblocks many others, 1 = standalone feature |

**Priority Thresholds:**
- Score >= 3.5 → P0 or P1 (do now or next sprint)
- Score 2.5-3.5 → P2 (current phase, but not urgent)
- Score < 2.5 → P3 (backlog, revisit next phase)

### Scoring Example: RLS Security Tightening

| Factor | Score | Rationale |
|--------|-------|-----------|
| Impact | 5 | Affects all users — security fundamental |
| Strategic Alignment | 5 | Required for Phase 1 and all future phases |
| Effort Inverse | 3 | 4-6 hours — moderate effort |
| Risk Reduction | 5 | Eliminates critical security vulnerability |
| Dependency Score | 5 | Blocks multi-user, CRM, all external features |
| **Weighted Total** | **4.6** | **P0 — Critical** |

---

## 3. Feature Request Evaluation Template

When a new feature request arrives from any source (Founder, client feedback, agent, system insight):

```markdown
## Feature Request: [Name]

**Requested by:** [Who — Founder, client, agent, internal observation]
**Date:** [When requested]
**Source Context:** [Why they want this — quote or paraphrase]

### Problem Statement
[What problem does this solve? Who is affected? What is the cost of not solving it?]

### Proposed Solution
[High-level description of how this would work]

### Priority Scoring

| Factor | Score (1-5) | Rationale |
|--------|-------------|-----------|
| Impact | | |
| Strategic Alignment | | |
| Effort Inverse | | |
| Risk Reduction | | |
| Dependency Score | | |
| **Weighted Total** | | |

### Dependencies
[What must exist before this can be built? What does this unblock?]

### Effort Estimate
[Rough hours — Architecture: X, Core logic: Y, UI: Z, Testing: W]

### Decision
[Approved — Sprint N / Deferred — Rationale / Rejected — Rationale]
```

---

## 4. Backlog Maintenance Rules

- **Weekly review:** Re-score the top 10 items every Monday based on new information
- **Phase boundary review:** Full backlog re-prioritization at every phase transition
- **New request processing:** Every incoming request scored within 24 hours — never left in an unsorted inbox
- **Aging rule:** Any P3 item untouched for 2 phases gets reviewed — keep or archive
- **Completed items:** Move to a separate "Done" log with delivery date and outcome
- **Scope changes:** If an in-flight feature's scope grows >30%, re-score and re-approve

---

## 5. Backlog Health Metrics

| Metric | Target | Red Flag |
|--------|--------|----------|
| P0 items open | 0-2 | >3 P0 items simultaneously |
| P1 items older than 2 sprints | 0 | Any P1 aging beyond 2 sprints |
| Total backlog size | <30 items | >50 items (backlog bloat) |
| Unsorted requests | 0 | Any request unscored >48 hours |
| Done items per sprint | 3-5 | <2 (velocity concern) |

---

**Cross-references:**
- For the roadmap these features map to: see `Dev — KB — Layaa OS Product Roadmap.md`
- For sprint planning using this backlog: see `Dev — KB — Sprint Planning Framework.md`
- For writing specs for approved features: see `Dev — KB — Product Spec Template.md`
- For triaging bugs against feature work: see `Dev — KB — Bug Triage & Release Planning.md`

*The backlog is the contract between "everything we want" and "what we will actually build." Discipline here prevents scope creep and ensures the most impactful work always gets done first.*
