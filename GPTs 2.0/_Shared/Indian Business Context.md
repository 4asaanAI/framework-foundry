# Indian Business Context — Shared Reference for All Agents

> This document provides actionable Indian regulatory, tax, legal, and compliance reference material relevant to Layaa AI Private Limited. Every agent should consult this when handling tasks that touch GST, TDS, contracts, data privacy, startup benefits, MCA compliance, or banking. This is not textbook theory — it is a working reference tailored to Layaa AI's specific situation.

---

## Company Quick Facts (For Context)

- **Entity:** Layaa AI Private Limited (Private Limited Company, 2 Directors)
- **CIN:** U62099HR2025PTC139528 | **PAN:** AAGCL6342M | **TAN:** RTKL05493F
- **Location:** Gurgaon, Haryana 122102
- **Nature of Business:** Software services (AI automation, consulting, education)
- **SAC Code:** 998314 (Information Technology Design and Development Services)
- **GST Rate:** 18%
- **DPIIT Recognition:** Certificate No. DIPP245808 (Valid till December 2035)
- **Udyam Registration:** UDYAM-HR-05-0177880 (Micro Enterprise, Services)
- **Incorporation Date:** 19 December 2024
- **Financial Year:** April to March (standard Indian FY)

---

## 1. GST Quick Reference

### Applicable GST Rates for Layaa AI

Layaa AI provides software and IT services. The applicable GST rate is **18%** on all service invoices.

| Service Type | SAC Code | GST Rate |
|---|---|---|
| IT Design & Development Services (primary) | 998314 | 18% |
| IT Consulting & Support Services | 998313 | 18% |
| IT Infrastructure Management | 998316 | 18% |
| Training & Education Services (workshops) | 999293 | 18% |

### How GST Applies on Layaa AI Invoices

- **Intra-state supply** (client in Haryana): Charge **9% CGST + 9% SGST** = 18% total
- **Inter-state supply** (client outside Haryana): Charge **18% IGST**
- **Export of services** (outside India): Zero-rated under LUT (Letter of Undertaking), or charge IGST and claim refund

**Practical rule:** Check the client's billing address state. If Haryana, split into CGST+SGST. If any other state, charge IGST. This affects how the invoice is formatted and how returns are filed.

### GST Filing Calendar

| Return | Frequency | Due Date | What It Contains |
|---|---|---|---|
| GSTR-1 | Monthly | 11th of following month | All outward supplies (sales invoices issued) |
| GSTR-3B | Monthly | 20th of following month | Summary return + tax payment |
| GSTR-9 | Annual | 31 December | Annual consolidated return |
| GSTR-9C | Annual | 31 December | Reconciliation statement (if turnover > Rs.5 Cr — not applicable to Layaa yet) |

**Filing sequence matters:** GSTR-1 must be filed before GSTR-3B each month. GSTR-1 feeds into the buyer's GSTR-2B (auto-populated purchase data). If Layaa AI files GSTR-1 late, clients cannot claim input tax credit on time.

### Input Tax Credit (ITC)

Layaa AI can claim ITC on GST paid on business purchases:

**Eligible ITC:**
- Cloud hosting and SaaS subscriptions (AWS, Vercel, etc.)
- Software licenses and tools
- Professional services (CA, CS, legal)
- Office rent (if GST-registered landlord)
- Computer hardware and equipment
- Internet and telecom services

**Blocked ITC (cannot claim):**
- Food and beverages
- Personal consumption items
- Motor vehicles (unless for resale or specific exceptions)
- Health insurance (unless mandated for employees)
- Goods/services used for exempt supplies

**ITC claim process:** Ensure vendor's GSTIN is valid, invoice matches GSTR-2B auto-populated data, and payment is made within 180 days of invoice date.

### E-invoicing

E-invoicing is mandatory for businesses with turnover exceeding Rs.5 Crore. **Not applicable to Layaa AI currently.** When turnover approaches this threshold, e-invoicing via the Invoice Registration Portal (IRP) will become mandatory. No action needed now — monitor annually.

### Composition Scheme

The GST Composition Scheme is **not available** to service providers (except restaurants). Layaa AI as a software services company cannot opt for composition scheme. This is a non-starter — do not recommend it.

---

## 2. TDS Reference

### TDS Rates for Common Payments Layaa AI Makes

| Payment Type | Section | TDS Rate | Annual Threshold | Layaa AI Context |
|---|---|---|---|---|
| Professional/Technical fees | 194J | 10% | Rs.30,000 | CA fees, CS fees, legal fees, freelance developers |
| Contractor payments | 194C | 1% (individual) / 2% (company) | Rs.30,000 (single) / Rs.1,00,000 (aggregate) | Freelancers, sub-contractors for client projects |
| Commission/Brokerage | 194H | 5% | Rs.15,000 | Referral commissions, sales agent payments |
| Rent | 194I | 10% | Rs.2,40,000 | Office rent payments |
| Salary | 192 | As per income tax slab | No threshold | Not applicable currently (no employees) |

**Key distinction for Layaa AI:**
- Paying a freelance developer for coding work = Section 194J (10%) if the work is technical/professional in nature
- Paying a contractor for a defined deliverable = Section 194C (1% or 2%)
- When in doubt, apply 194J (10%) — over-deduction is safer than under-deduction; the deductee can claim credit

### TDS on Payments Received by Layaa AI

When clients pay Layaa AI for software services, **clients should deduct TDS at 10% under Section 194J** (professional/technical fees) or 2% under Section 194C (if treated as a contract). Layaa AI claims this TDS as credit against its income tax liability.

**Practical tip:** If a client is not deducting TDS, do not force the issue — but ensure Layaa AI's CA accounts for the full gross income. Large corporate clients will always deduct TDS.

### TDS Deposit and Filing Calendar

**Monthly TDS deposit:** 7th of the month following the month of deduction.
- Example: TDS deducted in April must be deposited by 7th May.
- Exception: March deductions can be deposited by 30th April.
- **Penalty for late deposit:** 1.5% per month of delay (from date of deduction to date of deposit).

**Quarterly TDS Return Filing (Form 26Q for non-salary):**

| Quarter | Period | Return Due Date | TDS Certificate (Form 16A) Due |
|---|---|---|---|
| Q1 | April – June | 31 July | 15 August |
| Q2 | July – September | 31 October | 15 November |
| Q3 | October – December | 31 January | 15 February |
| Q4 | January – March | 31 May | 15 June |

**Form 24Q** is for salary TDS (not applicable currently — no employees).
**Form 26Q** is for all non-salary TDS (this is what Layaa AI files).

**Penalty for late TDS return filing:** Rs.200 per day of delay (capped at total TDS amount). Plus late filing fee under Section 234E.

### Current TDS Obligations for Layaa AI

| Vendor/Payment | Likely Section | Rate | Action |
|---|---|---|---|
| CA/CS professional fees | 194J | 10% | Deduct if annual payment > Rs.30,000 |
| Freelance developers | 194J or 194C | 10% or 1-2% | Deduct based on nature of engagement |
| Office rent (if applicable) | 194I | 10% | Deduct if annual rent > Rs.2,40,000 |
| Referral commissions | 194H | 5% | Deduct if annual payment > Rs.15,000 |

**Director remuneration:** Directors are not employees in the traditional sense. If directors receive remuneration (not salary), TDS under Section 194J at 10% applies. If structured as salary, Section 192 applies. Consult CA for optimal structure.

---

## 3. Indian Contract Act 1872 — Key Sections for Startup Contracts

### Essential Elements of a Valid Contract (Section 2 & 10)

Every contract Layaa AI enters must have:

1. **Offer and Acceptance** (Section 2) — Clear proposal by one party, unambiguous acceptance by other
2. **Consideration** (Section 2(d)) — Something of value exchanged (services for payment)
3. **Capacity** (Section 11) — Both parties must be competent (major, sound mind, not disqualified by law)
4. **Free Consent** (Section 14) — Not obtained by coercion, undue influence, fraud, misrepresentation, or mistake
5. **Lawful Object** (Section 23) — Purpose must not be illegal, immoral, or against public policy

**Practical implication:** Every Layaa AI service agreement must clearly state the scope (offer), the acceptance mechanism (signature/digital acceptance), the price (consideration), and the identities/authorities of signatories (capacity).

### Void Agreements (Section 10 & Related)

Agreements that are automatically void and unenforceable:

- Agreements without consideration (Section 25) — exception: written promise to compensate for past voluntary service
- Agreements in restraint of trade (Section 27) — broad non-competes are void (see below)
- Agreements in restraint of legal proceedings (Section 28)
- Agreements by way of wager/betting (Section 30)

### Breach of Contract and Damages (Sections 73-74)

- **Section 73:** Party suffering breach can claim compensation for loss or damage **naturally arising** from the breach, or which the parties knew would likely result
- **Section 74:** If a contract specifies a sum as liquidated damages, the court can award **reasonable compensation not exceeding** the stated amount — Indian courts do not distinguish between penalty and liquidated damages the way English law does
- **Practical tip for Layaa AI contracts:** Always include a liquidated damages clause capping liability at the contract value. Indian courts will enforce reasonable caps.

### Non-Compete Clauses (Section 27)

**Section 27 makes agreements in restraint of trade void.** This is critical for Layaa AI:

- **During employment/engagement:** Reasonable non-compete clauses are enforceable as part of service conditions
- **Post-termination non-competes:** Generally unenforceable in India. Indian courts have consistently struck down post-employment non-competes
- **What works instead:** Non-solicitation clauses (cannot poach clients/employees for a period), confidentiality/NDA clauses, IP assignment clauses
- **For Layaa AI's client contracts:** Do not include broad non-compete clauses. Use non-solicitation + confidentiality instead.

### Arbitration and Dispute Resolution

**Arbitration and Conciliation Act, 1996** (as amended 2015, 2019, 2021):

- **Preferred for Layaa AI:** Include an arbitration clause in all contracts. Arbitration is faster (usually 12-18 months vs. 5-10 years in courts), confidential, and the award is enforceable like a court decree.
- **Recommended clause structure:**
  - Seat of arbitration: Gurgaon, Haryana
  - Language: English
  - Rules: Ad hoc arbitration under the Arbitration Act, or institutional (Delhi International Arbitration Centre)
  - Number of arbitrators: Sole arbitrator for disputes < Rs.10L; three arbitrators for larger disputes
  - Governing law: Laws of India

**Jurisdiction clause:** "Subject to arbitration above, courts at Gurgaon, Haryana shall have exclusive jurisdiction." This must be in every Layaa AI contract.

### Stamp Duty (Haryana)

Service agreements and contracts require stamp duty under the Indian Stamp Act and Haryana Stamp Rules:

| Document Type | Haryana Stamp Duty |
|---|---|
| Service Agreement / General Agreement | Rs.100 (if not otherwise specified) |
| Lease/Rent Agreement (up to 5 years) | 1.5% of total rent + security deposit |
| Power of Attorney (general) | Rs.300 |
| Affidavit | Rs.30 |
| NDA / Confidentiality Agreement | Rs.100 |

**Practical note:** For digital contracts signed via e-signature, stamp duty can be paid through the Haryana e-stamping portal (SHCIL). Unstamped agreements are not void but are **inadmissible as evidence** in court. Always ensure stamp duty is paid.

---

## 4. DPDP Act 2023 — Practical Compliance Checklist

The Digital Personal Data Protection Act, 2023 applies to Layaa AI as it processes personal data of Indian residents (client contacts, student data in EduFlow, employee data of client organizations).

### Core Obligations

| Obligation | What It Means for Layaa AI | Priority |
|---|---|---|
| **Consent** | Must obtain clear, informed consent before collecting personal data. Consent must be specific, informed, unconditional, and unambiguous. | HIGH |
| **Purpose Limitation** | Data collected for one purpose cannot be used for another without fresh consent. If collecting student data for EduFlow, cannot use it for marketing. | HIGH |
| **Data Minimization** | Collect only data that is necessary for the stated purpose. Do not collect "nice to have" fields. | MEDIUM |
| **Storage Limitation** | Do not retain personal data longer than necessary. Define retention periods in privacy policy. | MEDIUM |
| **Accuracy** | Ensure personal data is accurate and up to date. Provide mechanisms for correction. | MEDIUM |

### Data Principal (User) Rights

| Right | Layaa AI's Obligation |
|---|---|
| Right to Access | Provide a summary of personal data processed and processing activities upon request |
| Right to Correction | Allow data principals to correct inaccurate data |
| Right to Erasure | Delete personal data when consent is withdrawn or purpose is fulfilled |
| Right to Grievance Redressal | Designate a grievance mechanism (currently: Hello@layaa.ai) |
| Right to Nominate | Allow nomination of another person to exercise rights in case of death/incapacity |

### Data Breach Notification

- **Timeline:** Notify the Data Protection Board (DPB) within **72 hours** of becoming aware of a breach
- **Also notify:** Affected data principals (users) without delay
- **What to report:** Nature of breach, data affected, measures taken, contact for further information
- **Penalty for non-compliance:** Up to Rs.200 Crore for failure to notify

### Cross-Border Data Transfer

- Personal data can be transferred outside India **except** to countries specifically restricted by the Central Government (blacklist approach, not whitelist)
- No restricted country list published yet as of April 2026
- **Layaa AI position:** All data stored on Indian VPS (self-hosted PocketBase). Minimal cross-border transfer risk. If using any SaaS tool that stores data abroad (e.g., analytics, email), ensure DPA (Data Processing Agreement) is in place.

### Penalties Under DPDP Act

| Violation | Maximum Penalty |
|---|---|
| Failure to take security safeguards | Rs.250 Crore |
| Failure to notify breach | Rs.200 Crore |
| Non-compliance with children's data provisions | Rs.200 Crore |
| Non-fulfillment of obligations by data fiduciary | Rs.150 Crore |
| Non-compliance with DPB directions | Rs.150 Crore |
| Breach of consent/purpose limitation by data principal | Rs.10,000 |

### What Layaa AI Must Do Now

1. **Privacy Policy** — Already in place (effective February 2026, DPDP Act & IT Act 2000 compliant). Review annually.
2. **Consent Mechanism** — Implement clear consent collection in EduFlow, CA AI Agent, and any client-facing product. Must be opt-in, not pre-checked.
3. **Data Processing Agreements (DPAs)** — Execute DPAs with every client where Layaa AI processes their customers' personal data (e.g., schools sharing student data for EduFlow).
4. **Breach Response Plan** — Document a step-by-step breach response procedure: detection, containment, assessment, notification (DPB within 72 hours + affected users), remediation.
5. **Data Retention Policy** — Define how long each category of data is retained and when it is purged.
6. **Grievance Officer** — Designate a person/mechanism for data principal complaints. Currently mapped to Hello@layaa.ai — consider a dedicated channel.
7. **Vendor Assessment** — For any third-party tool processing personal data, verify their DPDP compliance and execute DPA.

---

## 5. Startup India Benefits (DPIIT Recognized)

Layaa AI holds DPIIT Startup Recognition (Certificate No. DIPP245808, valid till December 2035). This unlocks the following benefits:

### Tax Benefits

**Section 80-IAC — Income Tax Holiday:**
- **What:** 100% tax exemption on profits for 3 consecutive years out of the first 10 years from incorporation
- **Eligibility:** Must be DPIIT recognized + obtain CBDT (Central Board of Direct Taxes) certification via Inter-Ministerial Board (IMB) application
- **Current status for Layaa AI:** DPIIT recognized. CBDT certification not yet applied for. Must apply through Startup India portal before claiming exemption.
- **When to apply:** When Layaa AI starts generating taxable profit and wants to claim the 3-year window
- **Practical note:** Choose the 3 years wisely — pick years with maximum projected profit

**Section 56(2)(viib) — Angel Tax Exemption:**
- **What:** Exemption from "angel tax" on share premium received from investors
- **Why it matters:** Without this, if Layaa AI issues shares at a premium to investors, the premium exceeding fair market value is taxed as income
- **Eligibility:** Automatic for DPIIT-recognized startups (post-2024 amendments broadened exemption)
- **Action for Layaa AI:** When raising funds, ensure DPIIT recognition is active and file Form 2 declaration with DPIIT

### Self-Certification for Labor & Environmental Laws

DPIIT-recognized startups can self-certify compliance (no inspector visits for 3 years from incorporation) under 9 laws:

1. The Industrial Disputes Act, 1947
2. The Trade Unions Act, 1926
3. Building and Other Constructions Workers' Act, 1996
4. The Industrial Employment (Standing Orders) Act, 1946
5. The Inter-State Migrant Workmen Act, 1979
6. The Payment of Gratuity Act, 1972
7. The Contract Labour (Regulation and Abolition) Act, 1970
8. The Employees' Provident Funds Act, 1952
9. The Employees' State Insurance Act, 1948

**Practical impact for Layaa AI:** Minimal currently (no employees). Will become relevant when hiring.

### Intellectual Property Benefits

- **Fast-track patent examination:** 80% rebate on patent filing fees for DPIIT startups
- **Fast-track trademark:** Expedited examination available
- **Layaa AI has filed:** Trademark for "Layaa AI" under Class 42

### Public Procurement Relaxation

- Government entities must relax prior experience and turnover requirements for DPIIT startups in public procurement
- Layaa AI can bid for government contracts without meeting the standard prior experience/turnover criteria
- **Practical use:** If pursuing government education/IT contracts (schools, digital India programs)

### SISFS — Startup India Seed Fund Scheme

- Up to Rs.20 Lakh seed funding through DPIIT-approved incubators
- **Layaa AI status:** Application under preparation. Target incubators: DTU IIF, FITT IIT Delhi, NIET TBI Greater Noida
- **Key requirement:** Must be incubated by an approved incubator to access SISFS funds

---

## 6. MCA Annual Compliance Calendar

### Critical Annual Filings

| Filing | Form | Deadline | Who Prepares | Who Files |
|---|---|---|---|---|
| Director KYC | DIR-3 KYC | 30 September annually | Each Director (documents) | CA/CS via MCA portal |
| Auditor Appointment | ADT-1 | Within 15 days of AGM | Anne (draft resolution) | CA/CS |
| Financial Statements | AOC-4 | Within 30 days of AGM | Aarav (data) + CA (preparation) | CA/CS |
| Annual Return | MGT-7/7A | Within 60 days of AGM | Anne (data compilation) | CA/CS |
| Return of Deposits | DPT-3 | 30 June annually | Anne (verification) | CA/CS |
| Director Disclosure | DIR-8 | First Board Meeting of FY | Each Director | Filed in Board records |

### AGM Timeline

- **AGM must be held by:** 30 September each year (within 6 months of FY end for March FY)
- **First AGM exception:** Within 9 months of FY end, but also within 18 months of incorporation
  - Layaa AI incorporated 19 Dec 2024, so first AGM by **18 June 2026** or 31 December 2025 (9 months from March 2025 FY end) — whichever is later. Practically, first AGM should be held by June 2026.
- **Gap between two AGMs:** Not more than 15 months

### Board Meeting Requirements

- **Minimum:** 4 Board Meetings per year
- **Gap:** Not more than 120 days between two consecutive Board Meetings
- **Quorum:** 2 directors or 1/3 of total strength, whichever is higher (for Layaa AI with 2 directors: both must be present)
- **Notice:** 7 days advance notice (can be shorter with consent of all directors)
- **First Board Meeting:** Within 30 days of incorporation

### First-Year Specific Filings

| Filing | Form | Deadline | Status |
|---|---|---|---|
| Business Commencement Declaration | INC-20A | Within 180 days of incorporation (~17 June 2025) | Must be tracked |
| First Auditor Appointment | Board Resolution | Within 30 days of incorporation | Verify with CA |

### Penalty Quick Reference

| Default | Penalty |
|---|---|
| Late DIR-3 KYC | Rs.5,000 per director |
| Late ADT-1 | Rs.300/day of default |
| Late AOC-4 | Rs.100/day (max Rs.10 Lakh) |
| Late MGT-7/7A | Rs.100/day (max Rs.5 Lakh) |
| AGM not held | Rs.1 Lakh on company + Rs.5,000 on every officer in default |
| Late INC-20A | Rs.50,000 + risk of CIN deactivation |
| Late DPT-3 | Rs.5,000 + Rs.500/day |

---

## 7. Indian Banking & Payments

### Bank Account Requirements

- **Current Account** is mandatory for a Private Limited Company (savings account not permissible for company transactions)
- Documents needed: Certificate of Incorporation, PAN, Board Resolution for account opening, MOA & AOA, identity/address proof of directors
- Recommended: Open with a bank that supports startup-friendly digital banking (Razorpay X, Open, Jupiter Business, or traditional banks like ICICI/HDFC with good net banking)

### Payment Methods in Indian Business

| Method | Use Case | Settlement Time | Cost |
|---|---|---|---|
| **UPI** | B2B payments up to Rs.1 Lakh (Rs.2L for some categories), vendor payments, quick transfers | Instant | Free |
| **NEFT** | Standard bank transfers, vendor payments, any amount | 30 minutes (batch processing) | Rs.2-25 depending on amount |
| **RTGS** | Large transfers (minimum Rs.2 Lakh) | Real-time | Rs.5-50 depending on amount |
| **IMPS** | Instant transfers up to Rs.5 Lakh | Instant | Rs.5-15 |
| **Cheque** | Formal payments, rent, government | 2-3 business days (clearing) | Cost of cheque book |

### Payment Gateway Options (For Client Collections)

If Layaa AI collects payments online for EduFlow or other products:

| Gateway | Key Feature | MDR (approx.) | Settlement |
|---|---|---|---|
| **Razorpay** | Most popular for startups, good dashboard, supports UPI/cards/netbanking | 2% + GST | T+2 |
| **Cashfree** | Competitive pricing, good for payouts | 1.75-2% + GST | T+1 to T+2 |
| **PayU** | Established player, EMI options | 2% + GST | T+2 to T+3 |
| **Stripe** | Best for international payments | 2% domestic / 3% international + GST | T+2 |

**GST on payment gateway fees:** Payment gateway charges are subject to 18% GST. Layaa AI can claim ITC on this GST.

### TCS on Payment Gateway Collections

- **Section 206C(1H):** Seller receiving payment exceeding Rs.50 Lakh from a buyer through any mode must collect TCS at 0.1%
- **Applicability for Layaa AI:** Not applicable currently (turnover below threshold). Monitor when collections from a single client exceed Rs.50 Lakh annually.

### Invoice Payment Best Practices for Layaa AI

- Always collect payment to the company's current account (never to personal accounts)
- For implementation fees: 50% advance on signing, 50% on delivery (as per pricing structure)
- For retainers: Monthly advance payment, due by 5th of each month
- Payment terms in contracts: Net 15 for SME clients, Net 30 for larger clients (never exceed Net 60 — red flag threshold)
- Always issue GST-compliant invoice before or at the time of receiving payment
- Maintain a payment receipt register reconciled with bank statements monthly (Aarav's responsibility)

---

## 8. Quick Cross-Reference: Which Agent Handles What

| Topic | Primary Agent | Supporting Agent |
|---|---|---|
| GST computation & filing prep | Aarav (Accounting & Finance) | Anne (deadline tracking) |
| TDS deduction & deposit | Aarav | Anne (deadline tracking) |
| MCA form preparation & filing | Anne (Chartered Compliance Assistant) | CA (external) |
| Contract drafting & legal clauses | Abhay (Legal & Contracts Advisor) | Preeti (regulatory validation) |
| DPDP Act compliance | Preeti (Regulatory Compliance & Data Governance Advisor) | Abhay (DPA drafting) |
| Startup India benefits & grants | Anne | Kabir (strategic decisions) |
| Invoice generation & pricing | Aarav (invoicing) + Veer (pricing) | Rishi (revenue tracking) |
| Banking & payment operations | Aarav | Founders (signatory authority) |

---

## 9. Key External Portals Reference

| Portal | URL | Purpose |
|---|---|---|
| MCA Portal | mca.gov.in | Company filings (AOC-4, MGT-7, DIR-3 KYC, etc.) |
| GST Portal | gst.gov.in | GST returns, registration, ITC |
| TRACES | tdscpc.gov.in | TDS returns, certificates, Form 26AS |
| Income Tax | incometax.gov.in | ITR filing, advance tax, refunds |
| Startup India | startupindia.gov.in | DPIIT recognition, 80-IAC application, SISFS |
| Udyam | udyamregistration.gov.in | MSME registration updates |
| e-Stamping (Haryana) | shcilestamp.com | Stamp duty payment for agreements |
| DPGA | dpga.gov.in | Data Protection Board (when operational) |

---

## 10. Important Thresholds to Monitor

| Threshold | Current Status | Trigger | Impact |
|---|---|---|---|
| GST turnover Rs.5 Cr | Well below | E-invoicing mandatory | Must integrate with IRP |
| Turnover Rs.1 Cr (Rs.10 Cr if <5% cash) | Below | Tax audit mandatory | Must get Form 3CA/3CD |
| Turnover Rs.2 Cr | Below | MGT-7 instead of MGT-7A | Full annual return required |
| Aggregate turnover Rs.40 Lakh+ | Monitor | GST registration mandatory | Already registered |
| TDS on single payment Rs.30K+ | Active | Must deduct TDS | Already being tracked |
| Employee count crossing 10/20 | 0 currently | PF/ESI registration | Must register under EPF & ESI Acts |
| Annual revenue Rs.50L+ | Target phase | Advance tax obligations | Quarterly advance tax payments required |

---

*This document is maintained as the shared Indian business context reference for all Layaa AI agents. All agents should treat this as authoritative for Indian regulatory, tax, and compliance matters. For company-specific context (vision, services, team), refer to `Layaa AI — Company Context.md`. Last updated: April 2026.*
