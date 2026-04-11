# Layaa AI -- Regulatory Landscape

**Document Owner:** Abhimanyu Singh (CEO)
**Last Updated:** April 2026
**Classification:** Internal -- Confidential
**Version:** 2.0

---

## 1. Purpose

This document maps the regulatory environment applicable to Layaa AI Private Limited. It covers data protection, information technology, contract law, arbitration, taxation, and sector-specific regulations relevant to an AI services company incorporated in Haryana, India. This document is a reference guide, not legal advice.

---

## 2. Digital Personal Data Protection Act, 2023 (DPDP Act)

### 2.1 Overview

The DPDP Act, notified in August 2023, is India's comprehensive data protection legislation governing the processing of digital personal data. The rules under the Act are being progressively notified by the Central Government. Layaa AI must comply with the Act in all engagements involving personal data.

### 2.2 Key Concepts

| Concept | Definition | Layaa AI Context |
|---------|-----------|-----------------|
| **Personal Data** | Any data about an individual who is identifiable by or in relation to such data | Client employee data, end-user data, contact details, usage analytics |
| **Data Principal** | The individual to whom personal data relates | End users of solutions built by Layaa AI, client employees |
| **Data Fiduciary** | The entity that determines the purpose and means of processing | Typically the Client (when Layaa AI processes on their behalf). Layaa AI is Data Fiduciary for its own collected data (website visitors, prospects). |
| **Data Processor** | The entity that processes data on behalf of the Data Fiduciary | Layaa AI when processing client data per client instructions |
| **Significant Data Fiduciary** | Data Fiduciary designated by the Central Government based on volume, sensitivity, risk | Not currently applicable to Layaa AI; monitor if data processing volume grows |

### 2.3 Core Obligations

#### Consent (Section 6)
- Personal data may only be processed for a lawful purpose after obtaining free, specific, informed, and unambiguous consent from the Data Principal
- Consent must be sought through a clear and plain notice specifying the data and purpose
- Consent may be withdrawn at any time; withdrawal must be as easy as giving consent
- **Layaa AI action:** Ensure Privacy Policy (effective February 2026) provides adequate notice. Obtain explicit consent before processing personal data. Maintain consent records.

#### Purpose Limitation (Section 5)
- Personal data shall be processed only for the purpose for which it was collected
- Data cannot be repurposed without fresh consent
- **Layaa AI action:** Never use client data or end-user data for purposes beyond the contracted scope. Specifically, never use personal data to train AI models without explicit consent.

#### Data Minimisation
- Collect and process only the personal data that is necessary for the stated purpose
- **Layaa AI action:** Design systems to collect minimum necessary data. Conduct data necessity assessments for each engagement.

#### Data Accuracy (Section 8(3))
- Reasonable efforts to ensure personal data is complete, accurate, and not misleading
- **Layaa AI action:** Implement data validation where applicable. Allow Data Principals to correct their data.

#### Storage Limitation
- Personal data shall not be retained beyond the period necessary for the stated purpose
- If consent is withdrawn or the purpose is fulfilled, data must be erased
- **Layaa AI action:** Define retention periods in DPA and SoW. Implement deletion procedures.

#### Security Safeguards (Section 8(4))
- Implement reasonable security safeguards to protect personal data
- Prevent personal data breach
- **Layaa AI action:** Encryption in transit and at rest. Access controls. Regular security review.

### 2.4 Breach Notification

| Requirement | Detail |
|------------|--------|
| **Who notifies** | Data Fiduciary to the Data Protection Board and affected Data Principals |
| **Timeline** | Within 72 hours (as prescribed; may be further specified in rules) |
| **What to notify** | Nature of breach, data involved, likely consequences, remedial actions |
| **Layaa AI obligation as Processor** | Notify Client (Data Fiduciary) within 24 hours of becoming aware. Assist Client in breach response. |

### 2.5 Penalties

| Violation | Maximum Penalty |
|-----------|----------------|
| Failure to take reasonable security safeguards | Up to INR 250 Crore |
| Failure to notify Data Protection Board of breach | Up to INR 200 Crore |
| Non-compliance with obligations regarding children's data | Up to INR 200 Crore |
| Non-compliance with additional obligations of Significant Data Fiduciary | Up to INR 150 Crore |
| General non-compliance | Up to INR 50 Crore |
| Violation by Data Principal (false complaint, etc.) | Up to INR 10,000 |

### 2.6 Cross-Border Data Transfer

- The Central Government may notify countries/territories to which personal data may be transferred
- Transfer to any country/territory NOT on the restricted list is permitted (negative list approach)
- The Central Government may also restrict transfers to specific jurisdictions
- **Layaa AI action:** Monitor the notification of restricted jurisdictions. Where client data is processed through API providers (e.g., Anthropic, OpenAI) whose servers may be outside India, ensure this is disclosed and consented to.

### 2.7 Data Protection Board of India

- Established under the DPDP Act to adjudicate complaints and impose penalties
- Functions as a digital office (proceedings conducted digitally)
- **Layaa AI action:** Monitor Board's establishment and early decisions for compliance guidance

---

## 3. Information Technology Act, 2000 (IT Act)

### 3.1 Overview

The IT Act provides the legal framework for electronic governance, digital signatures, electronic records, cybercrime, and intermediary liability. Key rules under the IT Act remain in force alongside the DPDP Act.

### 3.2 Key Provisions Relevant to Layaa AI

| Provision | Relevance |
|-----------|-----------|
| **Section 43** | Penalty for damage to computer systems. Compensation up to INR 5 Crore (civil). Relevant if Layaa AI's systems are compromised or if Layaa AI causes damage to client systems. |
| **Section 43A** | Compensation for failure to protect sensitive personal data (body corporates). Read with IT (Reasonable Security Practices) Rules, 2011. Mandates reasonable security practices. |
| **Section 65** | Tampering with computer source documents. Criminal offence (imprisonment up to 3 years / fine up to INR 2 Lakh). |
| **Section 66** | Computer-related offences (hacking, identity theft, etc.). Criminal penalties. |
| **Section 72A** | Punishment for disclosure of information in breach of lawful contract. Imprisonment up to 3 years / fine up to INR 5 Lakh. |
| **Section 79** | Safe harbour for intermediaries. May be relevant if Layaa AI builds platforms that host user-generated content for clients. |
| **Section 85** | Offences by companies -- directors can be held liable if offence is committed with their consent/connivance/negligence. |

### 3.3 IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011

- Defines "sensitive personal data" (passwords, financial information, health data, sexual orientation, biometrics)
- Requires documented information security policy
- Requires consent before collection of sensitive personal data
- Requires body corporates to implement ISO 27001 or equivalent security standards
- **Layaa AI action:** Maintain information security practices. Document security measures. These rules continue to apply alongside DPDP Act until expressly superseded.

### 3.4 IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021

- Primarily applicable to social media intermediaries and digital media entities
- May become relevant if Layaa AI builds platforms with user-generated content
- Due diligence requirements for intermediaries
- **Current applicability:** Limited. Monitor if Layaa AI's product offerings expand.

---

## 4. Indian Contract Act, 1872

### 4.1 Overview

The Indian Contract Act governs all commercial agreements in India. Every contract Layaa AI enters must satisfy the Act's requirements.

### 4.2 Essential Elements of a Valid Contract (Section 10)

| Element | Requirement | Layaa AI Application |
|---------|------------|---------------------|
| **Free Consent** (Sections 13--22) | Consent not obtained by coercion, undue influence, fraud, misrepresentation, or mistake | Ensure clear communication of terms. Avoid exploiting information asymmetry with less sophisticated clients. |
| **Competent Parties** (Section 11) | Parties must be of age of majority, sound mind, and not disqualified by law | Verify counterparty is a legal entity or competent individual. For companies, verify authorised signatory. |
| **Lawful Consideration** (Sections 23--25) | Consideration must not be illegal, immoral, or opposed to public policy | Standard commercial consideration. No bribes, kickbacks, or unlawful payments. |
| **Lawful Object** (Section 23) | Object of the agreement must be lawful | Ensure contracted services are for lawful purposes. Refuse engagements that facilitate illegal activity. |
| **Not Expressly Declared Void** (Sections 24--30) | Agreement must not fall under void categories | Key risk: Section 27 (restraint of trade) and Section 28 (restraint of legal proceedings). |

### 4.3 Void Agreements Relevant to Layaa AI

#### Section 27 -- Agreements in Restraint of Trade

```
"Every agreement by which any one is restrained from exercising a lawful profession,
trade or business of any kind, is to that extent void."
```

**Exception:** Restraint in connection with the sale of goodwill of a business (buyer can restrain seller within specified local limits).

**Impact on Layaa AI:**
- **Non-compete clauses** with contractors, employees, or clients are generally **void and unenforceable**
- **Non-solicitation clauses** (narrower; restricting active solicitation of specific clients/employees) are generally upheld by Indian courts as reasonable restrictions that do not amount to restraint of trade
- **Layaa AI policy:** Use non-solicitation, never broad non-compete. See Clause Library for standard language.

#### Section 28 -- Agreements in Restraint of Legal Proceedings

- Cannot prevent a party from pursuing legal remedies
- Arbitration clauses are valid (not a restraint -- they provide an alternative forum)
- Cannot unreasonably shorten limitation periods
- **Layaa AI action:** Ensure dispute resolution clauses do not bar legal proceedings entirely; arbitration is the preferred mechanism.

### 4.4 Breach and Damages (Sections 73--74)

#### Section 73 -- Compensation for Breach

```
"When a contract has been broken, the party who suffers by such breach is entitled to
receive, as compensation for any loss or damage caused to him thereby, such compensation
as naturally arose in the usual course of things from such breach, or which the parties
knew, when they made the contract, to be likely to result from the breach thereof."
```

**Key principles:**
- Only compensation for loss or damage that naturally arises from the breach
- Or loss that both parties knew would likely result from breach (consequential damages must be foreseeable)
- Compensation cannot exceed what would have been received if the contract were performed
- Mitigation duty: aggrieved party must take reasonable steps to minimise loss
- Remote or indirect damages not recoverable unless in contemplation of both parties

#### Section 74 -- Liquidated Damages and Penalty

```
"When a contract has been broken, if a sum is named in the contract as the amount to be
paid in case of such breach, or if the contract contains any other stipulation by way of
penalty, the party complaining of the breach is entitled, whether or not actual damage or
loss is proved to have been caused thereby, to receive from the party who has broken the
contract reasonable compensation not exceeding the amount so named or, as the case may be,
the penalty stipulated for."
```

**Key principles:**
- Indian law does not strictly distinguish between liquidated damages and penalties (unlike English law)
- The court awards "reasonable compensation" not exceeding the named amount
- Actual loss need not be proved, but the amount must be reasonable
- Courts will not enforce penalty amounts that are unconscionably high

**Impact on Layaa AI:**
- Liability caps in contracts are generally enforceable as they name a ceiling
- SLA credits / service penalties should be set at reasonable levels
- Late payment interest must be commercially reasonable (1.5%/month is generally accepted)
- Avoid penalty clauses that could be seen as punitive -- frame as liquidated damages with a reasonable estimation of loss

### 4.5 Specific Performance and Injunctions

- Specific performance of service contracts is generally not granted (Section 14 of Specific Relief Act 1963)
- Injunctions may be obtained to prevent breach of negative covenants (non-disclosure, non-solicitation)
- **Layaa AI action:** Include injunctive relief language in confidentiality clauses

---

## 5. Arbitration and Conciliation Act, 1996

### 5.1 Overview

Governs domestic and international arbitration in India. Layaa AI uses arbitration as the primary dispute resolution mechanism.

### 5.2 Key Provisions

| Provision | Detail | Layaa AI Application |
|-----------|--------|---------------------|
| **Part I** | Domestic arbitration. Applies where seat is in India. | All Layaa AI arbitrations (seat: Gurgaon) |
| **Section 7** | Arbitration agreement must be in writing. Can be in a separate agreement or a clause in a contract. | Include arbitration clause in all contracts |
| **Section 11** | Appointment of arbitrators. Parties can agree; failing agreement, courts can appoint. | Standard clause: 1 arbitrator, mutually appointed, 30-day deadline |
| **Section 34** | Challenge to arbitral award. Limited grounds (incapacity, invalid agreement, beyond scope, against public policy). | Awards are generally final |
| **Section 36** | Enforcement of award. Award enforceable as a decree of court. | Can be executed through civil court |
| **2015 & 2019 Amendments** | Time-bound arbitration (award within 12 months, extendable by 6 months). Institutional arbitration encouraged. | Include time limit reference in arbitration clause if desired |
| **Section 9** | Interim measures by court (before or during arbitration). | Injunctions for IP/confidentiality breaches can be sought from court even with arbitration clause |

### 5.3 Layaa AI Arbitration Framework

| Parameter | Standard |
|-----------|---------|
| Seat | Gurgaon, Haryana |
| Language | English |
| Number of arbitrators | One (1) |
| Appointment | Mutual agreement within 30 days; failing which, as per the Act |
| Applicable rules | Arbitration and Conciliation Act, 1996 (ad hoc; not institutional) |
| Governing law | Laws of India |
| Award timeline target | Within 12 months of appointment |
| Cost allocation | As determined by arbitrator |

### 5.4 When to Consider Institutional Arbitration

For high-value disputes (above INR 25 Lakh) or international parties, consider:
- Delhi International Arbitration Centre (DIAC)
- Mumbai Centre for International Arbitration (MCIA)
- Singapore International Arbitration Centre (SIAC) -- for international commercial disputes

---

## 6. Cross-Border Data Transfer Rules

### 6.1 Current Framework (April 2026)

| Aspect | Rule |
|--------|------|
| **DPDP Act approach** | Negative list: transfer permitted except to countries specifically restricted by Central Government notification |
| **Restricted jurisdictions** | As notified by the Central Government (monitor Gazette notifications) |
| **Contractual safeguards** | Include data transfer provisions in DPA. Disclose sub-processors and their jurisdictions. |
| **API provider transfers** | Data sent to AI API providers (Anthropic -- US, OpenAI -- US, Google -- US) constitutes cross-border transfer. Disclose and obtain consent. |

### 6.2 Layaa AI Data Transfer Checklist

- [ ] Identify all cross-border data flows in the engagement
- [ ] Verify destination jurisdiction is not on restricted list
- [ ] Disclose cross-border transfers to client in DPA/SoW
- [ ] Obtain client consent for transfers
- [ ] Ensure sub-processor agreements include data protection obligations
- [ ] Implement encryption for data in transit across borders
- [ ] Document legitimate basis for each transfer

---

## 7. E-Invoicing Requirements

### 7.1 Current Thresholds (April 2026)

| Turnover Threshold | E-Invoicing Mandatory From |
|-------------------|---------------------------|
| Above INR 5 Crore (in any FY from 2017-18) | 1 August 2023 onwards |
| Above INR 10 Crore | 1 October 2022 |
| Above INR 20 Crore | 1 April 2022 |
| Above INR 50 Crore | 1 April 2021 |

### 7.2 Layaa AI Applicability

- As a Micro enterprise with turnover well below INR 5 Crore, Layaa AI is **currently exempt** from mandatory e-invoicing
- Monitor turnover growth; once any FY turnover crosses INR 5 Crore, e-invoicing becomes mandatory
- **Proactive step:** Even if not mandatory, consider adopting e-invoicing-ready invoice formats for professional presentation and future readiness

### 7.3 E-Invoicing Process (When Applicable)

1. Generate invoice in accounting software
2. Upload to Invoice Registration Portal (IRP)
3. IRP validates and generates IRN (Invoice Reference Number) and QR code
4. Invoice with IRN and QR code shared with buyer
5. Auto-populated in GSTR-1

---

## 8. Stamp Duty (Haryana)

### 8.1 Applicable Instruments

| Instrument | Stamp Duty (Haryana) | Notes |
|-----------|---------------------|-------|
| **Agreement (general)** | INR 100 | General agreements not specifically covered |
| **Agreement for sale** | Same as conveyance | Based on property value |
| **NDA / Confidentiality Agreement** | INR 100 | As a general agreement |
| **Power of Attorney (general)** | INR 300 | For specific acts |
| **Power of Attorney (to sell immovable property)** | 5% of property value | Unlikely for Layaa AI |
| **Lease (up to 1 year)** | 1.5% of total rent | If leasing office space |
| **Lease (1-5 years)** | 3% of total rent for the period | If leasing office space |
| **Partnership deed** | INR 22,500 | If entering partnership |
| **Affidavit** | INR 30 | General declarations |

> Stamp duty rates are per the Haryana Stamp Act and the Indian Stamp Act, 1899 as applicable in Haryana. Rates are subject to change. Always verify current rates before execution.

### 8.2 Consequences of Inadequate Stamping

- **Inadmissibility:** Unstamped or under-stamped documents cannot be admitted as evidence in court
- **Penalty:** If deficiency is discovered, document can be stamped on payment of deficit plus penalty (typically 2% per month of the deficit, up to 200% of the deficit amount)
- **Impounding:** Courts and authorities must impound insufficiently stamped documents

### 8.3 E-Stamping in Haryana

- Haryana has adopted e-stamping through Stock Holding Corporation of India (SHCIL)
- Available at designated e-stamping centres
- Generates electronically verifiable stamp certificates
- **Layaa AI action:** Use e-stamping for all agreements requiring stamp duty

---

## 9. Other Relevant Regulations

### 9.1 Companies Act, 2013

- Governs incorporation, management, and dissolution of Layaa AI
- Key ongoing obligations: Board meetings, AGM, annual filings, statutory registers
- See Company Filings document for detailed compliance requirements

### 9.2 Income Tax Act, 1961

- Corporate tax, TDS obligations, advance tax
- DPIIT startup benefits: potential Section 80-IAC exemption (3 consecutive years out of first 10 years)
- See Compliance Calendar for tax deadlines

### 9.3 Goods & Services Tax Act, 2017

- GST on services at 18% (SAC 998314)
- Monthly returns (GSTR-1, GSTR-3B), annual return (GSTR-9)
- Input Tax Credit on eligible business expenses
- Reverse charge mechanism on certain imports of services
- See Compliance Calendar for filing deadlines

### 9.4 Foreign Exchange Management Act, 1999 (FEMA)

- Relevant when Layaa AI receives payment from or makes payment to foreign entities
- Export of services: remittance must be received within 9 months (or as specified by RBI)
- FIRC (Foreign Inward Remittance Certificate) to be obtained for each receipt
- No prior approval needed for export of IT/AI services (automatic route)
- **Layaa AI action:** If engaging with international clients, ensure FEMA-compliant invoicing and remittance tracking

### 9.5 Consumer Protection Act, 2019

- Applicable if Layaa AI sells pre-built solutions directly to individual consumers
- Unfair trade practices, misleading advertisements, product liability
- E-commerce rules apply to online sales
- **Current applicability:** Limited (B2B services). Monitor if B2C products are launched.

### 9.6 Competition Act, 2002

- Prohibits anti-competitive agreements and abuse of dominant position
- Relevant for pricing agreements with competitors (price fixing is prohibited)
- Merger control (not currently applicable given Layaa AI's size)
- **Layaa AI action:** Do not engage in price-fixing discussions with competitors. Keep competitive pricing intelligence to own observations and public information.

### 9.7 Shops and Commercial Establishments Act (Haryana)

- If Layaa AI operates from a physical office in Haryana with employees
- Registration required under Haryana Shops and Commercial Establishments Act
- Governs working hours, holidays, leave, conditions of work
- **Current applicability:** Not applicable as no employees and no physical shop/establishment. Monitor when office/employees are added.

---

## 10. Regulatory Change Monitoring

### 10.1 Sources to Monitor

| Source | What to Watch | Frequency |
|--------|--------------|-----------|
| Gazette of India | DPDP Act rules, new regulations | Weekly |
| MCA notifications | Companies Act amendments, filing changes | Monthly |
| CBDT circulars | Income tax changes, TDS rates | Monthly |
| CBIC notifications | GST rate changes, return filing changes | Monthly |
| Data Protection Board | Guidelines, enforcement actions, interpretations | As published |
| MEITY | IT Act rules, AI regulation developments | Monthly |
| RBI circulars | FEMA changes, payment regulations | Monthly |
| DPIIT updates | Startup policy changes, recognition criteria | Quarterly |

### 10.2 Emerging Regulatory Areas

| Area | Status (April 2026) | Layaa AI Exposure |
|------|---------------------|-------------------|
| AI-specific regulation | Under policy discussion; no standalone AI law yet | High -- monitor actively |
| DPDP Act rules | Being progressively notified | High -- direct compliance obligation |
| Digital India Act (proposed replacement for IT Act) | In draft/discussion stage | Medium -- will reshape digital regulations |
| Global Data Protection Interoperability | India engaging with global frameworks | Medium -- affects cross-border work |
| AI liability frameworks | Early-stage globally | Medium -- affects service liability |

---

## 11. Regulatory Compliance Matrix

| Regulation | Compliance Owner | Review Frequency | Current Status |
|-----------|-----------------|-----------------|----------------|
| DPDP Act 2023 | CEO | Quarterly | Compliant (Privacy Policy Feb 2026) |
| IT Act 2000 | CTO | Semi-annually | Compliant |
| Indian Contract Act | CEO | Per engagement | Ongoing -- reviewed per contract |
| Arbitration Act | CEO | Annually | Framework established |
| Companies Act | CEO + CA | Monthly (filings) | Compliant |
| Income Tax Act | CEO + CA | Monthly (TDS), Quarterly (advance tax) | Compliant |
| GST Act | CEO + CA | Monthly (returns) | Compliant |
| FEMA | CEO | Per international transaction | Monitoring |
| Stamp Duty (Haryana) | CEO | Per agreement | Compliant |

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
*CIN: U62099HR2025PTC139528 | DPIIT: DIPP245808 | Udyam: UDYAM-HR-05-0177880 (Micro)*
*Privacy Policy effective February 2026 | DPDP Act & IT Act 2000 Compliant*
