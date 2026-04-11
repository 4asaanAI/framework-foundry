# Veer — KB — Pricing Tiering Frameworks

> Reference document for Layaa AI's pricing tier structures across standard engagements and product-specific offerings.

---

## Standard Engagement Tiers

| Tier | Implementation Fee | Monthly Retainer | Target Client | Typical Scope |
|------|-------------------|-----------------|---------------|---------------|
| **Starter** | Rs.50K-75K | Rs.15,000/mo | First-time AI adopter, small team | Single workflow automation, basic integration |
| **Growth** | Rs.1L-2.5L | Rs.40,000/mo | Post-seed startup, mid-market SME | Multi-workflow, CRM integration, custom logic |
| **Enterprise** | Rs.2.5L+ | Custom | Larger firms, complex requirements | Full-stack automation, multi-department, dedicated support |

---

## Product-Specific Tiers

### EduFlow (School Management)

| Tier | Implementation | Monthly | Margin Target | Breakeven | Includes |
|------|---------------|---------|---------------|-----------|----------|
| Starter | Rs.40,000 | Rs.3,500/mo | 50%+ | Month 6 (retainer covers ongoing costs) | Core modules: attendance, fees, certificates |
| Growth | Rs.75,000 | Rs.6,000/mo | 55%+ | Month 5 | + AI tutor, WhatsApp alerts, assignment gen |
| Premium | Rs.1,25,000 | Rs.9,000/mo | 60%+ | Month 4 | + Full customization, priority support, analytics |

**EduFlow Unit Economics:**
- Average implementation cost (internal): Rs.15K-25K (Shubham's time + infrastructure)
- Marginal cost per new school: Decreasing as templates mature
- LTV projection (24-month retention): Starter Rs.1.24L | Growth Rs.2.19L | Premium Rs.3.41L

### CA AI Agent (Tax Practice)

| Tier | Implementation | Monthly | Margin Target | Breakeven | Includes |
|------|---------------|---------|---------------|-----------|----------|
| Solo | Rs.25,000 | Rs.2,500/mo | 45%+ | Month 5 | Single practice, basic intake, ITR population |
| Practice | Rs.50,000 | Rs.5,000/mo | 50%+ | Month 4 | Multi-user, WhatsApp, GST+ITR, deadlines |
| Firm | Rs.1,00,000 | Rs.8,500/mo | 55%+ | Month 4 | Full features, client DB, bulk processing |

**CA AI Agent Unit Economics:**
- Average implementation cost (internal): Rs.10K-20K
- LTV projection (24-month retention): Solo Rs.85K | Practice Rs.1.7L | Firm Rs.3.04L

---

## Hybrid Pricing Formula Deep Dive

### Floor Price Calculation

```
FLOOR = (Labor + Expenses + Overhead + Risk) x 1.40

LABOR:
- Identify all roles involved (Shubham, Abhimanyu, future hires)
- Estimate hours per role using AI-compression rates:
  * Architecture: Traditional hours x 0.65 (60-70%)
  * Core logic: Traditional hours x 0.35 (30-40%)
  * UI: Traditional hours x 0.45 (40-50%)
  * Testing: Traditional hours x 0.75 (70-80%)
- Apply hourly rates (Stage 1): Shubham Rs.700/hr, Abhimanyu Rs.400/hr
- Total Labor = Sum of (Hours x Rate) per role

EXPENSES:
- Direct costs: API subscriptions, cloud costs, third-party tools
- Client-specific: Any tools purchased for this engagement
- Travel (if applicable): Site visits, training sessions

OVERHEAD:
- Infrastructure allocation: Rs.500/month pro-rated by engagement duration
- Administrative time: Estimated at 10% of direct labor cost

RISK BUFFER:
- Standard: 10% of (Labor + Expenses + Overhead)
- Complex engagement: 15% (new technology, unclear requirements, new vertical)
- First engagement with client: 15% (unknown unknowns)

FLOOR PRICE = Total x 1.40 (ensures minimum 40% markup)
```

### Ceiling Price Calculation

```
CEILING = Client Value x Capture Rate

CLIENT VALUE:
- Annual revenue impact (if automation enables revenue growth)
- Annual cost savings (staff time, error reduction, penalty avoidance)
- Risk mitigation value (compliance, data security)
- Strategic value (competitive advantage, market speed)

CAPTURE RATE:
- Conservative: 10% of client value
- Standard: 15% of client value
- Premium (high differentiation): 20-25% of client value
```

### Proposed Price Calculation

```
PROPOSED = Floor + [(Ceiling - Floor) x Confidence]

CONFIDENCE MULTIPLIER (0.3 to 0.8):
- 0.3: Low confidence — unclear requirements, new vertical, competitive pressure
- 0.5: Medium confidence — reasonable clarity, some comparable precedent
- 0.7: High confidence — clear scope, validated approach, client has budget
- 0.8: Very high — repeat client, proven delivery, strong relationship
```

### Worked Example

```
Engagement: Custom automation for a logistics SME (50 employees)
Vertical: Automation Development & Integration

LABOR:
- Architecture: 10 traditional hours x 0.65 = 6.5 hours x Rs.700 = Rs.4,550
- Core logic: 40 traditional hours x 0.35 = 14 hours x Rs.700 = Rs.9,800
- UI: 15 traditional hours x 0.45 = 6.75 hours x Rs.700 = Rs.4,725
- Testing: 10 traditional hours x 0.75 = 7.5 hours x Rs.700 = Rs.5,250
- Sales/discovery: 8 hours x Rs.400 = Rs.3,200
Total Labor: Rs.27,525

EXPENSES: Rs.2,000 (API costs)
OVERHEAD: Rs.2,753 (10% of labor)
RISK: Rs.3,228 (10% of subtotal — standard engagement)

FLOOR = (27,525 + 2,000 + 2,753 + 3,228) x 1.40 = Rs.49,708 ≈ Rs.50,000

CLIENT VALUE:
- 2 FTEs spending 50% time on manual tracking = Rs.6L/year in labor
- Error reduction: Rs.1L/year in penalty/rework avoidance
- Total annual value: Rs.7L

CEILING = Rs.7,00,000 x 0.15 = Rs.1,05,000

PROPOSED (0.5 confidence — first engagement, reasonable clarity):
= 50,000 + [(1,05,000 - 50,000) x 0.5] = Rs.77,500

Recommended price: Rs.75,000-80,000 + Rs.15,000/mo retainer
```

---

## Competitive Pricing Benchmarks

### Competitor Categories

| Category | Typical Pricing | Layaa AI Advantage |
|----------|----------------|-------------------|
| **DIY Tools (ChatGPT, Zapier, Make)** | Rs.0-5K/month in tools | Integration, maintenance, expertise — "they give you tools, we give you solutions" |
| **Freelancers** | Rs.500-1500/hr, project-based | Reliability, methodology, ongoing support, accountability |
| **IT Consulting Firms (mid-market)** | Rs.5-20L per engagement | Cost efficiency (AI compression), SME focus, speed |
| **Enterprise AI vendors** | Rs.20L-1Cr+ | Accessible pricing, no enterprise bloat, India-focused |
| **Boutique AI agencies** | Rs.2-8L per engagement | Comparable pricing, differentiate on methodology and ongoing support |

### Positioning: Not Cheapest, Not Most Expensive

Layaa AI positions in the **quality-accessible** zone:
- More affordable than enterprise vendors and large IT firms
- More reliable and comprehensive than freelancers
- More expertly implemented than DIY tools
- Comparable to boutique agencies but with better methodology and support structure

---

## Deal Sizing Calculator — Quick Reference

| Engagement Type | Floor Price | Typical Proposed | Ceiling Price | Key Variables |
|----------------|-----------|-----------------|--------------|---------------|
| Single workflow automation | Rs.40K | Rs.50K-75K | Rs.1L | Complexity, integration points |
| Multi-workflow package | Rs.75K | Rs.1.5L-2.5L | Rs.3.5L | Number of workflows, data complexity |
| Full department automation | Rs.1.5L | Rs.2.5L-4L | Rs.6L | Department size, system count |
| Platform deployment (EduFlow/CA AI) | Product tiers | Product tiers | Product tiers | Tier selection drives pricing |
| Consulting/assessment only | Rs.30K | Rs.50K-75K | Rs.1L | Days of assessment, team size |
| Workshop/training | Rs.25K | Rs.40K-60K | Rs.80K | Duration, customization, audience |

---

*This is a Veer operational reference document. Updated as pricing tiers evolve and competitive landscapes shift.*
