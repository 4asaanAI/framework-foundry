---
name: triage-nda
description: >
  Review, triage, and draft Non-Disclosure Agreements. Identifies risks in incoming NDAs
  and generates Layaa AI standard NDAs for outbound use. Compares terms against standard
  positions and flags deviations.
  Trigger: "NDA", "non-disclosure", "confidentiality agreement", "review NDA", "draft NDA", "NDA review", "mutual NDA"
  This skill replaces the generic legal:triage-nda capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Triage NDA

Review, triage, and draft Non-Disclosure Agreements. For incoming NDAs, identifies risks and deviations from standard terms. For outbound NDAs, generates Layaa AI standard NDAs customized for the specific engagement.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, client NDA, vendor NDA, partner NDA, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/legal/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/clause-library.md — Clause 3 (Confidentiality) for standard NDA positions
- domain-references/legal/contract-templates.md — NDA template for outbound drafting
- domain-references/legal/risk-indicators.md — Risk scoring for NDA clause deviations
Only load references relevant to the direction (review vs. draft).

## Execution Steps

### Step 1: Determine Direction
Ask or determine:
- **Reviewing incoming NDA:** A counterparty has sent an NDA for Layaa AI to sign
- **Drafting outbound NDA:** Layaa AI needs to send an NDA to a counterparty

Also collect:
- **Counterparty:** Name, type (client, vendor, partner, investor, employee)
- **Purpose:** What engagement will the NDA cover?
- **Direction of disclosure:** Mutual, one-way (Layaa disclosing), or one-way (counterparty disclosing)
- **Sensitive information involved:** Types of confidential information to be shared
- **Timeline:** When is the NDA needed by?
- **Any specific concerns or requirements** from either party

---

### If Reviewing Incoming NDA:

### Step 2a: Compare Against Layaa AI Standard Terms
Read the incoming NDA and compare each key term against Layaa AI's standard positions:

| Term | Layaa AI Standard | What to Check |
|------|------------------|---------------|
| **Parties** | Correct legal entity names, authorized signatories | Verify Layaa AI entity name is correct (Layaa AI Private Limited) |
| **Definition of Confidential Information** | Broad but reasonable, with clear carve-outs | Too broad (captures everything), too narrow (misses key categories) |
| **Obligations** | Mutual, reasonable standard of care | One-sided obligations, "best efforts" vs. "reasonable efforts" |
| **Carve-Outs** | Public domain, independent development, prior knowledge, compelled disclosure | Missing carve-outs, especially compelled disclosure |
| **Term** | 2 years from effective date | Perpetual NDAs, excessively long terms (> 3 years) |
| **Survival Period** | 3 years after termination | Indefinite survival, mismatched with term |
| **Permitted Disclosures** | Employees, advisors, contractors on need-to-know basis | Too restrictive (no contractor access), too broad (unlimited sharing) |
| **Return/Destruction** | Return or destroy on request, certify destruction | No destruction option, unreasonable timeline |
| **Remedies** | Injunctive relief acknowledged, no liquidated damages | Excessive liquidated damages, penalty clauses |
| **Non-Solicitation** | Not standard in NDA (separate agreement) | Embedded non-solicit or non-compete clauses |
| **Residuals Clause** | Preferred (retained knowledge in unaided memory) | Absence of residuals clause when needed |
| **Governing Law** | Indian law, courts at [Gurgaon/Delhi] | Foreign jurisdiction, inconvenient forum |
| **Assignment** | Not assignable without consent | Silent on assignment (risk of NDA transferring) |

### Step 3a: Flag Deviations
For each deviation from standard, classify:

| Severity | Examples | Action |
|----------|---------|--------|
| **CRITICAL** | One-sided obligations favoring counterparty only; perpetual term with no exit; foreign jurisdiction with no Indian courts option; embedded non-compete | Reject or counter with Layaa AI standard |
| **HIGH** | Excessively broad confidential information definition; no compelled disclosure carve-out; liquidated damages > 10L; no residuals clause for technical engagement | Negotiate specific changes |
| **MEDIUM** | Survival period > 5 years; limited permitted disclosures; destruction-only (no return option); short notice period | Negotiate if practical, accept if minor |
| **LOW** | Minor drafting differences; different formatting; additional but reasonable provisions | Accept as-is |

### Step 4a: Score Risk and Recommend
Using risk indicators framework:

**NDA Risk Score:**
- Count CRITICAL deviations: each scores 4 points
- Count HIGH deviations: each scores 3 points
- Count MEDIUM deviations: each scores 2 points
- Count LOW deviations: each scores 1 point

**Recommendation:**
| Total Score | Recommendation |
|------------|---------------|
| 0-5 | **Accept as-is** — minor deviations only |
| 6-10 | **Negotiate specific terms** — mark up and return |
| 11-15 | **Counter with Layaa AI standard NDA** — too many deviations to negotiate individually |
| 16+ | **Reject and escalate** — fundamental issues, Founder review needed |

---

### If Drafting Outbound NDA:

### Step 2b: Load NDA Template (Layaa AI Mode)
1. Read `domain-references/legal/contract-templates.md` for the standard NDA template
2. Read `domain-references/legal/clause-library.md` Clause 3 for confidentiality provisions

### Step 3b: Customize Party Details
Populate the NDA with:
- **Disclosing Party / Receiving Party** (or mutual)
- **Layaa AI details:**
  - Layaa AI Private Limited
  - CIN: U62099HR2025PTC139528
  - Registered office address
  - Authorized signatory: Abhimanyu Singh (Director) or Shubham Sharma (Director)
- **Counterparty details:** Name, entity type, address, signatory
- **Effective date**

### Step 4b: Customize Confidential Information Categories
Based on the engagement purpose, specify categories:

**For Client Engagements:**
- Business processes, workflows, and operational data
- Customer data and user information
- Financial information and pricing
- Technology stack and system architecture
- Proprietary methodologies and trade secrets

**For Vendor/Partner Engagements:**
- Technical specifications and API documentation
- Integration architecture and data flows
- Pricing and commercial terms
- Product roadmap and feature plans

**For Investor Engagements:**
- Financial statements and projections
- Cap table and shareholder information
- Business plans and strategic documents
- Client list and pipeline data

### Step 5b: Apply Standard Terms
Insert standard clauses:
- **Term:** 2 years from effective date
- **Survival:** 3 years after expiration or termination
- **Obligations:** Mutual, reasonable standard of care
- **Carve-outs:** Public domain, independent development, prior knowledge, judicial/regulatory compulsion
- **Permitted disclosures:** Employees, advisors, contractors on need-to-know, bound by similar obligations
- **Residuals:** Retained knowledge in unaided memory (for technical engagements)
- **Return/Destruction:** Within 30 days of written request, with certification
- **Remedies:** Injunctive relief acknowledged, no liquidated damages
- **Governing law:** Laws of India, courts at Gurgaon/Delhi
- **No implied license:** NDA does not grant IP rights
- **Assignment:** Not assignable without prior written consent

### Step 6b: Generate Markup Summary
Provide a summary of any customizations made to the standard template.

## Output Format

### For Incoming NDA Review:

```
# NDA Review Report
**Counterparty:** [name]
**NDA Type:** [Mutual / One-way (Layaa disclosing) / One-way (counterparty disclosing)]
**Date Received:** [date]
**Review Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]

## Summary
- **Overall Risk Score:** [number] / [category]
- **Recommendation:** [Accept as-is / Negotiate / Counter with standard / Reject]
- **CRITICAL Deviations:** [count]
- **HIGH Deviations:** [count]
- **Key Concerns:** [top 2-3 issues in one line each]

## Term-by-Term Analysis
| # | Term | Standard Position | Incoming Position | Deviation | Severity |
|---|------|------------------|------------------|-----------|----------|
| 1 | Parties | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 2 | Definition | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 3 | Obligations | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 4 | Carve-outs | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 5 | Term | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 6 | Survival | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 7 | Permitted Disclosures | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 8 | Return/Destruction | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 9 | Remedies | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |
| 10 | Governing Law | [standard] | [incoming] | [deviation or "Aligned"] | [severity] |

## Deviations Requiring Action
### CRITICAL
- **[Term]:** [what the deviation is and why it's critical]
  - **Required change:** [specific language to request]

### HIGH
- **[Term]:** [deviation and concern]
  - **Required change:** [specific language]

### MEDIUM
- **[Term]:** [deviation]
  - **Preferred change:** [language, or note if acceptable]

## Recommended Response
[Accept as-is / Send markup with changes below / Counter with Layaa AI standard NDA / Reject and escalate]

**Markup Summary (if negotiating):**
1. [Clause X: change from Y to Z]
2. [Clause X: add provision for Y]
3. [Clause X: delete provision Y]

## Escalation
- [ ] Founder review required — [reason, if applicable]
- [ ] External counsel recommended — [reason, if applicable]
```

### For Outbound NDA Draft:

```
# NDA — Layaa AI Private Limited & [Counterparty Name]
**Type:** [Mutual / One-way]
**Purpose:** [engagement description]
**Effective Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]

---

[Full NDA text with all clauses populated]

---

## Cover Note
- **Customizations from standard template:** [list any deviations]
- **Confidential information categories:** [summary of what's covered]
- **Signatory for Layaa AI:** [Abhimanyu Singh / Shubham Sharma], Director
- **Next steps:** [send to counterparty for review / Founder review first]
```

## What Makes This Different from Generic NDA Skills
- Pre-loaded with Layaa AI's standard NDA positions (2-year term, 3-year survival, mutual obligations, Indian jurisdiction)
- Compares incoming NDAs against Layaa AI's clause library rather than generic "best practices"
- Risk scoring calibrated to Layaa AI's risk tolerance and deal sizes
- Populates outbound NDAs with correct Layaa AI entity details (CIN, registered address, authorized signatories)
- Customizes confidential information categories based on Layaa AI engagement types (client, vendor, partner, investor)
- Includes residuals clause for technical engagements where Layaa AI developers access client systems
- Flags non-solicitation and non-compete clauses that could restrict Layaa AI's ability to serve other clients in the same ICP
