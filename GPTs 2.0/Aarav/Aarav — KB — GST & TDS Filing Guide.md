# Aarav — KB — GST & TDS Filing Guide

> Preparation checklists and process flows for GST returns and TDS compliance.

---

## Monthly GSTR-3B Preparation (Due: 20th of following month)

**Output GST (Sales Side):**
- [ ] List all invoices issued during the month
- [ ] Compute total taxable value
- [ ] Compute CGST, SGST, IGST separately
- [ ] Verify GST amount on each invoice matches computation
- [ ] Identify any credit notes or debit notes issued
- [ ] Reconcile invoice register with bank receipts

**Input Tax Credit (Purchase Side):**
- [ ] Collect all vendor invoices with GST charged
- [ ] Verify vendor GSTIN validity
- [ ] Compute eligible input tax credit (ITC)
- [ ] Identify blocked credits (if any — e.g., food, personal expenses)
- [ ] Reconcile with GSTR-2B auto-populated data (when available)

**Net GST Payable:**
```
Net GST = Output GST - Eligible Input Tax Credit
If positive: Pay to government by 20th
If negative: Carry forward as ITC balance
```

**Handoff to CA:**
- [ ] Provide compiled invoice register
- [ ] Provide input tax credit summary
- [ ] Provide bank statement for the period
- [ ] Flag any unusual transactions or corrections needed
- [ ] Confirm all amounts reconcile

---

## GSTR-1 Preparation (Due: 11th of following month)

- [ ] List all outward supplies (B2B with GSTIN, B2C without)
- [ ] For B2B: Include invoice-wise detail with client GSTIN
- [ ] For B2C: Aggregate by rate
- [ ] Include credit notes and debit notes
- [ ] Reconcile with GSTR-3B figures

---

## TDS Compliance Guide

### When TDS Applies

| Payment Type | Section | TDS Rate | Threshold (Annual) |
|-------------|---------|----------|-------------------|
| Professional/Technical Services | 194J | 10% | Rs.30,000 |
| Contractor/Sub-contractor | 194C | 1% (individual) / 2% (others) | Rs.30,000 (single) / Rs.1,00,000 (aggregate) |
| Rent | 194-I | 10% | Rs.2,40,000 |
| Salary | 192 | As per slab | Per employee |
| Commission/Brokerage | 194H | 5% | Rs.15,000 |

### TDS Process Flow

1. **Identify:** Is this payment subject to TDS? (Check thresholds above)
2. **Deduct:** Deduct applicable TDS rate from payment
3. **Deposit:** Deposit TDS to government by 7th of following month
4. **Report:** Include in quarterly TDS return (Form 24Q for salary, 26Q for others)
5. **Certificate:** Issue TDS certificate (Form 16/16A) to deductee

### TDS Calendar

| Quarter | Period | Return Due Date | Certificate Due Date |
|---------|--------|----------------|---------------------|
| Q1 | Apr-Jun | 31 July | 15 August |
| Q2 | Jul-Sep | 31 October | 15 November |
| Q3 | Oct-Dec | 31 January | 15 February |
| Q4 | Jan-Mar | 31 May | 15 June |

### Current TDS Obligations (Likely)

- CA/CS professional fees → Section 194J (10% TDS if annual payment > Rs.30K)
- Any contractor payments → Section 194C
- No salary TDS currently (no employees — Founders draw as directors, different treatment)

---

*This is an Aarav operational reference document. Updated as GST and TDS filing requirements evolve.*
