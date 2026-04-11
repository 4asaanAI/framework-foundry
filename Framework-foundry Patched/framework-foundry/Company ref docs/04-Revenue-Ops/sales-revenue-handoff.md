# Layaa AI -- Sales-to-Revenue/Delivery Handoff Protocol

**Document Owner:** Shubham Sharma, CTO & Abhimanyu Singh, CEO
**Last Updated:** April 2026
**Classification:** Internal -- Sales & Delivery Teams
**Version:** 2.0

---

## 1. Purpose

This document defines the handoff process between Sales and Delivery at Layaa AI. A clean handoff ensures:

- The client experiences seamless continuity from sales to delivery
- The delivery team has complete context without needing to re-discover
- Nothing falls through the cracks -- scope, expectations, and commitments are transferred intact
- Accountability is clear at every step

**The handoff is not a moment -- it is a structured process with defined triggers, documentation, checkpoints, and post-handoff responsibilities.**

---

## 2. Handoff Trigger Points

The handoff process is initiated when ALL of the following conditions are met:

| # | Trigger Condition | Verified By |
|---|-------------------|-------------|
| 1 | Statement of Work (SoW) signed by the client | Sales (AE) |
| 2 | 50% advance payment received and confirmed by finance | Finance |
| 3 | Client brief document completed by AE | Sales (AE) |
| 4 | Delivery team capacity confirmed for the engagement timeline | Delivery Lead |

**No handoff occurs until all four conditions are satisfied.** If any condition is not met, the deal remains in the Sales domain.

### Exception: Expedited Handoff

In rare cases where the client has an urgent timeline and the SoW is signed but payment is being processed (within 5 business days), an expedited handoff may be initiated with:
- Founder approval (written -- email or Slack message)
- Payment confirmation expected within 5 business days
- Delivery starts with non-billable discovery work only until payment clears

---

## 3. Required Documentation -- The Handoff Package

The AE must prepare and deliver the following documents to the Delivery Lead. All documents are uploaded to the shared project folder in the CRM/project management system.

### Document 1: Signed Statement of Work (SoW)

| Requirement | Detail |
|-------------|--------|
| Format | PDF, signed by both parties (digital or physical signature) |
| Contents | Scope, deliverables, timeline, milestones, pricing, payment terms, T&Cs |
| Responsibility | AE prepares; Legal reviews (for deals > ₹5L or non-standard terms) |
| Deadline | Uploaded within 24 hours of signing |

### Document 2: Payment Confirmation

| Requirement | Detail |
|-------------|--------|
| Format | Screenshot or PDF of payment receipt / bank confirmation |
| Contents | Amount received, date, payment method, client name |
| Responsibility | Finance confirms; AE uploads |
| Deadline | Must be confirmed before handoff meeting is scheduled |

### Document 3: Client Brief

The most critical handoff document. Uses the standard Layaa AI Client Brief template.

**Client Brief Template:**

```
============================================================
LAYAA AI -- CLIENT BRIEF
============================================================

1. CLIENT OVERVIEW
   Company Name:       ___________________________
   Industry:           ___________________________
   Company Size:       ___________________________ employees
   Annual Revenue:     ₹___________________________
   Website:            ___________________________
   Location:           ___________________________

2. KEY STAKEHOLDERS
   Primary Contact:
     Name:             ___________________________
     Title:            ___________________________
     Email:            ___________________________
     Phone:            ___________________________
     Role in Project:  [Decision Maker / Project Owner / Day-to-Day Contact]

   Secondary Contact:
     Name:             ___________________________
     Title:            ___________________________
     Email:            ___________________________
     Phone:            ___________________________
     Role in Project:  ___________________________

   Executive Sponsor:
     Name:             ___________________________
     Title:            ___________________________
     Involvement:      [Active / Periodic Check-in / Escalation Only]

3. PROBLEM STATEMENT
   [2-3 paragraphs describing the client's challenges as uncovered in
   discovery. Use the client's own words where possible. Include
   quantified impact -- cost of the problem, time wasted, revenue lost.]

4. AGREED SCOPE AND DELIVERABLES
   [List each deliverable with a one-line description. Must match the SoW
   exactly. Flag any verbal commitments not in the SoW.]

   Deliverable 1: ___________________________
   Deliverable 2: ___________________________
   Deliverable 3: ___________________________

5. TIMELINE AND MILESTONES
   Project Start Date:       ___________________________
   Milestone 1: ____________ | Due: ____________
   Milestone 2: ____________ | Due: ____________
   Milestone 3: ____________ | Due: ____________
   Project End Date:         ___________________________
   Retainer Start Date:      ___________________________

6. CLIENT'S TECHNICAL ENVIRONMENT
   Current Tools/Systems:    ___________________________
   Data Storage:             ___________________________
   API Availability:         [Yes / No / Unknown]
   IT Contact:               ___________________________
   Security Requirements:    ___________________________
   Hosting Preference:       [Client Cloud / Layaa AI Managed / Hybrid]

7. SUCCESS CRITERIA
   [Quantified metrics the client will use to judge success.
   Must be measurable and agreed upon.]

   Criterion 1: ___________________________
   Criterion 2: ___________________________
   Criterion 3: ___________________________

8. KNOWN RISKS AND CONSTRAINTS
   [Any factors that could affect delivery. E.g., client availability
   windows, data quality concerns, legacy system limitations,
   stakeholder resistance, regulatory constraints.]

   Risk 1: ___________________________ | Mitigation: ___________________________
   Risk 2: ___________________________ | Mitigation: ___________________________

9. COMMUNICATION PREFERENCES
   Preferred Channel:        [Email / Slack / WhatsApp / Teams]
   Meeting Cadence:          [Weekly / Biweekly / As Needed]
   Preferred Meeting Time:   ___________________________
   Escalation Contact:       ___________________________
   Report Format Preference: [Deck / Document / Dashboard]

10. SALES CONTEXT (INTERNAL ONLY -- NOT SHARED WITH CLIENT)
    Discount Applied:        ___% | Approved by: _______________
    Competitive Situation:   [None / [Competitor Name]]
    Client Sensitivity:      [Price / Timeline / Quality / Relationship]
    Upsell Opportunities:    ___________________________
    Relationship Notes:      ___________________________
    [Any personality/style notes that help the delivery team
    build rapport -- e.g., "Prefers data-driven presentations",
    "Values personal touch", "Very time-conscious".]

============================================================
```

### Document 4: Discovery Call Notes

| Requirement | Detail |
|-------------|--------|
| Format | CRM notes or separate document |
| Contents | Raw notes from the Arjun 5-Phase Discovery call; direct quotes from client; pain points; process descriptions |
| Responsibility | AE |
| Deadline | Should already be in CRM; verified complete at handoff |

### Document 5: Proposal Document

| Requirement | Detail |
|-------------|--------|
| Format | PDF -- final version as shared with the client |
| Contents | The proposal including scope, pricing, timeline, and any appendices |
| Responsibility | AE |
| Deadline | Uploaded at handoff |

### Document 6: Communication Thread Archive

| Requirement | Detail |
|-------------|--------|
| Format | Email thread export or Slack/WhatsApp conversation summary |
| Contents | Key communications between AE and client during the sales process |
| Responsibility | AE |
| Deadline | Uploaded at handoff; at minimum, a summary of key exchanges |

---

## 4. Handoff Checklist

The AE completes this checklist and submits it to the Delivery Lead. All items must be checked before the handoff meeting is scheduled.

```
HANDOFF CHECKLIST -- [Client Name] -- [Date]
============================================

DOCUMENTATION
[ ] Signed SoW uploaded to project folder
[ ] 50% advance payment confirmed by Finance
[ ] Client Brief completed (all 10 sections)
[ ] Discovery call notes uploaded/verified in CRM
[ ] Proposal document (final version) uploaded
[ ] Communication thread summary uploaded

CLIENT READINESS
[ ] Client informed that delivery team will be taking over
[ ] Client's project contact confirmed and available
[ ] Client's technical contact identified (if applicable)
[ ] Client's availability for kickoff call confirmed
[ ] Any client-side prerequisites communicated (data access, tool access, etc.)

INTERNAL READINESS
[ ] Delivery Lead assigned and briefed
[ ] Solutions Architect assigned (if applicable)
[ ] Delivery team capacity confirmed for the project timeline
[ ] Project folder/workspace created in project management system
[ ] Internal kickoff meeting scheduled (pre-client kickoff)

COMMERCIAL
[ ] Deal amount and payment schedule clear to Finance and Delivery
[ ] Retainer tier and start date confirmed
[ ] Any special terms or commitments documented
[ ] Discount (if any) approved and documented

HANDOFF MEETING
[ ] Internal handoff meeting scheduled
[ ] All required attendees confirmed
[ ] AE has prepared the walkthrough of Client Brief

Completed by: _________________ Date: _________________
Verified by:  _________________ Date: _________________
```

---

## 5. Handoff Meeting

### Internal Handoff Meeting

**Purpose:** Transfer all context from Sales to Delivery. Ensure the delivery team can engage the client with full understanding.

| Attribute | Detail |
|-----------|--------|
| Duration | 30 minutes (45 minutes for deals > ₹5L) |
| Timing | Within 48 hours of all trigger conditions being met |
| Location | Video call (recorded for reference) |

**Required Attendees:**

| Role | Attendance | Purpose |
|------|-----------|---------|
| AE (Sales) | Mandatory | Presents handoff package; answers questions |
| Delivery Lead | Mandatory | Receives handoff; asks clarifying questions |
| Solutions Architect | If technical complexity is medium-high | Reviews technical requirements |
| CTO (Shubham) | For deals > ₹5L | Strategic oversight; resource allocation |
| CEO (Abhimanyu) | For deals > ₹8L or strategic accounts | Relationship continuity |

**Agenda:**

| Time | Topic | Led By |
|------|-------|--------|
| 0-5 min | Client overview and deal context | AE |
| 5-15 min | Walk through Client Brief (problem, scope, deliverables) | AE |
| 15-20 min | Technical environment and requirements | AE + Solutions Architect |
| 20-25 min | Risks, constraints, and client personality notes | AE |
| 25-28 min | Q&A from Delivery team | Delivery Lead |
| 28-30 min | Next steps: kickoff date, client intro, first actions | Delivery Lead |

**Meeting Output:**
- Delivery Lead confirms understanding and acceptance of the handoff
- Kickoff date confirmed
- Client introduction email drafted (sent same day)
- First-week action plan outlined

### Client Introduction

On the same day as the internal handoff meeting, the AE sends an introduction email:

```
Subject: Introducing your Layaa AI delivery team -- [Project Name]

Hi [Client Name],

Thank you for choosing Layaa AI. I'm excited to introduce you to
[Delivery Lead Name], who will be leading the delivery of [project/scope].

[Delivery Lead Name] is [brief credential]. I've shared our complete
discussion history, and [he/she/they] is fully up to speed on your
goals and requirements.

[Delivery Lead Name] will reach out to schedule your kickoff call
within the next [1-2] business days.

I'll continue to be involved as your relationship manager and will
check in periodically. Feel free to reach out to either of us at
any time.

Looking forward to a successful engagement!

Best regards,
[AE Name]
```

---

## 6. Responsibility Matrix (RACI)

### Pre-Handoff (Sales Phase)

| Activity | AE | Sales Lead | Delivery Lead | Finance | CTO | CEO |
|----------|-----|-----------|---------------|---------|-----|-----|
| Lead qualification | R/A | I | - | - | - | - |
| Discovery call | R/A | I | C (if technical) | - | I | I |
| Proposal creation | R | A | C (for scope) | C (for pricing) | I | A (>₹3L) |
| Negotiation | R | A | I | C | I | A (>₹5L) |
| SoW drafting | R | A | R (scope section) | R (payment terms) | I | A (>₹5L) |
| Payment collection | R | I | - | A | - | I |
| Client Brief preparation | R/A | I | I | - | - | - |

### Handoff Phase

| Activity | AE | Sales Lead | Delivery Lead | Finance | CTO | CEO |
|----------|-----|-----------|---------------|---------|-----|-----|
| Complete handoff checklist | R/A | I | I | C | - | - |
| Verify payment received | C | - | - | R/A | - | I |
| Confirm delivery capacity | I | - | R/A | - | C | I |
| Conduct handoff meeting | R | I | R | I | C (>₹5L) | C (>₹8L) |
| Send client introduction | R/A | I | C | - | - | - |
| Schedule client kickoff | C | - | R/A | - | - | - |

### Post-Handoff (Delivery Phase)

| Activity | AE | Sales Lead | Delivery Lead | Finance | CTO | CEO |
|----------|-----|-----------|---------------|---------|-----|-----|
| Client kickoff call | C (first 15 min) | - | R/A | - | C (>₹5L) | - |
| Project delivery | - | - | R/A | - | A | I |
| Milestone invoicing | I | - | R (triggers) | R/A | - | I |
| Monthly client check-in (months 1-3) | R | I | C | - | - | I |
| Upsell identification | R/A | I | C | - | - | I |
| Escalation handling | C | C | R | - | A | I |
| Contract renewal | R/A | I | C | C | I | A (>₹5L) |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 7. Escalation Paths for Handoff Failures

### Failure Scenarios and Escalation

| Failure Scenario | Impact | First Escalation | Second Escalation | Resolution SLA |
|-----------------|--------|-----------------|-------------------|----------------|
| **Incomplete documentation** -- AE submits handoff with missing documents | Delivery cannot start; client waits | Delivery Lead → AE (direct request to complete) | Sales Lead → AE (mandatory completion within 24 hrs) | 24 hours |
| **Payment delay** -- SoW signed but payment not received after 7 days | Handoff stalled; client may lose momentum | AE follows up with client | Finance + CEO intervene; client contacted directly | 5 business days |
| **Capacity conflict** -- Delivery team overbooked for committed timeline | Client expectation mismatch; potential SoW breach | Delivery Lead → CTO (resource reallocation) | CTO escalates to CEO; timeline renegotiation with client | 48 hours |
| **Scope mismatch** -- SoW scope doesn't match what was discussed in sales | Delivery team can't execute; client frustrated | Delivery Lead → AE (clarification meeting) | Sales Lead + Delivery Lead + Client (scope alignment call) | 72 hours |
| **Client contact unresponsive** -- Client-side contact not engaging post-handoff | Kickoff delayed; project timeline at risk | AE re-engages their sales contact | AE + Delivery Lead escalate to client's executive sponsor | 5 business days |
| **Technical discovery gap** -- Delivery team finds technical requirements not captured | Scope/effort may change; timeline at risk | Delivery Lead → AE (was this discussed in sales?) + CTO assessment | If scope change needed: Sales Lead + AE + Client re-scoping call | 72 hours |

### Escalation Chain

```
Level 1: Direct resolution between AE and Delivery Lead
  ↓ If unresolved within 24 hours
Level 2: Sales Lead and/or CTO involved
  ↓ If unresolved within 48 hours
Level 3: CEO (Abhimanyu) involved
  ↓ If client relationship at risk
Level 4: Founder-to-Client direct communication
```

### Handoff Quality Scorecard

Each handoff is scored by the Delivery Lead within one week of the handoff meeting.

| Criterion | Score (1-5) | Weight |
|-----------|------------|--------|
| Documentation completeness | | 25% |
| Client Brief quality and accuracy | | 25% |
| Scope clarity (SoW matches expectations) | | 20% |
| Technical requirements captured | | 15% |
| Client relationship warmth at handoff | | 15% |
| **Weighted Total** | | **100%** |

**Scoring Guide:**
- 5 = Exceptional -- no gaps, delivery team fully equipped
- 4 = Good -- minor gaps easily filled
- 3 = Adequate -- some follow-up needed with AE
- 2 = Below standard -- significant gaps; delayed kickoff
- 1 = Poor -- handoff needs to be redone

**Target:** Average handoff score ≥ 4.0. Scores below 3 trigger a process review with Sales Lead.

---

## 8. Post-Handoff Touchpoints

### AE Involvement After Handoff

The AE does not disappear after handoff. Ongoing involvement ensures relationship continuity and upsell identification.

| Touchpoint | Frequency | Purpose | Duration |
|-----------|-----------|---------|----------|
| Client kickoff call | Once (project start) | Introduce delivery team; reinforce confidence | First 15 minutes only |
| Monthly check-in with client | Monthly (months 1-3) | Relationship maintenance; satisfaction pulse | 15-minute call or message |
| Internal sync with Delivery Lead | Biweekly (months 1-3) | Stay informed on progress; flag issues early | 10-minute Slack/call |
| Quarterly business review | Quarterly (ongoing) | Strategic review; upsell discussion | Part of QBR with client |
| Contract renewal discussion | 30 days before renewal | Renewal proposal; scope expansion | As needed |

### Responsibility Transfer Timeline

```
Week 1-2:   AE leads relationship; Delivery Lead shadows
Week 3-4:   Delivery Lead leads; AE available for support
Month 2-3:  Delivery Lead owns day-to-day; AE does monthly check-ins
Month 4+:   AE is the strategic relationship owner; Delivery Lead is operational owner
```

---

## 9. Handoff Process Flow -- Visual Summary

```
SALES CLOSES DEAL
       │
       ▼
┌─────────────────────────┐
│  SoW Signed?            │──No──→ Stay in Sales (Negotiation stage)
│  Payment Received?      │──No──→ Stay in Sales (follow up on payment)
│  Client Brief Complete? │──No──→ AE completes documentation
│  Delivery Capacity OK?  │──No──→ CTO resolves capacity; timeline adjusted
└─────────────────────────┘
       │ All Yes
       ▼
┌─────────────────────────┐
│  AE Completes Handoff   │
│  Checklist              │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Internal Handoff       │
│  Meeting (30-45 min)    │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Client Introduction    │
│  Email (same day)       │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Client Kickoff Call    │
│  (within 3-5 days)      │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  DELIVERY BEGINS        │
│  (Discovery → Assessment│
│   → Development →       │
│   Validation →          │
│   Enablement)           │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  AE: Monthly check-ins  │
│  AE: Upsell tracking    │
│  AE: Renewal management │
└─────────────────────────┘
```

---

## 10. SLAs for Handoff Process

| Step | SLA | Owner |
|------|-----|-------|
| Handoff package preparation (after all triggers met) | 24 hours | AE |
| Internal handoff meeting | Within 48 hours of package completion | Delivery Lead (schedules) |
| Client introduction email | Same day as handoff meeting | AE |
| Client kickoff call | Within 3-5 business days of handoff | Delivery Lead |
| Handoff quality scorecard completion | Within 7 days of handoff meeting | Delivery Lead |
| Post-handoff AE check-in (first) | Within 2 weeks of project kickoff | AE |

---

*A clean handoff is the bridge between a great sale and a great delivery. Both sides own the outcome. When in doubt, over-communicate.*

**Layaa AI Private Limited**
*Empower decisions, Elevate Profits!*
