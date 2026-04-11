# Aarav — KB — Budget & Cash Flow Management

> Cash flow monitoring framework, infrastructure budget tracking, and SISFS grant budget allocation.

---

## Cash Flow Dashboard Template

```
CASH FLOW DASHBOARD — [Month/Week]
As of: [Date]

OPENING BALANCE:                                    Rs.[Amount]

INFLOWS:
  Client payments received:                         Rs.[Amount]
    - [Client 1]: Rs.[Amount] (Advance/Milestone/Retainer)
    - [Client 2]: Rs.[Amount]
  Other income (interest, refunds):                 Rs.[Amount]
  Grant disbursement (if any):                      Rs.[Amount]
TOTAL INFLOWS:                                      Rs.[Amount]

OUTFLOWS:
  Infrastructure (VPS, domain, backups):             Rs.[Amount]
  Professional services (CA/CS, legal):              Rs.[Amount]
  Tools & software:                                  Rs.[Amount]
  Government fees (filings, registrations):          Rs.[Amount]
  Marketing & sales:                                 Rs.[Amount]
  Travel & conveyance:                               Rs.[Amount]
  GST/TDS payments:                                  Rs.[Amount]
  Other:                                             Rs.[Amount]
TOTAL OUTFLOWS:                                      Rs.[Amount]

NET CASH FLOW:                                       Rs.[Amount]
CLOSING BALANCE:                                     Rs.[Amount]

UPCOMING COMMITMENTS (Next 30 days):
  - [Item]: Rs.[Amount] due [Date]
  - [Item]: Rs.[Amount] due [Date]

EXPECTED INFLOWS (Next 30 days):
  - [Client/Source]: Rs.[Amount] expected [Date]

CASH RUNWAY: [Months of operating expenses covered]
```

---

## Cash Flow Alert Thresholds

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Cash runway | >3 months | 2-3 months | <2 months |
| Outstanding receivables | <30 days old | 30-60 days old | >60 days old |
| Monthly burn rate | Within budget | 10-20% over | >20% over |
| Infrastructure utilization | <80% of cap | 80-100% of cap | At or exceeding cap |

---

## Budget Tracking — Infrastructure Cap

### Monthly Infrastructure Monitor

| Item | Budget | Actual | Variance | Status |
|------|--------|--------|----------|--------|
| VPS Hosting | Rs.[Budget] | Rs.[Actual] | Rs.[+/-] | [Green/Yellow/Red] |
| Domain | Rs.[Budget] | Rs.[Actual] | Rs.[+/-] | [Green/Yellow/Red] |
| Backups (Backblaze B2) | Rs.[Budget] | Rs.[Actual] | Rs.[+/-] | [Green/Yellow/Red] |
| SSL/Other | Rs.[Budget] | Rs.[Actual] | Rs.[+/-] | [Green/Yellow/Red] |
| **TOTAL** | **Rs.500** | **Rs.[Actual]** | **Rs.[+/-]** | **[Status]** |

**Rules:**
- Check weekly, not monthly
- Flag at 80% utilization (Rs.400)
- Escalate at 100% (Rs.500)
- Any new infrastructure cost must be offset by reducing existing cost or requires Founder approval

---

## SISFS Grant Budget Allocation (Rs.20L — When Received)

### Allocation Tracking

| Category | Allocated | Spent | Remaining | Utilization % |
|----------|-----------|-------|-----------|---------------|
| Product Deployment & Cloud | Rs.4,50,000 | Rs.0 | Rs.4,50,000 | 0% |
| Market Launch & Acquisition | Rs.4,00,000 | Rs.0 | Rs.4,00,000 | 0% |
| Development & R&D | Rs.4,00,000 | Rs.0 | Rs.4,00,000 | 0% |
| Operations & Compliance | Rs.3,50,000 | Rs.0 | Rs.3,50,000 | 0% |
| Founder Sustenance & Working Capital | Rs.4,00,000 | Rs.0 | Rs.4,00,000 | 0% |
| **TOTAL** | **Rs.20,00,000** | **Rs.0** | **Rs.20,00,000** | **0%** |

**Rules:**
- Do NOT budget against this until disbursement is confirmed
- Each expense from grant funds must be categorized to the correct allocation
- Track utilization quarterly for incubator reporting
- Maintain separate documentation for grant-funded expenses (audit trail)
- Cross-category reallocation requires Founder approval
- Maintain receipts and invoices for 100% of grant expenditure

### Grant Reporting Template (for incubator)

```
SISFS GRANT UTILIZATION REPORT — [Quarter]

Grantee: Layaa AI Private Limited (CIN: U62099HR2025PTC139528)
Incubator: [DTU IIF / other]
Grant Amount: Rs.20,00,000
Period: [Start Date] to [End Date]

UTILIZATION SUMMARY:
| Category | Allocated | Spent This Quarter | Cumulative Spent | Remaining |
[Table filled with actual data]

KEY MILESTONES ACHIEVED:
- [Milestone 1]
- [Milestone 2]

UPCOMING MILESTONES:
- [Milestone 1] — Expected by [Date]

SUPPORTING DOCUMENTATION:
- [List of attached invoices, receipts, bank statements]
```

---

*This is an Aarav operational reference document. Updated as cash flow patterns emerge and budget structures evolve.*
