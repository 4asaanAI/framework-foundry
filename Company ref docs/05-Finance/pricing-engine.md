# Layaa AI -- Pricing Engine

**Document Owner:** Abhimanyu Singh (CEO) & Shubham Sharma (CTO)
**Last Updated:** April 2026
**Classification:** Internal -- Confidential
**Version:** 2.0

---

## 1. Purpose

This document defines the complete pricing framework for Layaa AI Private Limited. Every client engagement, proposal, and quote must follow this framework. Deviations require explicit Founder approval per the escalation workflow in Section 8.

---

## 2. Pricing Philosophy

Layaa AI uses a **Hybrid Pricing Model** that combines cost-recovery, market positioning, and value capture:

```
Final Price = Fixed Component + Variable Component + Value-Based Tier
```

This ensures we cover costs, stay competitive, and capture a fair share of the value we create for clients.

**Core Principles:**
- Never price below cost (including opportunity cost of Founder time)
- Price reflects outcomes delivered, not just hours spent
- Transparency with clients on what drives cost
- Predictability for clients where possible (prefer fixed-fee over open-ended T&M)

---

## 3. Pricing Formula -- Detailed Breakdown

### 3.1 Fixed Component

The fixed component covers the baseline cost of delivering the engagement.

```
Fixed Component = (Base Hourly Rate x Estimated Hours x Complexity Multiplier) + Tool Costs
```

**Base Hourly Rate:**

| Role | Rate (INR/hr) | Rate (USD/hr) |
|------|---------------|---------------|
| Founder -- Strategy & Architecture | 5,000 | 60 |
| Founder -- Hands-on Development | 4,000 | 48 |
| Founder -- Review & Advisory | 6,000 | 72 |
| Contracted Specialist (if engaged) | 2,000 -- 3,500 | 24 -- 42 |

> Note: As of April 2026, all work is performed by the two Founders. Rates will be updated when employees or regular contractors are onboarded.

**Complexity Multiplier:**

| Complexity Level | Multiplier | Criteria |
|-----------------|------------|----------|
| Standard | 1.0x | Well-defined scope, familiar tech stack, minimal integrations |
| Moderate | 1.25x | Some ambiguity, 1--2 third-party integrations, moderate data handling |
| Complex | 1.5x | Multiple integrations, custom AI/ML pipelines, regulatory requirements |
| Highly Complex | 1.75x | Novel architecture, real-time systems, multi-stakeholder, cross-border data |
| Experimental / R&D | 2.0x | Unproven approach, prototype-stage tech, significant unknowns |

**Tool & Infrastructure Costs (pass-through at cost + 15% handling margin):**

| Cost Category | Examples | Handling |
|--------------|----------|----------|
| API Consumption | OpenAI, Claude API, Google Cloud AI | Actual usage + 15% |
| SaaS Subscriptions | Cursor, Vercel, hosting services | Pro-rated to project + 15% |
| Cloud Infrastructure | Compute, storage, bandwidth | Actual usage + 15% |
| Specialised Licenses | Domain-specific tools, datasets | At cost + 15% |

### 3.2 Variable Component

The variable component accounts for project-specific factors that increase delivery risk or effort.

```
Variable Component = Integration Surcharge + Data Complexity Premium + Timeline Premium
```

**Integration Surcharge:**

| Integration Type | Surcharge |
|-----------------|-----------|
| Standard REST API (well-documented) | 0% |
| Legacy system / undocumented API | +15--25% of Fixed Component |
| Real-time / webhook-based | +10--15% |
| Multi-system orchestration (3+ systems) | +20--30% |
| Enterprise SSO / compliance integration | +10--20% |

**Data Complexity Premium:**

| Data Factor | Premium |
|------------|---------|
| Clean, structured data | 0% |
| Data cleaning / transformation required | +10--15% |
| Unstructured data (PDFs, images, audio) | +15--25% |
| Sensitive / regulated data (PII, financial) | +10--20% |
| Cross-border data transfers | +5--10% |

**Timeline Premium:**

| Delivery Timeline | Premium |
|-------------------|---------|
| Standard (scope-appropriate) | 0% |
| Expedited (25--50% faster than standard) | +15--25% |
| Rush (less than 50% of standard timeline) | +30--50% |
| Emergency / weekend / holiday | +50--75% |

### 3.3 Value-Based Tier

The value-based tier captures a share of the measurable business impact created for the client. It is applied **on top of** the Fixed + Variable components.

```
Value-Based Tier = Revenue Impact Premium OR Efficiency Gain Premium
```

**Revenue Impact Premium:**

| Estimated Annual Revenue Impact to Client | Premium |
|------------------------------------------|---------|
| Less than INR 5 Lakh | 0% (base pricing only) |
| INR 5 Lakh -- 25 Lakh | +5--10% of project price |
| INR 25 Lakh -- 1 Crore | +10--15% of project price |
| Above INR 1 Crore | +15--20% of project price |

**Efficiency Gain Premium:**

| Estimated Annual Cost Savings to Client | Premium |
|-----------------------------------------|---------|
| Less than INR 2 Lakh | 0% |
| INR 2 Lakh -- 10 Lakh | +5--8% of project price |
| INR 10 Lakh -- 50 Lakh | +8--12% of project price |
| Above INR 50 Lakh | +12--18% of project price |

> Only one value-based premium is applied per engagement (whichever is higher). Value claims must be supported by a documented rationale in the proposal.

---

## 4. Margin Targets by Vertical

Every engagement must meet the minimum margin target for its vertical. Engagements below minimum require Founder approval with a documented strategic justification.

| Service Vertical | Target Gross Margin | Minimum Acceptable | Notes |
|-----------------|--------------------|--------------------|-------|
| **Education & EdTech** | 55--60% | 50% | High reuse of frameworks, lower customisation |
| **Consulting & Advisory** | 45--50% | 40% | Time-intensive, Founder-led, premium positioning |
| **Custom Development** | 40--45% | 35% | Bespoke work, higher effort, IP typically transfers |
| **Maintenance & Support** | 65--70% | 60% | Recurring revenue, predictable scope, low marginal cost |
| **Pre-Built Solutions / Templates** | 75--80% | 70% | One-time build cost amortised across multiple clients |

**Margin Calculation:**

```
Gross Margin = ((Final Price - Total Direct Costs) / Final Price) x 100

Total Direct Costs = Founder time (at internal cost rate) + Tool/API costs + Contractor costs + Any direct expenses
```

Internal cost rate for Founder time: INR 1,500/hr (covers opportunity cost and baseline compensation target).

---

## 5. Pricing Models by Engagement Type

### 5.1 Fixed-Fee Projects
- Preferred for well-scoped engagements
- Quote using the full hybrid formula
- Include a scope-change clause (changes beyond 10% of original scope trigger a Change Order)
- Payment milestones tied to deliverables

### 5.2 Time & Materials (T&M)
- Used when scope is uncertain or evolving
- Billed at the applicable hourly rate x complexity multiplier
- Weekly time reports to client
- Monthly invoicing with 15-day payment terms
- Cap recommended (not-to-exceed estimate) to protect client trust

### 5.3 Retainer
- Monthly fixed fee for an agreed block of hours/services
- Minimum 3-month commitment
- Unused hours do not roll over (unless negotiated -- max 20% rollover)
- Retainer clients receive 10% discount on hourly rate
- Scope defined in a retainer-specific SoW

### 5.4 Revenue Share / Performance-Based
- Layaa AI delivers at reduced upfront cost in exchange for a percentage of revenue generated
- Only for high-confidence engagements where attribution is clear
- Typical structure: 50--70% of standard price upfront + 5--15% revenue share for 12--24 months
- Requires robust tracking mechanism agreed in the contract
- Cap on total payout (typically 2--3x the standard project price)

### 5.5 Pre-Built Solution Licensing
- One-time licence fee or monthly subscription
- Pricing based on value delivered, not cost to build
- Tiered by usage (users, API calls, data volume)
- Support included at basic tier; premium support is an add-on

---

## 6. Competitive Pricing Guidelines

### 6.1 Market Positioning
Layaa AI positions as a **premium boutique AI consultancy** -- not the cheapest, but delivering disproportionate value for the price. We compete on expertise density (Founder-led delivery), speed, and outcomes rather than on cost.

### 6.2 Competitor Price Benchmarks (India Market, April 2026)

| Competitor Type | Typical Range (INR/hr) | Layaa AI Position |
|----------------|----------------------|-------------------|
| Freelance AI developers (platforms) | 800 -- 2,500 | Above -- we sell outcomes, not hours |
| Mid-tier IT services firms | 2,000 -- 4,000 | Comparable base, higher on value-add |
| Boutique AI consultancies | 3,500 -- 8,000 | Within range, differentiated by Founder involvement |
| Big-4 / large consultancies | 8,000 -- 20,000+ | Below -- but comparable quality for AI-specific work |

### 6.3 Competitive Response Rules
- **Never** match a competitor's price purely to win a deal
- If a client cites a lower competitor quote, respond with a value comparison, not a price reduction
- If a price reduction is justified, use the Discount Policy (Section 7)
- Document all competitive situations for pricing intelligence

---

## 7. Discount Policy

### 7.1 Standard Discount Authority

| Discount Level | Approval Required | Conditions |
|---------------|-------------------|------------|
| 0--10% | Either Founder | Strategic justification documented |
| 10--15% | Either Founder | Written rationale + margin still above vertical minimum |
| 15--20% | Both Founders jointly | Must maintain positive contribution margin; strategic deal memo required |
| Above 20% | **Not permitted** without exceptional Board-level justification | Reserved for equity-level partnerships or strategic market entry |

### 7.2 Permitted Discount Scenarios

| Scenario | Max Discount | Rationale |
|----------|-------------|-----------|
| Multi-project commitment (2+ projects) | 10% | Volume incentive |
| Long-term retainer (6+ months) | 15% | Guaranteed revenue stream |
| Referral source / testimonial agreement | 10% | Marketing value offset |
| DPIIT-recognised startup client | 10% | Ecosystem building |
| Educational institution / non-profit | 15% | Social impact + portfolio building |
| Strategic portfolio piece (new vertical entry) | 20% | Market development investment |

### 7.3 Discount Prohibitions
- No discount on pass-through costs (API, tools, infrastructure)
- No retroactive discounts on delivered work
- No discounts that bring margin below 25% gross
- No "introductory pricing" without a documented reversion plan and timeline

---

## 8. Pricing Approval Workflow

### Step 1: Cost Estimation
- CTO (Shubham) estimates technical effort, complexity, tool costs
- Use the hybrid formula to calculate base price

### Step 2: Value Assessment
- CEO (Abhimanyu) assesses client value impact and competitive positioning
- Apply value-based tier

### Step 3: Margin Check
- Verify gross margin meets vertical target
- If below target, document justification

### Step 4: Proposal Review
- Both Founders review final pricing before it goes to client
- For deals above INR 5 Lakh: formal pricing memo with cost breakdown, margin analysis, and competitive context

### Step 5: Client Negotiation
- CEO leads commercial negotiation
- Any deviation from approved pricing requires re-approval per the discount policy

### Step 6: Contract Execution
- Final agreed price documented in SoW
- Payment milestones and terms confirmed
- Finance tracking entry created

---

## 9. Pricing Review Cadence

| Review Type | Frequency | Scope |
|------------|-----------|-------|
| Deal-level margin review | Per engagement | Actual vs. estimated margin |
| Rate card review | Quarterly | Adjust base rates for market and cost changes |
| Vertical margin analysis | Quarterly | Review margin performance by vertical |
| Full pricing framework review | Annually (April) | Comprehensive review of all pricing elements |
| Competitive intelligence update | Semi-annually | Update competitor benchmarks |

---

## 10. Quick Reference -- Pricing Checklist

Before sending any proposal, verify:

- [ ] Scope is clearly defined and estimated in hours
- [ ] Complexity multiplier is justified
- [ ] All tool/API costs are identified and included
- [ ] Integration and data complexity surcharges applied where relevant
- [ ] Value-based tier assessed and documented
- [ ] Gross margin meets vertical minimum
- [ ] Discount (if any) is within approval authority
- [ ] Payment terms are standard (or deviation is approved)
- [ ] Both Founders have reviewed (for deals above INR 5 Lakh)
- [ ] Pricing is documented in the SoW before contract execution

---

*Layaa AI Private Limited -- "Empower decisions, Elevate Profits!"*
*CIN: U62099HR2025PTC139528 | SAC Code: 998314 | GST: 18%*
