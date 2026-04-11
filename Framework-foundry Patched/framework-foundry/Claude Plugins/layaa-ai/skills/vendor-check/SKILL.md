---
name: vendor-check
description: >
  Evaluate vendors, partners, and third-party service providers for legal, compliance, and business risk.
  Reviews contracts, certifications, reputation, and data handling practices.
  In Layaa AI mode, applies compliance red flags checklist and service vertical context.
  Trigger: "vendor check", "vendor assessment", "vendor evaluation", "vendor risk", "third party risk", "supplier review", "partner evaluation"
  This skill replaces the generic legal:vendor-check capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Vendor Check

Evaluate vendors, partners, and third-party service providers for legal, compliance, and business risk. Reviews contracts, certifications, reputation, and data handling practices to produce a scored recommendation.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, evaluating tools/platforms for Layaa AI projects (n8n, Make, Zapier, Relevance AI, cloud providers), client delivery vendors, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/risk-indicators.md — Risk scoring matrix and threshold values
- domain-references/legal/compliance-red-flags.md — Red flags checklist applicable to vendor evaluation
- shared-references/service-verticals.md — Layaa AI's service offerings and technology dependencies
Only load references relevant to the vendor type being assessed.

## Execution Steps

### Step 1: Identify Vendor and Services Being Evaluated
Collect or ask for:
- **Vendor name** and website
- **Services/products being procured:** What will the vendor provide?
- **Engagement type:** One-time purchase, ongoing subscription, project-based, reseller, white-label
- **Estimated contract value:** Annual or total commitment
- **Data access:** Will the vendor access, process, or store Layaa AI or client data?
- **Client-facing:** Will the vendor's services be visible to or used by Layaa AI's clients?
- **Criticality:** How dependent will Layaa AI be on this vendor? (single point of failure?)
- **Alternatives:** Are there alternative vendors being considered?

### Step 2: Research Vendor Background
Using WebSearch and WebFetch:

**Company Profile:**
- Legal entity name, incorporation details, jurisdiction
- Year founded, company size, funding history
- Key leadership and founders
- Office locations and operational presence

**Reputation and Track Record:**
- Customer reviews and ratings (G2, Capterra, Trustpilot, Google Reviews)
- Industry recognition, awards, certifications
- Case studies or published client references
- Media coverage (positive and negative)
- Glassdoor/employee reviews (retention and culture signals)

**Legal and Compliance History:**
- Past or pending litigation (search court records, legal databases)
- Regulatory actions, fines, or sanctions
- Data breaches or security incidents (reported publicly)
- Product recalls or service failures
- Bankruptcy or financial distress indicators

**Financial Health:**
- Revenue indicators (if public or disclosed)
- Funding status (bootstrapped, VC-backed, PE-owned)
- Profitability signals (growing, burning cash, sustainable)
- Customer concentration risk (depends on few large clients?)

### Step 3: Apply Compliance Red Flags (Layaa AI Mode)
Review the vendor against Layaa AI's compliance red flags checklist:

**Entity Red Flags:**
- [ ] No clear legal entity or incorporation details
- [ ] Registered in a jurisdiction with weak regulatory oversight
- [ ] Shell company indicators (no real office, no employees)
- [ ] Frequent entity name changes or restructuring
- [ ] Directors/officers associated with blacklisted entities

**Operational Red Flags:**
- [ ] No published terms of service or privacy policy
- [ ] Unclear data handling practices
- [ ] No SLA or uptime commitments
- [ ] No customer support channels
- [ ] Resistance to due diligence or transparency requests

**Financial Red Flags:**
- [ ] Pricing significantly below market rate (unsustainable)
- [ ] Demands full payment upfront with no escrow
- [ ] No standard invoicing or receipt process
- [ ] No clear refund or cancellation policy

**Compliance Red Flags:**
- [ ] No data protection policy or DPDP Act compliance
- [ ] No SOC 2, ISO 27001, or equivalent security certification
- [ ] Stores data outside India without adequate safeguards
- [ ] No contractual commitment to compliance obligations
- [ ] History of regulatory non-compliance

### Step 4: Review Vendor Contract Terms
If a vendor contract or terms of service are available, review:

**Critical Contract Areas:**
| Area | What to Check | Risk Indicator |
|------|--------------|---------------|
| **Scope** | Clear description of services, exclusions | Vague scope = scope creep risk |
| **Pricing** | Transparent pricing, hidden fees, auto-renewal | Lock-in risk, cost escalation |
| **Data Protection** | Data processing agreement, security measures | Breach liability, regulatory exposure |
| **IP Ownership** | Who owns output, derivative works, customizations | IP leakage risk |
| **Liability** | Limitation caps, exclusions, indemnification | Disproportionate risk allocation |
| **SLA** | Uptime guarantees, response times, remedies | Service disruption risk |
| **Termination** | Notice period, data portability, transition support | Vendor lock-in risk |
| **Confidentiality** | NDA provisions, survival period, carve-outs | Information leakage risk |
| **Subcontracting** | Right to subcontract, subcontractor oversight | Loss of control, quality risk |
| **Dispute Resolution** | Jurisdiction, arbitration, governing law | Enforcement difficulty |

**For Layaa AI:** Compare each area against standards in `domain-references/legal/risk-indicators.md`.

### Step 5: Assess Data Protection Compliance
If the vendor will handle personal data (Layaa AI's, employees', or clients'):

1. **Lawful basis:** Does the vendor have a lawful basis for processing?
2. **Data processing agreement:** Is a DPA in place or offered?
3. **Security measures:** What technical and organizational measures are in place?
4. **Data location:** Where is data stored and processed? India/abroad?
5. **Subprocessors:** Does the vendor use subprocessors? Are they disclosed?
6. **Breach notification:** What is the vendor's breach notification process and timeline?
7. **Data retention:** How long does the vendor retain data? Can it be deleted on request?
8. **Data portability:** Can data be exported in standard formats on termination?
9. **Certifications:** SOC 2, ISO 27001, HIPAA (if applicable), PCI-DSS (if payment data)
10. **DPDP Act compliance:** Has the vendor addressed India's DPDP Act 2023 requirements?

### Step 6: Check for Conflicts of Interest
1. Does the vendor serve any of Layaa AI's direct competitors?
2. Does the vendor have ownership or investment ties to competitors?
3. Could the vendor use Layaa AI's data or methodology to benefit competitors?
4. Are there any personal relationships between vendor personnel and Layaa AI team that should be disclosed?
5. Does engagement with this vendor create any exclusivity concerns?

### Step 7: Score Vendor on Risk Dimensions
Rate each dimension on a 1-5 scale (1 = lowest risk, 5 = highest risk):

| Dimension | Score (1-5) | Weight | Weighted Score | Notes |
|-----------|------------|--------|---------------|-------|
| **Legal Entity Risk** | [score] | 15% | [weighted] | [key findings] |
| **Financial Stability** | [score] | 15% | [weighted] | [key findings] |
| **Operational Capability** | [score] | 20% | [weighted] | [key findings] |
| **Data Protection** | [score] | 20% | [weighted] | [key findings] |
| **Contract Terms** | [score] | 15% | [weighted] | [key findings] |
| **Reputational Risk** | [score] | 10% | [weighted] | [key findings] |
| **Conflict of Interest** | [score] | 5% | [weighted] | [key findings] |
| **TOTAL** | — | 100% | [total] | — |

**Overall Rating:**
| Weighted Score | Rating | Recommendation |
|---------------|--------|---------------|
| 1.0 - 1.5 | EXCELLENT | Approve — low risk vendor |
| 1.6 - 2.5 | GOOD | Approve — standard monitoring |
| 2.6 - 3.5 | ACCEPTABLE | Approve with conditions — enhanced monitoring |
| 3.6 - 4.0 | MARGINAL | Approve only if no alternatives, with strict conditions |
| 4.1 - 5.0 | UNACCEPTABLE | Reject — risk too high |

### Step 8: Provide Recommendation
Based on the overall assessment:

**APPROVE:**
- Overall rating is EXCELLENT or GOOD
- No CRITICAL findings in any dimension
- Contract terms are acceptable or negotiable

**APPROVE WITH CONDITIONS:**
- Overall rating is ACCEPTABLE
- Specific conditions must be met before engagement:
  - Contract amendments required
  - Additional security measures needed
  - DPA must be executed
  - Specific certifications required
- Enhanced monitoring during engagement

**REJECT:**
- Overall rating is MARGINAL or UNACCEPTABLE
- CRITICAL findings that cannot be mitigated
- Unacceptable contract terms with no willingness to negotiate
- Recommend alternative vendors if available

## Output Format

```
# Vendor Assessment Report
**Vendor:** [vendor name]
**Website:** [URL]
**Assessment Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]
**Classification:** CONFIDENTIAL
**Services Evaluated:** [brief description of what is being procured]

## Executive Summary
- **Overall Rating:** [EXCELLENT / GOOD / ACCEPTABLE / MARGINAL / UNACCEPTABLE]
- **Recommendation:** [APPROVE / APPROVE WITH CONDITIONS / REJECT]
- **Key Strengths:** [top 2-3 positive findings]
- **Key Concerns:** [top 2-3 risk findings]
- **Estimated Contract Value:** [annual/total]

## Vendor Profile
- **Legal Entity:** [full legal name]
- **Incorporation:** [jurisdiction, year, entity type]
- **Size:** [employees, revenue indicators]
- **Funding:** [bootstrapped/VC/PE, last round if applicable]
- **Key Leadership:** [CEO/Founder names]
- **Locations:** [offices, data centers]

## Background Research Findings
### Reputation
[Summary of reviews, ratings, media coverage]

### Legal History
[Summary of litigation, regulatory actions, incidents]

### Financial Health
[Summary of financial stability indicators]

## Red Flags Assessment
| Category | Flags Triggered | Severity | Details |
|----------|----------------|----------|---------|
| Entity | [count] / [total] | [severity] | [key flags] |
| Operational | [count] / [total] | [severity] | [key flags] |
| Financial | [count] / [total] | [severity] | [key flags] |
| Compliance | [count] / [total] | [severity] | [key flags] |

## Contract Review
| Clause Area | Status | Risk Level | Notes |
|------------|--------|-----------|-------|
| Scope | [Acceptable/Concerning/Unacceptable] | [LOW/MED/HIGH] | [notes] |
| Pricing | [status] | [risk] | [notes] |
| Data Protection | [status] | [risk] | [notes] |
| IP Ownership | [status] | [risk] | [notes] |
| Liability | [status] | [risk] | [notes] |
| SLA | [status] | [risk] | [notes] |
| Termination | [status] | [risk] | [notes] |

## Data Protection Assessment
- **Data Handled:** [types of data the vendor will access]
- **DPA Status:** [in place / offered / not available]
- **Data Location:** [country/region]
- **Certifications:** [SOC 2, ISO 27001, etc.]
- **DPDP Act Compliance:** [assessment]
- **Risk Rating:** [LOW / MEDIUM / HIGH / CRITICAL]

## Risk Scoring
| Dimension | Score (1-5) | Weight | Weighted | Key Finding |
|-----------|------------|--------|----------|------------|
| Legal Entity | [score] | 15% | [weighted] | [finding] |
| Financial Stability | [score] | 15% | [weighted] | [finding] |
| Operational Capability | [score] | 20% | [weighted] | [finding] |
| Data Protection | [score] | 20% | [weighted] | [finding] |
| Contract Terms | [score] | 15% | [weighted] | [finding] |
| Reputational | [score] | 10% | [weighted] | [finding] |
| Conflict of Interest | [score] | 5% | [weighted] | [finding] |
| **TOTAL** | — | **100%** | **[total]** | — |

## Recommendation: [APPROVE / APPROVE WITH CONDITIONS / REJECT]

**Rationale:** [2-3 sentences explaining the recommendation]

### Conditions (if applicable)
1. [ ] [Condition that must be met before engagement]
2. [ ] [Condition that must be met before engagement]
3. [ ] [Ongoing monitoring requirement]

### Contract Negotiation Points
| Priority | Issue | Current Position | Required Position |
|----------|-------|-----------------|------------------|
| MUST | [issue] | [vendor's term] | [our requirement] |
| SHOULD | [issue] | [vendor's term] | [preferred term] |
| NICE | [issue] | [vendor's term] | [preferred term] |

### Alternative Vendors (if REJECT)
| Vendor | Estimated Rating | Notes |
|--------|-----------------|-------|
| [alternative 1] | [expected rating] | [brief note] |
| [alternative 2] | [expected rating] | [brief note] |

## Approvals
- [ ] Assessment by: [name/role]
- [ ] Reviewed by: [Kabir — if contract value > threshold]
- [ ] Approved by: [Founders — if MARGINAL rating or value > 5L]
```

## What Makes This Different from Generic Vendor Checks
- Applies Layaa AI's compliance red flags checklist specifically designed for technology service vendor evaluation
- Evaluates vendor compatibility with Layaa AI's technology stack (n8n, Make, Relevance AI, cloud providers)
- Considers data protection under India's DPDP Act 2023, not just GDPR
- Assesses whether vendor can support Layaa AI's client delivery model across ICP sectors
- Scores risk dimensions with weights calibrated to Layaa AI's priorities (data protection and operational capability weighted highest)
- Maps approval thresholds to Layaa AI's governance hierarchy and contract value tiers
- Checks for conflicts with Layaa AI's competitive positioning in the Indian SME automation market
