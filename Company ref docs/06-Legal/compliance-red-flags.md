# Layaa AI -- Compliance Red Flags

**Document Owner:** Abhimanyu Singh (CEO) & Shubham Sharma (CTO)
**Last Updated:** April 2026
**Classification:** Internal -- Confidential
**Version:** 2.0

---

## 1. Purpose

This document identifies compliance red flags that require immediate attention and escalation. Each red flag includes what to watch for, who to escalate to, and the recommended action. This is a living document -- review quarterly and after any compliance incident.

---

## 2. Red Flag Categories

| Category | Red Flags Covered |
|----------|------------------|
| Financial | Margin erosion, discount overreach, payment term violations, client concentration |
| Data Protection | Processing without consent, cross-border transfer violations, breach notification failures |
| Tax & GST | Late TDS deposit, late GST filing, missing compliance |
| Corporate / MCA | Late annual filings, missed Board meetings, missed AGM |
| Contractual | Missing stamp duty, inadequate liability protection, IP exposure |
| Operational | Single-builder dependency, infrastructure risk |

---

## 3. Financial Red Flags

### RED FLAG F-01: Gross Margin Below 30%

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any engagement where gross margin (revenue minus all direct costs including Founder time at INR 1,500/hr) falls below 30%. Vertical minimums range from 35% to 70% -- this is the absolute floor across all verticals. |
| **Detection method** | Calculate margin at proposal stage and again at engagement close. Compare estimated vs. actual. |
| **Threshold** | Below 30% on any single engagement. Below 40% on blended monthly margin. |
| **Escalate to** | Both Founders (Abhimanyu Singh and Shubham Sharma) |
| **Suggested action** | (1) Immediately review pricing for the engagement. (2) Identify cost overruns or scope creep. (3) If ongoing, renegotiate price or scope with client. (4) If completed, document lessons and update estimation process. (5) If blended margin is affected, review entire portfolio. |
| **Severity** | High |

### RED FLAG F-02: Discount Exceeding 20%

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any discount (explicit or implicit through scope expansion without price adjustment) that exceeds 20% of standard pricing. |
| **Detection method** | Compare final contract price to pricing engine output. Monitor scope changes without corresponding price changes. |
| **Threshold** | Discount above 20% without both Founders' documented approval. Any discount that pushes margin below vertical minimum. |
| **Escalate to** | Both Founders jointly |
| **Suggested action** | (1) Reject discount if not pre-approved. (2) If already committed, document the strategic justification. (3) Implement scope freeze for the engagement. (4) Review whether client relationship justifies continued discount. (5) Update pricing engine safeguards. |
| **Severity** | High |

### RED FLAG F-03: Payment Terms Exceeding 60 Days

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any contract with payment terms beyond Net 60. Also watch for clients who routinely pay beyond agreed terms. Standard is Net 15. |
| **Detection method** | Review contract payment terms at signing. Monitor days sales outstanding (DSO) per client. |
| **Threshold** | Contractual terms beyond Net 60 days. Actual payment averaging more than 45 days for Net 15 terms. |
| **Escalate to** | Abhimanyu Singh (CEO) |
| **Suggested action** | (1) For new contracts: push back to Net 30 maximum, or require advance payment component. (2) For existing late payers: send formal reminder at Day 20, escalation call at Day 30, suspend services notice at Day 45, actual suspension at Day 60. (3) For bootstrap stage, cash flow is critical -- do not accept Net 60+ without advance payment of at least 50%. (4) Consider offering 2-3% early payment discount rather than accepting extended terms. |
| **Severity** | High (cash flow critical for bootstrap company) |

### RED FLAG F-04: Client Concentration Exceeding 30% of Revenue

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any single client representing more than 30% of total monthly or quarterly revenue. |
| **Detection method** | Monthly revenue tracking by client. Calculate concentration percentage. |
| **Threshold** | Single client above 30% of trailing 3-month revenue. Top 2 clients above 60% combined. |
| **Escalate to** | Both Founders |
| **Suggested action** | (1) Acknowledge the risk formally in Founders' review. (2) Accelerate business development to diversify pipeline. (3) Do not offer additional discounts to the concentrated client. (4) Ensure contract terms protect against sudden termination (notice period, payment for work in progress). (5) Set a 90-day target to reduce concentration below 30%. |
| **Severity** | Medium-High (business continuity risk) |

---

## 4. Data Protection Red Flags

### RED FLAG D-01: Data Processing Without Consent

| Aspect | Detail |
|--------|--------|
| **What to watch** | Processing personal data without documented consent from Data Principals, or processing for purposes beyond what was consented to. Includes using client end-user data for training, analytics, or any purpose not in the DPA/SoW. |
| **Detection method** | Review consent mechanisms at engagement start. Audit data flows during project execution. Check if data usage aligns with stated purpose. |
| **Threshold** | Any instance of personal data processing without documented consent basis. |
| **Escalate to** | Both Founders -- immediately |
| **Suggested action** | (1) Stop processing immediately. (2) Assess scope of non-consented processing. (3) Notify Client (Data Fiduciary). (4) Obtain consent retroactively if possible. (5) If consent cannot be obtained, delete data and document the incident. (6) Review and fix the process gap. (7) Consider whether this constitutes a data breach requiring notification. |
| **Severity** | Critical (DPDP Act penalties up to INR 250 Crore) |

### RED FLAG D-02: Cross-Border Data Transfer Without DPA

| Aspect | Detail |
|--------|--------|
| **What to watch** | Personal data being transferred outside India without (a) a Data Processing Agreement in place, (b) client consent for the transfer, or (c) verification that the destination is not on the restricted list. Common scenario: sending client data to US-based AI APIs (Anthropic, OpenAI, Google). |
| **Detection method** | Map all data flows at engagement start. Check every API call that sends personal data to external services. Review DPA coverage. |
| **Threshold** | Any personal data leaving India without documented basis and client consent. |
| **Escalate to** | Both Founders -- immediately |
| **Suggested action** | (1) Pause the data transfer. (2) Assess what data was transferred and to where. (3) Execute or update DPA with client to cover the transfer. (4) Verify destination is not on restricted list. (5) Implement technical controls (anonymisation, pseudonymisation) before resuming. (6) Disclose transfer to client and obtain explicit consent. (7) Update engagement data flow map. |
| **Severity** | Critical |

### RED FLAG D-03: Breach Notification Missed (72-Hour Window)

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any personal data breach where the 72-hour notification window to the Data Protection Board (via the Data Fiduciary) is missed, or the 24-hour internal notification to the Client is missed. |
| **Detection method** | Incident response log. Breach detection timestamp vs. notification timestamp. |
| **Threshold** | More than 24 hours from Layaa AI becoming aware of breach to notifying Client. More than 72 hours from Data Fiduciary becoming aware to notifying Data Protection Board. |
| **Escalate to** | Both Founders -- immediately upon detection of any breach |
| **Suggested action** | (1) Notify Client immediately (even if late). (2) Document the timeline and reason for delay. (3) Assist Client in filing late notification with Data Protection Board. (4) Implement automated breach detection and alerting. (5) Review and update incident response procedures. (6) Consider engaging legal counsel for penalty risk assessment. |
| **Severity** | Critical (penalty up to INR 200 Crore for failure to notify) |

---

## 5. Tax & GST Red Flags

### RED FLAG T-01: Late TDS Deposit

| Aspect | Detail |
|--------|--------|
| **What to watch** | TDS deducted but not deposited with the government by the 7th of the following month (30th April for March TDS). |
| **Detection method** | Monthly TDS deposit tracker. Calendar reminders on the 5th of each month. |
| **Threshold** | Any TDS not deposited by the due date. |
| **Escalate to** | Abhimanyu Singh (CEO) and Chartered Accountant |
| **Suggested action** | (1) Deposit immediately with interest. (2) Interest is 1.5% per month (or part thereof) from date of deduction to date of deposit -- this is mandatory and non-waivable. (3) Note that late deposit is also a criminal offence under Section 276B (prosecution possible for amounts exceeding specified limits). (4) Set up auto-reminders and consider standing instructions with bank. (5) Ensure TDS is deposited before the return due date to avoid additional return-related penalties. |
| **Severity** | High (automatic penalty + potential prosecution) |

### RED FLAG T-02: Late GST Filing

| Aspect | Detail |
|--------|--------|
| **What to watch** | GSTR-1 not filed by the 11th; GSTR-3B not filed by the 20th; GSTR-9 not filed by 31 December. |
| **Detection method** | Monthly GST filing tracker. Calendar reminders 3 days before due date. |
| **Threshold** | Any return not filed by the due date. |
| **Escalate to** | Abhimanyu Singh (CEO) and CA/GST Practitioner |
| **Suggested action** | (1) File immediately. (2) Late fee: INR 50/day CGST + INR 50/day SGST (capped at INR 5,000 per return for GSTR-1 and GSTR-3B). (3) For GSTR-3B: interest at 18% per annum on late tax payment from due date to actual payment date. (4) For GSTR-9: late fee INR 100/day CGST + INR 100/day SGST (capped at 0.50% of state turnover). (5) Persistent late filing can lead to cancellation of GST registration. (6) Set up auto-reminders and consider GST filing software with alerts. |
| **Severity** | Medium-High |

### RED FLAG T-03: Late MCA Filing

| Aspect | Detail |
|--------|--------|
| **What to watch** | Annual return (MGT-7/7A), financial statements (AOC-4), auditor appointment (ADT-1), DPT-3, or DIR-3 KYC not filed by their respective due dates. |
| **Detection method** | Compliance calendar tracker. Post-AGM checklist. Annual DIR-3 KYC reminder (September). |
| **Threshold** | Any MCA filing beyond its statutory due date. |
| **Escalate to** | Both Founders and Company Secretary/CA |
| **Suggested action** | (1) File immediately with additional fee. (2) AOC-4 late: INR 100/day (no cap). MGT-7/7A late: INR 100/day (cap INR 5,00,000). ADT-1 late: INR 300/day (cap INR 12,00,000). DIR-3 KYC late: INR 5,000 per director + DIN deactivation. (3) Persistent non-filing can lead to company being marked as "default" on MCA, director disqualification, and striking off proceedings. (4) Review compliance calendar and improve tracking systems. |
| **Severity** | Medium-High |

---

## 6. Contractual Red Flags

### RED FLAG C-01: Missing Stamp Duty

| Aspect | Detail |
|--------|--------|
| **What to watch** | Agreements executed without proper stamp duty as per Haryana Stamp Act. Includes physical and electronic agreements. |
| **Detection method** | Contract execution checklist. Review all signed agreements for stamping. |
| **Threshold** | Any agreement required to be stamped but not stamped or under-stamped. |
| **Escalate to** | Abhimanyu Singh (CEO) |
| **Suggested action** | (1) Identify unstamped agreements. (2) Get them stamped through adjudication (submission to Collector with payment of deficit stamp duty + penalty of 2% per month of deficit, up to 200%). (3) Key risk: unstamped documents are inadmissible as evidence in court -- if a dispute arises, Layaa AI cannot rely on the contract. (4) Implement e-stamping as standard process for all agreements. (5) Most Layaa AI service agreements require INR 100 stamp duty -- do not neglect this small amount. |
| **Severity** | Medium (evidence risk in disputes) |

### RED FLAG C-02: Contract Without Liability Cap

| Aspect | Detail |
|--------|--------|
| **What to watch** | Any signed agreement that does not include a limitation of liability clause, or where the liability cap has been removed during negotiation. |
| **Detection method** | Contract review checklist. Post-signature clause verification. |
| **Threshold** | Any executed contract without a liability cap. |
| **Escalate to** | Both Founders |
| **Suggested action** | (1) For unsigned contracts: add limitation of liability clause before signing. (2) For signed contracts without cap: assess exposure and attempt to negotiate an amendment. (3) Standard cap: 12 months' fees under the contract. Maximum exposure without a cap: unlimited, including consequential damages. (4) Never sign a contract without a liability cap -- this is a non-negotiable requirement. |
| **Severity** | High (unlimited financial exposure) |

### RED FLAG C-03: IP Clause Ambiguity

| Aspect | Detail |
|--------|--------|
| **What to watch** | Agreements where IP ownership or licensing terms are ambiguous, missing, or where Layaa AI's Background IP is not carved out. Risk: client claims ownership of Layaa AI's reusable frameworks and methodologies. |
| **Detection method** | Contract review checklist. Specific review of IP clauses in every agreement. |
| **Threshold** | Any agreement without clear IP assignment/licensing terms. Any agreement that assigns all IP (including Background IP) to client without carve-out. |
| **Escalate to** | Both Founders |
| **Suggested action** | (1) Use the hybrid IP model from the Clause Library as the default. (2) Explicitly list Background IP in the SoW. (3) Ensure Foreground IP assignment is conditional on full payment. (4) Never assign Background IP -- licence it. (5) For ongoing disputes, engage legal counsel. |
| **Severity** | High (loss of core IP assets) |

---

## 7. Operational Red Flags

### RED FLAG O-01: Single-Builder Dependency

| Aspect | Detail |
|--------|--------|
| **What to watch** | Critical client projects or internal systems where only one person (either Founder) has the knowledge, access, or capability to maintain/modify the system. The "bus factor" problem. |
| **Detection method** | Quarterly knowledge audit: for each active project and internal system, identify who can maintain it. |
| **Threshold** | Any client-facing system or revenue-generating project where only one person can effectively work on it. Any internal system with no documentation and single-person knowledge. |
| **Escalate to** | Both Founders (discuss during Board meetings) |
| **Suggested action** | (1) Document all active projects: architecture, access credentials (in a secure vault), deployment procedures, known issues. (2) Cross-train: each Founder should have at least basic capability to maintain the other's projects. (3) For critical systems, create runbooks covering common operations and failure scenarios. (4) Consider engaging a documented backup contractor for critical systems. (5) Prioritise documentation as a standard project deliverable, not an afterthought. |
| **Severity** | Medium-High (business continuity risk) |

### RED FLAG O-02: Infrastructure Cost Overrun

| Aspect | Detail |
|--------|--------|
| **What to watch** | Monthly infrastructure costs exceeding the INR 500/month target for core operations, or total tech spend exceeding the INR 43,000/month hard ceiling. |
| **Detection method** | Monthly infrastructure spend review. Alert on any single service exceeding expected cost. |
| **Threshold** | Core infrastructure above INR 500/month. Total tech spend above INR 43,000/month. Any single unplanned charge above INR 5,000. |
| **Escalate to** | Shubham Sharma (CTO) for investigation; both Founders if systemic |
| **Suggested action** | (1) Identify the cost driver immediately. (2) Determine if it is a one-time anomaly or recurring increase. (3) Evaluate alternatives: free tier, open-source replacement, optimisation. (4) For API costs: implement usage caps, request budgets, and monitoring. (5) For subscription creep: audit all active subscriptions quarterly. |
| **Severity** | Medium |

---

## 8. Escalation Matrix Summary

| Severity | Response Time | Who Decides | Documentation |
|----------|-------------|-------------|---------------|
| **Critical** | Immediate (within hours) | Both Founders jointly | Written incident report within 24 hours |
| **High** | Within 24 hours | Both Founders (one can initiate, both must agree on action) | Written decision memo within 48 hours |
| **Medium-High** | Within 48 hours | Either Founder (with notification to the other) | Documented in next Founders' review |
| **Medium** | Within 1 week | Either Founder | Noted in monthly compliance review |

---

## 9. Red Flag Quick Reference Card

Print or bookmark this quick reference:

```
CRITICAL (Immediate Action)
  D-01  Data processing without consent          -> Stop. Notify. Fix.
  D-02  Cross-border transfer without DPA         -> Pause. Assess. Consent.
  D-03  Breach notification window missed         -> Notify now. Document. Legal counsel.

HIGH (Within 24 Hours)
  F-01  Margin below 30%                          -> Review pricing. Renegotiate or document.
  F-02  Discount above 20%                        -> Reject if unapproved. Scope freeze.
  F-03  Payment terms above 60 days               -> Push back. Require advance.
  T-01  Late TDS deposit                          -> Deposit with interest immediately.
  C-02  No liability cap in contract              -> Amend or assess exposure.
  C-03  IP clause ambiguity                       -> Clarify before further delivery.

MEDIUM-HIGH (Within 48 Hours)
  F-04  Client concentration above 30%            -> Diversification plan in 90 days.
  T-02  Late GST filing                           -> File immediately with late fee.
  T-03  Late MCA filing                           -> File immediately with additional fee.
  O-01  Single-builder dependency                 -> Document. Cross-train. Runbooks.

MEDIUM (Within 1 Week)
  C-01  Missing stamp duty                        -> Get stamped via adjudication.
  O-02  Infrastructure cost overrun               -> Identify driver. Optimise.
```

---

## 10. Monthly Red Flag Review

At each monthly Founders' review, address:

1. **Active red flags:** List all currently triggered red flags with status
2. **New red flags:** Any flags triggered since last review
3. **Resolved red flags:** Flags that have been addressed and closed
4. **Near-misses:** Situations that came close to triggering a flag (preventive action needed)
5. **Process improvements:** Updates to detection methods, thresholds, or response procedures

Template:
```
RED FLAG REVIEW -- [Month Year]

Active Red Flags:
  [Flag ID] [Description] [Status] [Owner] [Target Resolution Date]

New This Month:
  [Flag ID] [Description] [Date Triggered] [Immediate Action Taken]

Resolved This Month:
  [Flag ID] [Description] [Resolution Summary]

Near-Misses:
  [Description] [Preventive Action]

Process Updates:
  [Description of any changes to this document]
```

---

## 11. Annual Review

This document is reviewed comprehensively every April (start of FY) and updated based on:
- Regulatory changes (new DPDP Act rules, GST changes, Companies Act amendments)
- Business changes (new verticals, new geographies, team growth)
- Incidents experienced during the year
- Industry best practices

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
*CIN: U62099HR2025PTC139528 | DPIIT: DIPP245808 | Udyam: UDYAM-HR-05-0177880 (Micro)*
