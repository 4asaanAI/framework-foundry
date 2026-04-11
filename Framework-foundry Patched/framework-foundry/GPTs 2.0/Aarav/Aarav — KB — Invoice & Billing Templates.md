# Aarav — KB — Invoice & Billing Templates

> Invoice format, numbering conventions, GST computation rules, and SAC codes reference for Layaa AI billing operations.

---

## Invoice Format

```
============================================================
                    LAYAA AI PRIVATE LIMITED
        CIN: U62099HR2025PTC139528 | PAN: AAGCL6342M
       GSTIN: [To be registered/confirmed]
       Plot No. A16, First Floor, Ashok Estate,
       Sector-63-A, Gurgaon, Haryana 122102, India
============================================================

TAX INVOICE

Invoice No: LAI-INV-[YYYY]-[NNN]
Invoice Date: [DD/MM/YYYY]
Due Date: [DD/MM/YYYY]

BILL TO:
[Client Legal Entity Name]
[Client Address]
GSTIN: [Client GSTIN if registered]
State: [State] | State Code: [Code]

============================================================
S.No | Description of Service    | SAC Code | Amount (Rs.)
============================================================
1.   | [Service description]     | 998314   | [Amount]
     | [Details/milestones]      |          |
============================================================
                           Subtotal:          [Amount]
                           CGST @ 9%:         [Amount]  (Intra-state)
                           SGST @ 9%:         [Amount]  (Intra-state)
                           -- OR --
                           IGST @ 18%:        [Amount]  (Inter-state)
============================================================
                           TOTAL:             [Amount]
============================================================

Amount in Words: [Amount in words] only

PAYMENT TERMS:
[As per contract — standard: 50% advance, 50% on delivery]

BANK DETAILS:
[To be filled — verify current bank details before each invoice]

AUTHORIZED SIGNATORY:
________________________
For Layaa AI Private Limited

NOTES:
- SAC Code: 998314 (IT consulting and support services)
- Supply type: Intra-state (Haryana) = CGST+SGST; Inter-state = IGST
- This is a computer-generated invoice
```

---

## Invoice Numbering Convention

- Format: `LAI-INV-YYYY-NNN`
- Example: LAI-INV-2026-001
- Sequential, no gaps
- Reset NNN annually on April 1 (financial year start)
- Maintain invoice register with all issued invoices

---

## GST Computation Rules

| Scenario | GST Type | Rate | Components |
|----------|----------|------|------------|
| Client in Haryana | Intra-state | 18% | CGST 9% + SGST 9% |
| Client outside Haryana | Inter-state | 18% | IGST 18% |
| Client is unregistered | Same rules apply | 18% | Still charge GST |
| Export of services | Zero-rated | 0% | Letter of Undertaking required |

---

## SAC Codes Reference

| Service | SAC Code | Description |
|---------|----------|-------------|
| IT Consulting | 998314 | IT consulting and support services |
| Software Development | 998313 | IT design and development services |
| Training/Workshop | 998392 | Other education and training services |
| Maintenance | 998316 | IT infrastructure and network management |

---

## Expense Categorization Guide

### Expense Categories

| Category | Sub-categories | Budget Cap | Approval Level |
|----------|---------------|-----------|----------------|
| **Infrastructure** | VPS hosting, domain, SSL, backups | Rs.500/month (HARD CAP) | Founders for any breach |
| **Tools & Software** | SaaS subscriptions, API costs, development tools | Track separately | Founders for >Rs.5K/month |
| **Professional Services** | CA/CS fees, legal consultancy, external auditors | As incurred | Founders for >Rs.10K single |
| **Marketing & Sales** | Ads, content tools, event costs | Per campaign budget | Mira → Kabir → Founders |
| **Travel & Conveyance** | Client meetings, site visits, commute | As incurred | Founders for >Rs.5K single |
| **Office & Admin** | Stationery, printing, registered office costs | Minimal | Standard |
| **Communication** | Phone, internet, WhatsApp Business | Track separately | Standard |
| **Government Fees** | MCA filings, trademark fees, registration costs | As required | Standard (Anne tracks) |
| **Founder Compensation** | Drawings, sustenance (post-grant) | Per grant allocation | Founders |
| **Miscellaneous** | Uncategorized (should be minimal) | Minimize | Review monthly |

### Infrastructure Budget Tracking (Rs.500/month cap)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| VPS Hosting (Indian) | Rs.[Amount] | Primary server for Layaa OS |
| Domain (layaa.ai) | Rs.[Amount/12] (annualized) | Annual renewal, pro-rate monthly |
| Backblaze B2 (Backups) | Rs.[Amount] | Daily backup storage |
| SSL Certificate | Rs.[Amount/12] (if not free) | May be included with hosting |
| **TOTAL** | **Rs.[Total]** | **Must stay under Rs.500** |

### Expense Recording Rules

- Record every expense on the day it occurs
- Attach receipt/proof for every expense above Rs.500
- Categorize immediately — do not leave as "Miscellaneous"
- Flag any single expense above Rs.10,000 to Founders
- Review infrastructure costs weekly to ensure cap compliance
- Track recurring vs. one-time expenses separately

---

*This is an Aarav operational reference document. Updated as billing processes evolve and new expense categories emerge.*
