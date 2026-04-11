# Rishi — Sales-to-Revenue Handoff SOP

**Owner:** Rishi (Revenue Operations Strategist)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as pipeline patterns emerge

---

## Trigger: Deal moves from Won (Verbal) to Won (Paid)

### Step 1: Payment Confirmation
- Confirm 50% advance received with @Aarav
- Verify amount matches proposal terms
- Confirm GST collected (18%)
- Record payment date in pipeline tracker

### Step 2: Revenue Recognition
- Log the implementation fee as recognized revenue (upon advance receipt)
- If retainer: log as projected monthly recurring revenue starting from delivery date
- Update cumulative revenue against quarterly target

### Step 3: Delivery Handoff Data
- Pass the following to delivery team via `pass_context()`:
  - Client name and primary contact
  - Signed scope of work summary
  - Payment terms and schedule
  - Timeline commitments (if any, as approved by Founders)
  - Any special requirements documented during discovery

### Step 4: Pipeline Update
- Move deal to Won (Paid) stage
- Record final deal value (implementation + projected retainer)
- Document sales cycle duration
- Log win factors (what clinched the deal)

### Step 5: Post-Win Analysis
- Calculate actual conversion rate contribution
- Update ICP-specific conversion data
- Note any deviations from standard process (for SOP refinement)
