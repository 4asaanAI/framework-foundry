# Aarav — Output Templates

> Finance & Accounting Agent — Layaa AI Private Limited
> These templates are the standard output formats Aarav uses when generating financial documents. Fill in bracketed fields with actual data. All amounts in INR unless stated otherwise.

---

## 1. Tax Invoice

```
──────────────────────────────────────────────────────────────
                        TAX INVOICE
──────────────────────────────────────────────────────────────

LAYAA AI PRIVATE LIMITED
CIN: U62099HR2025PTC139528
PAN: AAGCL6342M
GSTIN: [Layaa AI GSTIN — insert when received]
Registered Office: [Full Address], Gurgaon, Haryana — 122001
Email: accounts@layaa.ai | Phone: [Phone Number]

Invoice Number : LAI/[FY]/[Sequential Number]
Invoice Date   : [DD-MMM-YYYY]
Due Date       : [DD-MMM-YYYY]
Place of Supply: [State Name] ([State Code])

──────────────────────────────────────────────────────────────
BILL TO
──────────────────────────────────────────────────────────────
Client Name    : [Legal Entity Name]
Address        : [Full Registered Address]
GSTIN          : [Client GSTIN or "Unregistered"]
State          : [State Name] ([State Code])
Contact Person : [Name] | [Email] | [Phone]
PO Number      : [If applicable, else "N/A"]

──────────────────────────────────────────────────────────────
SERVICE DETAILS
──────────────────────────────────────────────────────────────

| S.No | Description of Service              | SAC Code | Qty | Rate (INR) | Amount (INR) |
|------|--------------------------------------|----------|-----|------------|--------------|
| 1    | [e.g., AI Automation — EduFlow       | 998314   | 1   | [Amount]   | [Amount]     |
|      |  Setup & Configuration]              |          |     |            |              |
| 2    | [e.g., Monthly Support & Maintenance]| 998314   | 1   | [Amount]   | [Amount]     |
| 3    | [Additional line item if needed]     | 998314   | 1   | [Amount]   | [Amount]     |

──────────────────────────────────────────────────────────────
SUMMARY
──────────────────────────────────────────────────────────────
Sub-Total (before tax)              : INR [Amount]

--- If Intra-State (Haryana to Haryana) ---
CGST @ 9%                           : INR [Amount]
SGST @ 9%                           : INR [Amount]

--- If Inter-State ---
IGST @ 18%                          : INR [Amount]

Total Tax                           : INR [Amount]
TOTAL PAYABLE                       : INR [Amount]
Amount in Words                     : [INR Amount in words] only

──────────────────────────────────────────────────────────────
PAYMENT TERMS
──────────────────────────────────────────────────────────────
- 50% advance payment upon confirmation of engagement.
- 50% balance payment upon delivery / go-live.
- Late payment attracts interest @ 1.5% per month.
- All disputes subject to jurisdiction of courts in Gurgaon, Haryana.

──────────────────────────────────────────────────────────────
BANK DETAILS FOR REMITTANCE
──────────────────────────────────────────────────────────────
Account Name   : Layaa AI Private Limited
Bank Name      : [Bank Name]
Branch         : [Branch Name], Gurgaon
Account Number : [Account Number]
IFSC Code      : [IFSC Code]
Account Type   : Current Account
UPI ID         : [UPI ID if available]

──────────────────────────────────────────────────────────────
NOTES
──────────────────────────────────────────────────────────────
- This is a computer-generated invoice. No signature required.
- Subject to Haryana jurisdiction.
- E&OE (Errors and Omissions Excepted).

For: Layaa AI Private Limited

Authorized Signatory: ________________________
Name: [Director Name]
Designation: Director
```

---

## 2. Expense Report

```
──────────────────────────────────────────────────────────────
              LAYAA AI — EXPENSE REPORT
──────────────────────────────────────────────────────────────

Report ID       : EXP/[FY]/[Sequential Number]
Submitted By    : [Employee / Founder Name]
Department      : [e.g., Operations / Engineering / Sales]
Reporting Period: [DD-MMM-YYYY] to [DD-MMM-YYYY]
Submission Date : [DD-MMM-YYYY]

──────────────────────────────────────────────────────────────
EXPENSE LINE ITEMS
──────────────────────────────────────────────────────────────

| S.No | Date       | Category               | Description                        | Vendor / Payee       | Amount (INR) | Receipt Ref   | GST Input Credit |
|------|------------|------------------------|------------------------------------|----------------------|--------------|---------------|------------------|
| 1    | [DD-MMM]   | Software Subscription  | [e.g., Claude API — April billing] | [Anthropic]          | [Amount]     | REC-[Number]  | [Yes/No]         |
| 2    | [DD-MMM]   | Cloud Infrastructure   | [e.g., AWS hosting — April]        | [AWS India]          | [Amount]     | REC-[Number]  | [Yes/No]         |
| 3    | [DD-MMM]   | Travel                 | [e.g., Client meeting — Delhi]     | [Vendor Name]        | [Amount]     | REC-[Number]  | [No]             |
| 4    | [DD-MMM]   | Office & Admin         | [e.g., Co-working space — April]   | [WeWork / CoWrks]    | [Amount]     | REC-[Number]  | [Yes/No]         |
| 5    | [DD-MMM]   | Marketing              | [e.g., LinkedIn Ads — April]       | [LinkedIn]           | [Amount]     | REC-[Number]  | [Yes/No]         |
| 6    | [DD-MMM]   | Professional Services  | [e.g., Legal retainer — April]     | [Law Firm Name]      | [Amount]     | REC-[Number]  | [Yes/No]         |

──────────────────────────────────────────────────────────────
TOTALS
──────────────────────────────────────────────────────────────
Total Expenses                  : INR [Total Amount]
GST Input Credit Claimable      : INR [Amount]
Net Cost to Company             : INR [Amount]

──────────────────────────────────────────────────────────────
APPROVAL
──────────────────────────────────────────────────────────────
Status          : [Pending / Approved / Rejected / Partially Approved]
Approved By     : [Name]
Approval Date   : [DD-MMM-YYYY]
Remarks         : [Any notes — e.g., "Travel claim capped at policy limit"]
```

---

## 3. Monthly Profit & Loss Statement

```
──────────────────────────────────────────────────────────────
     LAYAA AI PRIVATE LIMITED — PROFIT & LOSS STATEMENT
──────────────────────────────────────────────────────────────

Period          : [Month] [Year] (e.g., April 2026)
Prepared By     : Aarav (Finance Agent)
Prepared On     : [DD-MMM-YYYY]

══════════════════════════════════════════════════════════════
A. REVENUE
══════════════════════════════════════════════════════════════

| Revenue Source                        | Amount (INR) |
|---------------------------------------|--------------|
| EduFlow — School Subscriptions        | [Amount]     |
| EduFlow — Setup & Onboarding Fees     | [Amount]     |
| CA AI Agent — Practice Subscriptions  | [Amount]     |
| CA AI Agent — Setup Fees              | [Amount]     |
| Custom AI Automation Projects         | [Amount]     |
| Consulting & Advisory                 | [Amount]     |
| Other Income (interest, refunds)      | [Amount]     |
| TOTAL REVENUE                         | [Amount]     |

══════════════════════════════════════════════════════════════
B. COST OF GOODS SOLD (COGS)
══════════════════════════════════════════════════════════════

| Cost Item                             | Amount (INR) |
|---------------------------------------|--------------|
| AI API Costs (Claude, OpenAI, etc.)   | [Amount]     |
| Cloud Hosting (AWS / GCP / Azure)     | [Amount]     |
| Third-Party Tool Licenses (Zapier,    | [Amount]     |
|   Make, Twilio, etc.)                 |              |
| Freelancer / Contract Delivery Costs  | [Amount]     |
| TOTAL COGS                            | [Amount]     |

GROSS PROFIT                            : INR [Revenue - COGS]
GROSS MARGIN                            : [Gross Profit / Revenue x 100]%

══════════════════════════════════════════════════════════════
C. OPERATING EXPENSES
══════════════════════════════════════════════════════════════

| Category                              | Amount (INR) |
|---------------------------------------|--------------|
| Salaries & Contractor Payments        | [Amount]     |
| Co-working / Office Rent              | [Amount]     |
| Marketing & Advertising               | [Amount]     |
| Software Subscriptions (internal)     | [Amount]     |
| Legal & Compliance                    | [Amount]     |
| Accounting & Audit                    | [Amount]     |
| Travel & Conveyance                   | [Amount]     |
| Miscellaneous / Admin                 | [Amount]     |
| TOTAL OPERATING EXPENSES              | [Amount]     |

══════════════════════════════════════════════════════════════
D. NET INCOME
══════════════════════════════════════════════════════════════

| Metric                                | Amount (INR) |
|---------------------------------------|--------------|
| Gross Profit                          | [Amount]     |
| Less: Operating Expenses              | [Amount]     |
| EBITDA                                | [Amount]     |
| Less: Depreciation & Amortization     | [Amount]     |
| EBIT (Operating Profit)               | [Amount]     |
| Less: Interest Expense                | [Amount]     |
| Profit Before Tax                     | [Amount]     |
| Less: Provision for Income Tax        | [Amount]     |
| NET PROFIT / (LOSS)                   | [Amount]     |
| Net Margin                            | [NP / Revenue x 100]% |

NOTES:
- [Any one-time items, adjustments, or context for the month]
- [Comparison note vs. previous month if relevant]
```

---

## 4. Cash Flow Summary

```
──────────────────────────────────────────────────────────────
      LAYAA AI PRIVATE LIMITED — CASH FLOW SUMMARY
──────────────────────────────────────────────────────────────

Period          : [Month] [Year]
Prepared By     : Aarav (Finance Agent)
Prepared On     : [DD-MMM-YYYY]

──────────────────────────────────────────────────────────────
OPENING BALANCE
──────────────────────────────────────────────────────────────
Bank Account (Current)          : INR [Amount]
Cash in Hand                    : INR [Amount]
Payment Gateway Pending         : INR [Amount]
TOTAL OPENING BALANCE           : INR [Amount]

══════════════════════════════════════════════════════════════
A. INFLOWS
══════════════════════════════════════════════════════════════

| Source                                | Amount (INR) |
|---------------------------------------|--------------|
| Client Payments — EduFlow             | [Amount]     |
| Client Payments — CA AI Agent         | [Amount]     |
| Client Payments — Custom Projects     | [Amount]     |
| Advance Payments Received (50%)       | [Amount]     |
| Delivery Payments Received (50%)      | [Amount]     |
| Founder Capital Infusion              | [Amount]     |
| GST Refund / Input Credit Received    | [Amount]     |
| Interest Income                       | [Amount]     |
| Other Inflows                         | [Amount]     |
| TOTAL INFLOWS                         | [Amount]     |

══════════════════════════════════════════════════════════════
B. OUTFLOWS
══════════════════════════════════════════════════════════════

| Category                              | Amount (INR) |
|---------------------------------------|--------------|
| AI API Costs                          | [Amount]     |
| Cloud Infrastructure                  | [Amount]     |
| Salaries & Contractor Payments        | [Amount]     |
| Software Subscriptions                | [Amount]     |
| Marketing & Ads Spend                 | [Amount]     |
| Rent / Co-working                     | [Amount]     |
| Legal & Professional Fees             | [Amount]     |
| Travel & Client Meetings              | [Amount]     |
| GST Payment (Net of Input Credit)     | [Amount]     |
| TDS Payments                          | [Amount]     |
| Advance Tax / Income Tax              | [Amount]     |
| Miscellaneous / Petty Cash            | [Amount]     |
| TOTAL OUTFLOWS                        | [Amount]     |

══════════════════════════════════════════════════════════════
C. CLOSING POSITION
══════════════════════════════════════════════════════════════
Opening Balance                 : INR [Amount]
Add: Total Inflows              : INR [Amount]
Less: Total Outflows            : INR [Amount]
CLOSING BALANCE                 : INR [Amount]

Breakup:
  Bank Account (Current)        : INR [Amount]
  Cash in Hand                  : INR [Amount]
  Payment Gateway Pending       : INR [Amount]

──────────────────────────────────────────────────────────────
D. KEY OBSERVATIONS
──────────────────────────────────────────────────────────────
- Burn Rate (Monthly)           : INR [Total Outflows]
- Runway (Months)               : [Closing Balance / Burn Rate]
- Net Cash Movement             : INR [Inflows - Outflows] ([Positive/Negative])
- Receivables Outstanding       : INR [Amount] (invoices raised but unpaid)
- Payables Outstanding          : INR [Amount] (bills due but unpaid)

NOTES:
- [Any exceptional inflows or outflows to flag]
- [Upcoming large payments expected next month]
- [Cash position health assessment — comfortable / needs attention / critical]
```

---

## Usage Notes for Aarav

1. **Invoice numbering**: Follow format `LAI/2526/001` where 2526 = FY 2025-26 and 001 is sequential.
2. **SAC Code 998314**: Covers "Information technology design and development services" — applicable to all Layaa AI service deliveries.
3. **GST determination**: If client is in Haryana, apply CGST 9% + SGST 9%. If client is outside Haryana, apply IGST 18%.
4. **Payment terms default**: Always 50% advance, 50% on delivery unless a specific MSA overrides this.
5. **Expense categories** should map to the chart of accounts used in Layaa AI's accounting software for clean reconciliation.
6. **P&L and Cash Flow** reports should be generated monthly by the 5th of the following month.
7. **All financial documents** must reference CIN and PAN. GSTIN should be added once the registration certificate is received.
