# Rohit — KB — Discovery Methodology (5 Phases)

> Core discovery methodology for client engagement, from business context through solution design. These 5 phases form the backbone of every Layaa AI discovery engagement.

---

## Phase 1: Business Context (30 minutes typical)

**Objective:** Understand the client's world before discussing any technology.

**Key Questions to Cover:**

**Business Model:**
- What does the company do? Who are their customers?
- How do they make money? What are their revenue streams?
- What is their growth trajectory? Are they scaling, stable, or restructuring?
- How many employees? What is the team structure?

**Industry Context:**
- What industry-specific regulations apply?
- Who are their competitors? What tech do competitors use?
- What seasonal patterns affect their operations?
- What industry trends are relevant?

**Decision Making:**
- Who is the project champion? Who signs off on budget?
- Who are the end users of any solution we build?
- What is their change management capacity? Have they adopted new tech before?
- What is their budget expectation? (Note: Record this, but NEVER confirm pricing.)

**Output from Phase 1:** A narrative summary of the client's business, written so that someone who has never spoken to the client can understand their world.

---

## Phase 2: Current State Assessment (45 minutes typical)

**Objective:** Map reality — how things actually work today, not how the org chart says they should.

**Systems Inventory:**
- List every tool, platform, and system they use (include version if possible)
- For each system: Who uses it? How? How often? What data lives there?
- Identify integration points: What systems talk to each other? How (API, manual export, copy-paste)?
- Note: Shadow IT matters — ask about personal spreadsheets, WhatsApp groups, manual trackers

**Process Mapping:**
- Walk through the top 3-5 processes they want to improve, step by step
- For each step: Who does it? How long does it take? What triggers it? What's the output?
- Identify handoff points (where work moves from one person/system to another)
- Note: Handoff points are where most breakdowns happen

**Data Assessment:**
- Where is critical data stored? (Database, spreadsheets, emails, WhatsApp, paper?)
- How clean is the data? (Consistent formatting? Duplicates? Missing fields?)
- Is there historical data available for AI training? How much?
- What data do they wish they had but don't track?

**Pain Point Discovery:**
- What takes the most time? What causes the most errors?
- What do employees complain about most?
- Where do customers experience friction?
- What has been tried before to fix these issues? Why did it fail?

**Output from Phase 2:** A systems map, a process map for top 3-5 workflows, and a ranked list of pain points with root causes.

---

## Phase 3: Requirement Validation (30 minutes typical)

**Objective:** Separate what the client says they need from what they actually need.

**The Requirements Triangle:**
```
        [Stated Need]
           / \
          /   \
         /     \
[Actual Need] — [Hidden Need]
```

- **Stated Need:** What the client explicitly asks for ("We need a chatbot")
- **Actual Need:** What would actually solve their underlying problem ("They need faster response times to customer queries")
- **Hidden Need:** What they haven't articulated but would benefit from ("Their FAQ is outdated and causes most queries")

**Validation Questions:**
- "If we built exactly what you described, what would change in your daily operations?"
- "What would success look like 90 days after launch? How would you measure it?"
- "Who else would be affected by this change? Have they been consulted?"
- "What constraints are absolutely non-negotiable?" (Budget, timeline, regulatory)
- "What happens if we don't do this? What's the cost of inaction?"

**Dependency Mapping:**
- What other projects or changes depend on this?
- What does this project depend on? (Other system upgrades, data cleanup, team training)
- Are there external dependencies? (Government APIs, third-party vendors, seasonal deadlines)

**Output from Phase 3:** A validated requirements document distinguishing stated/actual/hidden needs, with dependencies and constraints clearly mapped.

---

## Phase 4: Feasibility Analysis (Internal — no client present)

**Objective:** Apply Layaa AI's feasibility checklists and determine what's buildable, what's risky, and what's out of scope.

**Step 1: Apply Automation Checklist**
For each proposed automation, score all 6 criteria (Pass/Fail/Conditional).
- If all pass: Green — feasible
- If 1-2 conditional: Yellow — feasible with prerequisites
- If any fail: Red — not feasible without significant changes

**Step 2: Apply AI Checklist (if AI is proposed)**
For each proposed AI component, score all 5 criteria.
- Same traffic light system as above

**Step 3: Tool Selection**
Using the Tool Priority hierarchy:
1. Can PRIMARY tools (Bolt AI, n8n, Relevance AI) handle this?
2. If not, which SECONDARY tool and why?
3. Is custom development needed? For what specific component?

**Step 4: Effort Estimation**
Use the 1-10 effort scale. Be honest — underestimation is worse than overestimation.

**Step 5: Risk Scoring**
For each identified risk: Likelihood (H/M/L) x Impact (H/M/L) = Priority.

**Output from Phase 4:** Feasibility matrix, tool recommendations with rationale, effort estimates, risk register.

---

## Phase 5: Solution Design (High-Level Only) (15 minutes typical)

**Objective:** Sketch enough of a solution direction that Ujjawal can begin architecture without re-interviewing the client.

**What to Include:**
- Recommended approach: Automation only? AI-assisted? Hybrid? Manual fix first?
- High-level flow: Input source → Processing → Output/Action
- Tool recommendation per component
- Integration points between components
- Human-in-the-loop requirements (where manual review is mandatory)
- What's MVP vs. Phase 2

**What NOT to Include:**
- Specific node configurations or workflow designs (that's Ujjawal's job)
- Database schemas or data models
- API endpoint specifications
- Error handling logic (beyond "this needs error handling")
- Security architecture details

**Output from Phase 5:** A high-level solution sketch with recommended tools, enough for Ujjawal to begin architecture design.

---

*This document is part of Rohit's operational knowledge base. Update as new discovery patterns and learnings emerge.*
