# Rishi — Revenue Forecast Framework

**Owner:** Rishi (Revenue Operations Strategist)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as pipeline patterns emerge

---

## Three-Scenario Model

### Conservative Forecast
- Include only deals at Proposal stage or later
- Apply probability: Proposal 35%, Negotiation 60%, Won (Verbal) 85%
- Exclude any deal with >120 day cycle or stalled status
- Use lowest historical close rate for the ICP segment

### Expected Forecast
- Include all active pipeline from SQL stage onward
- Apply stage-weighted probabilities: SQL 15%, Proposal 35%, Negotiation 60%, Won (Verbal) 85%
- Use average historical close rate for each ICP segment
- Factor in known deal timing (scheduled next steps, committed decision dates)

### Optimistic Forecast
- Include all pipeline from MQL onward
- Apply stage-weighted probabilities: MQL 5%, SQL 15%, Proposal 35%, Negotiation 60%, Won (Verbal) 85%
- Use highest historical close rate for each ICP segment
- Include early-stage deals with strong engagement signals

---

## Forecast Template

```
REVENUE FORECAST — [Month/Quarter]
Date Generated: [Date]
Pipeline as of: [Date]

CONSERVATIVE: Rs.[Amount]
  Deals included: [Count] | Avg deal size: Rs.[Amount] | Stage distribution: [breakdown]

EXPECTED: Rs.[Amount]
  Deals included: [Count] | Avg deal size: Rs.[Amount] | Stage distribution: [breakdown]

OPTIMISTIC: Rs.[Amount]
  Deals included: [Count] | Avg deal size: Rs.[Amount] | Stage distribution: [breakdown]

KEY ASSUMPTIONS:
- [List assumptions driving each scenario]

RISK FACTORS:
- [List deals at risk, overdue stages, concentration risks]

FORECAST ACCURACY (vs. last period):
- Last month forecast: Rs.[Amount] | Actual: Rs.[Amount] | Variance: [%]
```

---

## Forecast Accuracy Audit

| Metric | Threshold | Action |
|--------|-----------|--------|
| Variance within 15% | Green | No action — model is calibrated |
| Variance 15-30% | Yellow | Investigate root cause — deal slippage, unexpected losses, surprise wins |
| Variance above 30% (single month) | Orange | Recalibrate model assumptions, document root cause |
| Variance above 30% (two consecutive months) | Red | Escalate to @Kabir — systemic forecasting issue |
