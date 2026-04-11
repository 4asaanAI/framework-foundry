# Layaa AI -- Unit Economics Framework

**Document Owner:** Abhimanyu Singh (CEO)
**Last Updated:** April 2026
**Classification:** Internal -- Confidential
**Version:** 2.0

---

## 1. Purpose

This document defines the unit economics framework for Layaa AI Private Limited. It provides the formulas, benchmarks, and tracking mechanisms that govern financial health at the per-client and per-engagement level. Every commercial decision -- pricing, discounting, client acquisition spending, service mix -- must be evaluated against these unit economics.

---

## 2. Key Metrics Overview

| Metric | Definition | Target | Red Flag |
|--------|-----------|--------|----------|
| CAC (Customer Acquisition Cost) | Total cost to acquire one paying client | Less than INR 15,000 | Above INR 25,000 |
| LTV (Lifetime Value) | Total gross profit from a client over the relationship | Above INR 1,50,000 | Below INR 75,000 |
| CAC:LTV Ratio | LTV divided by CAC | Above 3.0x | Below 2.5x |
| Payback Period | Months to recover CAC from client gross profit | Under 3 months | Above 6 months |
| Contribution Margin | Revenue minus all direct costs, per engagement | Above 40% | Below 30% |
| Monthly Burn Rate | Total cash outflow per month | Below INR 50,000 | Above INR 75,000 |
| Cash Runway | Months of operation at current burn rate | Above 12 months | Below 6 months |

---

## 3. Customer Acquisition Cost (CAC)

### 3.1 Formula

```
CAC = Total Acquisition Costs (in period) / Number of New Paying Clients (in period)
```

### 3.2 Cost Components

| Cost Category | Items Included | Monthly Budget (Current) |
|--------------|----------------|--------------------------|
| **Marketing Spend** | Content creation tools, social media promotion, domain/hosting, SEO tools | INR 2,000 -- 5,000 |
| **Sales Time** | Founder hours spent on outreach, proposals, demos, negotiations (valued at internal rate INR 1,500/hr) | Track actual hours |
| **Tools & Platforms** | CRM, email marketing, LinkedIn premium, portfolio hosting | INR 1,000 -- 3,000 |
| **Networking & Events** | Conference attendance, community memberships, co-working day passes | INR 1,000 -- 3,000 |
| **Referral Incentives** | Referral bonuses, testimonial incentives, partner commissions | As incurred |

### 3.3 CAC Calculation Example

```
Month: March 2026
- Marketing spend: INR 3,000
- Sales time: 20 hours x INR 1,500 = INR 30,000
- Tools: INR 2,000
- Networking: INR 2,000
- Total acquisition cost: INR 37,000
- New paying clients: 3
- CAC = INR 37,000 / 3 = INR 12,333
```

### 3.4 CAC by Acquisition Channel

Track CAC separately for each channel to identify the most efficient sources:

| Channel | Expected CAC Range | Priority |
|---------|--------------------|----------|
| Inbound (content, SEO, social media) | INR 5,000 -- 10,000 | High -- invest to build |
| Referrals | INR 2,000 -- 8,000 | Highest -- nurture actively |
| Direct outreach (cold) | INR 15,000 -- 30,000 | Medium -- use selectively |
| Partnerships / resellers | INR 8,000 -- 15,000 | Medium -- build over time |
| Platform leads (Upwork, Toptal, etc.) | INR 10,000 -- 20,000 | Low -- use as supplement |

### 3.5 CAC Optimisation Levers
- Increase referral rate (target: 30% of new clients from referrals)
- Improve proposal-to-close ratio (target: above 40%)
- Reduce sales cycle length (target: under 3 weeks for sub-INR 2 Lakh deals)
- Build reusable proposal templates and case studies
- Create content that generates inbound leads

---

## 4. Lifetime Value (LTV)

### 4.1 Formula

```
LTV = Average Revenue Per Client Per Month x Average Gross Margin % x Average Client Lifespan (months)
```

**Simplified alternative:**
```
LTV = Average Total Revenue Per Client x Average Gross Margin %
```

### 4.2 LTV Components

| Component | How to Calculate | Current Estimate |
|-----------|-----------------|------------------|
| Average Revenue Per Client Per Month | Total revenue / active clients / months | INR 40,000 -- 80,000 |
| Average Gross Margin | (Revenue - Direct Costs) / Revenue | 45 -- 55% |
| Average Client Lifespan | Track from first to last invoice per client | 4 -- 8 months (target: 12+) |

### 4.3 LTV by Client Segment

| Client Segment | Avg Monthly Revenue | Avg Margin | Avg Lifespan | Estimated LTV |
|---------------|--------------------|-----------:|-------------|---------------|
| One-time project (small) | INR 30,000 | 45% | 1.5 months | INR 20,250 |
| One-time project (medium) | INR 75,000 | 42% | 2.5 months | INR 78,750 |
| Retainer client | INR 50,000 | 55% | 8 months | INR 2,20,000 |
| Strategic / enterprise | INR 1,50,000 | 48% | 10 months | INR 7,20,000 |

### 4.4 LTV Enhancement Strategies
- Convert one-time clients to retainers (target: 25% conversion rate)
- Cross-sell additional services (maintenance after build, consulting after deployment)
- Increase average project size through value-based pricing
- Reduce churn through proactive communication and quality delivery
- Build switching costs through deep integration and institutional knowledge

---

## 5. CAC:LTV Ratio

### 5.1 Formula

```
CAC:LTV Ratio = LTV / CAC
```

### 5.2 Benchmarks and Interpretation

| Ratio | Interpretation | Action |
|-------|---------------|--------|
| Above 5.0x | Excellent -- may be under-investing in growth | Consider increasing acquisition spend |
| 3.0x -- 5.0x | Healthy -- sustainable unit economics | Maintain and optimise |
| 2.5x -- 3.0x | Acceptable -- monitor closely | Identify which channel or segment is dragging |
| 2.0x -- 2.5x | **Red flag** -- economics weakening | Immediate review of CAC and LTV drivers |
| Below 2.0x | **Critical** -- unsustainable | Pause acquisition spend, fix pricing or reduce costs |

### 5.3 Ratio by Channel (Track Monthly)

| Channel | CAC | LTV | Ratio | Status |
|---------|-----|-----|-------|--------|
| Referrals | INR 5,000 | INR 2,00,000 | 40.0x | Invest more |
| Inbound | INR 8,000 | INR 1,50,000 | 18.8x | Scale up |
| Direct outreach | INR 20,000 | INR 1,00,000 | 5.0x | Maintain |
| Platform leads | INR 15,000 | INR 50,000 | 3.3x | Optimise or reduce |

> These are illustrative targets. Track actual figures monthly and update.

---

## 6. Payback Period

### 6.1 Formula

```
Payback Period (months) = CAC / (Average Monthly Revenue Per Client x Gross Margin %)
```

### 6.2 Targets

| Client Segment | Target Payback | Maximum Acceptable |
|---------------|---------------|-------------------|
| One-time project | Within project duration | 1.5x project duration |
| Retainer client | 2 months | 4 months |
| Strategic / enterprise | 3 months | 6 months |

### 6.3 Example

```
CAC = INR 12,000
Average monthly revenue from client = INR 50,000
Gross margin = 50%
Monthly gross profit = INR 25,000
Payback period = 12,000 / 25,000 = 0.48 months (approximately 15 days)
```

### 6.4 Payback Period Considerations
- For one-time projects, payback should be achieved within the first milestone payment
- For retainers, payback within the first 2 billing cycles is the goal
- If payback exceeds 6 months, the client relationship must be reviewed for profitability
- Factor in payment collection delays (actual cash receipt, not invoice date)

---

## 7. Contribution Margin by Service Line

### 7.1 Formula

```
Contribution Margin = (Revenue - Direct Variable Costs) / Revenue x 100
```

### 7.2 Direct Variable Costs Include
- Founder time at internal cost rate (INR 1,500/hr)
- Contractor payments (if any)
- API and tool costs attributable to the project
- Any direct travel or client-site expenses

### 7.3 Service Line Targets

| Service Line | Revenue (Target Mix) | Contribution Margin Target | Contribution Margin Floor |
|-------------|---------------------|---------------------------|--------------------------|
| AI Consulting & Strategy | 25% | 55% | 45% |
| Custom AI Development | 35% | 42% | 35% |
| AI Integration Services | 15% | 45% | 38% |
| Maintenance & Support | 10% | 68% | 60% |
| Pre-Built Solutions | 10% | 78% | 70% |
| Training & Workshops | 5% | 60% | 50% |

### 7.4 Blended Contribution Margin Target

```
Blended target: 50% (weighted by revenue mix)
Blended floor: 42%
```

If blended contribution margin drops below 42%, trigger an immediate pricing and cost review.

---

## 8. Break-Even Analysis

### 8.1 Per-Deal Break-Even

```
Break-Even Revenue (per deal) = Fixed Costs Allocated to Deal + Variable Costs of Deal
```

For each deal, calculate:
- Minimum revenue required to cover all direct costs
- Revenue required to achieve target margin
- Revenue required to contribute to overhead recovery

### 8.2 Monthly Break-Even

```
Monthly Break-Even Revenue = Total Monthly Fixed Costs / Average Contribution Margin %
```

### 8.3 Current Monthly Fixed Costs (April 2026 Estimate)

| Cost Item | Monthly Amount (INR) |
|-----------|---------------------|
| Cloud infrastructure & hosting | 3,000 -- 5,000 |
| SaaS subscriptions (dev tools, productivity) | 5,000 -- 8,000 |
| Domain, email, communication tools | 1,000 -- 2,000 |
| Accounting & compliance (pro-rated) | 3,000 -- 5,000 |
| Insurance (if applicable, pro-rated) | 1,000 -- 2,000 |
| Miscellaneous / buffer | 2,000 -- 3,000 |
| **Total Monthly Fixed Costs** | **15,000 -- 25,000** |

> Founder compensation is not included in fixed costs at this stage (bootstrap phase). Once salaries are drawn, they become a significant fixed cost component.

### 8.4 Break-Even Calculation

```
At INR 20,000 monthly fixed costs and 50% contribution margin:
Monthly break-even revenue = INR 20,000 / 0.50 = INR 40,000

At INR 25,000 monthly fixed costs and 45% contribution margin:
Monthly break-even revenue = INR 25,000 / 0.45 = INR 55,556
```

### 8.5 Break-Even by Deal Size

| Deal Size (INR) | Min Margin for Break-Even | Hours at INR 4,000/hr | Viability |
|-----------------|--------------------------|----------------------|-----------|
| 10,000 -- 25,000 | 60%+ (due to fixed overhead per deal) | 2.5 -- 6 hrs | Only for quick wins or upsell |
| 25,000 -- 75,000 | 45%+ | 6 -- 19 hrs | Standard viable range |
| 75,000 -- 2,00,000 | 40%+ | 19 -- 50 hrs | Sweet spot |
| 2,00,000 -- 5,00,000 | 35%+ | 50 -- 125 hrs | High value, ensure scope control |
| Above 5,00,000 | 30%+ | 125+ hrs | Strategic, phase carefully |

---

## 9. Monthly Burn Rate Tracking

### 9.1 Formula

```
Monthly Burn Rate = Total Cash Outflows in Month (operating + capital)
Net Burn Rate = Total Cash Outflows - Total Cash Inflows
```

### 9.2 Burn Rate Budget (Bootstrap Phase)

| Category | Budget (INR/month) | Hard Ceiling |
|----------|-------------------|--------------|
| Infrastructure & hosting | 5,000 | 8,000 |
| Tools & subscriptions | 8,000 | 12,000 |
| Marketing & sales | 5,000 | 10,000 |
| Compliance & professional fees | 5,000 | 8,000 |
| Miscellaneous | 2,000 | 5,000 |
| **Total Burn Rate Target** | **25,000** | **43,000** |

> The infrastructure target of less than INR 500/month for core operations should be maintained through free tiers, open-source tools, and efficient resource use. The INR 5,000 infrastructure budget above includes development tools, staging environments, and client demo infrastructure.

### 9.3 Burn Rate Monitoring

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Monthly burn vs. budget | Within 100% | 100--120% | Above 120% |
| Net burn (outflows - inflows) | Negative (cash positive) | INR 0 -- 25,000 | Above INR 25,000 |
| Month-over-month burn increase | Less than 10% | 10--25% | Above 25% |

---

## 10. Cash Runway Calculation

### 10.1 Formula

```
Cash Runway (months) = Current Cash Balance / Average Monthly Net Burn Rate
```

### 10.2 Runway Thresholds

| Runway | Status | Action |
|--------|--------|--------|
| Above 18 months | Comfortable | Continue planned investments |
| 12 -- 18 months | Healthy | Monitor, no urgent action |
| 6 -- 12 months | **Caution** | Reduce discretionary spending, accelerate revenue |
| 3 -- 6 months | **Warning** | Cut non-essential costs, prioritise cash-generating deals |
| Below 3 months | **Critical** | Emergency measures: defer all non-critical expenses, pursue immediate revenue opportunities, consider external funding |

### 10.3 Runway Scenarios (Model Monthly)

Maintain three runway scenarios updated monthly:

1. **Optimistic:** Current cash + expected revenue (90% confidence pipeline) vs. planned burn
2. **Base case:** Current cash + confirmed revenue only vs. planned burn
3. **Pessimistic:** Current cash + zero new revenue vs. current burn rate

---

## 11. Monthly Unit Economics Dashboard

Track and review the following every month (by the 5th of the following month):

```
LAYAA AI -- UNIT ECONOMICS DASHBOARD
Month: [___________]

ACQUISITION
  New clients acquired:           [___]
  Total acquisition spend:        INR [___________]
  CAC:                            INR [___________]
  CAC by channel:                 Referral: [___] | Inbound: [___] | Outreach: [___]

VALUE
  Active clients:                 [___]
  Monthly revenue:                INR [___________]
  Average revenue per client:     INR [___________]
  Blended contribution margin:    [___] %

RATIOS
  LTV (rolling 6-month):          INR [___________]
  CAC:LTV ratio:                  [___] x
  Payback period:                 [___] months

CASH
  Opening cash balance:           INR [___________]
  Cash inflows:                   INR [___________]
  Cash outflows (burn):           INR [___________]
  Closing cash balance:           INR [___________]
  Net burn:                       INR [___________]
  Cash runway (base case):        [___] months

SERVICE LINE MARGINS
  Consulting:                     [___] %
  Development:                    [___] %
  Integration:                    [___] %
  Maintenance:                    [___] %
  Pre-built:                      [___] %
  Training:                       [___] %
  Blended:                        [___] %

FLAGS
  [ ] CAC:LTV below 3.0x
  [ ] Payback period above 4 months
  [ ] Contribution margin below 42%
  [ ] Burn rate above budget
  [ ] Runway below 12 months
  [ ] Client concentration above 30%
```

---

## 12. Review and Escalation

| Trigger | Escalation |
|---------|-----------|
| CAC:LTV drops below 3.0x | Review at next Founder meeting |
| CAC:LTV drops below 2.5x | Immediate Founder review, pause discretionary acquisition spend |
| Contribution margin below 42% blended | Review pricing and cost structure within 1 week |
| Cash runway below 6 months | Emergency financial review, activate cost-reduction plan |
| Any single client exceeds 30% of revenue | Diversification plan required within 30 days |
| Net burn exceeds INR 50,000 for 2 consecutive months | Mandatory cost audit |

---

## 13. Annual Benchmarking

At the end of each financial year (March), conduct a comprehensive unit economics review:

- Compare actual CAC, LTV, margins against targets
- Benchmark against industry standards for AI/IT services startups
- Identify trends (improving or deteriorating)
- Set targets for the coming financial year
- Update this document with revised benchmarks and targets

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
*CIN: U62099HR2025PTC139528 | DPIIT: DIPP245808 | Udyam: UDYAM-HR-05-0177880 (Micro)*
