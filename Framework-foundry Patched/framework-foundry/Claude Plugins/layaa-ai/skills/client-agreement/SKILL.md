---
name: client-agreement
description: >
  Generate complete Layaa AI client agreements from scope definition. Creates MSA + SoW package
  using Layaa AI standard templates, clause library, and pricing engine. Handles end-to-end
  agreement creation from discovery notes to signature-ready documents.
  Trigger: "client agreement", "draft agreement", "create contract", "MSA", "SoW", "statement of work", "master service agreement", "new client contract"
  This is a new Layaa AI-specific skill.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Client Agreement

Generate complete Layaa AI client agreements from scope definition. Creates an MSA + SoW package using Layaa AI standard templates, clause library, and pricing engine. Handles end-to-end agreement creation from discovery notes to signature-ready documents.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → This skill is primarily designed for Layaa AI mode. Load all references.
- **General mode** if: task is about a different company → Adapt the structure but note that templates and pricing are Layaa AI-specific. Provide a generic MSA + SoW framework.

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/contract-templates.md — MSA and SoW templates
- domain-references/legal/clause-library.md — Standard clauses for all 12+ clause areas
- domain-references/finance/pricing-engine.md — Fee calculation logic, package tiers, pricing rules
- domain-references/sales/service-config-matrix.md — Service configurations, deliverables by package tier
- shared-references/company-identity.md — Entity details, signatories, registration numbers
- shared-references/revenue-model.md — Pricing tiers, conversion funnel, retainer structure
Load ALL references for this skill, as agreement generation requires the full picture.

## Execution Steps

### Step 1: Gather Scope Inputs
Collect or ask for:

**Client Details:**
- Client company name (legal entity name)
- Client registered address
- Client authorized signatory (name, designation)
- Client industry/sector
- Client size (employees, revenue indicators)
- ICP classification (SaaS startup, logistics, fintech, professional services, other)

**Engagement Details:**
- Discovery notes or proposal (if available)
- Selected package tier (Starter / Growth / Enterprise / Custom)
- Specific services requested
- Problem statement / business need
- Expected outcomes and success metrics
- Timeline expectations (start date, duration, milestones)
- Budget discussed or approved

**Special Requirements:**
- Regulated industry considerations
- Data sensitivity (personal data, financial data, health data)
- Integration requirements (existing systems, APIs)
- Training/enablement needs
- SLA requirements beyond standard
- Any non-standard terms discussed

### Step 2: Load Layaa AI Contract Templates
1. Read `domain-references/legal/contract-templates.md` for MSA and SoW templates
2. Identify which template variant to use:
   - **Standard MSA + SoW:** For implementation + retainer engagements
   - **MSA-only:** For ongoing retainer without specific project
   - **SoW-only:** When MSA already exists (amendment or new project under existing MSA)
   - **Custom:** For enterprise or non-standard engagements (requires Founder review)

### Step 3: Load Clause Library
Read `domain-references/legal/clause-library.md` and prepare standard clauses for insertion:

**Required Clauses (all MSAs):**
1. Definitions
2. Scope of Services (reference to SoW)
3. Intellectual Property
4. Confidentiality
5. Payment Terms
6. Limitation of Liability
7. Indemnification
8. Term and Termination
9. Data Protection
10. Force Majeure
11. Dispute Resolution
12. Warranties and Representations
13. Non-Solicitation
14. Assignment
15. Notices
16. Entire Agreement
17. Amendment
18. Severability
19. Waiver
20. Counterparts and Electronic Execution

### Step 4: Load Pricing Engine
Read `domain-references/finance/pricing-engine.md` for fee calculation:

**Implementation Fee Calculation:**
- Base fee determined by package tier and scope complexity
- Complexity factors: number of workflows, integrations, data sources, custom development
- Average implementation: ~2.5L (varies by scope)
- Minimum viable budget: 50K+

**Retainer Fee Determination:**
| Tier | Monthly Fee | What's Included |
|------|------------|-----------------|
| Starter | 15,000/month | Basic monitoring, N updates/month, email support |
| Growth | 40,000/month | Enhanced monitoring, priority support, regular optimizations |
| Enterprise | Custom | Dedicated support, SLA-backed, custom scope |

**Payment Schedule (Standard):**
- 50% on contract signing (advance)
- 25% at midpoint milestone
- 25% on project completion and acceptance

### Step 5: Load Service Configuration Matrix
Read `domain-references/sales/service-config-matrix.md` for deliverables mapping:
- Map selected services to specific deliverables
- Define acceptance criteria for each deliverable
- Identify out-of-scope items based on package tier
- Note any add-on services or upgrades discussed

### Step 6: Populate MSA
Generate the Master Service Agreement with:

**Preamble and Parties:**
```
MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into on [Effective Date]

BETWEEN:

LAYAA AI PRIVATE LIMITED, a company incorporated under the Companies Act, 2013,
having CIN: U62099HR2025PTC139528 and its registered office at [address]
(hereinafter referred to as "Service Provider" or "Layaa AI")

AND

[CLIENT LEGAL NAME], a [entity type] having [registration number] and its
registered office at [address]
(hereinafter referred to as "Client")

(Service Provider and Client are individually referred to as "Party"
and collectively as "Parties")
```

**Insert all standard clauses** from clause library, customized for:
- Client's industry (add sector-specific data protection provisions for fintech/healthcare)
- Engagement type (implementation vs. retainer vs. hybrid)
- Any non-standard terms agreed during negotiation (flag these for Founder review)

**Industry-Specific Addenda:**
- **Fintech clients:** Data localization addendum, PCI-DSS compliance provisions
- **Healthcare clients:** Health data handling addendum, patient consent provisions
- **Government clients:** Government procurement compliance addendum
- **E-commerce clients:** Consumer data protection addendum

### Step 7: Populate SoW
Generate the Statement of Work with:

**SoW Header:**
```
STATEMENT OF WORK
(Pursuant to the Master Service Agreement dated [MSA Date])

SoW Reference: [LAI-SOW-YYYY-MM-XXX]
Client: [Client Name]
Project Name: [Project Title]
Effective Date: [Date]
```

**Section 1: Project Background**
- Client business context
- Problem statement
- How this engagement addresses the problem

**Section 2: Scope of Services**
- Detailed description of services to be provided
- Methodology: Discovery → Assessment → Development → Validation → Enablement
- Specific deliverables with descriptions

**Section 3: Deliverables**
| # | Deliverable | Description | Acceptance Criteria | Target Date |
|---|------------|-------------|-------------------|-------------|
| 1 | [deliverable] | [description] | [criteria] | [date] |
| 2 | [deliverable] | [description] | [criteria] | [date] |

**Section 4: Timeline and Milestones**
| Phase | Milestone | Duration | Start Date | End Date |
|-------|-----------|----------|-----------|---------|
| Discovery | Kickoff + Requirements | [X weeks] | [date] | [date] |
| Assessment | Process Mapping + Gap Analysis | [X weeks] | [date] | [date] |
| Development | Build + Integration | [X weeks] | [date] | [date] |
| Validation | Testing + UAT | [X weeks] | [date] | [date] |
| Enablement | Training + Handover | [X weeks] | [date] | [date] |

**Section 5: Pricing and Payment**
- Implementation fee: [amount] + GST
- Monthly retainer: [amount]/month + GST (if applicable)
- Payment schedule:
  - 50% ([amount]) — on signing of this SoW
  - 25% ([amount]) — on completion of [midpoint milestone]
  - 25% ([amount]) — on project completion and acceptance
- Retainer commencement: [date — typically after implementation acceptance]
- Retainer billing: Monthly in advance, due within [15] days of invoice

**Section 6: Acceptance Criteria**
- Each deliverable subject to acceptance testing within [10] business days
- Client provides written acceptance or rejection with specific deficiencies
- Layaa AI addresses deficiencies within [5] business days
- Deemed accepted if no response within acceptance period

**Section 7: Assumptions and Dependencies**
- Client responsibilities (access, information, personnel availability, decisions)
- Technical assumptions (system access, API availability, data quality)
- Timeline assumptions (dependencies on third parties, client response times)

**Section 8: Out-of-Scope Items**
- Explicitly list items NOT included in this engagement
- Process for requesting additional scope (change order procedure)
- Pricing framework for change orders

**Section 9: Client Responsibilities**
- Designate a project sponsor and primary contact
- Provide timely access to systems, data, and personnel
- Review and provide feedback within agreed timelines
- Make decisions within agreed timelines
- Communicate any changes to business requirements promptly

### Step 8: Generate Contract IDs
Assign reference numbers:
- **MSA:** LAI-MSA-YYYY-MM-XXX (e.g., LAI-MSA-2026-03-001)
- **SoW:** LAI-SOW-YYYY-MM-XXX (e.g., LAI-SOW-2026-03-001)

Format: LAI-[TYPE]-[YEAR]-[MONTH]-[SEQUENCE]
- Sequence resets annually
- Check existing contract tracker for next available sequence number

### Step 9: Add Signature Pages
For both MSA and SoW:

```
IN WITNESS WHEREOF, the Parties have executed this [Agreement/Statement of Work]
as of the date first written above.

For and on behalf of                    For and on behalf of
LAYAA AI PRIVATE LIMITED                [CLIENT LEGAL NAME]


_________________________               _________________________
Name: [Abhimanyu Singh /                Name: [Client Signatory]
       Shubham Sharma]
Designation: Director                   Designation: [Title]
Date:                                   Date:
Place: Gurgaon                          Place: [City]
```

### Step 10: Flag Items for Founder Review
Create a review checklist for Founders:

**Automatic Founder review triggers:**
- [ ] Contract value > 10L implementation fee
- [ ] Non-standard pricing (below minimum or custom discounts)
- [ ] Non-standard terms (deviations from clause library)
- [ ] New ICP or industry not previously served
- [ ] Liability provisions exceeding standard caps
- [ ] Engagement duration > 12 months
- [ ] Client in regulated sector requiring addenda
- [ ] Any verbal commitments made during sales process not reflected in contract
- [ ] Payment terms deviating from 50/25/25 standard

## Output Format

```
# Client Agreement Package
**Client:** [Client Legal Name]
**Project:** [Project Name]
**Package Tier:** [Starter / Growth / Enterprise / Custom]
**Contract Value:** Implementation: [amount] | Retainer: [amount]/month
**Contract IDs:** MSA: [LAI-MSA-YYYY-MM-XXX] | SoW: [LAI-SOW-YYYY-MM-XXX]
**Prepared Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor]

## Cover Memo

### Engagement Summary
- **Client:** [name] — [industry] — [size]
- **ICP Match:** [category]
- **Services:** [brief list of services]
- **Timeline:** [start date] to [end date] ([duration])
- **Value:** [total implementation + annual retainer value]

### Items Requiring Founder Attention
- [ ] [Item — reason for review]
- [ ] [Item — reason for review]
- [ ] [Item — reason for review]

### Non-Standard Terms (if any)
| Term | Standard Position | Agreed Position | Reason |
|------|------------------|-----------------|--------|
| [term] | [standard] | [agreed] | [why deviation was accepted] |

### Regulatory Addenda
- [Addendum name — if applicable]

---

## Document 1: Master Service Agreement

[Full MSA text with all clauses populated]

---

## Document 2: Statement of Work

[Full SoW text with all sections populated]

---

## Execution Checklist
- [ ] MSA reviewed by Abhay (Legal & Contracts Advisor)
- [ ] Commercial terms approved by Founders
- [ ] SoW deliverables validated by Rohit (QA & Validation Specialist)
- [ ] Pricing confirmed by Veer (Pricing & Unit Economics Specialist)
- [ ] Non-standard terms approved by Founders (if any)
- [ ] Regulatory addenda reviewed by Preeti (if applicable)
- [ ] Client sent for review
- [ ] Client comments addressed
- [ ] Final version confirmed
- [ ] Signature pages prepared
- [ ] Contract IDs assigned
- [ ] Filed in contract repository
- [ ] Anne notified for compliance tracking
- [ ] Rishi notified for revenue tracking
- [ ] Yuvaan updated for pipeline management
```

## What Makes This Different from Generic Agreement Generation
- Uses Layaa AI's actual contract templates, clause library, and standard positions
- Calculates pricing from Layaa AI's pricing engine with real tier structures and rates
- Maps deliverables from Layaa AI's service configuration matrix
- Applies Layaa AI's methodology (Discovery → Assessment → Development → Validation → Enablement) as the project framework
- Includes Indian law provisions (GST, stamp duty, IT Act e-signatures, DPDP Act compliance)
- Generates contract IDs in Layaa AI's format (LAI-XXX-YYYY-MM-XXX)
- Populates correct Layaa AI entity details (CIN, PAN, registered address, authorized signatories)
- Routes review to Layaa AI's GPT workforce (Abhay for legal, Rohit for scope validation, Veer for pricing, Preeti for regulatory)
- Adds industry-specific addenda based on client's sector classification
- Flags Founder review triggers based on Layaa AI's governance thresholds
- Includes client responsibilities aligned with Layaa AI's delivery model
