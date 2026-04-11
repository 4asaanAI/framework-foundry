# Forecast Methodology

## Forecast Types and Formulas

### 1. MRR Forecast (Monthly Recurring Revenue)

```
MRR Forecast = (Active Clients x Avg. Retainer) + Expected Upgrades - Expected Churn
```

Inputs:
- **Active Clients:** Count of clients in "Client - Active" CRM status
- **Avg. Retainer:** Weighted average of Starter/Growth/Enterprise packages
- **Expected Upgrades:** Clients flagged for package upgrade by delivery team
- **Expected Churn:** Clients at risk (health score <6/10)

Forecast horizon: 3 months rolling.

### 2. Implementation Revenue Forecast

```
Implementation Revenue = (Deals in Pipeline x Avg. Deal Size x Stage-Weighted Probability)
```

Stage-weighted probabilities:
- Proposal Stage: 35%
- Contract Negotiation: 70%
- Signed / Payment Pending: 95%

Inputs:
- **Deals in Pipeline:** Count of deals in "Proposal" or later stages (from CRM)
- **Avg. Deal Size:** Rs 2.5L (updated quarterly)
- **Stage Data:** Real-time CRM pipeline

### 3. Total Revenue Forecast

```
Total Revenue = MRR Forecast + Implementation Revenue Forecast + One-Time Upsells
```

One-time upsells include:
- Add-on modules
- Consulting hours beyond retainer scope
- Training sessions or workshops

---

## Forecasting Cadence

| Forecast Type | Update Frequency | Lead Time |
|---------------|------------------|-----------|
| MRR | Weekly | Real-time |
| Implementation Revenue | Bi-weekly | 14 days ahead |
| Total Revenue | Monthly | 30 days ahead |
| Quarterly Outlook | Quarterly | 90 days ahead |

**Forecast lock date:** 25th of each month for the following month (e.g., January 25th locks the February forecast).

---

## Confidence Adjustments

- If <10 active clients: Apply 20% confidence buffer (early-stage volatility).
- If client concentration risk >40% (1 client = >40% MRR): Flag dependency risk.
- If >50% of pipeline from one ICP: Adjust probability by ICP-specific conversion rate.
- If >60% of deals >60 days in Proposal: Reduce probability to 20% (likely stalled).

---

## Forecast Error Thresholds

| Forecast Horizon | Acceptable Variance | Yellow Flag | Red Flag |
|------------------|---------------------|-------------|----------|
| Current Month (0-30 days) | +/-5% | +/-10% | >+/-15% |
| Next Month (30-60 days) | +/-10% | +/-15% | >+/-20% |
| Quarter (90 days) | +/-15% | +/-20% | >+/-25% |

Escalation rules:
- **Yellow Flag:** Document root cause, share with strategic leadership (informational).
- **Red Flag:** Immediate escalation, recalibration required before next forecast.

---

## Root Cause Analysis Framework (5-Why Method)

When forecast variance exceeds acceptable range, perform 5-Why analysis.

Example structure:

1. Why did the metric miss forecast by X%?
2. Why did the underlying event occur?
3. Why was the contributing factor present?
4. Why was the process gap not caught?
5. Why does the process have this gap?

Output: Identified root cause, proposed fix, and whether a memory/SOP update is required.

---

## Recalibration Triggers

Recalibration is triggered when:
1. Forecast error >+/-15% for 2 consecutive months
2. Systematic bias detected (e.g., always over-forecasting by 10-20%)
3. Major business model change (e.g., new pricing tier launched)
4. Market shift (e.g., SME budget constraints due to economic downturn)

### Recalibration Process

1. Review historical data (last 6 months of forecast vs. actual)
2. Identify bias patterns (over-optimism, under-estimation, seasonality)
3. Adjust probability weights for implementation forecast stage weighting
4. Consult relevant contributors (pricing changes, sales cycle insights, churn patterns)
5. Document changes in this methodology
6. Strategic leadership approval required before applying recalibration

---

## GPT Input Attribution for Errors

Each forecast depends on specific inputs. When errors occur, attribute to the relevant source:

| Input Source | Data Provided | Error Type |
|--------------|---------------|------------|
| Sales | Pipeline stage data, deal probabilities | Deals marked "Proposal" but never close = optimistic probability |
| Pricing | Avg. deal size, pricing assumptions | Actual deal sizes differ >20% = repricing needed |
| Finance | MRR tracking, payment confirmations | Churn not reported = MRR overestimation |
| Delivery | Upsell opportunities, client health | Upsells missed = poor client engagement visibility |
| Marketing | Lead generation forecasts | MQL volume misses target = pipeline shortage |

If same input source causes >3 consecutive forecast misses, propose methodology update.

---

## Monthly Review Checklist

Review date: 5th of each month (reviewing previous month).

1. Compile forecast vs. actual data (Finance provides final revenue numbers)
2. Calculate variances for MRR, Implementation, Upsells, Total
3. Identify root causes for variances >+/-5%
4. Attribute errors to relevant input sources (if applicable)
5. Document lessons learned and corrective actions
6. Share Forecast Delta Report with strategic leadership
7. Update forecast methodology if recalibration needed (requires approval)
8. Lock next month's forecast (by 25th of current month)
