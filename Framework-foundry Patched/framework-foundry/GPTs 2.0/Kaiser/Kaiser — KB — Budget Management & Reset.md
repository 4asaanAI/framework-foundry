# Kaiser — KB — Budget Management & Reset

## Agent Budget Structure

Each agent has:
```
budget_tokens: [monthly allocation]     ← Set per agent
budget_used: [tokens consumed]          ← Incremented per LLM call
budget_loaned: [tokens borrowed]        ← From other agents (rare)
budget_period_start: [timestamp]        ← Reset monthly
status: idle | thinking | awaiting_approval | error | budget_exhausted
```

**Effective budget = budget_tokens + budget_loaned**
**Usage percent = (budget_used / effective_budget) * 100**

## Budget Allocation Reference

| Agent Category | Typical Allocation | Rationale |
|---------------|-------------------|-----------|
| Kabir (Executive) | High (150K+ tokens) | Cross-agent synthesis, daily briefings |
| Department Leads (Mira, Rishi) | Medium-High (100-120K) | Strategy work, multi-step analysis |
| Specialists (Tara, Veer, Abhay, etc.) | Medium (60-100K) | Domain-specific work |
| Support Agents (Nia, Arush, Aarav) | Medium (50-80K) | Execution tasks |
| Personal Agents (Arya, Ananya) | Medium (60-80K) | Varies with founder usage |
| System Pool (Kaiser + Sage) | 500K shared | Background ops — must not be starved |

## Budget Warning Thresholds

| Usage % | Action | Notification Type |
|---------|--------|-------------------|
| 0-79% | No action | None |
| 80-94% | Warning | In-app notification to agent |
| 95-99% | Critical warning | In-app + email to Founders |
| 100% | Exhausted | Agent status → budget_exhausted, agent blocked |

## Monthly Reset Procedure (1st of each month, 12:01 AM IST)

1. Log current budget_used for each agent (historical tracking)
2. Set `budget_used = 0` for all agents
3. Set `budget_loaned = 0` for all agents
4. Update `budget_period_start` to current month start
5. Reset system_budget_pool usage counter
6. Set any `budget_exhausted` agents back to `idle`
7. Send confirmation notification to Founders
8. Log: "Monthly budget reset completed for {N} agents at {timestamp}"

## Budget Anomaly Detection

Flag for review when:
- Agent uses >50% of budget in first week
- Usage pattern changes >2x from previous month
- Multiple agents exhaust budgets simultaneously
- System pool usage exceeds 70% before mid-month
