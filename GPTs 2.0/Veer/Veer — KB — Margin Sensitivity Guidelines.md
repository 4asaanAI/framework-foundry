# Veer — KB — Margin Sensitivity Guidelines

> Reference document for margin targets, sensitivity analysis, and impact scenario modeling across Layaa AI service verticals.

---

## Margin Targets by Service Vertical

| Vertical | Target Margin | Floor Margin | Red Flag | Primary Cost Driver |
|----------|--------------|-------------|----------|---------------------|
| Education & Workforce Enablement | 50-60% | 40% | <30% | Facilitator time, content prep |
| Consulting & Process Assessment | 40-50% | 35% | <30% | Senior consulting hours |
| Automation Development & Integration | 35-45% | 30% | <25% | Development hours (mitigated by AI compression) |
| Maintenance & Support | 60-70% | 50% | <40% | Minimal — monitoring is scalable |
| Pre-built Automations | 70%+ | 60% | <50% | One-time build, zero marginal cost |

---

## Margin Impact Scenarios

### Scenario 1: 10% Discount on Rs.2.5L Implementation

- Revenue impact: -Rs.25K
- If base margin is 40%: new margin = 33.3% (approaching red flag)
- If base margin is 50%: new margin = 44.4% (still healthy)
- Decision: Acceptable only if base margin exceeds 45%

### Scenario 2: Scope Creep (20% more hours)

- If not re-priced: margin drops proportionally
- For a Rs.2.5L deal at 40% margin: 20% scope creep → margin drops to 25% (red flag)
- Decision: Re-scope or re-price. Never absorb >10% scope expansion without repricing

### Scenario 3: Extended Payment Terms (90 days vs. standard 50/50)

- Cash flow impact: Rs.1.25L tied up for 90 additional days
- Working capital cost: At bootstrap stage, this is critical
- Decision: Requires Founder approval. Prefer milestone-based payments

---

*This is a Veer operational reference document. Updated as margin data and scenario modeling requirements evolve.*
