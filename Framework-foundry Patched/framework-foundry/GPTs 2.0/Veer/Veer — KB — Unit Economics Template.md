# Veer — KB — Unit Economics Template

> Reference document for computing and tracking unit economics: CAC, LTV, contribution margin, and payback period.

---

## Customer Acquisition Cost (CAC)

```
CAC = Total Sales & Marketing Spend / Number of New Customers Acquired

Components:
- Marketing spend (ads, content, events)
- Sales time (Abhimanyu Rs.400/hr for sales activities)
- Tool costs (CRM, email, analytics)
- Content creation costs

Current Stage 1 CAC Estimate: [EVIDENCE: PENDING — insufficient data for validated calculation]
Target CAC: <20% of first-year LTV
```

---

## Lifetime Value (LTV)

```
LTV = (Average Monthly Revenue per Customer x Gross Margin %) x Average Customer Lifespan (months)

For Implementation + Retainer model:
LTV = Implementation Fee + (Monthly Retainer x Gross Margin % x Average Months Retained)

Target LTV:CAC Ratio: >2.5x (below 2.5x = red flag)
```

---

## Contribution Margin

```
Contribution Margin = (Revenue - Variable Costs) / Revenue x 100

Variable Costs per engagement:
- Direct labor (Shubham/Abhimanyu hours at Stage 1 rates)
- Third-party API costs (if any)
- Infrastructure marginal cost (typically minimal due to self-hosting)

Fixed Costs (monthly):
- Infrastructure: Rs.500/month cap
- Tool subscriptions: [Track actual]
- Domain/hosting: [Track actual]
```

---

## Payback Period

```
Payback Period = CAC / (Monthly Revenue per Customer x Gross Margin %)

Target: <6 months
Yellow flag: 6-12 months
Red flag: >12 months
```

---

## Red Flag Thresholds — Detailed Reference

| Red Flag | Threshold | Impact | Escalation | Remediation |
|----------|-----------|--------|------------|-------------|
| Gross margin <30% | Any single deal | Unprofitable engagement | Founders (via Kabir) | Re-scope, re-price, or decline |
| CAC:LTV <2.5x | Portfolio level | Unsustainable acquisition | Founders (via Kabir) | Reduce CAC or increase LTV |
| Discount >20% | Any single deal | Revenue erosion precedent | Founders directly | Justify or decline |
| Revenue concentration >30% | Single client | Business risk | Kabir → Founders | Diversification strategy |
| Payment terms >60 days | Any deal | Cash flow strain | Abhay → Kabir | Negotiate shorter terms |
| Variable costs > fixed costs | Any engagement | Cost structure imbalance | Kabir | Investigate and restructure |
| Deal >Rs.10L | Any engagement | High-stakes commitment | Founders | Full deal review |
| Custom pricing | Any occurrence | Precedent risk | Founders | Document and limit |
| 3+ deals lost on price | Same vertical/tier | Pricing misalignment | Kabir (pricing review) | Full tier re-evaluation |

---

## Pricing Decision Tracker

### Template for Each Pricing Decision

```
PRICING DECISION LOG

Date: [Date]
Decision ID: PRC-[YYYY]-[NNN]
Deal/Product: [Name]
Decision Type: [New tier / Price change / Discount / Custom pricing]

CONTEXT:
[Why this pricing decision was needed]

ANALYSIS:
- Floor price: Rs.[Amount]
- Ceiling price: Rs.[Amount]
- Proposed price: Rs.[Amount]
- Confidence multiplier: [Value]
- Expected margin: [%]

COMPETITIVE CONTEXT:
[Relevant competitor pricing or market conditions]

DECISION:
[What was decided and by whom]

RATIONALE:
[Why this price was chosen — the reasoning, not just the number]

OUTCOME:
[Filled in after deal resolution — won/lost, actual margin, client feedback]

LEARNING:
[What this decision teaches about pricing in this vertical/segment]
```

---

*This is a Veer operational reference document. Updated as new financial data emerges and unit economics mature.*
