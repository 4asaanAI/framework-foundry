---
name: sox-testing
description: >
  Design and execute internal control testing procedures. Evaluates control design and operating
  effectiveness for financial reporting processes. Supports SOX compliance and startup internal
  control frameworks.
  Trigger: "SOX testing", "internal controls", "control testing", "control deficiency",
  "material weakness", "control effectiveness", "SOX compliance", "ICFR"
  This skill replaces the generic finance:sox-testing capability.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Agent
---

# SOX Testing / Internal Control Testing

Design and execute internal control testing procedures. Evaluates control design and operating effectiveness for financial reporting processes. Supports formal SOX compliance as well as pragmatic internal control frameworks for startups.

## Context Detection
Determine if this task relates to Layaa AI:
- **Layaa AI mode** if: user mentions Layaa AI, a founder (Abhimanyu/Shubham), Indian SMEs, AI automation services, any ICP (SaaS startups, logistics, fintech, professional services), or is working in the Layaa AI workspace → Read context from shared-references/ and domain-references/
- **General mode** if: task is about a different company/industry → Operate as standard skill without Layaa context

## Reference Loading (Layaa AI Mode)
Read relevant context from the plugin directory:
- domain-references/finance/compliance-calendar.md — Filing deadlines and compliance requirements
- domain-references/legal/compliance-red-flags.md — Known compliance risk indicators
- domain-references/legal/regulatory-landscape.md — Regulatory framework and requirements
Only load references relevant to the specific task.

## Execution Steps

### Step 1: Identify Controls to Test and Testing Scope
Determine what needs testing:

**Control Categories:**
- **Entity-Level Controls:** Tone at the top, governance, risk management
- **Process-Level Controls:** Transaction processing, authorization, reconciliation
- **IT General Controls:** Access management, change management, backup/recovery
- **Financial Reporting Controls:** Close process, journal entry approval, account reconciliation

**Scoping Questions:**
- Which financial statement assertions are relevant? (Existence, completeness, valuation, rights/obligations, presentation)
- Which business processes are in scope? (Revenue, expenses, payroll, cash, fixed assets)
- What is the testing period?
- What is the control frequency? (Per transaction, daily, weekly, monthly, quarterly, annual)

### Step 2: Assess Applicability (Layaa AI Mode)
For Layaa AI, contextualize control requirements:

**SOX Applicability:**
- Layaa AI is an early-stage private limited company — SOX (Sarbanes-Oxley) is NOT mandatory
- SOX applies to US-listed public companies
- However, internal controls are strongly recommended as good governance practice
- Building controls early creates a scalable foundation for growth

**Recommended Focus for Early-Stage Startup:**
Rather than full SOX compliance, focus on key controls that protect the business:

| Priority | Control Area | Why It Matters for Layaa AI |
|----------|-------------|---------------------------|
| **Critical** | Revenue Recognition | Ensure proper timing and amounts — dual revenue model (implementation + retainer) creates recognition complexity |
| **Critical** | Cash Management | Protect limited cash resources — monitor deposits, disbursements, signatory controls |
| **Critical** | Expense Authorization | Prevent unauthorized spending — approval workflows before payment |
| **High** | Data Security | Protect client data and IP — access controls, encryption, backup |
| **High** | Vendor/Contractor Payments | Proper authorization, TDS compliance, GST validation |
| **Medium** | Payroll | Accurate salary processing, statutory deductions (PF, ESI, TDS) |
| **Medium** | Financial Close | Timely and accurate period-end reporting |
| **Lower** | Fixed Assets | Track and depreciate assets properly |

### Step 3: Document Control Description
For each control being tested, document:

| Element | Description |
|---------|-------------|
| **Control ID** | [CTRL-AREA-###] |
| **Control Name** | [descriptive name] |
| **Control Objective** | What risk does this control mitigate? |
| **Control Owner** | Who is responsible for performing this control? |
| **Control Frequency** | How often? (Per transaction, daily, weekly, monthly, quarterly, annual) |
| **Control Type** | Preventive or Detective |
| **Control Method** | Manual, Automated, or IT-Dependent Manual |
| **Assertion(s)** | Which financial statement assertions does this address? |
| **Process** | Which business process does this belong to? |
| **Description** | Step-by-step description of what happens, who does it, and what evidence is produced |
| **Evidence** | What documentation proves this control operated? |

### Step 4: Design Test Procedures
For each control, design appropriate test procedures:

**Inquiry:**
- Interview the control owner about how the control operates
- Ask about exceptions and how they are handled
- Verify understanding matches documentation
- Limitation: Inquiry alone is never sufficient — must be corroborated

**Observation:**
- Watch the control being performed in real time
- Verify that the process matches the documented description
- Note any deviations from the documented procedure
- Best for: Controls performed frequently in a visible manner

**Inspection:**
- Examine documentary evidence of the control operating
- Check for signatures, approvals, timestamps, reconciliation markings
- Verify completeness of supporting documentation
- Best for: Controls that produce physical or digital evidence

**Reperformance:**
- Independently re-execute the control procedure
- Compare results to the control owner's results
- Identify any discrepancies
- Best for: Calculations, reconciliations, analytical reviews

Document the test procedure for each control in sufficient detail that another person could execute it.

### Step 5: Determine Sample Size and Selection
Set appropriate sample sizes based on control frequency:

| Control Frequency | Population Size | Recommended Sample |
|------------------|----------------|-------------------|
| Annual | 1 | Test the 1 occurrence |
| Quarterly | 4 | Test all 4 |
| Monthly | 12 | Test 2-4 (judgmental) |
| Weekly | 52 | Test 5-15 (judgmental or random) |
| Daily | 250+ | Test 20-25 (random) |
| Per Transaction | Varies | Test 25-40 (random or systematic) |

**Selection Methods:**
- **Random:** Assign numbers, use random selection — preferred for large populations
- **Systematic:** Every Nth item — acceptable if no pattern bias
- **Judgmental:** Select items with specific characteristics — use when risk-based targeting is needed
- **Haphazard:** Not truly random but practical — acceptable for small populations

For Layaa AI (early-stage, low transaction volume), populations are likely small — test entire population where feasible.

### Step 6: Execute Test Procedures and Document Results
For each test, document:

**Test Workpaper:**
| Field | Content |
|-------|---------|
| Control ID | [CTRL-AREA-###] |
| Test Period | [dates] |
| Population | [description and size] |
| Sample Size | [number] |
| Sample Selection Method | [random/systematic/judgmental] |
| Test Procedure | [what was done] |
| Test Date | [when testing was performed] |
| Tested By | [name] |

**Test Results (per sample item):**
| Sample # | Item Details | Test Performed | Result | Exception? | Notes |
|----------|-------------|----------------|--------|-----------|-------|
| 1 | [description] | [procedure] | [Pass/Fail] | [Y/N] | [details] |

### Step 7: Evaluate Findings
Classify each finding:

**Effective:**
- Control operated as designed throughout the testing period
- No exceptions identified, or exceptions were immaterial and promptly corrected
- Control adequately addresses the identified risk

**Deficiency:**
- Control exists but did not operate as designed in some instances
- Exception rate is low (1-2 out of sample)
- Risk is partially mitigated but gaps exist
- Remediation recommended but not urgent

**Significant Deficiency:**
- Control has multiple exceptions or a pattern of failure
- Compensating controls partially mitigate the risk
- Reasonable possibility of material misstatement if not remediated
- Requires management attention and remediation plan

**Material Weakness:**
- Control does not exist or has pervasively failed
- No compensating controls
- Reasonable possibility that a material misstatement would not be prevented or detected
- Requires immediate remediation and may affect audit opinion

### Step 8: Focus on Key Startup Controls (Layaa AI Mode)
For Layaa AI, design and test these priority controls:

**Revenue Recognition Controls:**
| Control | Description | Test |
|---------|-------------|------|
| CTRL-REV-001 | Implementation revenue recognized only upon documented milestone completion | Inspect milestone sign-off documents for sample of revenue entries |
| CTRL-REV-002 | Deposits recorded as deferred revenue, not recognized as income | Trace deposits to deferred revenue account, verify no premature recognition |
| CTRL-REV-003 | Retainer revenue recognized monthly, matching service period | Compare retainer invoices to revenue recognition entries for timing accuracy |
| CTRL-REV-004 | All revenue entries supported by signed contracts | Match revenue entries to executed contracts |

**Expense Authorization Controls:**
| Control | Description | Test |
|---------|-------------|------|
| CTRL-EXP-001 | Expenses above [threshold] require founder approval before payment | Inspect approval evidence for sample of expenses above threshold |
| CTRL-EXP-002 | Vendor payments match approved purchase orders or contracts | Match payments to POs/contracts |
| CTRL-EXP-003 | Reimbursements supported by receipts and approved by manager | Inspect supporting documentation for sample of reimbursements |

**Cash Management Controls:**
| Control | Description | Test |
|---------|-------------|------|
| CTRL-CASH-001 | Bank reconciliation performed monthly | Inspect reconciliations for all months in test period |
| CTRL-CASH-002 | Dual signatory required for payments above [threshold] | Verify dual authorization for sample of large payments |
| CTRL-CASH-003 | Cash receipts deposited within [N] business days | Compare receipt dates to deposit dates |

**Data Security Controls:**
| Control | Description | Test |
|---------|-------------|------|
| CTRL-IT-001 | Access to financial systems restricted to authorized personnel | Review user access list, verify appropriateness |
| CTRL-IT-002 | Financial data backed up [daily/weekly] | Verify backup logs and test restoration |
| CTRL-IT-003 | Client data access limited to project team members | Review access controls on client-facing systems |

### Step 9: Recommend Remediation
For each identified deficiency, provide:

| # | Finding | Severity | Root Cause | Remediation | Timeline | Owner |
|---|---------|----------|-----------|-------------|----------|-------|
| 1 | [finding] | [Deficiency/Significant/Material Weakness] | [why it happened] | [specific fix] | [target date] | [name] |

**Remediation Priorities:**
1. Material weaknesses — address immediately
2. Significant deficiencies — address within 30 days
3. Deficiencies — address within 90 days
4. Observations/best practices — address as part of continuous improvement

## Output Format

```
# Internal Control Testing — [Scope/Area]
**Entity:** [Company name]
**Test Period:** [dates]
**Testing Performed By:** [name]
**Date:** [date]

## Scope and Applicability
- **Control Framework:** [SOX / Internal Best Practice / Custom]
- **Applicability Note:** [For Layaa AI: SOX not mandatory; testing performed as good governance practice]
- **Areas in Scope:** [list]
- **Areas Excluded:** [list with justification]

## Testing Summary
| Area | Controls Tested | Effective | Deficiency | Sig. Deficiency | Material Weakness |
|------|----------------|-----------|-----------|-----------------|-------------------|
| Revenue Recognition | [count] | [count] | [count] | [count] | [count] |
| Expense Authorization | [count] | [count] | [count] | [count] | [count] |
| Cash Management | [count] | [count] | [count] | [count] | [count] |
| Data Security | [count] | [count] | [count] | [count] | [count] |
| **Total** | **[count]** | **[count]** | **[count]** | **[count]** | **[count]** |

## Control Test Results

### [Control Area — e.g., Revenue Recognition]

**CTRL-REV-001: [Control Name]**
| Element | Detail |
|---------|--------|
| Objective | [what risk is mitigated] |
| Owner | [name/role] |
| Frequency | [frequency] |
| Type | [Preventive/Detective] |
| Population | [size] |
| Sample | [size and method] |
| Test Procedure | [what was done] |
| **Result** | **[Effective / Deficiency / Sig. Deficiency / Material Weakness]** |
| Exceptions | [count and description] |
| Evidence | [documents reviewed] |

[Repeat for each control tested]

## Findings and Remediation

### Finding 1: [Title]
- **Control:** [CTRL-ID]
- **Severity:** [classification]
- **Description:** [what was found]
- **Root Cause:** [why it happened]
- **Impact:** [potential effect on financial reporting]
- **Remediation:** [specific corrective action]
- **Target Date:** [date]
- **Owner:** [name]

## Overall Assessment
- **Control Environment:** [Strong / Adequate / Needs Improvement / Weak]
- **Key Strengths:** [list]
- **Key Gaps:** [list]
- **Priority Actions:** [top 3 actions]

## Recommendations
1. **[Action]** — [expected improvement] — [priority] — [timeline]
2. **[Action]** — [expected improvement] — [priority] — [timeline]
3. **[Action]** — [expected improvement] — [priority] — [timeline]

## Follow-Up Schedule
| Finding | Remediation Due | Follow-Up Test Date | Status |
|---------|----------------|-------------------|--------|
| [finding] | [date] | [date] | [Open / In Progress / Closed] |
```

## What Makes This Different from Generic SOX Testing
- Contextualizes SOX for an early-stage Indian startup — not mandatory, but positions as good governance
- Pre-designed control tests for Layaa AI's specific risk areas (dual revenue model, deferred revenue, cash management)
- Includes Indian regulatory controls (TDS compliance, GST validation, PF/ESI)
- Focuses on controls most critical for startups (revenue recognition, expense authorization, cash, data security)
- Integrates compliance red flags from legal domain references
- Practical sample sizes appropriate for low-volume early-stage operations
- Builds a control framework that scales as the company grows
- Understands DPIIT/startup benefits that affect control requirements
