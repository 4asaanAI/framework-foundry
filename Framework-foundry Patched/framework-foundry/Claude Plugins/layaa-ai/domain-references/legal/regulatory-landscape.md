# Layaa AI — Regulatory Landscape

## Key Regulations Applicable to Layaa AI

### 1. Companies Act, 2013
**Applicability:** Layaa AI is a Private Limited Company
- MCA filings (AOC-4, MGT-7, ADT-1)
- Board meetings: minimum 4/year, gap ≤120 days
- AGM: before September 30 annually
- Statutory registers: members, directors, charges
- Director duties and disqualification rules
- Related party transaction approvals

### 2. Digital Personal Data Protection Act, 2023 (DPDP Act)
**Applicability:** Layaa AI processes personal data for clients
- **Consent:** Obtain valid consent before processing personal data; consent must be free, specific, informed, unconditional, and unambiguous
- **Data Fiduciary obligations:** Determine purpose and means of processing; implement security safeguards; publish privacy policy
- **Data Principal rights:** Access, correction, erasure, grievance redressal, nomination
- **Data Processor obligations:** Process only on instructions of Data Fiduciary; implement security measures
- **Breach notification:** Notify Data Protection Board and affected individuals; no specific timeline in Act yet (CERT-In 6-hour rule applies separately)
- **Cross-border transfers:** Permitted except to countries notified by Central Government as restricted
- **Children's data:** Additional protections; verifiable parental consent required for under-18
- **Penalties:** Up to ₹250 crore for significant breaches

**Layaa AI's position:** Acts as Data Processor when handling client data; acts as Data Fiduciary for own employee/prospect data.

### 3. Information Technology Act, 2000 + IT Rules
**Applicability:** Layaa AI provides technology services
- **Reasonable security practices:** ISO 27001 or equivalent (IT Rules, Rule 8)
- **Intermediary guidelines:** If Layaa AI hosts/processes user content
- **Cyber incident reporting:** CERT-In mandate — report incidents within 6 hours
- **Data retention:** Maintain logs for 180 days (rolling), available to CERT-In
- **Encryption:** No restrictions on use; specific standards for financial data

### 4. Indian Contract Act, 1872
**Applicability:** All client and vendor contracts
- Contract enforceability requirements: offer, acceptance, consideration, competency, free consent
- Void and voidable agreements
- Indemnity and guarantee provisions
- Bailment (relevant for client data handling)

### 5. Goods and Services Tax (GST)
**Applicability:** IT services and consulting are taxable
- **Rate:** 18% on IT/consulting/automation services
- **Registration:** Required (turnover threshold ₹20L for services)
- **Invoice requirements:** GST number, HSN/SAC code (998314 for IT consulting), tax breakup
- **Filing deadlines:** GSTR-1 by 11th, GSTR-3B by 20th of following month
- **Input tax credit:** Available on business expenses, tools, infrastructure
- **Reverse charge:** Applicable on certain imported services

### 6. Intellectual Property Laws
**Applicability:** Layaa AI creates and uses IP
- **Copyright Act, 1957:** Automatic protection for original works (code, content, documentation); work-for-hire provisions; assignment must be in writing
- **Patents Act, 1970:** Software per se not patentable in India; process patents possible for novel AI methods
- **Trade Marks Act, 1999:** Layaa AI trademark filed/pending; brand protection
- **Trade Secrets:** No specific legislation; protected under contract law and equity

### 7. Labour Laws (if hiring employees)
**Applicability:** When Layaa AI hires employees
- **Provident Fund (PF):** Mandatory for 20+ employees; voluntary before
- **ESI:** Mandatory for 10+ employees earning ≤₹21,000/month
- **Shops & Establishments Act:** State-specific (Haryana); registration, working hours, leave
- **Payment of Wages/Bonus:** Statutory compliance
- **Sexual Harassment (PoSH Act):** Mandatory Internal Complaints Committee for 10+ employees

### 8. Startup India / DPIIT
**Applicability:** Layaa AI has DPIIT recognition
- **80-IAC tax exemption:** 3 consecutive years out of first 10 years; requires Inter-Ministerial Board certification
- **Self-certification:** Labour and environment laws compliance
- **Patent/trademark fee concession:** 80% rebate
- **Government procurement:** Relaxation of turnover/experience criteria
- **Fund of Funds:** Access to government-backed VC funding
- **Recognition requirements:** Must remain eligible (turnover <₹100 crore, entity age <10 years)

### 9. Foreign Exchange Management Act (FEMA)
**Applicability:** If serving foreign clients or receiving foreign investment
- **FDI:** 100% FDI permitted in IT/ITES under automatic route
- **Export of services:** Comply with RBI guidelines on receipt of payment
- **SOFTEX form:** Required for software export earnings
- **Transfer pricing:** If related party transactions with foreign entities
- **External Commercial Borrowings:** RBI approval route

---

## Sector-Specific Guidance (for Layaa AI's ICP Segments)

### Fintech Clients
- RBI regulations on data handling, especially payment data
- PCI-DSS compliance if touching payment card data
- Data localization: Payment data must be stored in India (RBI mandate)
- KYC/AML regulations may apply to automations touching customer data
- **Layaa AI risk:** Ensure SoW explicitly states Layaa AI does not handle payment data directly; client responsible for regulatory compliance

### Healthcare Clients
- DPDP Act "sensitive personal data" implications for health data
- No HIPAA equivalent in India yet, but DPDP Act covers health data
- Telemedicine guidelines if applicable
- **Layaa AI risk:** Additional data protection clauses in contract; restrict data access to minimum necessary

### Government Clients
- GeM (Government e-Marketplace) registration may be required
- Public procurement rules and tendering process
- Right to Information Act — government contracts may be subject to RTI
- **Layaa AI risk:** Longer payment cycles; specific compliance requirements; Founder approval needed

### Education Clients
- Children's data under DPDP Act requires parental consent
- EdTech guidelines (voluntary) on data practices
- **Layaa AI risk:** If automation processes student data, additional safeguards needed

---

## Cross-Border Data Transfer

Under DPDP Act:
- **Default:** Cross-border transfer is permitted
- **Exception:** Central Government may restrict transfer to specific countries
- **Contractual safeguards:** Include data protection clauses in contracts with foreign clients
- **Practical approach:** Process data in India where possible; if cross-border transfer needed, ensure client consent and contractual protections

---

## Compliance Monitoring Approach

| Frequency | Activity | Owner |
|-----------|----------|-------|
| Daily | Monitor regulatory news feeds | Preeti |
| Weekly | Review new client contracts for regulatory flags | Abhay + Preeti |
| Monthly | Compliance status review | Anne + Preeti |
| Quarterly | Full regulatory compliance audit | Preeti → Kabir |
| Annually | DPIIT/Udyam renewal check | Anne |
| As needed | New regulation impact assessment | Preeti |
