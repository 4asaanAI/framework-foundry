---
name: discovery-call
description: >
  Prepare for or process a discovery call using Layaa AI's 5-phase framework
  (Business Context → Current State → Requirements → Feasibility → Solution Design).
  Trigger: "discovery call", "discovery session", "client discovery", "scope call"
user-invocable: true
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Discovery Call

Prepare for, guide, or process a discovery call using Layaa AI's structured 5-phase discovery framework. Ensures thorough scope validation, risk identification, and a clean handover to the architecture and delivery team.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/sales/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- shared-references/company-identity.md — Company basics
- shared-references/icp-and-market.md — ICP profiles and personas
- shared-references/revenue-model.md — Pricing and conversion funnel
- shared-references/service-verticals.md — Services and methodology
- domain-references/sales/sales-playbook.md — Battle cards and objection handling
- domain-references/sales/service-config-matrix.md — Package tiers
- domain-references/sales/pricing-quick-ref.md — Pricing tables
Only load references relevant to the specific task.

## Execution Modes

This skill operates in three modes:
- **Pre-call mode:** Prepare questions, research, and agenda before a discovery call
- **Live guidance mode:** Provide real-time guidance during a discovery session
- **Post-call mode:** Process discovery notes into a structured output and handover document

Ask the user which mode they need, or infer from context.

## The 5-Phase Discovery Framework

### Phase 1: Business Context (10-15 minutes)
**Objective:** Understand the client's business, market position, and strategic priorities.

**Questions to ask:**
1. "Tell me about your business — what do you do and who do you serve?"
2. "How many employees do you have, and how is your team structured?"
3. "What are your top 3 business priorities for the next 6-12 months?"
4. "Where do you see the biggest friction in your current operations?"
5. "Have you used automation or AI tools before? If so, what was the experience?"

**What to listen for:**
- Company size and stage (validates ICP fit)
- Growth trajectory (determines urgency and budget)
- Past automation experience (shapes expectations and readiness)
- Strategic priorities (reveals where automation delivers the most value)
- Team structure (identifies stakeholders and adoption challenges)

**ICP Classification:**
Based on answers, classify into:
- SaaS Startups (5-25 employees, post-seed)
- Logistics & Supply Chain SMEs (50-200 employees)
- Fintech & Payment Processors (10-100 employees)
- Professional Services (10-50 employees)
- Non-ICP (flag for founder review)

### Phase 2: Current State Assessment (15-20 minutes)
**Objective:** Map existing processes, tools, and workflows that are candidates for automation.

**Questions to ask:**
1. "Walk me through the specific process you want to improve. Start from the trigger — what initiates it?"
2. "How many people are involved in this process? What does each person do?"
3. "What tools or systems do you currently use?" (CRM, ERP, spreadsheets, email, WhatsApp, etc.)
4. "How often does this process run? Daily, weekly, per transaction?"
5. "What happens when something goes wrong in this process today?"
6. "How much time does this process take end-to-end?"
7. "What data moves between systems, and in what format?"

**Process Mapping Output:**
For each process discussed, capture:
- **Trigger:** What initiates the workflow
- **Steps:** Sequential actions (who does what)
- **Systems:** Tools and platforms involved
- **Data:** What information moves and in what format
- **Volume:** How often, how many transactions
- **Time:** Duration per instance and total monthly time
- **Error points:** Where things break or slow down
- **Handoff points:** Where work transfers between people/systems

### Phase 3: Requirements Gathering (10-15 minutes)
**Objective:** Define what success looks like and capture non-negotiable requirements.

**Questions to ask:**
1. "If we automated this perfectly, what would the outcome look like?"
2. "What are your must-have requirements vs. nice-to-haves?"
3. "Are there any compliance or regulatory requirements we need to consider?"
4. "What's your timeline expectation — when do you need this working?"
5. "What does your budget range look like for this initiative?"
6. "Who needs to approve this project, and what's their decision process?"
7. "How will you measure success — what KPIs matter to you?"

**Requirements Matrix:**
| Requirement | Priority | Type | Feasibility Notes |
|-------------|----------|------|-------------------|
| [requirement] | Must-Have / Nice-to-Have | Functional / Technical / Compliance | [initial assessment] |

### Phase 4: Feasibility Assessment (Internal — post-call)
**Objective:** Evaluate whether Layaa AI can deliver what the client needs, at the right quality, within budget.

**Risk Categories to Evaluate:**

**Data Risk:**
- Is the required data accessible via API or structured format?
- Are there data quality issues (inconsistent formats, missing fields)?
- Does data cross systems that don't integrate easily?
- Volume of data — can it be processed within tool limits?
- Data sensitivity — are there privacy or compliance implications?

**Technical Risk:**
- Are all required integrations available (APIs, webhooks, connectors)?
- Does any component require custom development beyond no-code/low-code?
- Are there rate limits or platform restrictions that could block the solution?
- Does the solution require real-time processing or is batch acceptable?
- Are there authentication or access control complexities?

**Process Risk:**
- Is the current process well-defined enough to automate?
- Are there too many edge cases or exceptions?
- Does the process depend on human judgment that cannot be reliably automated?
- Will the process change in the near term (making automation premature)?

**Expectation Risk:**
- Are the client's timeline expectations realistic?
- Is the budget aligned with the scope?
- Does the client expect outcomes Layaa AI cannot guarantee (e.g., specific revenue increase)?
- Is there a gap between what was discussed and what's actually needed?

**Compliance Risk:**
- Are there industry-specific regulations (SEBI, RBI, DPDP Act)?
- Does data handling require special treatment (encryption, residency, consent)?
- Are there audit trail requirements?

**Economic Risk:**
- Does the ROI justify the investment for the client?
- Is the deal size above minimum viable budget (50k+ implementation)?
- Is the retainer sustainable for the client long-term?

**Feasibility Decision:**
- **GREEN — Proceed:** All risks manageable, clear path to delivery
- **YELLOW — Proceed with conditions:** Some risks require mitigation plans or scope adjustments
- **RED — Do not proceed:** Fundamental risks that cannot be mitigated. Recommend declining or fundamentally rescoping.

### Phase 5: Solution Design Outline (Internal — post-call)
**Objective:** Sketch the solution architecture and delivery plan at a high level.

**Solution Outline:**
- Recommended service package(s) from the service configuration matrix
- Key workflows to be built (list with brief descriptions)
- Technology stack recommendation (n8n, Make, custom, hybrid)
- Integration points (systems to connect)
- Estimated implementation timeline (weeks)
- Recommended retainer tier for ongoing support
- Phasing recommendation (if scope is large, what to build first)

**Handover Document for Architecture Team:**
This is the bridge between discovery (Rohit's domain) and architecture (Ujjwal's domain):
- Validated business context
- Process maps
- Requirements matrix with priorities
- Risk assessment with mitigation plans
- Recommended solution approach
- Client constraints (budget, timeline, technical)
- Open questions requiring further investigation

## Pre-Call Mode: Preparation Checklist
If preparing for an upcoming discovery call:

1. **Research the prospect** (use account-research skill or manual research)
2. **Prepare the question list** customized for their industry and ICP
3. **Review relevant service packages** they might need
4. **Set an agenda** (propose 45-60 minutes)
5. **Prepare a brief intro** — who Layaa AI is and what this call will cover (3 minutes max)
6. **Identify information gaps** — what do we already know vs. what we need to learn
7. **Prepare fallback questions** — if the conversation stalls or goes off-track

## Post-Call Mode: Processing Notes
If processing notes after a discovery call:

1. **Organize raw notes** into the 5-phase structure
2. **Fill gaps** — flag what was not covered and needs follow-up
3. **Run feasibility assessment** — score each risk category
4. **Map to service packages** — identify the right offering
5. **Generate the handover document** — structured output for the architecture team
6. **Draft follow-up email** — summarize what was discussed, confirm next steps
7. **Recommend next action** — proposal, technical deep-dive, founder call, or decline

## Output Format

```
# Discovery Call Report: [Company Name]
**Date:** [date]
**Attendees:** [list with titles]
**Call Duration:** [minutes]
**Conducted By:** [Layaa AI team member]

## Phase 1: Business Context
- **Company:** [name] — [description]
- **Industry:** [vertical] | **Size:** [employees] | **Stage:** [startup/growth/established]
- **ICP Classification:** [category] — Fit: [Strong/Moderate/Weak]
- **Strategic Priorities:** [top 3]
- **Automation Maturity:** [None / Basic / Intermediate]

## Phase 2: Current State
### Process Map: [Process Name]
- **Trigger:** [what starts it]
- **Steps:**
  1. [step] — [who] — [tool] — [time]
  2. [step] — [who] — [tool] — [time]
- **Systems Involved:** [list]
- **Volume:** [frequency and quantity]
- **Time per Instance:** [duration]
- **Monthly Time Spent:** [total hours]
- **Error Rate:** [estimated]
- **Pain Points:** [specific friction points]

## Phase 3: Requirements
| # | Requirement | Priority | Type | Notes |
|---|-------------|----------|------|-------|
| 1 | [requirement] | Must-Have | [type] | [notes] |

- **Success KPIs:** [how they'll measure success]
- **Budget Range:** [stated or estimated]
- **Timeline:** [desired start and completion]
- **Decision Process:** [who approves, how long]

## Phase 4: Feasibility Assessment
| Risk Category | Score | Key Findings | Mitigation |
|---------------|-------|-------------|------------|
| Data | [G/Y/R] | [findings] | [plan] |
| Technical | [G/Y/R] | [findings] | [plan] |
| Process | [G/Y/R] | [findings] | [plan] |
| Expectation | [G/Y/R] | [findings] | [plan] |
| Compliance | [G/Y/R] | [findings] | [plan] |
| Economic | [G/Y/R] | [findings] | [plan] |

**Overall Feasibility:** [GREEN / YELLOW / RED]
**Recommendation:** [Proceed / Proceed with conditions / Decline]

## Phase 5: Solution Outline
- **Recommended Package:** [from service matrix]
- **Estimated Implementation:** [amount] | **Retainer Tier:** [Starter/Growth/Enterprise]
- **Key Workflows:** [numbered list]
- **Technology:** [recommended stack]
- **Timeline:** [weeks for implementation]
- **Phasing:** [if applicable — Phase 1: [scope], Phase 2: [scope]]

## Handover to Architecture Team
[Structured summary for Ujjwal / implementation team]

## Follow-Up Actions
| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | [action] | [who] | [when] |

## Open Questions
- [question requiring follow-up]
```

## What Makes This Different from Generic Discovery
- Uses Layaa AI's mandatory 5-phase discovery framework rather than ad-hoc questioning
- Evaluates six specific risk categories (Data, Technical, Process, Expectation, Compliance, Economic) from Rohit's methodology
- Produces a structured handover document that bridges discovery to architecture (Rohit → Ujjwal pipeline)
- Maps requirements directly to Layaa AI's service packages and pricing tiers
- Includes feasibility decision trees with GREEN/YELLOW/RED scoring
- Validates ICP fit during the call itself and adjusts questioning accordingly
- Knows Layaa AI's technical capabilities and limitations for accurate feasibility assessment
- Connects to the broader GPT workforce: flags when to escalate to Veer (pricing), Abhay (legal), Preeti (compliance), or Kshitiz (research)
