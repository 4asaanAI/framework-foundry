---
name: meeting-briefing
description: >
  Prepare legal briefing documents for meetings, negotiations, board meetings, or client discussions.
  Includes key talking points, risk flags, and decision frameworks.
  In Layaa AI mode, loads clause library, service verticals, and risk indicators for context-aware briefings.
  Trigger: "meeting brief", "meeting briefing", "legal briefing", "board meeting prep", "negotiation prep", "legal meeting"
  This skill replaces the generic legal:meeting-briefing capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Meeting Briefing

Prepare comprehensive legal briefing documents for meetings, negotiations, board meetings, or client discussions. Delivers structured talking points, risk flags, decision frameworks, and prepared responses for legal scenarios.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), board meetings, investor meetings, client contract negotiations, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/clause-library.md — Standard clause positions for contract negotiations
- domain-references/legal/risk-indicators.md — Risk scoring and assessment framework
- shared-references/company-identity.md — Company details, authorized representatives, entity information
- shared-references/service-verticals.md — Service offerings, methodology, delivery approach
Only load references relevant to the specific meeting type.

## Execution Steps

### Step 1: Identify Meeting Type and Participants
Collect or ask for:
- **Meeting type:**
  - Contract negotiation (new client, vendor, partner)
  - Board meeting / Board resolution
  - Investor meeting (pitch, update, due diligence)
  - Regulatory meeting (government body, compliance review)
  - Dispute resolution (mediation, settlement discussion)
  - Client escalation (service issue, scope dispute)
  - Internal legal review (policy, compliance, risk)
  - Partnership discussion (JV, channel partner, reseller)
- **Participants:** Names, titles, organizations, and their role in the meeting
- **Date, time, duration, and location** (in-person / virtual)
- **Agenda or purpose** as communicated by the organizer
- **Prior interactions** relevant to this meeting
- **Desired outcome** from Layaa AI's perspective

### Step 2: Load Relevant Legal Context (Layaa AI Mode)
Based on meeting type:

**Contract Negotiation:**
- Read `domain-references/legal/clause-library.md` for standard positions on all clause areas
- Read `shared-references/service-verticals.md` for scope and deliverable definitions
- Read `domain-references/legal/risk-indicators.md` for clause risk scoring

**Board Meeting:**
- Read `shared-references/company-identity.md` for entity details and governance structure
- Read any pending compliance items from `domain-references/finance/compliance-calendar.md`

**Investor Meeting:**
- Read `shared-references/company-identity.md` for cap table, entity structure
- Read `shared-references/service-verticals.md` for business model context

**Regulatory Meeting:**
- Read `domain-references/legal/regulatory-landscape.md` for applicable regulations
- Read `domain-references/legal/compliance-red-flags.md` for known compliance gaps

### Step 3: Summarize Key Issues and Background
For each issue on the meeting agenda:
1. **State the issue** in one clear sentence
2. **Provide background** — what led to this issue being on the agenda
3. **Current status** — where things stand right now
4. **Stakeholder positions** — what each party wants (if known)
5. **Legal implications** — what are the legal consequences of different outcomes
6. **Prior commitments** — any existing obligations or positions already taken

### Step 4: Prepare Talking Points with Legal Basis
For each agenda item, create:

**Opening position:**
- What to say first and how to frame the discussion
- Legal basis for the position (statute, clause, precedent, commercial logic)

**Supporting arguments:**
- 2-3 supporting points with evidence
- Reference to industry practice or market norms
- Data or metrics that strengthen the position

**Counterargument anticipation:**
- What the other side is likely to argue
- Pre-prepared responses to each anticipated argument
- Evidence or logic that rebuts each counterargument

### Step 5: Identify Risk Flags and Red Lines
Define three categories:

**Non-Negotiable (Red Lines):**
- Positions that cannot be conceded under any circumstances
- Legal or regulatory requirements that are mandatory
- Terms that would create unacceptable risk exposure
- Example for Layaa AI: IP ownership of custom-developed workflows, limitation of liability cap, data protection obligations

**Negotiable Within Bounds:**
- Positions with an acceptable range for negotiation
- State the preferred position and the floor/ceiling
- Conditions under which movement is acceptable
- Example: Payment terms (preferred: 50/25/25; acceptable: 40/30/30; floor: 30/30/40)

**Concession Chips:**
- Items that can be conceded to gain ground on more important issues
- Low-cost concessions that appear valuable to the other side
- Example: Extended warranty period (low cost to deliver), additional training sessions

### Step 6: Create Decision Framework
Build if/then scenarios for likely meeting outcomes:

```
IF [other party proposes X]
  AND [X is within acceptable range]
  THEN → Accept with [condition Y]

IF [other party proposes X]
  AND [X exceeds acceptable range]
  THEN → Counter with [alternative Z]
  ESCALATE IF → [they insist on X beyond threshold]

IF [unexpected issue W arises]
  THEN → Table for follow-up, do not commit in meeting
  REASON → [why this needs further analysis]
```

For each scenario, note:
- Who has authority to decide in the meeting
- What requires Founder approval before committing
- What requires external counsel review

### Step 7: Include Fallback Positions and Escalation Triggers
**Fallback positions** (if primary objectives cannot be achieved):
1. [Minimum acceptable outcome] with [conditions]
2. [Alternative deal structure] that achieves core objectives differently
3. [Adjournment strategy] — conditions under which to pause and reconvene

**Escalation triggers** (situations that require immediate escalation):
- Other party introduces terms outside prepared scenarios
- Legal threat or litigation mention
- Regulatory disclosure that changes the risk profile
- Financial terms that exceed authority of attendees
- Request for commitments on timeline or deliverables not yet scoped

## Output Format

```
# Meeting Briefing: [Meeting Title/Purpose]
**Date/Time:** [scheduled time]
**Location:** [venue / virtual platform]
**Duration:** [expected duration]
**Meeting Type:** [from classification in Step 1]
**Classification:** [CONFIDENTIAL / INTERNAL]

## Our Attendees
| Name | Role | Authority Level |
|------|------|----------------|
| [name] | [role at Layaa AI] | [can commit / advisory only] |

## Their Attendees
| Name | Title | Organization | Role in Meeting |
|------|-------|-------------|----------------|
| [name] | [title] | [org] | [Decision Maker / Negotiator / Technical / Legal] |

## Meeting Context
**Purpose:** [one-paragraph summary of why this meeting is happening]
**History:** [relevant prior interactions and current status]
**Desired Outcome:** [what success looks like for Layaa AI]

## Agenda with Legal Analysis

### Agenda Item 1: [Topic]
**Background:** [context and current status]
**Legal Basis:** [applicable law, clause, or contractual provision]
**Our Position:** [what we want and why]
**Their Likely Position:** [what they want, based on available intelligence]
**Risk Level:** [LOW / MEDIUM / HIGH]

**Talking Points:**
1. [Point with legal basis]
2. [Point with evidence/data]
3. [Point with industry practice reference]

**Prepared Responses:**
| If They Say | We Respond |
|-------------|-----------|
| [anticipated argument] | [prepared response] |
| [anticipated argument] | [prepared response] |

### Agenda Item 2: [Topic]
[Same structure as above]

## Red Lines and Negotiation Boundaries
### Non-Negotiable
- [Position] — Reason: [legal/regulatory/commercial]
- [Position] — Reason: [legal/regulatory/commercial]

### Negotiable Range
| Item | Preferred | Acceptable | Floor/Ceiling |
|------|-----------|-----------|---------------|
| [item] | [position] | [range] | [limit] |
| [item] | [position] | [range] | [limit] |

### Available Concessions
- [Concession] — Cost to us: [LOW] — Value to them: [HIGH]
- [Concession] — Cost to us: [LOW] — Value to them: [MEDIUM]

## Decision Framework
### Scenario 1: [Best case]
- **If:** [condition]
- **Then:** [action — can commit in meeting]
- **Authority:** [who can approve]

### Scenario 2: [Expected case]
- **If:** [condition]
- **Then:** [action — may need to table for Founder review]
- **Authority:** [who can approve]

### Scenario 3: [Difficult case]
- **If:** [condition]
- **Then:** [action — table and reconvene]
- **Escalate to:** [Founders / External Counsel]

## Escalation Triggers
- [ ] [Situation that requires immediate pause] → [action to take]
- [ ] [Situation that requires Founder call] → [action to take]
- [ ] [Situation that requires external counsel] → [action to take]

## Fallback Strategy
**If primary objectives are not achievable:**
1. [Minimum acceptable outcome with conditions]
2. [Alternative structure to propose]
3. [Graceful adjournment language: "We'd like to take this back and provide a considered response by [date]"]

## Documents to Bring
- [ ] [Document name — purpose]
- [ ] [Document name — purpose]
- [ ] [Document name — purpose]

## Post-Meeting Actions
- [ ] Send meeting summary within [timeframe]
- [ ] Document any verbal commitments made
- [ ] Draft follow-up correspondence if [condition]
- [ ] Update [contract/proposal/compliance tracker] with outcomes
```

## What Makes This Different from Generic Meeting Briefings
- Loads Layaa AI's specific clause library positions for contract negotiations
- Uses Layaa AI's risk indicators framework for consistent risk scoring across meetings
- References Layaa AI's service verticals and methodology for accurate scope discussions
- Maps authority levels to Layaa AI's governance hierarchy (attendee → Kabir → Founders)
- Prepares concession strategies based on Layaa AI's actual cost structure and service flexibility
- Includes Indian regulatory context for compliance-related meetings
- Coordinates with Abhay (Legal & Contracts Advisor) and Preeti (Regulatory Compliance & Data Governance Advisor) for cross-functional legal issues
