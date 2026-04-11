# Layaa AI — Unit Economics

## Key Metrics & Formulas

### Customer Acquisition Cost (CAC)
```
CAC = Total Sales & Marketing Spend / New Customers Acquired
```
- **Target:** <₹15,000 per customer
- **Components:** Marketing spend + sales team cost + tools + content creation + event costs
- **Tracking:** Monthly, by channel (to identify most efficient acquisition paths)

### Lifetime Value (LTV)
```
LTV = Average Monthly Revenue per Customer × Average Customer Lifetime (months)
```
- **Target LTV:CAC ratio:** >3:1 (minimum viable), >5:1 (healthy)
- **Average monthly revenue by tier:**
  - Starter: ₹15,000/month
  - Growth: ₹40,000/month
  - Enterprise: ₹80,000+/month
- **Expected retention:** 12–24 months (target increasing with product stickiness)

### Gross Margin
```
Gross Margin = (Revenue - Direct Costs) / Revenue × 100
```
- **Target:** 60–80% depending on vertical
- **Direct costs:** Tool/API licenses, developer time, infrastructure, third-party services
- **Exclude:** Sales, marketing, G&A overhead (those go in operating margin)

### Net Revenue Retention (NRR)
```
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR × 100
```
- **Target:** >100% (expansion revenue exceeds losses from churn and downgrades)
- **Expansion sources:** Tier upgrades, additional workflows, new department automations
- **Churn mitigation:** Enablement training, health score monitoring, quarterly business reviews

### Payback Period
```
Payback Period (months) = CAC / (Average Monthly Revenue × Gross Margin %)
```
- **Target:** <6 months
- **Example:** CAC ₹15k / (₹40k × 65%) = 0.58 months (excellent for Growth tier)

---

## Margin Sensitivity Guidelines

| Margin Range | Assessment | Action |
|-------------|------------|--------|
| >80% | Premium pricing | Validate sustainability; ensure not underdelivering |
| 65–80% | Target range (retainer & pre-built) | Optimal; maintain |
| 50–65% | Standard range (implementation) | Acceptable for custom development projects |
| 40–50% | Acceptable only for strategic accounts | Requires documented justification |
| <40% | Below minimum threshold | Escalate to Founders — do not proceed without approval |
| <30% | Unacceptable | Reject unless Founder-approved strategic exception |

---

## Deal Economics Template

### Per-Deal Analysis

| Component | Calculation | Example (Growth) |
|-----------|-------------|-----------------|
| Implementation Revenue | One-time fee | ₹3,00,000 |
| Monthly Retainer | Recurring | ₹40,000/month |
| First-Year Value | Implementation + (Retainer × 12) | ₹3L + ₹4.8L = ₹7.8L |
| Direct Cost (Implementation) | Developer hours + tools | ~₹1.2L (60% margin) |
| Direct Cost (Monthly) | Monitoring + support hours | ~₹12k/month (70% margin) |
| First-Year Gross Profit | Revenue - Direct Costs | ₹7.8L - ₹1.2L - ₹1.44L = ₹5.16L |
| Gross Margin (Blended) | Gross Profit / Revenue | 66% |
| Break-even Point | When cumulative margin covers CAC | Month 1 (if CAC ₹15k) |
| Expected Lifetime Revenue | Retainer × Expected Retention | ₹40k × 18 months = ₹7.2L |
| Total Lifetime Value | Implementation + Lifetime Retainer | ₹3L + ₹7.2L = ₹10.2L |

### Unit Economics by Tier

| Metric | Starter | Growth | Enterprise |
|--------|---------|--------|-----------|
| Avg. Implementation | ₹75k | ₹3L | ₹7L |
| Monthly Retainer | ₹15k | ₹40k | ₹80k+ |
| First-Year Value | ₹2.55L | ₹7.8L | ₹16.6L+ |
| Estimated Gross Margin | 65% | 66% | 60% |
| CAC Target | ₹10k | ₹15k | ₹25k |
| LTV:CAC Ratio | 5.1:1 | 10.2:1 | 12.8:1 |
| Payback Period | <1 month | <1 month | <1 month |

---

## Revenue Composition Targets

| Revenue Stream | Current Target | Long-term Target |
|---------------|---------------|-----------------|
| Implementation (one-time) | 50–60% | 30–40% |
| Retainer (recurring - MRR) | 30–40% | 50–60% |
| Training & Workshops | 5–10% | 5–10% |
| Pre-built Modules | 0–5% | 10–15% |

**Strategic goal:** Shift revenue mix from implementation-heavy to retainer-heavy for predictable MRR growth.

---

## Cohort Analysis Framework

Track customer cohorts by:
- **Acquisition month:** When did they sign?
- **Acquisition channel:** Which marketing channel brought them?
- **ICP segment:** SaaS, Logistics, Fintech, Professional Services
- **Package tier:** Starter, Growth, Enterprise

Measure per cohort:
- Retention rate at 3, 6, 12 months
- Revenue expansion (upgrades, add-ons)
- Support ticket volume (proxy for product quality)
- NPS / satisfaction scores

---

## Health Score Model

Each active client scored monthly on:

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| Usage / Workflow Activity | 30% | Low (1-3), Medium (4-6), High (7-10) |
| Support Ticket Volume | 20% | High tickets = low score |
| Payment Timeliness | 20% | On time = 10, Late = 5, Very late = 1 |
| Engagement (meetings, feedback) | 15% | Active = high, Ghost = low |
| Expansion Signals | 15% | Requesting more = high, No interest = low |

**Thresholds:**
- Score 8–10: Healthy — candidate for upsell
- Score 5–7: Monitor — schedule check-in
- Score <5: At-risk — immediate intervention (Arjun + Founders)
