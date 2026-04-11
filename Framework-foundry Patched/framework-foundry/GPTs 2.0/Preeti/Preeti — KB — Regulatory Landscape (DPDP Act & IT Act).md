# Preeti — KB — Regulatory Landscape (DPDP Act & IT Act)

> Comprehensive regulatory landscape document covering the DPDP Act 2023, IT Act 2000, RBI Guidelines, and sector-specific regulations applicable to Layaa AI.

---

## 1. Digital Personal Data Protection Act, 2023 (DPDP Act)

**Status:** Enacted 11 August 2023. Rules to be notified by the Central Government (phased rollout expected). Data Protection Board of India to be constituted.

**Applicability to Layaa AI:**
- Layaa AI is a **Data Fiduciary** — it determines the purpose and means of processing personal data
- For client projects (EduFlow, CA AI Agent), Layaa AI may also be a **Data Processor** — processing data on behalf of clients
- Both roles carry distinct obligations

**Key Provisions Summary:**

| Section | Provision | Layaa AI Obligation |
|---------|-----------|-------------------|
| Section 4 | Application — processing of digital personal data within India | Fully applicable |
| Section 5 | Notice — inform data principal before processing | Privacy notice required for all data collection points |
| Section 6 | Consent — free, specific, informed, unambiguous | Consent mechanism in EduFlow, CA AI Agent, and website |
| Section 7 | Deemed Consent — legitimate uses, employment, public interest | Assess whether any processing qualifies for deemed consent |
| Section 8(1) | Purpose Limitation — process only for stated purpose | Document purposes for each data processing activity |
| Section 8(3) | Data Accuracy — reasonable efforts to ensure correctness | Data validation processes in products |
| Section 8(4) | Data Retention — delete when purpose fulfilled | Retention schedule required |
| Section 8(5) | Security Safeguards — reasonable measures | Encryption, access controls, audit logging |
| Section 8(6) | Breach Notification — inform Board and affected individuals | Incident response plan required |
| Section 9 | Children's Data — parental consent, no tracking/advertising | **Critical for EduFlow** — school student data |
| Section 10 | Significant Data Fiduciary — additional obligations | Monitor for designation — unlikely at current scale |
| Section 11-14 | Data Principal Rights — access, correction, erasure, grievance | Rights fulfillment mechanism required |
| Section 16 | Cross-Border Transfer — permitted unless restricted | Default: process in India. Flag if transfer needed. |
| Section 33 | Penalties — up to Rs.250 Cr | Risk-proportionate compliance essential |

**EduFlow-Specific DPDP Compliance:**
- Student data = children's data under Section 9
- Parental/guardian consent required before processing
- No behavioral tracking or targeted advertising on student data
- Age verification mechanism recommended (school enrollment as proxy)
- Data retention linked to student enrollment period + defined post-period

---

## 2. Information Technology Act, 2000

| Provision | Relevance |
|-----------|-----------|
| Section 43A + SPDI Rules 2011 | Reasonable Security Practices for sensitive personal data (financial info, health, biometric, passwords) |
| Section 65B | Admissibility of electronic records — relevant for digital contracts |
| Section 72A | Breach of confidentiality in lawful contract — criminal offense |
| CERT-In Directions (April 2022) | Mandatory 6-hour incident reporting for cybersecurity incidents; log retention for 180 days; VPN/VPS provider reporting |
| Section 5 | Electronic signatures legally valid |
| Section 69 | Government power to intercept, monitor, decrypt — compliance obligation if directed |

**CERT-In Compliance Requirements:**
- Report cybersecurity incidents within 6 hours of noticing
- Incident types: unauthorized access, data breach, identity theft, DDoS, malware, API vulnerabilities
- Maintain logs for 180 days (rolling)
- Layaa AI uses self-hosted Indian VPS — CERT-In directions apply directly

---

## 3. RBI Guidelines (Sector-Specific)

| Guideline | Relevance |
|-----------|-----------|
| Payment Data Localization (April 2018) | All payment system data to be stored in India — relevant for fintech clients |
| Digital Lending Guidelines (Sept 2022) | Regulate digital lending apps — relevant if building for lending clients |
| KYC Master Direction | Know Your Customer requirements — relevant for fintech client projects |
| Outsourcing Risk Management | RBI-regulated entities must ensure vendors comply — Layaa AI may be subject as a vendor |
| Data Privacy in NBFC/Bank operations | Client-specific — assess per engagement |

---

## 4. Sector-Specific Regulations

**Education (EduFlow relevant):**
- Right to Education Act (RTE) 2009 — school data management requirements
- CBSE/ICSE data handling guidelines for affiliated schools
- NEP 2020 digital education framework — data governance for EdTech
- DPDP Act Section 9 — children's data protection (primary concern)

**Fintech (CA AI Agent / future clients):**
- ICAI guidelines for CA firms — data handling standards for financial data
- GST/Income Tax Act — data retention requirements for financial records (8 years)
- Prevention of Money Laundering Act (PMLA) — if handling transaction data

---

## 5. Regulatory Watch Tracker Template

| Date Identified | Regulation/Update | Source | Impact Assessment | Risk Level | Action Required | Deadline | Status | Assigned To |
|----------------|-------------------|--------|-------------------|-----------|-----------------|----------|--------|-------------|
| [Date] | [Description] | [Official Gazette/CERT-In/RBI/DPB] | [Impact on Layaa AI operations] | [Low/Medium/High/Critical] | [Specific actions] | [Date] | [Open/In Progress/Closed] | [Agent] |

**Monitoring Sources:**
- Ministry of Electronics and IT (MeitY) official gazette
- Data Protection Board of India (when constituted) orders and rulings
- CERT-In advisories and directions
- RBI circulars and master directions
- Industry body updates (NASSCOM, DSCI)
- Legal databases (SCC Online, Manupatra, Indian Kanoon)

---

*This is a Preeti regulatory reference document. Updated whenever new regulations are enacted, existing regulations are amended, or compliance assessments reveal new findings.*
