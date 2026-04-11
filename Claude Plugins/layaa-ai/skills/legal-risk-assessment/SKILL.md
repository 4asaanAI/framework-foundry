---
name: legal-risk-assessment
description: >
  Evaluate legal risks for business decisions, new ventures, partnerships, or market entries.
  Provides risk scoring, mitigation strategies, and go/no-go recommendations.
  In Layaa AI mode, applies sector-specific guidance for ICP segments and Indian regulatory context.
  Trigger: "legal risk", "risk assessment", "risk analysis", "evaluate risk", "legal exposure", "should we proceed", "go no-go"
  This skill replaces the generic legal:legal-risk-assessment capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Legal Risk Assessment

Evaluate legal risks for business decisions, new ventures, partnerships, or market entries. Delivers a structured risk register with probability-impact scoring, mitigation strategies, and clear go/no-go recommendations.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), new client engagement, new service vertical, partnership, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/risk-indicators.md — Risk scoring matrix, indicator definitions, threshold values
- domain-references/legal/regulatory-landscape.md — Indian regulatory framework, sector-specific regulations
- domain-references/legal/compliance-red-flags.md — Known compliance risk patterns
- shared-references/icp-and-market.md — ICP profiles, sector characteristics, market dynamics
Only load references relevant to the specific decision being assessed.

## Execution Steps

### Step 1: Define the Business Decision or Initiative
Collect or ask for:
- **What is being decided:** New client engagement, partnership, market entry, product launch, investment, policy change, etc.
- **Scope:** What does this decision encompass (geography, industry, contract value, duration)?
- **Stakeholders:** Who is involved and who is affected?
- **Timeline:** When must the decision be made? When would execution begin?
- **Alternatives:** What other options exist besides proceeding?
- **Financial magnitude:** Estimated revenue, cost, investment, or exposure
- **Strategic importance:** Is this core to business strategy or opportunistic?

### Step 2: Load Risk Indicators and Regulatory Context (Layaa AI Mode)
1. Read `domain-references/legal/risk-indicators.md` for the risk scoring framework
2. Read `domain-references/legal/regulatory-landscape.md` for applicable regulations
3. Read `shared-references/icp-and-market.md` to understand sector-specific dynamics
4. Read `domain-references/legal/compliance-red-flags.md` for known patterns

### Step 3: Identify Legal Risk Categories
Assess risks across all applicable categories:

**Regulatory Risk:**
- Non-compliance with applicable laws and regulations
- Licensing or registration requirements not met
- Sector-specific regulatory constraints
- Cross-border regulatory implications (if applicable)

**Contractual Risk:**
- Unfavorable terms in proposed agreements
- Unlimited liability or excessive indemnification
- IP ownership disputes
- Non-compete or exclusivity constraints
- Payment and credit risk

**Intellectual Property Risk:**
- Ownership of deliverables unclear
- Third-party IP infringement risk
- Open-source licensing complications
- Trade secret exposure
- Trademark or brand conflicts

**Data Protection Risk:**
- Personal data processing without lawful basis
- Cross-border data transfers without safeguards
- Data breach exposure
- Consent mechanism gaps
- DPDP Act 2023 non-compliance

**Employment/Labor Risk:**
- Misclassification (employee vs. contractor)
- Non-compete enforceability
- Poaching/solicitation exposure
- Labor law compliance in client engagements

**Litigation Risk:**
- Probability of disputes arising
- Forum and jurisdiction concerns
- Enforceability of dispute resolution clauses
- Limitation period considerations

**Reputational Risk:**
- Association with controversial sectors or practices
- Client business model concerns
- ESG/ethical considerations
- Media and public perception

**Financial Risk (Legal Dimension):**
- Penalty exposure from regulatory non-compliance
- Litigation costs (defense, damages, settlement)
- Contract termination costs
- Insurance gaps

### Step 4: Score Each Risk (Probability x Impact)
Use a 5x5 risk matrix:

**Probability Scale:**
| Score | Label | Definition |
|-------|-------|-----------|
| 1 | Rare | < 5% likelihood within assessment period |
| 2 | Unlikely | 5-20% likelihood |
| 3 | Possible | 20-50% likelihood |
| 4 | Likely | 50-80% likelihood |
| 5 | Almost Certain | > 80% likelihood |

**Impact Scale:**
| Score | Label | Definition |
|-------|-------|-----------|
| 1 | Negligible | Financial: < 50K, no operational disruption, no regulatory action |
| 2 | Minor | Financial: 50K-2L, minor disruption, warning/advisory |
| 3 | Moderate | Financial: 2L-10L, significant disruption, penalty/fine |
| 4 | Major | Financial: 10L-50L, severe disruption, regulatory sanction |
| 5 | Catastrophic | Financial: > 50L, business-threatening, criminal prosecution/license loss |

**Risk Score = Probability x Impact**

| Risk Score | Rating | Action Required |
|-----------|--------|----------------|
| 1-4 | LOW | Accept with monitoring |
| 5-9 | MEDIUM | Accept with documented mitigation |
| 10-15 | HIGH | Proceed only with Founder approval + active mitigation |
| 16-25 | CRITICAL | Do not proceed without mitigation reducing score below 16 |

### Step 5: Apply Sector-Specific Guidance (Layaa AI Mode)
If the decision involves a client or partner in a regulated sector:

**Fintech / Payment Processors:**
- RBI licensing requirements for payment-related services
- Data localization mandates (RBI circular on storage of payment data)
- KYC/AML obligations that may flow to technology providers
- PCI-DSS compliance requirements for payment data handling
- Risk of being classified as a payment system operator

**Healthcare:**
- Patient data sensitivity (personal sensitive data under DPDP Act)
- Medical device regulations if AI is used in diagnostics
- Telemedicine guidelines compliance
- Clinical data handling restrictions

**Government / Public Sector:**
- GeM procurement rules and compliance
- Public procurement transparency requirements
- RTI Act implications for information shared with government entities
- Security clearance requirements

**Logistics / Supply Chain:**
- GST compliance for multi-state operations
- E-way bill system integration requirements
- Customs and trade compliance for cross-border supply chains
- Motor vehicle and transport regulations for fleet management AI

### Step 6: Develop Mitigation Strategies
For each HIGH and CRITICAL risk:
1. **Avoid:** Can the risk be eliminated by changing the approach?
2. **Transfer:** Can the risk be transferred (insurance, contractual allocation, indemnification)?
3. **Mitigate:** Can the probability or impact be reduced?
4. **Accept:** If residual risk remains, is it within acceptable tolerance?

For each mitigation strategy, specify:
- **Action required** — concrete steps
- **Owner** — who is responsible
- **Timeline** — when must it be implemented (before proceeding or ongoing)
- **Cost** — estimated cost of mitigation
- **Effectiveness** — expected reduction in risk score after mitigation

### Step 7: Provide Go/No-Go Recommendation
Based on the overall risk profile:

**GO — Proceed:**
- All risks are LOW or MEDIUM after mitigation
- Mitigations are practical and affordable
- Strategic value justifies residual risk
- No CRITICAL risks remain

**CONDITIONAL GO — Proceed with Conditions:**
- HIGH risks exist but can be mitigated to MEDIUM
- Specific conditions must be met before proceeding
- Requires Founder approval
- Regular risk monitoring required

**HOLD — Defer Decision:**
- Insufficient information to assess key risks
- External factors may change the risk profile soon
- Additional due diligence or legal opinion needed

**NO-GO — Do Not Proceed:**
- CRITICAL risks cannot be mitigated
- Legal prohibitions or regulatory barriers
- Risk-reward ratio is unfavorable
- Reputational risk exceeds strategic benefit

### Step 8: List Residual Risks
For risks that cannot be fully mitigated:
- State the residual risk and its score after mitigation
- Explain why further mitigation is not possible or practical
- Define monitoring mechanisms (early warning indicators)
- Set review triggers (events that should prompt reassessment)
- Document risk acceptance rationale (who accepted and when)

## Output Format

```
# Legal Risk Assessment
**Decision/Initiative:** [title]
**Assessment Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]
**Classification:** CONFIDENTIAL
**Valid Until:** [date — after which reassessment is needed]

## Executive Summary
- **Decision:** [brief description of what is being assessed]
- **Overall Risk Rating:** [LOW / MEDIUM / HIGH / CRITICAL]
- **Recommendation:** [GO / CONDITIONAL GO / HOLD / NO-GO]
- **Key Risks:** [top 2-3 risks in one line each]
- **Key Conditions:** [critical mitigations required if CONDITIONAL GO]

## Decision Context
- **Initiative:** [detailed description]
- **Strategic Value:** [why this matters]
- **Financial Magnitude:** [revenue/cost/investment]
- **Timeline:** [decision deadline and execution timeline]
- **Alternatives:** [other options considered]

## Risk Register

### CRITICAL Risks
| ID | Risk Category | Risk Description | Probability | Impact | Score | Rating |
|----|-------------|-----------------|------------|--------|-------|--------|
| R1 | [category] | [description] | [1-5] | [1-5] | [P×I] | CRITICAL |

**R1: [Risk Title]**
- **Description:** [detailed risk description]
- **Trigger:** [what would cause this risk to materialize]
- **Consequence:** [what happens if it materializes]
- **Current Controls:** [existing protections, if any]
- **Mitigation Strategy:** [recommended actions]
- **Residual Risk After Mitigation:** [score and rating]

### HIGH Risks
[Same structure as CRITICAL]

### MEDIUM Risks
| ID | Risk Category | Risk Description | Probability | Impact | Score | Rating |
|----|-------------|-----------------|------------|--------|-------|--------|
| R5 | [category] | [description] | [1-5] | [1-5] | [P×I] | MEDIUM |

### LOW Risks
| ID | Risk Category | Risk Description | Probability | Impact | Score | Rating |
|----|-------------|-----------------|------------|--------|-------|--------|
| R8 | [category] | [description] | [1-5] | [1-5] | [P×I] | LOW |

## Risk Heat Map
```
Impact →   1        2        3        4        5
Prob ↓   Negligible Minor   Moderate  Major   Catastrophic
5 (AC)    MEDIUM   HIGH    HIGH    CRITICAL  CRITICAL
4 (L)     LOW      MEDIUM  HIGH    HIGH      CRITICAL
3 (P)     LOW      MEDIUM  MEDIUM  HIGH      HIGH
2 (U)     LOW      LOW     MEDIUM  MEDIUM    HIGH
1 (R)     LOW      LOW     LOW     LOW       MEDIUM

[Risks plotted: R1(4,5), R2(3,4), etc.]
```

## Mitigation Plan
| Risk ID | Mitigation Action | Owner | Deadline | Cost | Pre/Post Score |
|---------|------------------|-------|----------|------|---------------|
| R1 | [action] | [owner] | [date] | [est.] | [before] → [after] |
| R2 | [action] | [owner] | [date] | [est.] | [before] → [after] |

## Sector-Specific Considerations
[If applicable — regulatory requirements specific to the client's or partner's industry]

## Recommendation
### [GO / CONDITIONAL GO / HOLD / NO-GO]

**Rationale:** [2-3 sentences explaining the recommendation]

**Conditions for Proceeding** (if CONDITIONAL GO):
1. [ ] [Condition — must be met before proceeding]
2. [ ] [Condition — must be met before proceeding]
3. [ ] [Condition — ongoing requirement]

**Monitoring Plan:**
- [Early warning indicator] — Check [frequency]
- [Early warning indicator] — Check [frequency]
- Reassess if [trigger event] occurs

## Residual Risks (Accepted)
| Risk ID | Residual Score | Accepted By | Date | Review Trigger |
|---------|---------------|-------------|------|---------------|
| [ID] | [score] | [Founders/Kabir] | [date] | [trigger] |

## Approvals
- [ ] Prepared by: [name/role]
- [ ] Reviewed by: [Kabir — Executive Strategy Orchestrator]
- [ ] Approved by: [Founders — if HIGH/CRITICAL risks present]
```

## What Makes This Different from Generic Risk Assessments
- Applies Layaa AI's risk indicators framework with calibrated scoring for Indian SME context
- Includes sector-specific risk guidance for each ICP (fintech, logistics, healthcare, government)
- Uses Layaa AI's compliance red flags to identify pattern risks across client engagements
- Maps risk owners to Layaa AI's GPT workforce (Abhay for legal, Preeti for regulatory, Anne for compliance)
- Calibrates financial impact thresholds to Layaa AI's scale (not enterprise-scale thresholds)
- Considers Layaa AI's specific regulatory profile (DPIIT startup, MSME, IT services provider)
- Escalation follows governance hierarchy: Abhay → Kabir → Founders → External Counsel
- Cross-references with ICP market dynamics for realistic probability assessment
