---
name: review-contract
description: >
  Comprehensive review of contracts, agreements, and legal documents. Identifies risks,
  missing clauses, unfavorable terms, and provides negotiation recommendations.
  In Layaa AI mode, compares against clause library, applies risk indicators, and checks regulatory compliance.
  Trigger: "review contract", "contract review", "review agreement", "check contract", "contract analysis", "review terms"
  This skill replaces the generic legal:review-contract capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Review Contract

Comprehensive review of contracts, agreements, and legal documents. Performs clause-by-clause analysis against standard positions, identifies risks and missing protections, scores each clause area, and provides prioritized negotiation recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, client contracts, vendor agreements, partnership agreements, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/legal/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/clause-library.md — Standard clause positions for all 12+ clause areas
- domain-references/legal/risk-indicators.md — Risk scoring matrix and assessment framework
- domain-references/legal/contract-templates.md — Layaa AI standard contract structures
- domain-references/legal/regulatory-landscape.md — Regulatory requirements for contract compliance
Only load references relevant to the contract type being reviewed.

## Execution Steps

### Step 1: Read the Full Contract
1. Read the entire document end-to-end before beginning analysis
2. Note the document structure:
   - **Type:** MSA, SoW, NDA, License Agreement, Vendor Agreement, Partnership Agreement, Employment Agreement, other
   - **Parties:** Who are the contracting parties and what are their roles?
   - **Effective date and term**
   - **Governing law and jurisdiction**
   - **Total pages and sections**
3. Identify the **commercial context:**
   - Is Layaa AI the service provider or the client?
   - What services or products are covered?
   - What is the contract value?
   - Is this a new relationship or renewal/amendment?

### Step 2: Load Clause Library and Risk Framework (Layaa AI Mode)
1. Read `domain-references/legal/clause-library.md` for Layaa AI's standard positions on each clause area
2. Read `domain-references/legal/risk-indicators.md` for the scoring framework
3. Read `domain-references/legal/contract-templates.md` for structural comparison
4. Read `domain-references/legal/regulatory-landscape.md` for industry-specific compliance requirements

### Step 3: Check Each Clause Area Against Standards
Perform systematic review across all clause areas:

**1. Scope of Services / Scope of Work**
- [ ] Services clearly defined with measurable deliverables
- [ ] Out-of-scope items explicitly stated
- [ ] Change order process defined
- [ ] Acceptance criteria specified
- [ ] Timeline and milestones documented
- **Risk if missing:** Scope creep, disputes over deliverables, payment withholding

**2. Intellectual Property**
- [ ] IP ownership clearly assigned (pre-existing IP vs. newly created)
- [ ] License grants appropriately scoped
- [ ] Open-source compliance addressed
- [ ] Background IP protected
- [ ] Work-for-hire provisions clear (if applicable)
- [ ] Layaa AI retains right to reuse methodologies and frameworks
- **Risk if missing:** IP disputes, loss of reusable assets, infringement claims

**3. Confidentiality**
- [ ] Confidential information defined with appropriate scope
- [ ] Mutual obligations (not one-sided)
- [ ] Carve-outs present (public domain, independent development, compelled disclosure)
- [ ] Term and survival period reasonable
- [ ] Return/destruction obligations on termination
- **Risk if missing:** Trade secret exposure, unlimited obligation period

**4. Payment Terms**
- [ ] Payment amounts and schedule clearly stated
- [ ] Currency specified
- [ ] Tax treatment clear (GST, TDS)
- [ ] Late payment consequences defined
- [ ] Invoicing process specified
- [ ] Payment milestones tied to deliverables
- [ ] Expense reimbursement terms (if applicable)
- **Layaa AI standard:** 50% on signing, 25% at midpoint, 25% on completion
- **Risk if missing:** Cash flow issues, disputes over payment triggers

**5. Limitation of Liability**
- [ ] Cap on total liability (preferred: contract value for 12 months)
- [ ] Exclusion of consequential, indirect, punitive damages
- [ ] Carve-outs from the cap (IP infringement, confidentiality breach, willful misconduct)
- [ ] Mutual limitation (not one-sided)
- **Red flags:** Unlimited liability, liability > 2x contract value, one-sided caps
- **Risk if missing:** Existential financial exposure

**6. Indemnification**
- [ ] Indemnification obligations clearly defined
- [ ] Trigger events specified (IP infringement, breach, negligence)
- [ ] Procedure for claiming indemnification (notice, defense control, settlement approval)
- [ ] Reciprocal indemnification (not one-sided)
- [ ] Cap aligned with liability limitation
- **Red flags:** Broad indemnification triggers, no cap, no notice requirements
- **Risk if missing:** Uncapped exposure for third-party claims

**7. Termination**
- [ ] Termination for cause with cure period (30 days standard)
- [ ] Termination for convenience with notice period (60-90 days)
- [ ] Effects of termination clearly stated
- [ ] Transition assistance obligations
- [ ] Payment for work completed prior to termination
- [ ] Survival of relevant clauses post-termination
- **Red flags:** No cure period, immediate termination rights, no payment for completed work
- **Risk if missing:** Abrupt termination without compensation

**8. Data Protection**
- [ ] Data processing obligations defined (controller/processor roles)
- [ ] Personal data categories and processing purposes specified
- [ ] Security measures required
- [ ] Data breach notification obligations
- [ ] Data retention and deletion requirements
- [ ] Cross-border transfer provisions (if applicable)
- [ ] DPDP Act 2023 compliance (for Indian contracts)
- [ ] Subprocessor restrictions
- **Risk if missing:** Regulatory penalty exposure, data breach liability

**9. Force Majeure**
- [ ] Force majeure events defined
- [ ] Notification obligations specified
- [ ] Mitigation obligations included
- [ ] Prolonged force majeure termination right (90+ days)
- [ ] Payment obligations during force majeure period
- **Post-COVID check:** Does the definition include pandemics, government-ordered shutdowns?
- **Risk if missing:** Liability for non-performance beyond control

**10. Dispute Resolution**
- [ ] Governing law specified (preferred: Indian law)
- [ ] Jurisdiction specified (preferred: courts at Gurgaon/Delhi)
- [ ] Escalation mechanism (good faith negotiation → mediation → arbitration/litigation)
- [ ] Arbitration provisions if applicable (seat, rules, number of arbitrators, language)
- [ ] Interim relief rights preserved
- **Red flags:** Foreign jurisdiction, mandatory foreign arbitration, waiver of injunctive relief
- **Risk if missing:** Expensive or impractical dispute resolution

**11. Warranty**
- [ ] Warranty scope defined (services performed in professional manner)
- [ ] Warranty period specified
- [ ] Warranty remedies defined (re-performance, credit, refund)
- [ ] Disclaimer of implied warranties
- [ ] Warranty exclusions (misuse, unauthorized modification)
- **Risk if missing:** Unlimited warranty obligations, expectation gaps

**12. Non-Solicitation**
- [ ] Non-solicitation of employees (not non-compete of business)
- [ ] Duration reasonable (12-18 months)
- [ ] Mutual obligation
- [ ] Carve-out for general advertisements
- **Red flags:** Non-compete clause disguised as non-solicitation, perpetual term
- **Risk if missing:** Key employee poaching risk

### Step 4: Apply Risk Indicator Matrix
Score each clause area:

| Score | Rating | Definition |
|-------|--------|-----------|
| 1 | GREEN | Aligned with Layaa AI standard or better |
| 2 | YELLOW | Minor deviations, acceptable with awareness |
| 3 | ORANGE | Significant deviations, negotiate if possible |
| 4 | RED | Unacceptable terms, must be changed before signing |
| 5 | BLACK | Deal-breaker, reject if not amended |

### Step 5: Identify Missing Clauses
Check for clauses that should be present but are absent:
- [ ] Scope definition / SoW reference
- [ ] IP ownership
- [ ] Confidentiality
- [ ] Data protection
- [ ] Payment terms
- [ ] Liability limitation
- [ ] Indemnification
- [ ] Termination
- [ ] Force majeure
- [ ] Dispute resolution
- [ ] Warranty
- [ ] Non-solicitation
- [ ] Assignment
- [ ] Notices
- [ ] Entire agreement / integration clause
- [ ] Amendment procedure
- [ ] Severability
- [ ] Waiver
- [ ] Counterparts

Score each missing clause by importance (CRITICAL / HIGH / MEDIUM / LOW).

### Step 6: Flag Non-Negotiable Deviations vs. Acceptable Variations
Categorize all findings:

**Non-Negotiable (must be changed):**
- Unlimited liability for Layaa AI
- One-sided IP assignment to counterparty with no residual rights
- Foreign jurisdiction with no Indian courts option
- No termination rights for Layaa AI
- Data processing without adequate protection

**Strongly Preferred (negotiate, accept if necessary):**
- Specific liability cap amount (prefer 12-month contract value)
- Specific payment schedule (prefer 50/25/25)
- Cure period duration (prefer 30 days)
- Non-solicitation term (prefer 12 months)

**Flexible (acceptable range):**
- Notice periods (30-90 days acceptable)
- Warranty period (3-12 months acceptable)
- Force majeure definition variations
- Governing law (Indian law preferred, but specific state acceptable)

### Step 7: Run Contract Risk Decision Tree
**Overall Contract Risk Assessment:**

```
1. Are there any BLACK (score 5) clause areas?
   YES → DO NOT SIGN without amendment. Escalate to Founders.
   NO → Continue.

2. Are there more than 2 RED (score 4) clause areas?
   YES → HIGH RISK. Negotiate all RED items before signing. Founder approval required.
   NO → Continue.

3. Are there missing CRITICAL clauses?
   YES → Add missing clauses before signing. Flag to counterparty.
   NO → Continue.

4. Total risk score across all areas:
   12-24 (all GREEN/YELLOW) → LOW RISK. Proceed with standard approval.
   25-36 (mostly YELLOW/ORANGE) → MEDIUM RISK. Negotiate ORANGE items, document accepted risks.
   37-48 (ORANGE/RED heavy) → HIGH RISK. Significant negotiation needed. Founder review required.
   49-60 (RED/BLACK heavy) → CRITICAL RISK. Consider walking away or complete renegotiation.
```

### Step 8: Generate Negotiation Recommendations
Prioritize changes into three tiers:

**Tier 1 — Must Change (Block Signing):**
- Items scored RED or BLACK
- Missing CRITICAL clauses
- Non-negotiable deviations
- Include specific alternative language

**Tier 2 — Should Change (Negotiate):**
- Items scored ORANGE
- Missing HIGH-priority clauses
- Strongly preferred positions
- Include preferred and fallback language

**Tier 3 — Nice to Change (Request):**
- Items scored YELLOW with room for improvement
- Minor formatting or structural issues
- Best practice additions
- Include as requests, not demands

### Step 9: Check Regulatory Compliance (Layaa AI Mode)
Based on the counterparty's industry:
- **Fintech clients:** RBI data localization, payment data handling restrictions
- **Healthcare clients:** Patient data requirements, medical device regulations
- **Government clients:** Procurement rules, RTI implications, security requirements
- **E-commerce clients:** Consumer protection compliance, FDI rules
- **General:** GST implications, TDS on service payments, stamp duty

Flag any regulatory compliance gaps in the contract.

## Output Format

```
# Contract Review Report
**Document:** [contract title and version]
**Parties:** [Party A] & [Party B]
**Contract Type:** [MSA / SoW / NDA / etc.]
**Contract Value:** [value]
**Term:** [duration]
**Review Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]
**Classification:** CONFIDENTIAL

## Executive Summary
- **Overall Risk Rating:** [LOW / MEDIUM / HIGH / CRITICAL]
- **Total Risk Score:** [X] / 60
- **Non-Negotiable Issues:** [count]
- **Missing Clauses:** [count critical + high]
- **Recommendation:** [Sign as-is / Negotiate and sign / Major renegotiation needed / Do not sign]
- **Key Concern:** [single most important issue in one sentence]

## Clause-by-Clause Analysis

| # | Clause Area | Present | Risk Score | Rating | Key Finding |
|---|------------|---------|-----------|--------|-------------|
| 1 | Scope | [Y/N] | [1-5] | [color] | [one-line finding] |
| 2 | IP | [Y/N] | [1-5] | [color] | [one-line finding] |
| 3 | Confidentiality | [Y/N] | [1-5] | [color] | [one-line finding] |
| 4 | Payment | [Y/N] | [1-5] | [color] | [one-line finding] |
| 5 | Liability | [Y/N] | [1-5] | [color] | [one-line finding] |
| 6 | Indemnification | [Y/N] | [1-5] | [color] | [one-line finding] |
| 7 | Termination | [Y/N] | [1-5] | [color] | [one-line finding] |
| 8 | Data Protection | [Y/N] | [1-5] | [color] | [one-line finding] |
| 9 | Force Majeure | [Y/N] | [1-5] | [color] | [one-line finding] |
| 10 | Dispute Resolution | [Y/N] | [1-5] | [color] | [one-line finding] |
| 11 | Warranty | [Y/N] | [1-5] | [color] | [one-line finding] |
| 12 | Non-Solicitation | [Y/N] | [1-5] | [color] | [one-line finding] |
| **TOTAL** | — | — | **[sum]** | — | — |

## Detailed Findings

### RED / BLACK Items (Must Address)
#### [Clause Area] — Score: [X] / [Rating]
- **Contract says:** [quote or paraphrase the problematic provision]
- **Layaa AI standard:** [what our position should be]
- **Risk:** [specific risk this creates]
- **Recommended language:** [specific alternative wording]

### ORANGE Items (Should Negotiate)
#### [Clause Area] — Score: [X] / [Rating]
- **Contract says:** [current provision]
- **Preferred position:** [what we want]
- **Fallback position:** [minimum acceptable]
- **Risk if accepted as-is:** [what we're accepting]

### Missing Clauses
| Clause | Importance | Recommended Action |
|--------|-----------|-------------------|
| [clause] | CRITICAL | Must be added before signing |
| [clause] | HIGH | Should be added |
| [clause] | MEDIUM | Request addition |

## Negotiation Priorities

### Tier 1 — Must Change (Block Signing)
1. **[Issue]:** Change [current] to [proposed]. Reason: [why].
2. **[Issue]:** Add [clause]. Reason: [why].

### Tier 2 — Should Change (Negotiate)
1. **[Issue]:** Prefer [position], accept [fallback]. Reason: [why].
2. **[Issue]:** Prefer [position], accept [fallback]. Reason: [why].

### Tier 3 — Nice to Change (Request)
1. **[Issue]:** Request [change]. Low priority.

## Regulatory Compliance (if applicable)
- **Industry:** [counterparty's industry]
- **Regulatory concerns:** [specific compliance gaps in the contract]
- **Required additions:** [provisions needed for regulatory compliance]

## Risk Decision Tree Result
```
[Show the decision tree path taken and result]
```

## Recommendation
**[Sign as-is / Negotiate / Major renegotiation / Do not sign]**

**Rationale:** [2-3 sentences explaining the recommendation]

**Next Steps:**
1. [Specific action]
2. [Specific action]
3. [Specific action]

## Escalation
- [ ] Founder review required — [reason]
- [ ] External counsel recommended — [reason]
- [ ] Cross-GPT coordination — [Preeti for data/regulatory, Anne for compliance calendar]
```

## What Makes This Different from Generic Contract Reviews
- Compares every clause against Layaa AI's specific clause library, not generic best practices
- Applies risk scoring calibrated to Layaa AI's risk tolerance and deal sizes
- Checks for Layaa AI's standard payment structure (50/25/25) and methodology references
- Verifies IP provisions protect Layaa AI's right to reuse frameworks and methodologies across clients
- Includes Indian regulatory compliance checks (DPDP Act, IT Act, GST, stamp duty)
- Maps negotiation authority to Layaa AI's governance hierarchy
- Considers Layaa AI's specific position as service provider to SMEs in regulated sectors
- Flags non-solicitation clauses that could restrict Layaa AI's ability to serve ICP segments
