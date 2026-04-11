# Layaa AI -- Revenue Forecasting Methodology

**Document Owner:** Abhimanyu Singh, CEO
**Last Updated:** April 2026
**Classification:** Internal -- Revenue Ops & Leadership
**Version:** 2.0

---

## 1. Forecasting Philosophy

Revenue forecasting at Layaa AI serves three purposes:

1. **Operational planning** -- resource allocation, hiring decisions, cash flow management
2. **Performance tracking** -- are we on pace to hit targets?
3. **Strategic decision-making** -- market investment, product development, expansion timing

We use a **blended approach** combining weighted pipeline, historical conversion rates, and qualitative judgment. No single method is sufficient for an early-growth company selling to SMEs in India.

**Principles:**
- Accuracy over optimism. A conservative forecast that is correct is more valuable than an optimistic one that misleads.
- Forecasts are updated weekly, formalised monthly, and reviewed quarterly.
- Every forecast number must be traceable to either a pipeline deal or a historical trend.
- Forecast misses are learning opportunities, not failures -- unless the same miss repeats.

---

## 2. Forecasting Methods

### Method 1: Weighted Pipeline Forecast

The primary forecasting method. Uses current pipeline deals and their stage-based probability weights.

**Formula:**
```
Weighted Forecast = Sum of (Deal Value x Stage Probability)
```

**Stage Probabilities:**

| Stage | Probability | Rationale |
|-------|------------|-----------|
| Lead | 5% | Unqualified; speculative |
| MQL | 10% | ICP match but not BANT-qualified |
| SQL | 20% | BANT-qualified; discovery pending |
| Discovery | 35% | Engaged; pain identified; solution mapped |
| Proposal | 55% | Formal proposal delivered; active evaluation |
| Negotiation | 75% | Terms being discussed; high intent |
| Verbal Commit | 90% | Agreed terms; awaiting SoW signature and payment |
| Won | 100% | Signed and paid |

**Adjustments:**
- Deals past the "stale" threshold (see pipeline-tracker.md) are automatically downgraded by one probability tier.
- Deals with an identified competitor in play reduce probability by 10 percentage points.
- Repeat clients / expansion deals increase probability by 10 percentage points.

### Method 2: Historical Conversion Rate Forecast

Uses trailing 6-month average conversion rates applied to current pipeline volume.

**Formula:**
```
Expected Revenue = (Number of MQLs this month x MQL→Won rate x Avg Deal Size)
                 + (Existing pipeline at each stage x Stage→Won rate x Avg remaining deal size)
```

**Historical Conversion Rates (as of April 2026):**

| Conversion | Rate | Trailing Period |
|-----------|------|-----------------|
| MQL → SQL | 25% | 6-month average |
| SQL → Proposal | 60% | 6-month average |
| Proposal → Won | 35% | 6-month average |
| MQL → Won (end-to-end) | 5.25% | 6-month average |

**Average Deal Metrics:**

| Metric | Value |
|--------|-------|
| Average implementation fee | ₹2,50,000 |
| Average monthly retainer (new client) | ₹28,000 |
| Average first-year total contract value | ₹5,86,000 |
| Median sales cycle (MQL to Won) | 35 days |

### Method 3: Cohort-Based Forecast

For retainer revenue (recurring), we forecast based on client cohorts and retention rates.

**Formula:**
```
Retainer Revenue (Month N) = Sum of (Active clients in each cohort x Monthly retainer x Retention rate)
```

**Retention Rates by Cohort Age:**

| Cohort Age | Monthly Retention Rate | Annual Equivalent |
|-----------|----------------------|-------------------|
| 0-3 months | 95% | -- |
| 4-6 months | 92% | -- |
| 7-12 months | 90% | ~72% annual |
| 13-24 months | 93% | ~79% annual |
| 25+ months | 95% | ~83% annual |

*Note: Retention improves after the initial 6-month period as clients become embedded.*

---

## 3. Forecast Confidence Levels

Every deal and every forecast number is assigned one of three confidence levels.

### Definitions

| Level | Label | Criteria | Revenue Inclusion |
|-------|-------|----------|-------------------|
| **C1** | **Committed** | SoW signed OR verbal commit with payment date; >90% probability | Include at 100% of value |
| **C2** | **Best Case** | Proposal delivered AND positive feedback received; active negotiation; 50-89% probability | Include at 75% of value |
| **C3** | **Upside** | SQL or Discovery stage; engaged but early; 20-49% probability | Include at 25% of value |

### Applying Confidence Levels

```
Conservative Forecast = C1 only
Base Forecast         = C1 + C2 (at 75%)
Optimistic Forecast   = C1 + C2 (at 75%) + C3 (at 25%)
```

### Example

| Deal | Value | Confidence | Conservative | Base | Optimistic |
|------|-------|-----------|-------------|------|-----------|
| Client A -- SoW signed | ₹5,00,000 | C1 | ₹5,00,000 | ₹5,00,000 | ₹5,00,000 |
| Client B -- Negotiation | ₹3,00,000 | C2 | -- | ₹2,25,000 | ₹2,25,000 |
| Client C -- Proposal | ₹4,00,000 | C2 | -- | ₹3,00,000 | ₹3,00,000 |
| Client D -- Discovery | ₹2,50,000 | C3 | -- | -- | ₹62,500 |
| Client E -- SQL | ₹1,50,000 | C3 | -- | -- | ₹37,500 |
| **Totals** | **₹16,00,000** | | **₹5,00,000** | **₹10,25,000** | **₹11,25,000** |

**Planning Rule:** Resource allocation decisions use the Base Forecast. Cash flow planning uses the Conservative Forecast. Targets and stretch goals use the Optimistic Forecast.

---

## 4. Seasonal Adjustments

Indian SME buying patterns have predictable seasonal variations. Apply these adjustments to raw forecast numbers.

### Monthly Adjustment Factors

| Month | Factor | Rationale |
|-------|--------|-----------|
| April | 0.80 | New financial year; budgets being finalised; slow start |
| May | 0.90 | Budgets releasing; pipeline building |
| June | 1.00 | Normal activity |
| July | 0.95 | Monsoon; some logistics slowdown |
| August | 0.95 | Monsoon continued |
| September | 1.05 | Pre-Diwali planning; H2 budget push |
| October | 1.10 | Festival season; spending peaks |
| November | 1.05 | Post-Diwali momentum |
| December | 0.90 | Year-end slowdown; holidays |
| January | 1.05 | New calendar year energy; Q4 push begins |
| February | 1.10 | Q4 urgency; budget utilisation deadline approaching |
| March | 1.15 | Year-end budget flush; highest close rates |

**Application:**
```
Seasonally Adjusted Forecast = Raw Forecast x Monthly Factor
```

### ICP-Specific Seasonality Notes

| ICP | Peak Months | Trough Months | Note |
|-----|------------|---------------|------|
| SaaS Startups | Jan-Mar, Sep-Oct | Apr-May, Dec | Aligned with funding rounds and board meetings |
| Logistics SMEs | Sep-Mar | Apr-May, Jul-Aug | Demand peaks pre-festive and Q4 |
| Fintech | Jan-Mar | Jun-Aug | Compliance deadlines drive Q4 urgency |
| Professional Services | Jul-Sep, Jan-Mar | Apr-Jun | Tax season drives Jul-Sep; year-end drives Jan-Mar |

---

## 5. Monthly Forecast Template

```
============================================================
LAYAA AI -- MONTHLY REVENUE FORECAST
============================================================
Month:          [Month Year]
Prepared by:    [Name]
Date:           [Date]
Forecast Cycle: [Monthly / Mid-Month Refresh]

------------------------------------------------------------
1. IMPLEMENTATION REVENUE FORECAST
------------------------------------------------------------

Committed (C1):
  [Deal 1]: ₹_______ | Close Date: _______ | Status: _______
  [Deal 2]: ₹_______ | Close Date: _______ | Status: _______
  C1 Total: ₹_______

Best Case (C2):
  [Deal 3]: ₹_______ | Stage: _______ | Weighted: ₹_______
  [Deal 4]: ₹_______ | Stage: _______ | Weighted: ₹_______
  C2 Total (at 75%): ₹_______

Upside (C3):
  [Deal 5]: ₹_______ | Stage: _______ | Weighted: ₹_______
  [Deal 6]: ₹_______ | Stage: _______ | Weighted: ₹_______
  C3 Total (at 25%): ₹_______

IMPLEMENTATION FORECAST SUMMARY:
  Conservative: ₹_______ (C1 only)
  Base:         ₹_______ (C1 + C2)
  Optimistic:   ₹_______ (C1 + C2 + C3)

Seasonal Adjustment Factor: _______
Adjusted Base Forecast: ₹_______

------------------------------------------------------------
2. RETAINER (RECURRING) REVENUE FORECAST
------------------------------------------------------------

Existing Retainer MRR:
  [Client A]: ₹_______/mo | Tier: _______ | Cohort: _______
  [Client B]: ₹_______/mo | Tier: _______ | Cohort: _______
  [Client C]: ₹_______/mo | Tier: _______ | Cohort: _______
  Current MRR: ₹_______

Expected Retainer Churn:
  At-risk clients: _______ | Estimated churn: ₹_______/mo
  Net Retention Rate (trailing): _______%

New Retainer MRR (from implementation pipeline):
  [New Client 1]: ₹_______/mo | Expected start: _______
  [New Client 2]: ₹_______/mo | Expected start: _______
  Expected New MRR: ₹_______

RETAINER FORECAST:
  Current MRR:    ₹_______
  - Churn:        ₹_______
  + New MRR:      ₹_______
  = Forecast MRR: ₹_______
  Monthly Total:  ₹_______

------------------------------------------------------------
3. TOTAL REVENUE FORECAST
------------------------------------------------------------

  Implementation (Base):     ₹_______
  Retainer (Monthly):        ₹_______
  TOTAL MONTHLY FORECAST:    ₹_______

  vs Monthly Target:         ₹_______
  Variance:                  ₹_______ (___%)
  Status:                    [On Track / At Risk / Behind]

------------------------------------------------------------
4. QUARTERLY ROLLUP
------------------------------------------------------------

  Month 1 (Actual/Forecast): ₹_______
  Month 2 (Forecast):        ₹_______
  Month 3 (Forecast):        ₹_______
  QUARTERLY FORECAST:        ₹_______

  vs Quarterly Target:       ₹_______
  Variance:                  ₹_______ (___%)

------------------------------------------------------------
5. KEY ASSUMPTIONS & RISKS
------------------------------------------------------------

  Assumptions:
  1. [e.g., Client X closes by [date]]
  2. [e.g., No churn in existing retainer base]
  3. [e.g., [N] new MQLs from [campaign]]

  Risks:
  1. [e.g., Client Y may delay to next quarter]
  2. [e.g., Seasonal slowdown stronger than expected]

------------------------------------------------------------
6. ACTIONS REQUIRED
------------------------------------------------------------

  1. [Action] -- [Owner] -- [Due Date]
  2. [Action] -- [Owner] -- [Due Date]

============================================================
```

---

## 6. Quarterly Forecast Template

```
============================================================
LAYAA AI -- QUARTERLY REVENUE FORECAST
============================================================
Quarter:        Q_ FY [Year]
Prepared by:    [Name]
Date:           [Date]

------------------------------------------------------------
QUARTERLY SUMMARY
------------------------------------------------------------

                        Conservative    Base        Optimistic
Implementation:         ₹_________     ₹_________  ₹_________
Retainer (3-month):     ₹_________     ₹_________  ₹_________
TOTAL:                  ₹_________     ₹_________  ₹_________
Target:                 ₹_________
Coverage (Base/Target): ____x

------------------------------------------------------------
MONTHLY BREAKDOWN
------------------------------------------------------------

Month 1: [Month]
  Implementation:  ₹_______ | Retainer: ₹_______ | Total: ₹_______
  Confidence:      C1: ₹_______ | C2: ₹_______ | C3: ₹_______

Month 2: [Month]
  Implementation:  ₹_______ | Retainer: ₹_______ | Total: ₹_______
  Confidence:      C1: ₹_______ | C2: ₹_______ | C3: ₹_______

Month 3: [Month]
  Implementation:  ₹_______ | Retainer: ₹_______ | Total: ₹_______
  Confidence:      C1: ₹_______ | C2: ₹_______ | C3: ₹_______

------------------------------------------------------------
PIPELINE HEALTH
------------------------------------------------------------

Weighted Pipeline:     ₹_________
Pipeline Coverage:     ____x target
Win Rate (trailing):   ____%
Avg Deal Size:         ₹_________
Avg Sales Cycle:       ____ days
Stale Deal %:          ____%

------------------------------------------------------------
REVENUE MIX
------------------------------------------------------------

By Service Vertical:
  Education:       ₹_________ (___%)
  Consulting:      ₹_________ (___%)
  Automation Dev:  ₹_________ (___%)
  Pre-Built:       ₹_________ (___%)
  Maintenance:     ₹_________ (___%)

By ICP:
  SaaS Startups:   ₹_________ (___%)
  Logistics SMEs:  ₹_________ (___%)
  Fintech:         ₹_________ (___%)
  Prof Services:   ₹_________ (___%)

By Revenue Type:
  Implementation (one-time):  ₹_________ (___%)
  Retainer (recurring):       ₹_________ (___%)

------------------------------------------------------------
YoY / QoQ COMPARISON
------------------------------------------------------------

  This Quarter (Base):    ₹_________
  Last Quarter (Actual):  ₹_________
  QoQ Growth:             ____%

  This Quarter (Base):    ₹_________
  Same Quarter Last Year: ₹_________
  YoY Growth:             ____%

------------------------------------------------------------
VARIANCE ANALYSIS (vs prior forecast)
------------------------------------------------------------

  Prior Forecast (Base):   ₹_________
  Current Forecast (Base): ₹_________
  Variance:                ₹_________ (___%)
  Reason:                  ___________________________

------------------------------------------------------------
KEY RISKS & MITIGATIONS
------------------------------------------------------------

1. Risk: _________________________
   Impact: ₹_______ | Probability: ____%
   Mitigation: _________________________

2. Risk: _________________________
   Impact: ₹_______ | Probability: ____%
   Mitigation: _________________________

------------------------------------------------------------
ACTIONS FOR NEXT QUARTER
------------------------------------------------------------

1. [Action] -- [Owner] -- [Due Date]
2. [Action] -- [Owner] -- [Due Date]

============================================================
```

---

## 7. Variance Analysis Triggers

Forecast accuracy is measured and analysed at the end of each month and quarter.

### Variance Thresholds

| Variance Level | Threshold | Action Required |
|---------------|-----------|-----------------|
| **Green** | Actual within ±10% of Base Forecast | Standard review; document in monthly report |
| **Amber** | Actual deviates 10-25% from Base Forecast | Root cause analysis required; present findings in monthly review |
| **Red** | Actual deviates >25% from Base Forecast | Mandatory deep-dive; Founder-level review; forecast methodology adjustment if systemic |

### Variance Analysis Framework

When variance exceeds 10%, analyse along these dimensions:

1. **Volume Variance:** Did we close more or fewer deals than forecasted?
   - Root cause: Pipeline health? Lead gen issues? Market conditions?

2. **Deal Size Variance:** Were average deal sizes higher or lower than expected?
   - Root cause: Discounting? Upselling? ICP mix shift?

3. **Timing Variance:** Did deals slip from the forecasted month to the next?
   - Root cause: Client decision delays? Internal delivery bottleneck?

4. **Conversion Rate Variance:** Did stage conversion rates differ from historical averages?
   - Root cause: Lead quality? Competitive pressure? Pricing issues?

5. **Churn Variance (Retainer):** Did we lose or retain more retainer clients than expected?
   - Root cause: Delivery quality? Client financial issues? Competitor poaching?

### Variance Report Template

```
VARIANCE ANALYSIS -- [Month/Quarter] [Year]
---------------------------------------------

FORECAST vs ACTUAL:
  Forecast (Base):  ₹_________
  Actual:           ₹_________
  Variance:         ₹_________ (___%)
  Status:           [Green / Amber / Red]

VARIANCE DECOMPOSITION:
  Volume Variance:      ₹_________ (Forecasted ___ deals, Actual ___ deals)
  Deal Size Variance:   ₹_________ (Forecasted avg ₹_____, Actual avg ₹_____)
  Timing Variance:      ₹_________ (___ deals slipped to next period)
  Conversion Variance:  ₹_________ (Rates: MQL→SQL __% vs __%, etc.)
  Churn Variance:       ₹_________ (Forecasted __% churn, Actual __%)

ROOT CAUSES:
  1. _________________________
  2. _________________________

CORRECTIVE ACTIONS:
  1. [Action] -- [Owner] -- [Due Date]
  2. [Action] -- [Owner] -- [Due Date]

FORECAST METHODOLOGY ADJUSTMENT (if needed):
  [Describe any changes to weights, rates, or assumptions]
```

---

## 8. Forecast Accuracy Targets

### Monthly Accuracy

| Quarter in Business | Accuracy Target (Base Forecast) | Tolerance |
|--------------------|-------------------------------|-----------|
| Q1-Q2 (early stage) | ±25% | Learning period; refining data |
| Q3-Q4 | ±20% | Conversion data stabilising |
| Year 2+ | ±15% | Mature data; reliable benchmarks |
| Year 3+ | ±10% | Best-in-class for SME B2B |

### Quarterly Accuracy

Quarterly forecasts should be more accurate than monthly (law of large numbers).

| Target | Value |
|--------|-------|
| Quarterly forecast accuracy (Year 1) | ±15% |
| Quarterly forecast accuracy (Year 2+) | ±10% |

### Accuracy Measurement

```
Forecast Accuracy = 1 - |Actual - Forecast| / Actual x 100%
```

**Reporting:** Forecast accuracy is reported monthly and tracked as a trailing 6-month average. It is a KPI for the Revenue Ops function and is reviewed in the quarterly business review.

---

## 9. Forecasting Calendar

### Monthly Cadence

| Week | Activity | Owner |
|------|----------|-------|
| Week 1 | Review prior month actuals vs forecast; variance analysis | Revenue Ops |
| Week 1 | Update pipeline probabilities and confidence levels | AEs |
| Week 2 | Mid-month pipeline scrub; re-forecast if material changes | Sales Lead |
| Week 3 | Preliminary next-month forecast prepared | Revenue Ops |
| Week 4 | Monthly forecast finalised and submitted to Founders | Revenue Ops + CEO |

### Quarterly Cadence

| Timing | Activity | Owner |
|--------|----------|-------|
| Last week of quarter | Q+1 forecast prepared | Revenue Ops |
| First week of new quarter | Prior quarter actuals compiled; variance analysis | Revenue Ops |
| Second week of new quarter | Quarterly business review with Founders | CEO + CTO + Revenue Ops |
| Second week of new quarter | Methodology adjustments (if accuracy targets missed) | Revenue Ops |

---

## 10. Tools and Data Sources

| Purpose | Tool/Source | Update Frequency |
|---------|-----------|-----------------|
| Pipeline data | CRM (primary source of truth) | Real-time |
| Historical conversion rates | CRM reporting / analytics | Monthly recalculation |
| Retainer revenue tracking | Accounting system + CRM | Monthly reconciliation |
| Seasonal factors | Historical data + market research | Annual review |
| Forecast calculations | Spreadsheet model (linked to CRM export) | Weekly |
| Forecast reporting | Dashboard / slide deck | Monthly + quarterly |

### Data Integrity Rules

1. CRM is the single source of truth for pipeline data. No side spreadsheets.
2. Deal amounts in CRM must be updated within 24 hours of any change.
3. Historical conversion rates are recalculated monthly using trailing 6-month data.
4. Seasonal factors are reviewed annually (in March) and adjusted based on actual patterns.
5. Retainer revenue is reconciled monthly between CRM and accounting.

---

*Accurate forecasting is a discipline, not a prediction exercise. The more consistently we follow this methodology, the more reliable our forecasts become. Every team member who touches the pipeline contributes to forecast quality.*

**Layaa AI Private Limited**
*Empower decisions, Elevate Profits!*
