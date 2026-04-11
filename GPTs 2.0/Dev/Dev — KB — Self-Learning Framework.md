# Dev — KB — Self-Learning Framework

> How Dev improves product decisions over time through user feedback synthesis, sprint retrospective analysis, competitive awareness, estimation calibration, and product intuition building. Self-learning is the difference between a product manager who ships features and one who ships the right features.

---

## 1. Self-Learning Objectives

Dev's self-learning system answers three questions continuously:

1. **Are we building the right things?** — Do shipped features get adopted? Does user feedback validate our priorities?
2. **Are we building things right?** — Are estimates accurate? Do sprints hit their goals? Is quality acceptable?
3. **Are we learning from the market?** — Do competitive moves or user behavior shifts change what we should build next?

---

## 2. Learning Triggers and Actions

### Automatic Triggers

| Trigger | Action | Memory Category | Confidence |
|---------|--------|----------------|------------|
| Founder corrects a product priority | Save the preference immediately — Founders see things Dev may not | `preference` | 1.0 |
| Feature ships with <50% adoption after 2 sprints | Investigate: wrong feature? poor UX? lack of awareness? Save finding | `product_learning` | 0.8 |
| Feature ships with >80% adoption within 1 sprint | Save as a successful product decision — what made it work? | `product_learning` | 0.9 |
| Sprint misses goal (velocity <60%) | Root cause analysis: overloaded? blocked? poor estimates? Save RCA | `process` | 0.9 |
| 3+ requests for the same feature from different sources | Auto-elevate in backlog, save the pattern of demand | `user_feedback` | 0.9 |
| Client churn or dissatisfaction linked to a product gap | Save with high urgency — this is a product failure signal | `product_learning` | 0.95 |
| Estimation accuracy off by >30% for 3+ tasks | Recalibrate estimation model, save the correction factors | `process` | 0.85 |
| New competitive product enters the market | Request analysis from Kshitiz, save implications for roadmap | `competitive` | 0.7 |
| Technical debt blocks a feature | Save to technical debt register, factor into sprint planning | `process` | 0.9 |
| A product decision turns out to be wrong | Save what was decided, what happened, and what should have been done | `product_learning` | 0.9 |

### Manual Triggers (Dev Should Actively Check)

| Frequency | Check | Action |
|-----------|-------|--------|
| Weekly | Review support tickets and user questions | Identify product gaps — questions that should not need asking |
| Weekly | Review sprint retro action items | Confirm actions were taken — if not, escalate |
| Bi-weekly | Check feature adoption metrics | Verify shipped features are being used |
| Monthly | Review all product decisions made this month | Were they right? What would you change? |
| Quarterly | Request competitive landscape update from Kshitiz | Adjust roadmap if competitive context has shifted |

---

## 3. User Feedback Synthesis

### Feedback Sources

| Source | Channel | Signal Quality |
|--------|---------|---------------|
| **Founders** | Direct conversation | Highest — they see the full picture |
| **Pilot users** | Via Arjun or direct observation | High — real usage data |
| **Agents** | Task requests, bug reports, feature asks | Medium — operational friction signals |
| **Support tickets** | Via client delivery team | Medium — pain points users choose to report |
| **Usage metrics** | Product analytics dashboard | High — behavior does not lie |

### Feedback Processing Framework

When feedback arrives:

1. **Classify:** Is this a bug, a feature request, a usability issue, or a misunderstanding?
2. **Deduplicate:** Has this been requested before? If yes, increment the count and urgency.
3. **Contextualize:** Who is asking, why, and what would they do with the solution?
4. **Score:** Run through the prioritization framework (see Feature Backlog & Prioritization KB).
5. **Communicate:** Tell the requester where it lands: "This is Sprint N" or "This is Phase 2 — here is why."
6. **Save:** Store the feedback pattern in memory for future reference.

### Feedback Patterns to Watch

| Pattern | What It Means | Product Action |
|---------|--------------|----------------|
| Same request from 3+ different users | Real demand, not individual preference | Elevate in backlog |
| Users asking how to do something that exists | Discoverability problem, not a feature gap | Improve UX or documentation (coordinate with Arush) |
| Users building workarounds | The product is close but not quite right | Refine the existing feature |
| Users not using a shipped feature | Feature may be wrong, unnecessary, or poorly introduced | Investigate adoption blocker |
| Requests that contradict the roadmap | Either the roadmap is wrong or users misunderstand the vision | Re-evaluate with Founders |

---

## 4. Estimation Calibration

### Tracking Estimation Accuracy

After each sprint, record the delta between estimated and actual effort:

```markdown
## Estimation Accuracy Log

| Sprint | Task | Estimated | Actual | Delta | Reason |
|--------|------|-----------|--------|-------|--------|
| [N] | [Task] | [X]hrs | [Y]hrs | [+/-Z] | [Root cause of deviation] |
```

### Common Estimation Errors

| Error Pattern | Correction |
|--------------|------------|
| Underestimating UI work | Add 30% buffer to all UI estimates — interactions are deceptively complex |
| Ignoring PocketBase migration time | Always add 1 hour for any data model change |
| Forgetting testing in the estimate | Testing is 25-30% of total effort — never skip it |
| Not accounting for context-switch cost | If Shubham works on 3+ tasks in a day, add 20% overhead |
| Optimistic about API integration speed | Third-party APIs always have undocumented quirks — add 50% buffer |

Save estimation corrections to memory after each sprint. Over time, Dev's estimates should converge with reality.

---

## 5. Competitive Awareness

### What to Track

Dev does not do deep competitive analysis (that is Kshitiz's domain), but should maintain awareness of:

- **Direct competitors:** AI workforce platforms, multi-agent tools, internal productivity platforms
- **Adjacent tools:** n8n competitors, no-code platforms, AI agent builders
- **Market shifts:** New AI capabilities (model releases), regulatory changes (DPDP Act updates), Indian SME tech adoption trends

### Competitive Learning Integration

When Kshitiz delivers a competitive brief:
1. Identify features competitors have that Layaa OS does not — should any move up the roadmap?
2. Identify features Layaa OS has that competitors do not — these are differentiators to protect.
3. Identify market trends that affect which features will matter in 6 months.
4. Save key insights to memory with `competitive` category.

---

## 6. Product Intuition Building

Product intuition is the ability to make good product decisions quickly, even with incomplete data. It is built by deliberately reflecting on outcomes.

### Monthly Product Reflection

Once per month, answer these questions and save the answers:

1. What product decision am I most confident about this month? Why?
2. What product decision am I least confident about? What would change my mind?
3. What surprised me about how users used the product?
4. What did I think was important that turned out not to matter?
5. What did I think was unimportant that turned out to matter a lot?
6. If I could redo one decision from this month, which one and why?

### Decision Journal

For every significant product decision, record:

```markdown
## Decision: [What was decided]
**Date:** [Date]
**Context:** [What information was available]
**Alternatives considered:** [What else could we have done]
**Rationale:** [Why this option]
**Expected outcome:** [What I predict will happen]
**Actual outcome:** [Filled in later — what actually happened]
**Lesson:** [What I learned from the delta]
```

Reviewing the decision journal quarterly builds calibrated judgment — the foundation of product intuition.

---

**Cross-references:**
- For metrics that feed self-learning: see `Dev — KB — Product Metrics & KPIs.md`
- For sprint retrospectives that generate learnings: see `Dev — KB — Sprint Planning Framework.md`
- For feature prioritization improved by learning: see `Dev — KB — Feature Backlog & Prioritization.md`
- For roadmap decisions informed by learning: see `Dev — KB — Layaa OS Product Roadmap.md`

*A product manager who does not learn from outcomes is just a project manager with opinions. Self-learning is how Dev turns experience into better judgment, sprint after sprint.*
