---
name: signature-request
description: >
  Prepare documents for signature, including cover letters, signature pages, and execution instructions.
  Manages the document execution workflow from final draft to signed copies.
  In Layaa AI mode, uses company identity for signatory details and contract ID formatting.
  Trigger: "signature request", "send for signature", "sign document", "execute agreement", "signature page", "execution instructions"
  This skill replaces the generic legal:signature-request capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Signature Request

Prepare documents for signature, including cover letters, signature pages, and execution instructions. Manages the complete document execution workflow from final draft verification to signed copy filing.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, client contracts, vendor agreements, or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/contract-templates.md — Template structures and standard signature blocks
- shared-references/company-identity.md — Company details, authorized signatories, entity information
Only load references relevant to the document type being executed.

## Execution Steps

### Step 1: Identify Document(s) Requiring Signature
Collect or ask for:
- **Document type:** MSA, SoW, NDA, Amendment, Board Resolution, MoU, Letter of Intent, Employment Agreement, Vendor Agreement, other
- **Document title and version:** Exact title and latest version number
- **Parties:** All parties to the agreement
- **Counterparty contact:** Name, email, and phone of the person handling execution on the other side
- **Number of originals:** How many signed originals are needed (typically 2 — one per party)
- **Any special execution requirements:** Notarization, witness, stamp duty, e-stamping

### Step 2: Load Company Identity (Layaa AI Mode)
Read `shared-references/company-identity.md` for signatory details:
- **Entity name:** Layaa AI Private Limited
- **CIN:** U62099HR2025PTC139528
- **Registered Office:** [address from company-identity.md]
- **Authorized Signatories:**
  - Abhimanyu Singh — Director
  - Shubham Sharma — Director
- **PAN:** AAGCL6342M
- **TAN:** RTKL05493F
- **GST Number:** [from company-identity.md, if registered]

Determine which signatory is appropriate:
- **Both founders:** For high-value contracts (> 10L), board resolutions, shareholder agreements
- **Either founder:** For standard client agreements, NDAs, vendor agreements
- **Designated authority:** For routine documents where signing authority has been delegated

### Step 3: Verify Document is Final and Approved
Pre-execution checklist:
- [ ] **Final version confirmed** — no tracked changes or comments remaining
- [ ] **Legal review complete** — reviewed by Abhay (Legal & Contracts Advisor) or external counsel
- [ ] **Commercial terms approved** — pricing and scope confirmed by Founders
- [ ] **Counterparty agreed** — all negotiation points resolved
- [ ] **Internal approvals obtained** — Founder sign-off for contracts above threshold
- [ ] **Compliance check passed** — no compliance red flags outstanding
- [ ] **Template consistency** — document follows Layaa AI standard format
- [ ] **All blanks filled** — no placeholder text remaining (dates, names, amounts)
- [ ] **Schedules and annexures attached** — all referenced attachments included
- [ ] **Page numbering correct** — continuous, including annexures

If any item is not confirmed, flag it and do NOT proceed to signature preparation until resolved.

### Step 4: Prepare Signature Page
Create a signature page with correct party details:

**For Layaa AI:**
```
For and on behalf of
LAYAA AI PRIVATE LIMITED

_________________________
Name: [Abhimanyu Singh / Shubham Sharma]
Designation: Director
Date: ___________________
Place: Gurgaon
```

**For Counterparty:**
```
For and on behalf of
[COUNTERPARTY LEGAL NAME]

_________________________
Name: [Authorized Signatory Name]
Designation: [Title]
Date: ___________________
Place: [City]
```

**If witnesses required:**
```
WITNESSES:

1. _________________________
   Name:
   Address:

2. _________________________
   Name:
   Address:
```

**Stamp duty considerations (for Indian execution):**
- Determine if stamp duty applies based on document type and state
- For agreements executed in Haryana: check Haryana Stamp Act schedule
- E-stamping via SHCIL if applicable
- Note: stamp duty is typically borne by the party specified in the agreement or by convention

### Step 5: Draft Cover Letter/Email
Create a professional cover communication:

**For Email (standard):**
```
Subject: [Document Type] — [Layaa AI Private Limited] & [Counterparty Name] — For Execution

Dear [Name],

Please find attached the [Document Type] between Layaa AI Private Limited and [Counterparty Name] for your review and execution.

[Document details — title, date, number of pages]

Execution Instructions:
[per Step 6]

Please return [one/two] signed original(s) to:
[Address or email for digital]

Should you have any questions, please do not hesitate to reach out.

Best regards,
[Signatory Name]
Director, Layaa AI Private Limited
[Contact details]
```

**For Formal Cover Letter (high-value or legal proceedings):**
```
[Layaa AI letterhead]

Date: [date]
Ref: [contract ID]

To,
[Counterparty details]

Subject: Execution of [Document Type] dated [date]

Dear [Name],

With reference to our discussions, we enclose herewith [number] copies of the [Document Type] between Layaa AI Private Limited and [Counterparty Name], duly signed on behalf of Layaa AI Private Limited.

We request you to kindly execute the same and return one copy to our office for our records.

[Additional instructions if any]

Thanking you,

For Layaa AI Private Limited

_________________________
[Signatory Name]
Director

Encl: As above
```

### Step 6: Specify Signing Method
Determine and communicate the signing method:

| Method | When to Use | Requirements | Legal Validity |
|--------|-----------|-------------|---------------|
| **Digital Signature (Aadhaar eSign / DSC)** | Government filings, high-value contracts | Aadhaar or DSC token | Full legal validity under IT Act |
| **Electronic Signature (DocuSign/equivalent)** | Standard commercial contracts, NDAs | Email verification, audit trail | Valid under IT Act Section 5, subject to exceptions |
| **Wet Signature (ink on paper)** | Agreements requiring physical originals, stamped documents | Printed copies, courier | Traditional, universally accepted |
| **Notarized** | Affidavits, powers of attorney, certain property documents | Notary public | Required by specific statutes |

**For Layaa AI standard practice:**
- NDAs: Electronic signature preferred
- Client MSA/SoW: Electronic signature or wet signature per client preference
- Board Resolutions: Wet signature
- Government filings: Digital signature (DSC)

### Step 7: Assign Contract ID and Filing Instructions
Generate contract reference number:

**Contract ID Format:**
| Document Type | Format | Example |
|--------------|--------|---------|
| MSA | LAI-MSA-YYYY-MM-XXX | LAI-MSA-2026-03-001 |
| SoW | LAI-SOW-YYYY-MM-XXX | LAI-SOW-2026-03-001 |
| NDA | LAI-NDA-YYYY-MM-XXX | LAI-NDA-2026-03-001 |
| Amendment | LAI-AMD-YYYY-MM-XXX | LAI-AMD-2026-03-001 |
| Vendor Agreement | LAI-VA-YYYY-MM-XXX | LAI-VA-2026-03-001 |
| Employment Agreement | LAI-EA-YYYY-MM-XXX | LAI-EA-2026-03-001 |
| MoU | LAI-MOU-YYYY-MM-XXX | LAI-MOU-2026-03-001 |
| Board Resolution | LAI-BR-YYYY-MM-XXX | LAI-BR-2026-03-001 |

**Filing instructions:**
1. Save executed copy with contract ID as filename
2. Store in designated contract repository
3. Update contract tracker with execution date and key dates (expiry, renewal)
4. Set calendar reminders for:
   - Renewal/expiry date — 60 days advance notice
   - Key milestone dates within the agreement
   - Payment schedule dates
5. Notify relevant team members (Anne for compliance tracking, Rishi for revenue tracking)

### Step 8: Set Follow-Up Timeline
For unsigned documents, establish follow-up schedule:

| Days Since Sent | Action |
|----------------|--------|
| Day 0 | Document sent with execution instructions |
| Day 3 | Gentle follow-up email — "Just checking if you received the documents" |
| Day 7 | Second follow-up — "Please let us know if you have any questions" |
| Day 14 | Escalation — phone call or escalate to senior contact |
| Day 21 | Final notice — "We need the executed documents by [date] to proceed" |
| Day 30 | Internal escalation — notify Founders, assess if engagement should proceed without signed agreement |

## Output Format

```
# Signature Request Package
**Document:** [document title]
**Contract ID:** [LAI-XXX-YYYY-MM-XXX]
**Parties:** Layaa AI Private Limited & [Counterparty Name]
**Date Prepared:** [date]
**Prepared by:** [Abhay — Legal & Contracts Advisor / General]

## Pre-Execution Checklist
- [x/pending] Final version confirmed
- [x/pending] Legal review complete
- [x/pending] Commercial terms approved
- [x/pending] Counterparty agreed
- [x/pending] Internal approvals obtained
- [x/pending] Compliance check passed
- [x/pending] All blanks filled
- [x/pending] Schedules attached

## Document Details
- **Type:** [MSA / SoW / NDA / etc.]
- **Version:** [final version number]
- **Pages:** [number of pages including schedules]
- **Effective Date:** [date or "upon execution"]
- **Key Dates:** [expiry, renewal, milestones]
- **Value:** [contract value if applicable]

## Execution Details
- **Signing Method:** [Digital / Electronic / Wet / Notarized]
- **Originals Required:** [number]
- **Stamp Duty:** [applicable / not applicable — amount if applicable]
- **Witnesses Required:** [yes/no — number]

### Layaa AI Signatory
- **Name:** [Abhimanyu Singh / Shubham Sharma]
- **Designation:** Director
- **Place:** Gurgaon

### Counterparty Signatory
- **Name:** [name]
- **Designation:** [title]
- **Contact:** [email / phone]

## Cover Communication
[Draft email or cover letter per Step 5]

## Execution Instructions
[Per signing method — what the counterparty needs to do]

## Post-Execution Actions
| Action | Owner | Deadline |
|--------|-------|----------|
| File executed copy with contract ID | [owner] | Same day |
| Update contract tracker | [owner] | Same day |
| Set renewal/expiry reminders | [owner] | Same day |
| Notify team (Anne, Rishi) | [owner] | Within 24 hours |
| [Engagement-specific action] | [owner] | [date] |

## Follow-Up Plan (if not returned)
| Date | Action | Owner |
|------|--------|-------|
| [date + 3 days] | Email follow-up | [owner] |
| [date + 7 days] | Second follow-up | [owner] |
| [date + 14 days] | Phone/escalation | [owner] |
| [date + 21 days] | Final notice | [owner] |
| [date + 30 days] | Internal escalation to Founders | [owner] |
```

## What Makes This Different from Generic Signature Requests
- Pre-loaded with Layaa AI entity details (CIN, PAN, TAN, registered address, authorized signatories)
- Uses Layaa AI's contract ID system (LAI-XXX-YYYY-MM-XXX) for consistent document tracking
- Knows Indian execution requirements (stamp duty, e-stamping, DSC, IT Act e-signature validity)
- Maps post-execution notifications to Layaa AI's GPT workforce (Anne for compliance, Rishi for revenue)
- Includes pre-execution compliance checklist aligned with Layaa AI's governance requirements
- Determines which Founder should sign based on document type and value thresholds
- Follow-up timeline calibrated to Layaa AI's typical deal cycle (30-90 days depending on ICP)
