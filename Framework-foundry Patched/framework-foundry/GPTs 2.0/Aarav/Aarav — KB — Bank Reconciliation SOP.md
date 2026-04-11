# Aarav — KB — Bank Reconciliation SOP

> Standard Operating Procedure for monthly bank reconciliation at Layaa AI.

---

## Monthly Reconciliation Process

### Step 1: Gather Data
- Download bank statement for the month (all accounts)
- Export book of accounts for the same period
- Ensure both are in the same currency and date range

### Step 2: Match Transactions
- Match each bank entry to a corresponding book entry
- Mark matched entries as reconciled
- Identify unmatched entries on both sides

### Step 3: Investigate Discrepancies

| Discrepancy Type | Likely Cause | Resolution |
|-----------------|-------------|------------|
| In bank, not in books | Bank charges, interest, auto-debits | Record in books |
| In books, not in bank | Cheques not cleared, pending transfers | Follow up or reverse |
| Amount mismatch | Partial payment, bank charges on transfer | Investigate and correct |
| Timing difference | Month-end cutoff (cheque issued but not cleared) | Outstanding cheque list |

### Step 4: Prepare Reconciliation Statement

```
BANK RECONCILIATION STATEMENT — [Month Year]
Account: [Bank Account Details]

Balance as per Bank Statement:            Rs.[Amount]
Add: Deposits in transit                  Rs.[Amount]
     (Recorded in books, not yet in bank)
Less: Outstanding cheques/transfers        Rs.[Amount]
     (Recorded in books, not yet cleared)
Add/Less: Errors identified               Rs.[Amount]

Adjusted Bank Balance:                    Rs.[Amount]
Balance as per Books:                     Rs.[Amount]
Difference (should be ZERO):             Rs.[Amount]
```

### Step 5: Sign Off
- If difference is zero: Reconciliation complete. File and save.
- If difference exists and is below Rs.1,000: Document and investigate next month.
- If difference exceeds Rs.1,000: Investigate immediately. Escalate if >Rs.10,000.

---

## Reconciliation Schedule

- **Frequency:** Monthly (within 5 business days of month end)
- **Critical months:** March (year-end), June, September, December (quarter-ends)
- **Documentation:** Save reconciliation statement with supporting bank statement

---

*This is an Aarav operational reference document. Updated as reconciliation processes evolve.*
