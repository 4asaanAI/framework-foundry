# Sales-to-Revenue Handoff SOP

## Handoff Trigger Conditions

The handoff is initiated when ALL four conditions are met.

### Condition 1: Contract Execution

- Contract signed by client (digital or wet signature)
- Contract signed by Layaa AI Founder
- Contract PDF stored in designated legal folder with naming convention `[Client_Name]_[Date].pdf`
- Contract ID logged in CRM (format: `LAI-CTR-YYYY-MM-XXX`)

### Condition 2: Payment Confirmation

- First payment (50% implementation deposit) received
- Payment recorded in accounting system with invoice number
- Payment confirmation email sent to client
- CRM updated with payment date and transaction ID

### Condition 3: Scope Documentation

- Final scope document approved by client (email confirmation or signed addendum)
- Deliverables list documented in project tracker
- Timeline confirmed (start date, key milestones, go-live date)
- Tech stack and integration points validated

### Condition 4: CRM Data Completeness

- Client contact details (primary + backup contact)
- Decision-maker names and roles
- Billing contact (if different from primary contact)
- Preferred communication channel (email, Slack, WhatsApp)
- Retainer package selected (Starter/Growth/Enterprise)
- Token allocation confirmed

---

## 3-Phase Handoff Process

### Phase 1: Pre-Handoff Validation (Day 0)

**Step 1.1: Sales initiates handoff request**

- CRM deal stage updated to "Ready for Handoff"
- Handoff notification sent using standard format (see template below)

**Step 1.2: RevOps validates handoff checklist**

All 4 conditions reviewed. Validation report generated:

| Condition | Status | Owner | Notes |
|-----------|--------|-------|-------|
| Contract Execution | Complete / Pending | Legal | |
| Payment Confirmation | Complete / Pending | Finance | |
| Scope Documentation | Complete / Pending | Delivery | |
| CRM Data Complete | Complete / Pending | Sales | |

- If all complete: Proceed to Phase 2.
- If any pending: Escalate blockers to relevant owner. If time-sensitive, escalate to strategic leadership.

### Phase 2: Cross-Functional Coordination (Days 1-2)

**Step 2.1: Finance -- Billing Setup**

- Create client record in accounting system
- Set up recurring invoice schedule (monthly retainer)
- Configure payment reminders (auto-email 5 days before due date)
- Add client to GST filing records (if applicable)
- Send welcome email with payment instructions

Deliverable: Billing setup confirmation. Timeline: 1 business day.

**Step 2.2: Delivery -- Project Initiation**

- Review final scope document and proposal
- Create project folder
- Assign technical architect for design
- Schedule internal kickoff with delivery team
- Schedule client kickoff call (include Founder if high-value deal)
- Add project to delivery tracker with milestones

Deliverable: Project kickoff scheduled + delivery team briefed. Timeline: 2 business days.

**Step 2.3: Sales -- Client Transition Communication**

Send client transition email covering:
- Project kickoff date and time
- Delivery team introductions
- Billing contact for invoice questions
- Dedicated support channel
- Pre-kickoff preparation items (tool access, stakeholder availability, technical documentation)

Deliverable: Client acknowledgment received. Timeline: 1 business day.

### Phase 3: Revenue Activation (Day 3)

**Step 3.1: Activate client in revenue tracker**

- Update CRM deal stage to "Client - Active"
- Add client to Monthly Recurring Revenue (MRR) tracker
- Set revenue attribution (campaign/source that generated the lead)
- Schedule first monthly retainer invoice (30 days from go-live date)
- Add client to Customer Health Score monitoring (tracked monthly)

**Step 3.2: Notify strategic leadership**

Revenue Activation Confirmation sent covering:
- Implementation revenue received
- Monthly retainer amount and start date
- MRR impact
- Attribution source
- Projected annual value
- Confirmation that billing, project initiation, and client transition are all complete

---

## Handoff Failure Scenarios

### Scenario 1: Contract Signed but Payment Delayed

Symptoms: Client signed contract but has not sent 50% deposit. More than 5 business days since signing.

Recovery:
1. Finance sends payment reminder email (Day 3, Day 7, Day 10)
2. Sales follows up with client (friendly nudge)
3. If >14 days: Escalate to Founders -- hold project start
4. If >30 days: Legal reviews contract for late payment penalties

Escalation trigger: Payment not received within 14 days of contract signing.

### Scenario 2: Scope Ambiguity Discovered Post-Handoff

Symptoms: Client expectations do not match proposal. Deliverables unclear or contradictory. Client requesting features not in scope.

Recovery:
1. Delivery pauses project start (no work begins)
2. Sales reviews original proposal and client communications
3. Schedule clarification call with client (Sales + Delivery + Founder)
4. If scope increase required: Repricing and contract amendment
5. If no increase: Document clarification in writing, get client sign-off

Escalation trigger: Scope mismatch discovered before first milestone.

### Scenario 3: CRM Data Incomplete or Incorrect

Symptoms: Cannot generate invoice (missing billing details). Cannot schedule kickoff (wrong contact info). Client not responding (email bouncing).

Recovery:
1. RevOps flags data gaps back to Sales
2. Sales contacts client to collect missing info
3. CRM updated within 24 hours
4. Handoff re-validated

Escalation trigger: Data gaps delay handoff by >3 days.

### Scenario 4: Ghost Activation (Handoff Skipped or Delayed)

Symptoms: Deal marked "Closed-Won" in CRM but no handoff initiated. Client paying but not in revenue tracker. Project started without billing setup.

Recovery:
1. RevOps runs weekly audit: "Closed-Won deals without revenue activation"
2. If gaps found: Immediate escalation + backfill handoff process
3. Finance retroactively sets up billing, invoices for any missed payments
4. Delivery confirms project status with client

Escalation trigger: Any "Closed-Won" deal without revenue activation >7 days.

---

## Quality Assurance Checkpoints

### Weekly CRM Hygiene Audit

- All "Closed-Won" deals have matching revenue activation entries
- No deals stuck in "Ready for Handoff" >5 days
- All active clients have valid billing records
- All active clients have assigned project leads in delivery tracker

### Monthly Handoff Efficiency Review

| Metric | Target |
|--------|--------|
| Avg. Time from Deal Close to Revenue Activation | <3 days |
| % of Deals with Complete Handoff Data | 100% |
| Number of Handoff Failures (requiring recovery) | 0 |
| Client Satisfaction with Onboarding | >4.5/5 |

---

## Handoff Notification Template

```
Subject: [Sales -> RevOps] -- Client Handoff Request: [Client Name]

Summary:
Deal closed for [Client Name]. Contract signed, payment pending/received.
Ready for revenue activation.

Details:
- Client: [Company Name]
- Contract Value: Rs [X] implementation + Rs [Y]/month retainer
- Retainer Tier: [Starter/Growth/Enterprise]
- Payment Status: [Received / Pending - Expected by: DD/MM/YYYY]
- Scope Document: [Link to final proposal/scope doc]
- Start Date: [Confirmed project kickoff date]

Action Requested:
Validate handoff checklist and activate client in revenue operations.

Deadline: Within 2 business days

Proposed Next Steps:
1. RevOps validates checklist completion
2. Finance confirms billing setup
3. Delivery receives project brief
```

---

## Handoff Success Metrics

| Metric | Target |
|--------|--------|
| Total Deals Closed | 6+/month |
| Successful Handoffs (First-Time) | 100% |
| Handoffs Requiring Recovery | 0 |
| Avg. Handoff Time (Days) | <3 |
| Revenue Activated (Rs) | Rs 10L+/month |
| Client Onboarding NPS | 9/10 |
