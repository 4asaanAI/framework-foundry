---
name: legal-response
description: >
  Draft responses to legal correspondence, notices, demand letters, and regulatory inquiries.
  Ensures timely, appropriate responses that protect legal position.
  In Layaa AI mode, applies compliance red flags framework and Indian regulatory context.
  Trigger: "legal response", "respond to notice", "demand letter response", "reply to legal", "regulatory inquiry", "legal notice reply"
  This skill replaces the generic legal:legal-response capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# Legal Response

Draft responses to legal correspondence, notices, demand letters, and regulatory inquiries that protect the company's legal position while maintaining a professional tone and meeting response deadlines.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), Indian regulatory bodies (MCA, RoC, DPIIT, GST authorities, IT Department), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/legal/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/legal/clause-library.md — Standard clause positions and approved language
- domain-references/legal/compliance-red-flags.md — Red flags checklist and severity indicators
- shared-references/company-identity.md — Company basics (CIN, PAN, TAN, registered address, authorized signatories)
Only load references relevant to the specific correspondence type.

## Execution Steps

### Step 1: Review Incoming Correspondence/Notice
Carefully read and catalog:
- **Sender:** Who sent it (individual, law firm, regulatory body, court)?
- **Date received** and **date of the notice/letter**
- **Response deadline:** Statutory or stated deadline for reply
- **Subject matter:** What is the notice about?
- **Claims or allegations:** What specific claims are made?
- **Relief sought:** What does the sender want (payment, action, information, compliance)?
- **Attachments:** Are supporting documents referenced or enclosed?
- **Delivery method:** Registered post, email, courier, hand-delivered (affects validity and timeline)

### Step 2: Load Layaa AI Context (Layaa AI Mode)
1. Read `shared-references/company-identity.md` for correct entity name, registration numbers, and authorized signatories
2. Read `domain-references/legal/compliance-red-flags.md` to check if the subject matter triggers any known red flags
3. Read `domain-references/legal/clause-library.md` if the correspondence relates to a contractual dispute

### Step 3: Identify Type of Correspondence
Classify the correspondence and set response parameters:

| Type | Urgency | Typical Deadline | Tone |
|------|---------|-----------------|------|
| **Demand Letter** (from private party) | HIGH | 7-15 days | Firm, factual, protective |
| **Legal Notice** (u/s 80 CPC or other) | HIGH | 30 days (statutory) | Formal, without prejudice |
| **Show Cause Notice** (regulatory) | CRITICAL | As stated (7-30 days) | Respectful, detailed, evidence-backed |
| **Regulatory Inquiry** (information request) | MEDIUM-HIGH | As stated | Cooperative, precise, limited |
| **Consumer Complaint** | MEDIUM | 30-45 days | Empathetic, solution-oriented |
| **Cease and Desist** (IP/trademark) | HIGH | 7-15 days | Professional, assertive |
| **Court Notice/Summons** | CRITICAL | As stated | Formal, through counsel |
| **Tax Notice** (IT/GST) | HIGH | As stated (15-30 days) | Factual, documented |
| **General Complaint Letter** | LOW-MEDIUM | 15-30 days | Professional, constructive |

### Step 4: Assess Urgency and Severity
Apply escalation decision tree:

1. **Is this from a court or tribunal?** → CRITICAL — External counsel required immediately
2. **Is this from a government/regulatory body?** → HIGH — Founder notification required within 24 hours
3. **Does it allege criminal conduct or fraud?** → CRITICAL — External counsel + Founder immediately
4. **Is the financial exposure > 10L?** → HIGH — Founder review before response
5. **Does it affect ongoing client relationships?** → MEDIUM-HIGH — Coordinate with relevant team
6. **Is it a routine compliance query?** → MEDIUM — Handle with standard process
7. **Is it a general complaint?** → LOW — Handle with standard process

**For Layaa AI:** Cross-reference with compliance red flags to determine if this is an isolated issue or part of a pattern.

### Step 5: Research Applicable Law and Obligations
1. Identify the **legal basis** for the claims or inquiry
2. Determine **response obligations** (statutory response period, mandatory format, filing requirements)
3. Research **defenses or exemptions** available
4. Check if **acknowledgment vs. substantive response** is appropriate at this stage
5. Identify **limitation periods** — is the claim time-barred?
6. For regulatory inquiries, determine **scope of disclosure obligation** — what must be disclosed vs. what is protected

### Step 6: Draft the Response
**General principles for all responses:**
- Use correct legal entity name and registration numbers
- Reference the incoming correspondence precisely (date, reference number, subject)
- Do not admit liability or make unnecessary concessions
- State facts accurately — do not speculate or overstate
- Reserve rights where appropriate ("without prejudice to our rights")
- Keep the response focused on what is required — do not volunteer information
- Maintain professional tone regardless of the sender's tone
- Ensure authorized signatory is appropriate for the response type

**Response structure by type:**

**For Demand Letters / Legal Notices:**
1. Acknowledge receipt with date
2. State that the notice is being addressed "without prejudice"
3. Address each allegation with factual response
4. State the company's position clearly
5. Offer resolution path if appropriate
6. Reserve rights for further action
7. Set expectations for next steps

**For Regulatory Inquiries / Show Cause Notices:**
1. Acknowledge receipt and express cooperation
2. Respond to each point raised, in the same order
3. Attach supporting documentation
4. If additional time needed, request extension with justification
5. Offer to provide further information or attend in person
6. Request confirmation of receipt

**For Consumer Complaints:**
1. Acknowledge the complaint and express concern
2. State the facts from the company's perspective
3. Reference applicable terms of service or contract
4. Offer resolution or explain why the complaint is not valid
5. Provide escalation path if the consumer is unsatisfied

### Step 7: Flag External Counsel Recommendation
Recommend external counsel if:
- The matter involves potential litigation
- Financial exposure exceeds 25L
- The matter involves criminal allegations
- Complex regulatory interpretation is required
- The matter is in a jurisdiction unfamiliar to the team
- Previous responses have not resolved the matter
- The sender is represented by counsel

### Step 8: Include Recommended Next Steps and Timeline
1. **Immediate actions** (within 24-48 hours)
2. **Response filing** (before deadline)
3. **Follow-up actions** (after response is sent)
4. **Monitoring** (watch for counter-response or escalation)
5. **Documentation** (file all correspondence with contract/case reference)
6. **Internal communication** (who needs to be informed)

## Output Format

```
# Legal Response Package
**In Response To:** [type of correspondence — demand letter, regulatory notice, etc.]
**From:** [sender name and capacity]
**Dated:** [date of incoming correspondence]
**Received:** [date received]
**Response Deadline:** [date] — [X days remaining]
**Our Reference:** [internal reference number]

## Cover Memo — Strategy and Risk Assessment

### Classification
- **Correspondence Type:** [from classification table]
- **Urgency:** [ROUTINE / TIME-SENSITIVE / URGENT / CRITICAL]
- **Financial Exposure:** [estimated range]
- **Risk Rating:** [LOW / MEDIUM / HIGH / CRITICAL]

### Summary of Claims/Allegations
[Bullet-point summary of what the sender is claiming or requesting]

### Response Strategy
- **Approach:** [deny / partially accept / negotiate / comply / request extension]
- **Key positions to take:** [list main arguments]
- **Positions to avoid:** [what NOT to say and why]
- **Concessions available:** [if any, with Founder approval]

### Risk Assessment
| Risk Dimension | Rating | Rationale |
|---------------|--------|-----------|
| Legal merit of claim | [WEAK/MODERATE/STRONG] | [explanation] |
| Financial exposure | [LOW/MEDIUM/HIGH/CRITICAL] | [amount range] |
| Escalation likelihood | [LOW/MEDIUM/HIGH] | [explanation] |
| Reputational risk | [LOW/MEDIUM/HIGH] | [explanation] |

### Escalation Flags
- [ ] Founder notification required — [reason]
- [ ] External counsel recommended — [reason]
- [ ] Cross-team coordination needed — [who and why]

---

## Draft Response

[Date]

**To:**
[Sender name and address]

**From:**
[Layaa AI Private Limited / appropriate entity]
[Address]

**Subject:** [Response to your [notice/letter/inquiry] dated [date] regarding [subject]]

**Reference:** [Sender's reference number, if any]

Dear [Salutation],

[Body of response — structured per the guidance in Step 6]

[Closing — appropriate sign-off with rights reservation if needed]

Yours faithfully,
For Layaa AI Private Limited

[Authorized Signatory Name]
[Designation]

Encl: [list of enclosures, if any]
CC: [copies to, if any]

---

## Recommended Next Steps
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| [Send response via [method]] | [name] | [date] | Pending |
| [File copy with records] | [name] | [date] | Pending |
| [Notify [stakeholder]] | [name] | [date] | Pending |
| [Monitor for reply] | [name] | [date] | Pending |
| [Follow-up if no reply by] | [name] | [date] | Pending |
```

## What Makes This Different from Generic Legal Responses
- Applies Indian legal notice conventions (Section 80 CPC, statutory response periods under Indian law)
- Uses Layaa AI's compliance red flags checklist to identify pattern issues across notices
- References correct entity details (CIN, PAN, TAN, registered address) automatically
- Maps escalation to Layaa AI's governance hierarchy (Abhay → Kabir → Founders → External Counsel)
- Considers Layaa AI's specific regulatory profile (DPIIT-registered, MSME, technology services)
- Coordinates with Anne for compliance calendar implications and Preeti for data governance issues
- Applies "without prejudice" and rights reservation language consistent with Layaa AI's standard positions
