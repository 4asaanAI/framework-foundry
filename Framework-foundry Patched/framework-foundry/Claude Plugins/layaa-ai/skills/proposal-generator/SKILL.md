---
name: proposal-generator
description: >
  Generate end-to-end proposals from discovery notes — scope, pricing, timeline,
  legal terms, all formatted. Uses Layaa AI's pricing engine, service packages, and contract templates.
  Trigger: "create proposal", "write proposal", "generate proposal", "draft proposal"
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# Proposal Generator

Generate comprehensive, ready-to-send proposals that combine discovery insights, service package selection, pricing, timelines, and legal terms into a professional document.

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

### Step 1: Gather Proposal Inputs
Collect the following from the user or from existing workspace files:

**Required:**
- Client company name and contact person
- Discovery notes or discovery call report (check for existing files using Grep/Glob)
- Scope of work (what needs to be built/delivered)
- Pricing approved or to be calculated

**Optional but recommended:**
- Discovery call report (from discovery-call skill output)
- Specific client requirements or constraints
- Competitive context (are they evaluating alternatives?)
- Internal notes on deal strategy
- Custom terms or conditions requested by the client

If a discovery call report exists in the workspace, read it to extract scope, requirements, and feasibility assessment.

### Step 2: Define the Scope of Work
Translate discovery findings into clear deliverables:

**For each deliverable, define:**
- **What:** Description of the workflow, integration, or service
- **Why:** The business problem it solves
- **How:** High-level approach (no technical details that commit to a specific implementation)
- **Acceptance criteria:** What "done" looks like
- **Dependencies:** What the client needs to provide (data access, tool credentials, SME time)

**Scope boundaries:**
- Explicitly state what IS included
- Explicitly state what is NOT included (prevents scope creep)
- Note any assumptions that, if wrong, could change the scope

**Phasing (if applicable):**
If the scope is large, recommend phases:
- **Phase 1 (Quick Win):** Deliver visible value within 2-4 weeks
- **Phase 2 (Core Build):** Main automation/integration work
- **Phase 3 (Optimisation):** Refinement, additional workflows, training

### Step 3: Select Service Package (Layaa AI Mode)
Map the scope to Layaa AI's service offerings:

**Service Verticals to Consider:**
1. Education & Workforce Enablement — training, workshops
2. Consulting & Process Assessment — process mapping, roadmaps
3. Automation Development & Integration — custom workflows, AI interfaces, integrations
4. Maintenance & Support — ongoing monitoring, updates, issue resolution
5. Pre-built Automations — ready-to-deploy modules

**Package Tier Selection:**
From `domain-references/sales/service-config-matrix.md`, select:
- Which service verticals apply
- Which package tier fits (Starter / Growth / Enterprise)
- Any add-ons or custom components needed

### Step 4: Calculate Pricing (Layaa AI Mode)
Build the pricing section using Layaa AI's pricing model:

**Implementation Fee (One-Time):**
- Base: Calculate from scope complexity and service matrix
- Average benchmark: 2.5L (adjust up or down based on scope)
- Factor in: number of workflows, integrations, custom development, data migration
- Payment terms: 50% deposit on contract signing, 50% on delivery completion

**Monthly Retainer (Recurring):**
- Starter (15k/month): Basic monitoring, minor updates, email support
- Growth (40k/month): Active monitoring, regular updates, priority support, performance reviews
- Enterprise (Custom): Dedicated support, SLA-backed, continuous optimisation, strategic reviews

**Total Investment Summary:**

| Component | Amount | Timing |
|-----------|--------|--------|
| Implementation Fee | [amount] | 50% upfront, 50% on delivery |
| Monthly Retainer | [amount]/month | Starting [month after go-live] |
| Year 1 Total | [implementation + 12x retainer] | — |

**ROI Justification:**
Include a brief ROI calculation:
- Current cost of the manual process (time x hourly rate x frequency)
- Projected savings with automation
- Payback period (investment / monthly savings)
- Net benefit over 12 months

### Step 5: Build the Timeline
Create a realistic implementation timeline:

**Standard Timeline Structure:**
| Phase | Duration | Activities | Deliverables |
|-------|----------|------------|--------------|
| Kickoff & Setup | Week 1 | Access provisioning, environment setup, detailed requirements review | Project plan, access confirmed |
| Development Sprint 1 | Weeks 2-3 | Core workflow builds, initial integrations | Working prototypes |
| Development Sprint 2 | Weeks 4-5 | Additional workflows, refinements, error handling | Complete workflows |
| Testing & Validation | Week 6 | End-to-end testing, client UAT | Test results, bug fixes |
| Go-Live & Enablement | Week 7 | Deployment, team training, documentation | Live system, training materials |
| Hypercare | Weeks 8-10 | Active monitoring, rapid issue resolution | Stable operations |

Adjust based on scope complexity:
- Simple (1-2 workflows): 3-4 weeks
- Moderate (3-5 workflows with integrations): 6-8 weeks
- Complex (enterprise-grade, multiple systems): 10-14 weeks

**Client Responsibilities (Critical):**
List what the client must provide and when:
- System access and API credentials (by kickoff)
- Subject matter expert availability (X hours/week during development)
- Test data or sandbox environment (by Week 2)
- UAT feedback within agreed window (during testing phase)
- Go/No-Go decision (before go-live)

### Step 6: Terms and Conditions (Layaa AI Mode)
Include standard contractual terms, drawing from Layaa AI's contract framework:

**Payment Terms:**
- 50% of implementation fee due on contract signing
- 50% of implementation fee due on successful delivery
- Monthly retainer invoiced on the 1st of each month, due within 15 days
- Late payment: [standard terms]

**Scope Change Process:**
- Changes to agreed scope require written approval from both parties
- Additional scope will be quoted separately and does not delay existing timelines
- Minor adjustments (within 10% of original scope) may be accommodated at no additional cost at Layaa AI's discretion

**Intellectual Property:**
- All custom workflows and automations built for the client become the client's property upon full payment
- Layaa AI retains the right to use general methodologies, frameworks, and non-client-specific components
- Pre-existing IP (templates, libraries) remains Layaa AI's property but is licensed for client use

**Confidentiality:**
- Both parties agree to keep confidential all proprietary information shared during the engagement
- NDA terms per Layaa AI's standard agreement

**Warranty and Support:**
- 30-day warranty post go-live for bug fixes at no additional cost
- Ongoing support available via retainer packages
- Response times defined by retainer tier

**Termination:**
- Either party may terminate with 30 days written notice
- Implementation fees are non-refundable once development has begun
- Retainer can be cancelled with 30 days notice

**Note:** These are standard terms. For deals requiring custom legal terms, escalate to Abhay (Legal & Contracts Advisor). Do not modify standard terms without approval.

### Step 7: Assemble the Proposal Document
Compile all sections into a formatted proposal:

**Proposal Structure:**

```
[LAYAA AI LOGO PLACEHOLDER]

PROPOSAL
[Client Company Name]
Prepared for: [Contact Name], [Title]
Prepared by: Layaa AI Private Limited
Date: [date]
Valid until: [date + 30 days]

---

TABLE OF CONTENTS
1. Executive Summary
2. Understanding Your Needs
3. Proposed Solution
4. Scope of Work
5. Implementation Timeline
6. Investment
7. Why Layaa AI
8. Terms & Conditions
9. Next Steps

---

1. EXECUTIVE SUMMARY
[2-3 paragraphs summarizing: their challenge, our proposed solution, expected outcomes, and investment overview. Written in their language, referencing their specific pain points. No generic boilerplate.]

2. UNDERSTANDING YOUR NEEDS
[Reflect back what we learned in discovery. Shows we listened and understand their business. Include:
- Business context summary
- Key challenges identified
- Current process pain points
- Success criteria they defined]

3. PROPOSED SOLUTION
[High-level solution overview:
- Approach and methodology (Discovery → Assessment → Development → Validation → Enablement)
- Technology stack recommendation
- How the solution addresses each identified pain point
- Expected outcomes with metrics where possible]

4. SCOPE OF WORK
[Detailed deliverables:]

4.1 Included in Scope
[Numbered list of deliverables with descriptions and acceptance criteria]

4.2 Not Included in Scope
[Explicit exclusions to prevent scope creep]

4.3 Assumptions
[Conditions that, if changed, may affect scope or pricing]

4.4 Client Responsibilities
[What the client must provide for successful delivery]

5. IMPLEMENTATION TIMELINE
[Timeline table from Step 5]
[Gantt-style visual if feasible, otherwise table format]

6. INVESTMENT

6.1 Implementation Fee
[Breakdown of one-time costs]

6.2 Ongoing Support (Monthly Retainer)
[Retainer tier details and what's included]

6.3 Total Investment Summary
[Summary table]

6.4 ROI Projection
[Brief ROI calculation showing payback period]

6.5 Payment Schedule
[When payments are due]

7. WHY LAYAA AI
[3-5 compelling reasons tailored to this client:
- Relevant experience or capabilities
- Methodology advantage
- Ongoing support model
- SME-focused approach
- Technology flexibility]

[Brief company overview:
- Founded: 2025
- Focus: AI automation and enablement for Indian SMEs
- Approach: No-code/low-code rapid deployment + custom development
- Founders: Abhimanyu Singh, Shubham Sharma]

8. TERMS & CONDITIONS
[Standard terms from Step 6]

9. NEXT STEPS
[Clear path forward:]
- Review this proposal and share any questions
- Schedule a call to discuss [specific date suggestion]
- Upon agreement, sign the contract and submit the 50% deposit
- Kickoff within [X] business days of signing

---

CONTACT
Layaa AI Private Limited
Website: https://layaa.ai
Email: Hello@layaa.ai
[Founder name and contact if appropriate]
```

### Step 8: Quality Review
Before delivering, check:
- [ ] Client name and contact details are correct throughout
- [ ] Scope accurately reflects discovery findings — no over-promising
- [ ] Pricing is consistent across all sections (summary matches details)
- [ ] Timeline is realistic given the scope
- [ ] Terms are standard (no custom modifications without approval)
- [ ] Brand voice is maintained (confident, clear, no jargon, no hype)
- [ ] All claims are defensible — no fabricated metrics or case studies
- [ ] Proposal is valid for 30 days (default validity period)
- [ ] Next steps are clear and specific
- [ ] No banned terms used
- [ ] Indian English spelling throughout

### Step 9: Save and Deliver
Use the Write tool to save the proposal as a markdown file:
- Suggested path: `[workspace]/proposals/[client-name]-proposal-[date].md`
- Inform the user the file has been saved
- Suggest converting to PDF using their preferred tool (Google Docs, Word, Canva)
- Offer to create a summary email to send with the proposal

## Output Format
The primary output is the full proposal document as structured above. Additionally provide:

```
## Proposal Summary
- **Client:** [name]
- **Scope:** [1-sentence summary]
- **Implementation Fee:** [amount]
- **Monthly Retainer:** [tier and amount]
- **Year 1 Total:** [amount]
- **Timeline:** [weeks]
- **Validity:** [date]
- **File saved to:** [path]

## Sending Recommendations
- **Email subject:** [suggested]
- **Key points to highlight in the cover email:** [3 bullets]
- **Anticipated objections:** [list with prepared responses]
- **Follow-up timing:** [when to follow up if no response]
```

## What Makes This Different from Generic Proposal Generation
- Draws directly from Layaa AI's discovery framework output (5-phase structure)
- Uses Layaa AI's actual pricing model with implementation + retainer components
- Applies Layaa AI's standard contractual terms (from Abhay's legal framework)
- Structures the scope around Layaa AI's five service verticals
- Includes ROI calculations calibrated to Layaa AI's pricing (2.5L avg implementation, 15-40k retainer)
- Payment terms follow Layaa AI's 50% deposit model
- "Why Layaa AI" section uses differentiation points from the sales playbook
- Knows when to escalate to Veer (custom pricing), Abhay (custom legal terms), or founders (strategic deals)
- Applies Layaa AI's methodology (Discovery → Assessment → Development → Validation → Enablement) as the solution framework
- Brand voice compliance ensures proposals match all other Layaa AI communications
