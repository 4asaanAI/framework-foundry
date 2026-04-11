# Indian Business & Regulatory Context

**Document Owner:** Shubham Sharma, CTO
**Last Updated:** April 2026
**Classification:** Internal Reference

---

## Overview

This document serves as a comprehensive regulatory and business environment reference for Layaa AI Private Limited. It covers the key compliance obligations, tax requirements, legal frameworks, and business context relevant to operating an AI technology company in India, specifically serving Indian SMEs.

Layaa AI is incorporated as a Private Limited Company under the Companies Act 2013, operating from Haryana, India.

---

## 1. Goods & Services Tax (GST)

### 1.1 GST Rate for IT Services

| Item | Rate |
|------|------|
| Software development services | 18% |
| SaaS / cloud services | 18% |
| IT consulting and AI services | 18% |
| Training and enablement services | 18% |

Layaa AI's services fall under SAC 998314 (IT consulting and support services) and SAC 998315 (hosting and IT infrastructure provisioning services), both taxed at **18% GST**.

### 1.2 Intra-State vs Inter-State Supply

| Type | Tax Applied | Example |
|------|------------|---------|
| Intra-state (within Haryana) | CGST 9% + SGST 9% = 18% | Layaa AI (Haryana) to client (Haryana) |
| Inter-state (across states) | IGST 18% | Layaa AI (Haryana) to client (Maharashtra) |
| Export of services | Zero-rated (0%) with LUT | Layaa AI (India) to client (USA) |

**Place of Supply for services:** Location of the recipient (Section 12, IGST Act). For B2B services, this is the registered address of the recipient.

### 1.3 GST Filing Calendar

| Return | Frequency | Due Date | Contents |
|--------|-----------|----------|----------|
| GSTR-1 | Monthly | 11th of following month | Outward supply details (invoices issued) |
| GSTR-3B | Monthly | 20th of following month | Summary return + tax payment |
| GSTR-9 | Annual | 31st December | Annual return consolidating all monthly returns |
| GSTR-9C | Annual (if turnover > INR 5 Cr) | 31st December | Reconciliation statement (audited) |

**Note:** If aggregate turnover is under INR 5 Cr, quarterly filing under QRMP scheme is available (GSTR-1 quarterly, GSTR-3B monthly or quarterly with IFF option).

### 1.4 Input Tax Credit (ITC) Eligibility

**Eligible for ITC:**
- GST paid on cloud hosting services (VPS, Backblaze B2)
- GST paid on software subscriptions (if any taxable SaaS tools)
- GST paid on professional services (legal, accounting)
- GST paid on office rent (commercial)
- GST paid on computer hardware and equipment
- GST paid on internet services

**Not eligible for ITC:**
- Food and beverages (Section 17(5))
- Motor vehicle expenses (unless in the business of transport)
- Membership of clubs, fitness centres
- Personal consumption items
- Goods/services used for exempt supplies

**ITC conditions:**
- Must have a valid tax invoice.
- Goods/services must be received.
- Return must be filed by the supplier (visible in GSTR-2B).
- Payment must be made to supplier within 180 days.

### 1.5 E-Invoicing

| Threshold | Requirement |
|-----------|-------------|
| Aggregate turnover > INR 5 Cr | Mandatory e-invoicing via IRP (Invoice Registration Portal) |
| Below INR 5 Cr | Not mandatory (as of April 2026, monitor for threshold changes) |

E-invoicing requires generating a unique IRN (Invoice Reference Number) for every B2B invoice via the government's Invoice Registration Portal before issuing the invoice to the client.

**Action for Layaa AI:** Monitor aggregate turnover. When approaching INR 5 Cr, implement e-invoicing integration. This is a potential automation opportunity for the CA AI Agent product as well.

---

## 2. Tax Deducted at Source (TDS)

### 2.1 Common TDS Rates

| Section | Payment Type | Rate (with PAN) | Rate (without PAN) |
|---------|-------------|-----------------|-------------------|
| 194J | Professional/Technical services fees | 10% | 20% |
| 194C | Contractor payments (individuals) | 1% | 20% |
| 194C | Contractor payments (companies/firms) | 2% | 20% |
| 194H | Commission or brokerage | 5% | 20% |
| 194I(a) | Rent on plant/machinery/equipment | 2% | 20% |
| 194I(b) | Rent on land/building/furniture | 10% | 20% |
| 194A | Interest (non-bank) | 10% | 20% |
| 194O | E-commerce operator payments | 1% | 5% |
| 192 | Salary | Slab rates | N/A |

**Relevance to Layaa AI:**
- **As a payer:** Layaa AI deducts TDS when paying contractors, consultants, rent, etc.
- **As a payee:** Clients deduct TDS (typically 194J at 10%) when paying Layaa AI for professional/technical services.
- Ensure TAN (Tax Deduction Account Number) is active and used for all TDS deposits.

### 2.2 TDS Deposit Calendar

| Payment Type | Deposit Due Date |
|-------------|-----------------|
| All months except March | 7th of the following month |
| March (year-end) | 30th April |
| Government deductors | Same day as deduction |

**Example:** TDS deducted in January 2026 must be deposited by 7th February 2026.

### 2.3 TDS Return Filing

| Return | Applicable To | Frequency | Due Date |
|--------|-------------|-----------|----------|
| 26Q | TDS on non-salary payments | Quarterly | 31st July (Q1), 31st Oct (Q2), 31st Jan (Q3), 31st May (Q4) |
| 24Q | TDS on salary | Quarterly | Same as 26Q |

**Form 16/16A:**
- Form 16: Annual TDS certificate for salary (issued by 15th June).
- Form 16A: Quarterly TDS certificate for non-salary payments (issued within 15 days of filing quarterly return).

**Action for Layaa AI:** File 26Q quarterly. Issue Form 16A to payees. Collect Form 16A from clients who deduct TDS on Layaa AI's invoices. Reconcile TDS credits in Form 26AS/AIS.

---

## 3. Indian Contract Act 1872

### 3.1 Valid Contract Elements (Section 10)

For Layaa AI's client agreements, every contract must satisfy:

| Element | Requirement | Practical Application |
|---------|------------|----------------------|
| Offer & Acceptance | Clear offer and unambiguous acceptance | Proposal document + signed SOW/agreement |
| Lawful Consideration | Something of value exchanged | Service fees for automation delivery |
| Capacity to Contract | Parties must be competent (age 18+, sound mind, not disqualified by law) | Verify signatory authority for companies |
| Free Consent | No coercion, undue influence, fraud, misrepresentation, or mistake (Sections 14-22) | Transparent terms, no pressure tactics |
| Lawful Object | Purpose must be legal | Automation services are legal |
| Not Expressly Declared Void | Contract type is not listed as void under the Act | Check against Sections 24-30 |

### 3.2 Void Agreements (Key Sections)

| Section | Void Agreement Type | Relevance |
|---------|-------------------|-----------|
| Section 24 | Agreements with unlawful consideration/object | Ensure all services are lawful |
| Section 25 | Agreements without consideration (exceptions: gift, past service, time-barred debt) | Always have consideration in commercial agreements |
| Section 26 | Agreements in restraint of marriage | Not applicable |
| **Section 27** | **Agreements in restraint of trade -- VOID in India** | **Non-compete clauses are unenforceable in India.** Cannot prevent an employee or contractor from working with competitors after leaving. Can only protect trade secrets and confidential information via NDA, not restrict employment |
| Section 28 | Agreements in restraint of legal proceedings | Arbitration clauses are permitted (exception) |
| Section 29 | Uncertain agreements | Draft precise, unambiguous terms |
| Section 30 | Wagering agreements | Not applicable |

**Critical for Layaa AI:** Section 27 means non-compete clauses in employment or contractor agreements are void and unenforceable in India. Instead, protect intellectual property through:
- Non-disclosure agreements (NDAs) -- enforceable.
- Confidentiality clauses -- enforceable.
- IP assignment clauses -- enforceable.
- Trade secret protections -- enforceable.
- Garden leave provisions -- enforceable if compensated.

### 3.3 Breach of Contract & Damages (Sections 73-74)

| Section | Provision | Application |
|---------|----------|-------------|
| Section 73 | Compensation for loss or damage caused by breach | Aggrieved party can claim actual damages naturally arising from the breach. Must prove actual loss. Remote/indirect damages not recoverable |
| Section 74 | Liquidated damages and penalty | If the contract specifies a sum payable on breach, the court will award reasonable compensation not exceeding that sum. The specified amount serves as a ceiling, not an automatic entitlement |

**Best practice for Layaa AI contracts:**
- Include a liquidated damages clause with a reasonable cap (typically capped at total contract value or fees paid).
- Specify liability limitations (exclude consequential, indirect, and special damages).
- Define what constitutes a material breach.
- Include a cure period (e.g., 15-30 days to remedy a breach before termination).

### 3.4 Arbitration

Arbitration clauses are enforceable in India under the Arbitration and Conciliation Act 1996 (as amended 2019).

**Standard Layaa AI arbitration clause elements:**
- Seat of arbitration: Gurugram, Haryana (or mutually agreed Indian city).
- Language: English.
- Number of arbitrators: Sole arbitrator for disputes under INR 10 Lakh; three arbitrators for larger disputes.
- Governing law: Laws of India.
- Institutional arbitration preferred (e.g., DIAC -- Delhi International Arbitration Centre).

---

## 4. Digital Personal Data Protection Act 2023 (DPDP Act)

### 4.1 Key Obligations for Layaa AI

As a "Data Fiduciary" (entity that determines the purpose and means of processing personal data):

| Obligation | Requirement | Implementation |
|-----------|-------------|----------------|
| **Consent** | Obtain free, specific, informed, unconditional, unambiguous consent with clear affirmative action | Consent form/click-through before collecting any personal data. Consent must be as easy to withdraw as to give |
| **Purpose Limitation** | Process data only for the purpose for which consent was given | Document data processing purposes. Do not repurpose data without fresh consent |
| **Data Minimisation** | Collect only data that is necessary for the stated purpose | Audit data collection points. Remove fields that are not strictly necessary |
| **Accuracy** | Ensure personal data is accurate and up to date | Provide users a way to update their data. Periodic data quality checks |
| **Storage Limitation** | Do not retain data longer than necessary for the purpose | Define retention periods per data category. Implement automated deletion |
| **Security Safeguards** | Implement reasonable security measures to protect data | Encryption, access controls, audit logging, regular security reviews |

### 4.2 Data Breach Notification

| Requirement | Detail |
|------------|--------|
| Notify the Data Protection Board | Within 72 hours of becoming aware of a personal data breach |
| Notify affected Data Principals | As directed by the Data Protection Board |
| Contents of notification | Nature of breach, data affected, remedial measures taken, contact person |

**Layaa AI breach response plan:**
1. Detect and contain the breach (immediate).
2. Assess scope and impact (within 12 hours).
3. Notify CTO and legal advisor (within 12 hours).
4. Notify the Data Protection Board (within 72 hours).
5. Notify affected individuals as directed.
6. Remediate and document lessons learned.

### 4.3 Penalties

| Violation | Maximum Penalty |
|-----------|----------------|
| Failure to take security safeguards to prevent breach | Up to INR 250 Crore |
| Failure to notify the Board of a breach | Up to INR 200 Crore |
| Non-compliance with obligations regarding children's data | Up to INR 200 Crore |
| Non-compliance with additional obligations for Significant Data Fiduciary | Up to INR 150 Crore |
| Other non-compliance | Up to INR 50 Crore |

### 4.4 Data Principal Rights

| Right | Description | Layaa AI Implementation |
|-------|------------|------------------------|
| Right to Access | Request summary of personal data and processing activities | Provide data export feature in Layaa OS |
| Right to Correction | Request correction of inaccurate or misleading data | User profile editing, support request process |
| Right to Erasure | Request deletion of personal data that is no longer necessary | Data deletion workflow, automated for clear cases |
| Right to Grievance Redressal | Lodge complaints about data processing | Designated contact person, response within 30 days |
| Right to Nominate | Nominate another person to exercise rights in case of death or incapacity | Process for handling nominee requests |

### 4.5 Cross-Border Data Transfer

The DPDP Act allows transfer of personal data to countries/territories not restricted by the Central Government. The Government will publish a list of countries where transfer is NOT allowed (negative list approach).

**Layaa AI's position:**
- Core data stored on Indian VPS (no cross-border transfer for storage).
- LLM API calls to Anthropic/OpenAI may involve data leaving India temporarily for processing.
- Mitigation: Minimise personal data sent to LLM APIs. Use anonymisation where possible. Document the data flow and obtain consent for LLM processing.

---

## 5. Startup India Benefits

Layaa AI is eligible for benefits under the Startup India programme (DPIIT-recognised startup).

### 5.1 Section 80-IAC Tax Holiday

| Benefit | Detail |
|---------|--------|
| What | 100% tax exemption on profits for any 3 consecutive years out of the first 10 years from incorporation |
| Eligibility | DPIIT-recognised startup, incorporated as Private Limited / LLP / Partnership, turnover under INR 100 Cr in any financial year |
| How to claim | Apply via the Inter-Ministerial Board (IMB). Approved startups can claim deduction while filing ITR |
| Important | The 3-year window is chosen by the startup. Choose years when profits are highest |

### 5.2 Angel Tax Exemption (Section 56(2)(viib))

| Benefit | Detail |
|---------|--------|
| What | Exemption from tax on share premium received from investors (investment exceeding fair market value of shares) |
| Eligibility | DPIIT-recognised startup, aggregate paid-up share capital + share premium does not exceed INR 25 Cr |
| How to claim | File Form 2 with DPIIT. Obtain exemption certificate |
| Status (2026) | The Finance Act 2024 effectively repealed Angel Tax for all investors (including residents). Verify current status for each fundraise |

### 5.3 Self-Certification for Labour and Environmental Laws

| Benefit | Detail |
|---------|--------|
| What | DPIIT-recognised startups can self-certify compliance under 6 labour laws and 3 environmental laws for the first 5 years |
| Labour laws covered | Industrial Disputes Act, Trade Unions Act, Building & Construction Workers Act, Inter-State Migrant Workmen Act, Payment of Gratuity Act, Contract Labour Act |
| Environmental laws covered | Water (Prevention and Control) Act, Air (Prevention and Control) Act, Environment Protection Act |
| Practical impact | Reduced inspection burden; inspections only on written complaint or actionable evidence |

### 5.4 Intellectual Property (IP) Fast-Track

| Benefit | Detail |
|---------|--------|
| What | Fast-tracked examination of patent, trademark, and design applications |
| Facilitation | Government-appointed facilitators help with filing; 80% fee rebate on patent filing |
| Relevance | If Layaa AI files patents on its AI automation methodology or architecture |

### 5.5 Public Procurement Relaxation

| Benefit | Detail |
|---------|--------|
| What | Exemption from prior turnover and experience requirements in government tenders |
| Condition | Must meet quality and technical specifications |
| Relevance | Enables Layaa AI to bid for government AI/automation projects without turnover history |

### 5.6 SISFS (Startup India Seed Fund Scheme)

| Benefit | Detail |
|---------|--------|
| What | Up to INR 50 Lakh seed funding for proof of concept, prototype, product trials, market entry, commercialisation |
| Eligibility | DPIIT-recognised, incorporated < 2 years ago, not received > INR 10 Lakh funding from other government schemes |
| How to apply | Via selected incubators; apply on Startup India portal |

---

## 6. MCA (Ministry of Corporate Affairs) Compliance

### 6.1 Annual Filings

| Filing | Form | Due Date | Contents |
|--------|------|----------|----------|
| Annual Return | MGT-7A (for small companies) or MGT-7 | Within 60 days of AGM | Shareholding pattern, directors, meetings, etc. |
| Financial Statements | AOC-4 | Within 30 days of AGM | Balance sheet, P&L, notes, auditor's report |
| DIR-3 KYC | DIR-3 KYC | 30th September annually | Director KYC verification (for all directors) |
| DPT-3 | DPT-3 | 30th June annually | Return of deposits (if any) |
| MSME-1 | MSME-1 | Half-yearly (31st Oct, 30th April) | Outstanding payments to MSME vendors (if exceeding 45 days) |

### 6.2 AGM (Annual General Meeting) Requirements

| Requirement | Detail |
|------------|--------|
| Frequency | Once every calendar year |
| Gap | Not more than 15 months between two consecutive AGMs |
| First AGM | Within 9 months from the close of the first financial year |
| Notice | 21 clear days before the meeting (shorter notice with 95% members' consent) |
| Quorum | 2 members present in person (for Private Limited) |
| Venue | Registered office city or any place in India (virtual AGM permissible under certain conditions) |

### 6.3 Board Meeting Requirements

| Requirement | Detail |
|------------|--------|
| Frequency | Minimum 4 board meetings per year |
| Gap | Not more than 120 days between consecutive board meetings |
| First meeting | Within 30 days of incorporation |
| Notice | 7 days' written notice to all directors |
| Quorum | One-third of total strength or 2 directors, whichever is higher |
| Minutes | Must be prepared within 30 days and entered in the minutes book |

### 6.4 Penalties for Non-Compliance

| Violation | Company Penalty | Director/Officer Penalty |
|-----------|----------------|------------------------|
| Late filing of annual return | INR 100/day of default (up to financial statement filing amount) | INR 50,000 - INR 5,00,000 |
| Failure to hold AGM | INR 1,00,000 + INR 5,000/day of continuing default | INR 1,00,000 + INR 5,000/day |
| Failure to hold board meetings | INR 25,000 per director for each default | INR 25,000 per default |
| Failure to file DIR-3 KYC | DIN deactivated; INR 5,000 for reactivation | Director personally affected |

---

## 7. Banking & Payments

### 7.1 Current Account Requirements

| Requirement | Detail |
|------------|--------|
| Eligibility | Must be a registered business entity (Private Limited company in Layaa AI's case) |
| Documents | Certificate of Incorporation, MOA/AOA, PAN card of company, board resolution for account opening, KYC of all directors, registered office address proof |
| Minimum balance | Varies by bank (typically INR 10,000 - INR 25,000 for current accounts) |
| Note | RBI guidelines restrict individuals from opening more than one current account for the same business |

### 7.2 Payment Methods

| Method | Use Case | Details |
|--------|----------|---------|
| **UPI** | Client payments (small-medium), vendor payments | Instant, 24/7, zero cost for P2P. Business UPI accounts available. Transaction limit: INR 1-5 Lakh per transaction depending on bank/app |
| **NEFT** | Client invoices, vendor payments | Batch processing every 30 minutes (effectively real-time). No upper limit. Available 24/7/365. Charges: NIL for online transactions (RBI mandate) |
| **RTGS** | Large payments (> INR 2 Lakh) | Real-time gross settlement. Minimum INR 2 Lakh. No upper limit. Available 24/7/365. Charges: NIL for online transactions |
| **IMPS** | Urgent small-medium transfers | Instant, 24/7. Limit: INR 5 Lakh per transaction. Small charges may apply |
| **Cheque** | Legacy clients, certain vendor payments | Clearing time 2-3 days. Increasingly rare but still used in some SME transactions |

### 7.3 Payment Gateways (For Collecting Client Payments Online)

| Gateway | Key Features | Typical MDR |
|---------|-------------|-------------|
| Razorpay | UPI, cards, net banking, EMI. Strong API. Popular with startups | 2% for most instruments |
| Cashfree | UPI, cards, net banking. Good payout APIs | 1.90-2% |
| PayU | UPI, cards, net banking. EMI options | 2-2.25% |
| Stripe (India) | International card support, clean API. Limited Indian payment methods | 2% + GST for domestic, 3% for international |

**Recommendation for Layaa AI:** Razorpay or Cashfree for domestic payments (comprehensive Indian payment method support). Consider Stripe for international clients (if/when serving export markets).

**GST on payment gateway MDR:** Payment gateway charges attract 18% GST, which is eligible for ITC.

---

## 8. Key Thresholds to Monitor

These thresholds trigger additional compliance obligations as Layaa AI grows. Monitor proactively.

| Threshold | Trigger | Obligation Triggered |
|-----------|---------|---------------------|
| **Aggregate turnover > INR 5 Cr** | GST e-invoicing becomes mandatory | Implement e-invoicing via IRP for all B2B invoices |
| **Aggregate turnover > INR 1 Cr (business) / INR 50 Lakh (profession)** | Tax audit under Section 44AB | Mandatory tax audit by a Chartered Accountant |
| **Turnover > INR 10 Cr** | Audit of GST reconciliation (GSTR-9C) | Annual reconciliation statement by CA |
| **20+ employees** | Provident Fund (PF) mandatory under EPF Act | Register with EPFO, deduct and deposit PF (12% employee + 12% employer of basic + DA) |
| **10+ employees (in notified areas) or 20+ employees** | ESI (Employees' State Insurance) mandatory | Register with ESIC, deduct and deposit ESI (0.75% employee + 3.25% employer) for employees earning up to INR 21,000/month |
| **Salary payment > INR 21,000/month per employee** | Professional Tax (state-specific) | Register for Professional Tax in Haryana. Deduct from employee salary and deposit with state |
| **Turnover > INR 50 Cr** | TCS on sale of goods (Section 206C(1H)) | Collect TCS at 0.1% on sale consideration exceeding INR 50 Lakh per buyer per year |
| **Foreign transactions** | Transfer pricing documentation | If Layaa AI has international associated enterprises, maintain transfer pricing documentation |
| **Total receipts > INR 50 Lakh (professional)** | Presumptive taxation option (Section 44ADA) | Can declare 50% of gross receipts as income (simplified, but may not be optimal) |

---

## 9. Stamp Duty (Haryana)

Stamp duty is payable on various agreements and instruments. Rates vary by state; below are Haryana rates relevant to Layaa AI.

### 9.1 Common Instruments

| Instrument | Stamp Duty (Haryana) | Notes |
|-----------|---------------------|-------|
| Service Agreement / Contract | INR 100 (if no consideration mentioned) to 1-3% of consideration | Varies by contract value and type |
| Non-Disclosure Agreement (NDA) | INR 100 | Nominal stamp duty for agreements not involving transfer of property |
| Employment Agreement | INR 100 | Nominal |
| Lease/Rent Agreement (commercial) | 1.5-3% of total rent for lease period + security deposit | Higher for longer lease periods. Must be registered if > 11 months |
| Power of Attorney (general) | INR 300-500 | For authorising someone to act on behalf |
| Partnership Deed | INR 22.50 per INR 500 of capital | If ever relevant for subsidiary structures |
| Affidavit | INR 10-30 | Various declarations |
| Board Resolution (notarised copy) | INR 10-100 | When certified copies needed for banking/regulatory |

### 9.2 E-Stamping

Haryana uses e-stamping (SHCIL -- Stock Holding Corporation of India Limited). E-stamp certificates can be purchased online or at authorised centres.

**Process:**
1. Visit SHCIL portal or authorised stamp vendor.
2. Purchase e-stamp certificate for the required amount.
3. Attach/reference the e-stamp certificate to the document.
4. The certificate has a unique identification number (UIN) verifiable online.

### 9.3 Registration of Documents

| Document Type | Registration Required? |
|--------------|----------------------|
| Lease agreement > 11 months | Yes (mandatory, at Sub-Registrar office) |
| Lease agreement <= 11 months | No (but recommended for evidence) |
| Sale deed | Yes (mandatory) |
| Service agreement | No (but stamp duty still applicable) |
| NDA | No |

---

## 10. Quick Reference: Compliance Calendar

### Monthly

| Date | Obligation |
|------|-----------|
| 7th | TDS deposit for previous month |
| 11th | GSTR-1 filing (outward supplies) |
| 15th | PF deposit for previous month (if applicable) |
| 15th | ESI deposit for previous month (if applicable) |
| 20th | GSTR-3B filing + GST payment |

### Quarterly

| Period | Due Date | Obligation |
|--------|----------|-----------|
| Q1 (Apr-Jun) | 31st July | TDS return (26Q) |
| Q2 (Jul-Sep) | 31st October | TDS return (26Q) |
| Q3 (Oct-Dec) | 31st January | TDS return (26Q) |
| Q4 (Jan-Mar) | 31st May | TDS return (26Q) |

### Annually

| Date | Obligation |
|------|-----------|
| 30th September | AGM (within 6 months of FY end for existing companies) |
| 30th September | DIR-3 KYC for all directors |
| Within 30 days of AGM | AOC-4 (financial statements) filing with MCA |
| Within 60 days of AGM | MGT-7/7A (annual return) filing with MCA |
| 31st October | Income Tax Return (for companies requiring audit; verify current year deadline) |
| 31st December | GSTR-9 (annual GST return) |
| 15th June | Issue Form 16 to employees |

---

## 11. Practical Compliance Checklist for Layaa AI (Current Stage)

Given Layaa AI's current scale (< INR 5 Cr turnover, small team, single-CTO operations):

| Area | Current Obligation | Status Check |
|------|-------------------|-------------|
| GST | Monthly GSTR-1 and GSTR-3B filing | Must file even if nil |
| TDS | Deposit by 7th, 26Q quarterly | If making payments requiring TDS |
| MCA | Annual return + financial statements + DIR-3 KYC | Mandatory every year |
| Income Tax | ITR filing by due date | Mandatory |
| DPDP Act | Consent, purpose limitation, security safeguards | Implement in all products |
| PF/ESI | Not mandatory until employee threshold reached | Monitor headcount |
| E-invoicing | Not mandatory until INR 5 Cr turnover | Monitor turnover |
| Tax audit | Not mandatory until INR 1 Cr turnover | Monitor turnover |
| Board meetings | Minimum 4 per year, max 120-day gap | Schedule in advance |
| Stamp duty | On all agreements as applicable | Use e-stamping |

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
