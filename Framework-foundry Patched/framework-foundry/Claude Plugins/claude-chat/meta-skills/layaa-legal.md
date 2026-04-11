---
name: layaa-legal
description: >
  Layaa AI Legal skill group. Use for: contract review, NDA triage, client agreement
  generation, compliance checks, legal risk assessment, vendor checks, legal briefs,
  legal responses, meeting briefings with legal context, and signature routing.
  Applies Indian regulatory context and Layaa AI's standard clause library.
  Works for Layaa AI and general legal tasks.
user-invocable: true
---

# Layaa Legal — Skill Group

## Available Sub-Skills

| Sub-Skill | When to Use |
|-----------|------------|
| **review-contract** | Review a contract against Layaa AI's negotiation playbook |
| **triage-nda** | Rapidly classify an NDA as Green / Yellow / Red |
| **client-agreement** | Generate a Layaa AI client agreement from project scope |
| **compliance-check** | Run a compliance check on a proposed action or initiative |
| **legal-risk-assessment** | Assess and classify legal risks by severity and likelihood |
| **vendor-check** | Check agreements and status of a vendor relationship |
| **legal-brief** | Generate a contextual legal briefing on a topic |
| **legal-response** | Generate a response to a legal inquiry using standard templates |
| **meeting-briefing** | Prepare a briefing for a meeting with legal relevance |
| **signature-request** | Prepare and route a document for e-signature |

## How to Use
- "Review this SaaS vendor contract and flag anything non-standard" → **review-contract**
- "We received an NDA — is it safe to sign?" → **triage-nda**
- "Generate a client agreement for a 3-month automation project at ₹3L" → **client-agreement**
- "Check if our WhatsApp-based lead capture is DPDP compliant" → **compliance-check**

---

## Context Detection
- **Layaa AI mode:** Mention Layaa AI, Indian regulations, our contracts/clients → apply Layaa AI legal framework from Project Knowledge
- **General mode:** Different company → standard legal assistant

---

## Layaa AI Legal Context (Quick Reference)

**Governing Law:** Indian law | **Jurisdiction:** Courts of Gurgaon / Haryana (default)
**Entity:** Layaa AI Private Limited | CIN: U62099HR2025PTC139528

**Standard payment terms:** 50% advance on signing, 50% on delivery | **GST:** 18%, charged separately
**IP:** Vests in client on full payment; Layaa AI retains methodology | **Liability cap:** Fees in preceding 3 months
**Confidentiality:** Mutual, 2 years post-engagement | **Termination:** 30 days notice (immediate for material breach)

**Red flag clauses — never accept without Founder review:**
Unlimited liability | IP vesting before full payment | Exclusivity | Unilateral amendment rights | Non-compete >12 months | Jurisdiction outside India

**NDA classification:** 🟢 GREEN = mutual, standard, 1-3 year term | 🟡 YELLOW = negotiate minor changes | 🔴 RED = Founder/legal review required

---

## Sub-Skill Execution

### review-contract
1. Read the contract provided
2. Check: payment terms, liability clauses, IP ownership, termination rights, governing law, jurisdiction
3. Compare against Layaa AI standard terms (from Project Knowledge)
4. Flag: all red flag clauses, missing standard protections, unusual provisions
5. Rate: Risk level (Low/Medium/High) with reasoning
6. Recommend: accept as-is / negotiate these specific points / refer to Founder

### triage-nda
1. Read the NDA
2. Check: mutual vs one-sided, confidentiality scope, term, carve-outs, IP implications, non-compete
3. Classify: 🟢 GREEN (sign as-is) / 🟡 YELLOW (sign with these specific changes) / 🔴 RED (Founder review needed)
4. For YELLOW: specify exact clauses to negotiate and suggested alternative language
5. For RED: specify which clauses are blockers and why

### client-agreement
1. Take project scope inputs: client name, project description, deliverables, timeline, price, retainer tier
2. Apply standard terms from Project Knowledge (50% advance, 50% delivery, 18% GST, IP on full payment)
3. Generate full agreement: Parties & Recitals → Scope of Work → Deliverables & Timeline → Payment Terms → IP & Confidentiality → Liability → Termination → Governing Law → Signatures
4. Flag any non-standard elements for Founder review
5. Output as clean, formatted document ready for e-signature

### compliance-check
1. Define the proposed action, feature, or process being checked
2. Check against relevant regulations: DPDP Act (data), IT Act (electronic), GST (invoicing), Companies Act, Contract Act
3. Identify: compliant areas, gaps, required changes
4. Output: Compliance status (Compliant / Needs Attention / Non-Compliant), specific issues, recommended remediation steps

### legal-risk-assessment
1. Describe the scenario or situation
2. Identify all potential legal risks across categories: contractual, regulatory, IP, data, commercial
3. Score each: Severity (High/Medium/Low) × Likelihood (High/Medium/Low) = Risk Rating
4. Build risk register with recommended mitigations
5. Flag anything requiring immediate Founder or external legal counsel

### vendor-check
1. Identify vendor and agreement in question
2. Check: contract status (active/expired), key terms, renewal dates, exit clauses, payment obligations
3. Flag: upcoming renewals (within 60 days), unusual terms, MSME payment obligations (45-day rule)
4. Recommend: retain / renegotiate / exit (with timeline)

### legal-brief
1. Identify topic (regulation, legal concept, case type)
2. Provide: what the law says, how it applies to Layaa AI's context, practical implications
3. Cite: relevant Act/Section, key obligations, compliance requirements
4. Written for business owners, not lawyers — no unnecessary legalese

### meeting-briefing
1. Identify meeting type, parties involved, and legal context
2. Brief: who they are, what they likely want, key issues to discuss, risks to flag
3. Prepare: questions to ask, positions to hold, points to concede if needed
4. Note: any items that must not be agreed to without Founder approval

### signature-request
1. Review document completeness: correct parties named, dates filled, amounts correct, blanks completed, GST clause present
2. Identify all required signatories and signing order
3. Draft covering email/message for each signatory
4. Recommend e-signature tool (Zoho Sign or DocuSign) and routing sequence
5. Flag any final review needed before routing
