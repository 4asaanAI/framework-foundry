# Preeti — Regulatory Compliance & Data Governance Advisor | Memory

> This is your living memory file. It tracks the current regulatory landscape, compliance status, risk register entries, data governance decisions, regulatory changes, and audit readiness. Update this as you learn from each conversation.

---

## Current Regulatory Landscape

### Regulations Actively Monitored

| Regulation | Status | Last Reviewed | Key Concern for Layaa AI |
|-----------|--------|---------------|--------------------------|
| DPDP Act 2023 | Enacted, rules pending | April 2026 | Children's data in EduFlow (Section 9), consent mechanisms, breach notification |
| IT Act 2000 + SPDI Rules 2011 | Active, enforced | April 2026 | Reasonable security practices, CERT-In 6-hour reporting |
| CERT-In Directions (April 2022) | Active, enforced | April 2026 | 6-hour incident reporting, 180-day log retention |
| RBI Digital Lending Guidelines | Active | April 2026 | Relevant for fintech ICP clients — assess per engagement |
| RBI Data Localization Circular | Active | April 2026 | Payment data must stay in India — relevant for fintech clients |
| GDPR | Active (EU) | April 2026 | Awareness level — relevant if/when international clients engage |

### Upcoming Regulatory Changes to Watch
- DPDP Act Rules — expected phased notification. Monitor MeitY gazette.
- Data Protection Board of India — constitution pending. Monitor for establishment and first rulings.
- Potential Significant Data Fiduciary designation criteria — assess if Layaa AI's scale triggers designation.
- CERT-In updated incident categories — monitor for new reportable incident types.

---

## Compliance Status

### Privacy Policy
- **Status:** Published and effective as of February 18, 2026
- **Coverage:** DPDP Act 2023 and IT Act 2000 compliant
- **Location:** https://layaa.ai (website)
- **Last reviewed:** February 2026
- **Next review due:** February 2027 (annual) or upon DPDP Act rules notification, whichever is earlier
- **Gap identified:** Verify consent mechanism implementation for EduFlow parental consent

### Data Processing Inventory

| Processing Activity | Data Type | Data Subjects | Legal Basis | Assessed |
|-------------------|-----------|--------------|------------|----------|
| Layaa OS operations | Agent conversations, task data, memory | Founders, agents (AI) | Legitimate interest / operational necessity | Partially |
| EduFlow — student management | Student names, grades, attendance, parent contact | Students (minors), parents/guardians | Consent (parental for minors) | Needs assessment |
| EduFlow — fee tracking | Payment records, parent financial data | Parents/guardians | Contractual necessity | Needs assessment |
| CA AI Agent | Financial documents, PAN, ITR data | CA firm clients | Contractual necessity + consent | Needs assessment |
| Website analytics | IP address, browsing behavior | Website visitors | Consent (cookie consent) | Needs verification |
| Client communication | Email, phone, meeting notes | Client contacts | Legitimate interest / contractual | Partially |

### Data Infrastructure Compliance

| Requirement | Status | Notes |
|------------|--------|-------|
| Indian data residency | Compliant | Self-hosted PocketBase on Indian VPS |
| Encryption at rest | Compliant | AES-256 for sensitive data |
| Encryption in transit | Compliant | HTTPS only, TLS enforced |
| Access controls (RBAC) | Implemented | PocketBase auth + role-based access |
| Audit logging | Implemented | All significant actions logged |
| Backup encryption | Implemented | Daily backups to Backblaze B2 via rclone |
| Log retention (180 days) | Needs verification | CERT-In requirement — verify log rotation policy |
| Incident response plan | Needs documentation | Procedure exists informally; formal SOP needed |

---

## Compliance Risk Register

| Risk ID | Description | Regulation | Risk Score | Risk Level | Mitigation | Status | Review Date |
|---------|-------------|-----------|------------|-----------|------------|--------|-------------|
| CR-001 | EduFlow processes children's data without documented parental consent mechanism | DPDP Act Section 9 | 3.7 | High | Implement consent form, verify school-level consent process | Open | April 2026 |
| CR-002 | No formal incident response SOP documented | CERT-In Directions | 3.1 | High | Draft and approve incident response SOP | Open | April 2026 |
| CR-003 | Data processing agreements not in place for client projects where Layaa AI is processor | DPDP Act Section 8 | 2.8 | Medium | Flag to Abhay for DPA template creation | Open | April 2026 |
| CR-004 | Retention schedule not formally defined for all data categories | DPDP Act Section 8(4) | 2.5 | Medium | Draft retention schedule, get Founder approval | Open | April 2026 |
| CR-005 | Data subject rights fulfillment mechanism not formally documented | DPDP Act Section 11-14 | 2.3 | Medium | Document process for handling access/correction/erasure requests | Open | April 2026 |
| CR-006 | CERT-In log retention period (180 days) not verified | CERT-In Directions | 2.1 | Medium | Verify with Kaiser that log rotation meets 180-day requirement | Open | April 2026 |

---

## Data Governance Decisions

| Date | Decision | Context | Decided By | Rationale |
|------|----------|---------|------------|-----------|
| Feb 2026 | Privacy Policy published | DPDP Act + IT Act compliance | Founders | Required for legal compliance; covers all current data processing |
| Ongoing | All data on Indian VPS | Data residency requirement | Founders | DPDP Act and business principle — no vendor lock-in, data sovereignty |
| Ongoing | Self-hosted PocketBase | Data control | CTO (Shubham) | Full control over data, no third-party cloud dependency |
| Ongoing | AES-256 encryption at rest | Security safeguard | CTO (Shubham) | Industry standard, meets DPDP Act reasonable security requirement |

*Update this section after every data governance decision. Include the "why" for institutional memory.*

---

## Regulatory Changes Tracked

| Date | Regulation | Change Description | Impact on Layaa AI | Impact Level | Action Taken | Status |
|------|-----------|-------------------|-------------------|-------------|--------------|--------|
| Aug 2023 | DPDP Act 2023 | Enacted by Parliament | Comprehensive data protection obligations | High | Privacy policy updated (Feb 2026); ongoing compliance program | In progress |
| Apr 2022 | CERT-In Directions | 6-hour incident reporting, 180-day log retention | Incident response and logging requirements | Medium | Infrastructure configured for compliance; SOP pending | In progress |

*Add entries whenever a regulatory change is identified. Assess impact within 7 days of identification.*

---

## Audit Readiness Status

### DPDP Act Readiness: Partial

| Area | Readiness | Priority |
|------|-----------|----------|
| Privacy notice/policy | Ready | Maintain |
| Consent mechanisms | Needs work (EduFlow parental consent) | High |
| Data processing documentation | Partial | Medium |
| Security safeguards | Ready (infrastructure level) | Maintain |
| Breach notification procedure | Needs formal SOP | High |
| Data subject rights process | Needs documentation | Medium |
| Children's data protections | Needs assessment (EduFlow) | High |
| Data retention schedule | Needs formal definition | Medium |
| Data processing agreements | Needs templates (coordinate with Abhay) | Medium |

### IT Act / CERT-In Readiness: Mostly Ready

| Area | Readiness | Priority |
|------|-----------|----------|
| Reasonable security practices | Ready | Maintain |
| Incident reporting process | Needs formal SOP (6-hour timeline) | High |
| Log retention (180 days) | Needs verification | Medium |
| CERT-In point of contact | Needs designation | Medium |

### Overall Compliance Posture
- **Assessment:** Partially compliant — foundation is solid (privacy policy, encrypted infrastructure, Indian data residency), but operational SOPs and EduFlow-specific compliance need work
- **Priority actions:** (1) EduFlow parental consent mechanism, (2) Incident response SOP, (3) Data retention schedule, (4) DPA template with Abhay

---

## DPDP Compliance Checklist Status

| # | Requirement | Status | Notes |
|---|------------|--------|-------|
| 1 | Privacy notice published | Done | Feb 2026, on website |
| 2 | Consent mechanism — website | Needs verification | Check cookie consent implementation |
| 3 | Consent mechanism — EduFlow | Not done | Parental consent form needed |
| 4 | Consent mechanism — CA AI Agent | Not done | Consent flow needed in product |
| 5 | Purpose limitation documented | Partial | Processing inventory started above |
| 6 | Data minimization verified | Not done | Needs review per product |
| 7 | Retention schedule defined | Not done | Draft needed |
| 8 | Security safeguards | Done | AES-256, HTTPS, RBAC, audit logging |
| 9 | Breach notification procedure | Not done | SOP needed |
| 10 | Data subject rights mechanism | Not done | Process needed |
| 11 | Grievance officer designated | Not done | Needs Founder decision |
| 12 | DPAs with clients (processor role) | Not done | Template needed (coordinate with Abhay) |
| 13 | Cross-border transfer assessment | Not needed currently | All data stays in India |
| 14 | Annual review scheduled | Scheduled | Next: Feb 2027 or upon rules notification |

---

## Key Learnings & Patterns

*This section captures recurring compliance patterns and institutional knowledge:*

- **Pattern:** [None recorded yet — this section grows as conversations accumulate]
- **Recurring questions:** [Track compliance questions that come up 3+ times]
- **Client compliance requirements:** [Track what clients ask about compliance during engagements]
- **Regulatory interpretation decisions:** [Track interpretations of ambiguous regulations for consistency]

---

*This memory file is a living document. Update it after every significant compliance interaction. The compliance landscape changes constantly — your memory keeps Layaa AI ahead of regulatory surprises. When in doubt, save it.*
