---
name: call-summary
description: >
  Process call notes or transcript — extract action items, draft follow-up email,
  update pipeline context. Replaces generic sales:call-summary.
  Trigger: "summarize call", "call notes", "call summary", "post-call"
user-invocable: true
allowed-tools: Read, Grep, Glob
---

# Call Summary

Process sales call notes or transcripts into structured summaries with action items, pipeline updates, and follow-up emails.

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

## Execution Steps

### Step 1: Ingest Call Content
Accept one of the following inputs:
- **Raw transcript** (pasted text or file path)
- **Unstructured call notes** (bullet points, shorthand)
- **Audio transcript file** (if pre-transcribed)

If the input is extremely brief or unclear, ask clarifying questions:
- Who was on the call? (names, titles, company)
- What stage is this deal in? (first call, follow-up, negotiation)
- What was the primary purpose of the call?

### Step 2: Extract Key Information
Parse the call content and extract these categories:

**Attendees & Context:**
- All participants (name, title, company)
- Call date and duration (if available)
- Deal stage at time of call

**Pain Points Identified:**
- Explicit pain points stated by the prospect
- Implicit pain signals (complaints, workarounds, frustrations mentioned)
- Rank by severity: Critical / High / Medium / Low

**Objections Raised:**
- Pricing objections — note exact concerns (too expensive, unclear ROI, budget constraints)
- Timing objections — not now, next quarter, need internal buy-in
- Technical objections — integration concerns, data security, team readiness
- Competitive objections — already evaluating alternatives, incumbent solution

**Budget Signals:**
- Any budget mentioned (explicit numbers or ranges)
- Budget authority indicators (who decides, approval process)
- Procurement process clues (vendor registration, PO requirements)

**Decision-Making Signals:**
- Decision maker identified? (name, title)
- Decision timeline mentioned?
- Other stakeholders who need to be involved?
- Internal champions identified?

**Next Steps Discussed:**
- Any commitments made by either side
- Follow-up materials requested
- Next meeting scheduled or proposed
- Trial/pilot discussions

### Step 3: Map to ICP and Pipeline Stage (Layaa AI Mode)
Using extracted information:
1. Classify the prospect into an ICP category from `shared-references/icp-and-market.md`
2. Determine current pipeline stage:
   - **MQL** — Interest expressed but not qualified
   - **SQL** — Pain confirmed, budget exists, timeline is real
   - **Proposal** — Active evaluation, proposal requested or sent
   - **Negotiation** — Terms being discussed
   - **Won/Lost** — Decision made
3. Assess stage movement: Did this call advance, stall, or regress the deal?
4. Flag if conversion benchmarks are at risk (MQL→SQL 25%, SQL→Proposal 60%, Proposal→Won 35%)

### Step 4: Identify Service Package Fit (Layaa AI Mode)
Based on the pain points and requirements discussed:
1. Read `domain-references/sales/service-config-matrix.md`
2. Match discussed needs to specific service packages
3. Note any scope creep risks (prospect asking for things outside standard packages)
4. Flag if a custom/enterprise package may be needed

### Step 5: Generate Action Items
Create a prioritized action list:

**Immediate (within 24 hours):**
- Send follow-up email (drafted in Step 7)
- Share any materials promised on the call
- Update CRM/pipeline status

**Short-term (within 1 week):**
- Prepare requested deliverables (proposal, case study, demo)
- Schedule next meeting if agreed
- Loop in additional team members if needed

**Strategic:**
- Internal alignment needed (pricing approval, technical feasibility check)
- Competitive positioning preparation
- Escalation items for founders

### Step 6: Flag Escalation Needs
Determine if any of the following require escalation:
- **Founder escalation:** Prospect wants to speak with founders, deal size is large (>5L implementation), strategic partnership discussed
- **Pricing escalation:** Custom pricing requested, significant discount asked, non-standard payment terms
- **Technical escalation:** Complex integration requirements, security/compliance demands beyond standard
- **Risk flags:** Prospect seemed disengaged, competitive threat mentioned, timeline slipping

### Step 7: Draft Follow-Up Email
Generate a follow-up email that:
1. Thanks them for their time (brief, not effusive)
2. Summarizes the key points discussed (3-5 bullets max)
3. Confirms next steps with specific dates/deadlines
4. Attaches or references any promised materials
5. Ends with a clear single CTA

**Tone rules (Layaa AI mode):**
- Professional, warm, concise
- No jargon unless the call was technical
- Reference specific things they said to show active listening
- No generic "great chatting" openers

### Step 8: Generate Pipeline Update
Create a structured update suitable for CRM entry or team standup:
- Deal name and contact
- Stage change (if any)
- Win probability adjustment
- Key risks
- Next action and owner

## Output Format

```
## Call Summary: [Company Name] — [Date]

### Attendees
| Name | Title | Company | Role in Deal |
|------|-------|---------|--------------|
| [name] | [title] | [company] | [Champion/Decision Maker/Evaluator/Blocker] |

### Call Context
- **Deal Stage:** [stage] → [new stage if changed]
- **ICP Match:** [category]
- **Call Purpose:** [discovery / follow-up / demo / negotiation]
- **Duration:** [if known]

### Key Findings

**Pain Points:**
1. [pain point] — Severity: [Critical/High/Medium/Low]
2. [pain point] — Severity: [Critical/High/Medium/Low]

**Objections:**
1. [objection] — Type: [Pricing/Timing/Technical/Competitive]
   - Suggested response: [from battle card]

**Budget Signals:**
- [budget information extracted]

**Decision Process:**
- Decision maker: [name/title or unknown]
- Timeline: [stated timeline or estimate]
- Other stakeholders: [if mentioned]

### Service Package Fit
- **Recommended package:** [package name from service matrix]
- **Estimated deal size:** [range]
- **Scope notes:** [any adjustments needed]

### Action Items
| # | Action | Owner | Deadline | Priority |
|---|--------|-------|----------|----------|
| 1 | [action] | [who] | [when] | [High/Med/Low] |

### Escalation Flags
- [any items requiring founder or specialist attention]

### Pipeline Update
- **Stage:** [current] | **Probability:** [%] | **Next Action:** [what] by [when]

---

## Follow-Up Email

**Subject:** [subject line]

[email body]
```

## What Makes This Different from Generic Call Summary
- Maps call insights to Layaa AI's specific ICP profiles and conversion benchmarks
- Identifies which service package fits the discussed requirements
- Matches objections to battle-card responses from the sales playbook
- Flags deals against Layaa AI's pipeline conversion rates (MQL→SQL 25%, SQL→Proposal 60%, Proposal→Won 35%)
- Applies Layaa AI brand voice to the follow-up email
- Knows the escalation paths (to founders, to pricing specialist Veer, to legal Abhay)
- Understands the minimum viable budget threshold (50k+ implementation)
