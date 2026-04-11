---
name: legal-brief
description: >
  Research and draft legal briefs, memoranda, and position papers on legal questions.
  Analyzes applicable law, precedent, and risk for business decisions.
  In Layaa AI mode, applies Indian regulatory landscape, clause library, and risk indicators framework.
  Trigger: "legal brief", "legal memo", "legal memorandum", "position paper", "legal analysis", "legal question", "legal opinion"
  This skill replaces the generic legal:legal-brief capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Legal Brief

Research and draft legal briefs, memoranda, and position papers that analyze applicable law, assess risk, and provide actionable recommendations for business decisions.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), Indian regulations (Companies Act, IT Act, DPDP Act, GST, MCA filings), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/legal/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/regulatory-landscape.md — Indian regulatory framework, applicable statutes, compliance obligations
- domain-references/legal/clause-library.md — Standard clause language and approved positions
- domain-references/legal/risk-indicators.md — Risk scoring matrix and assessment framework
- shared-references/company-identity.md — Company basics (CIN, PAN, TAN, registered address, founders)
Only load references relevant to the specific legal question.

## Execution Steps

### Step 1: Identify the Legal Question or Issue
Collect or ask for:
- **The specific legal question** to be answered
- **Context:** What business decision or situation prompted this question?
- **Jurisdiction:** Which legal system applies (default: Indian law for Layaa AI mode)
- **Urgency:** Is there a deadline (regulatory filing, response date, contract deadline)?
- **Stakeholders:** Who will act on this brief (Founders, external counsel, clients)?
- **Prior positions:** Has Layaa AI taken a position on this issue before?

### Step 2: Load Layaa AI Legal Context (Layaa AI Mode)
1. Read `domain-references/legal/regulatory-landscape.md` to identify applicable statutes and regulations
2. Read `shared-references/company-identity.md` for company-specific details (entity type, registration numbers, industry classifications)
3. Read `domain-references/legal/risk-indicators.md` to prepare the risk scoring framework
4. Read `domain-references/legal/clause-library.md` if the question relates to contractual matters

### Step 3: Research Applicable Law and Regulations
Using WebSearch if needed:
1. Identify the **primary statute(s)** governing the issue
2. Locate **relevant sections and provisions** within those statutes
3. Find **rules and notifications** that clarify the statutory provisions
4. Check for **recent amendments** or proposed changes to the law
5. Search for **regulatory guidance** (circulars, FAQs, press notes) from relevant authorities
6. Identify **judicial precedent** if the issue has been litigated

**For Indian Law (Layaa AI default):**
- Companies Act, 2013 and Rules — corporate governance, compliance
- Information Technology Act, 2000 — digital contracts, data, intermediary liability
- Digital Personal Data Protection Act, 2023 — data privacy, consent, processing
- GST Acts and Rules — taxation of services
- Indian Contract Act, 1872 — contract validity, enforceability
- Consumer Protection Act, 2019 — service obligations
- Competition Act, 2002 — anti-competitive practices
- FEMA and RBI regulations — foreign exchange, investment

### Step 4: Analyze How the Law Applies
1. **Map facts to law:** Connect the specific business situation to the relevant legal provisions
2. **Identify obligations:** What must be done, what is prohibited, what is permitted
3. **Examine exceptions:** Are there carve-outs, exemptions, or safe harbors that apply?
4. **Consider regulatory practice:** How do authorities typically interpret and enforce these provisions?
5. **Assess ambiguity:** Where the law is unclear, identify the range of possible interpretations
6. **Note conflicting provisions:** Flag any tensions between different applicable laws

### Step 5: Assess Risk Level
Using the risk indicators framework (Layaa AI mode) or standard risk matrix:

**Risk Scoring Matrix:**
| Dimension | LOW (1) | MEDIUM (2) | HIGH (3) | CRITICAL (4) |
|-----------|---------|------------|----------|---------------|
| Probability | Unlikely to arise | Could arise in certain scenarios | Likely to arise | Almost certain |
| Financial Impact | < 1L | 1L - 10L | 10L - 50L | > 50L or existential |
| Regulatory Impact | No enforcement action | Warning/notice | Penalty/fine | License revocation/prosecution |
| Reputational Impact | None | Minor/contained | Public/industry-visible | Media coverage/client loss |

**Overall Risk Rating:**
- **LOW:** Proceed with standard precautions
- **MEDIUM:** Proceed with documented mitigation measures
- **HIGH:** Proceed only with Founder approval and specific safeguards
- **CRITICAL:** Do not proceed without external counsel review

### Step 6: Draft the Legal Brief
Structure the brief with:
1. **Issue Statement** — Clear, concise framing of the legal question
2. **Background** — Relevant facts and business context
3. **Applicable Law** — Statutes, regulations, and precedent identified
4. **Analysis** — How the law applies to the specific situation
5. **Risk Assessment** — Scored risk with supporting rationale
6. **Conclusion** — Direct answer to the legal question
7. **Recommendations** — Specific actions to take
8. **Caveats** — Limitations of this analysis, areas requiring further investigation

### Step 7: Flag Escalation Items
Review the brief and flag items requiring escalation:
- **Founder escalation** if: risk rating is HIGH or CRITICAL, involves financial commitment > 5L, affects company structure, or creates precedent
- **External counsel escalation** if: risk rating is CRITICAL, involves litigation or regulatory action, requires opinion on novel legal question, or involves foreign law
- **Abhay (Legal & Contracts Advisor) coordination** if: issue involves contract drafting or amendment
- **Preeti (Regulatory Compliance & Data Governance Advisor) coordination** if: issue involves data privacy, regulatory compliance, or audit readiness
- **Anne (Chartered Compliance Assistant) coordination** if: issue involves MCA filings, DPIIT, or compliance calendar deadlines

## Output Format

```
# Legal Brief
**Prepared for:** [Founders / specific stakeholder]
**Date:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]
**Classification:** [CONFIDENTIAL / INTERNAL / CLIENT-FACING]
**Urgency:** [ROUTINE / TIME-SENSITIVE / URGENT]

## Issue Statement
[Clear, one-paragraph statement of the legal question being analyzed]

## Background
[Relevant facts, business context, and what prompted this analysis]
- **Entity:** [Layaa AI Private Limited / other]
- **Business Decision:** [what action is being contemplated]
- **Timeline:** [any relevant deadlines]

## Applicable Law
### Primary Statutes
1. [Statute name] — [relevant sections]
2. [Statute name] — [relevant sections]

### Regulatory Guidance
- [Circular/notification reference and summary]

### Precedent (if applicable)
- [Case citation and relevance]

## Analysis
### [Sub-issue 1]
[Detailed analysis mapping facts to law]

### [Sub-issue 2]
[Detailed analysis mapping facts to law]

### Areas of Ambiguity
[Where the law is unclear and how this affects the conclusion]

## Risk Assessment
| Risk Dimension | Rating | Rationale |
|---------------|--------|-----------|
| Probability | [LOW/MEDIUM/HIGH/CRITICAL] | [explanation] |
| Financial Impact | [LOW/MEDIUM/HIGH/CRITICAL] | [explanation] |
| Regulatory Impact | [LOW/MEDIUM/HIGH/CRITICAL] | [explanation] |
| Reputational Impact | [LOW/MEDIUM/HIGH/CRITICAL] | [explanation] |
| **Overall Risk** | **[rating]** | **[summary]** |

## Conclusion
[Direct answer to the legal question — what is the legal position, what can/cannot be done]

## Recommendations
1. [Specific action to take]
2. [Specific action to take]
3. [Specific action to take]

## Escalation Flags
- [ ] [Item requiring Founder review — reason]
- [ ] [Item requiring external counsel — reason]
- [ ] [Item requiring cross-GPT coordination — which GPT and why]

## Caveats
- This analysis is based on [sources consulted] as of [date]
- [Limitations — e.g., "This does not constitute formal legal advice"]
- [Areas requiring further investigation]

## Appendices (if applicable)
- [Supporting documents, statutory text, correspondence]
```

## What Makes This Different from Generic Legal Briefs
- Applies Indian regulatory landscape specific to AI automation services and SME operations
- Uses Layaa AI's risk indicators framework for consistent risk scoring across all legal analyses
- References Layaa AI's standard clause positions when contractual issues arise
- Maps escalation to Layaa AI's governance hierarchy (Abhay → Kabir → Founders)
- Cross-references with Layaa AI's compliance calendar for deadline-sensitive issues
- Considers Layaa AI's specific regulatory profile (DPIIT-registered startup, MSME, technology services provider)
