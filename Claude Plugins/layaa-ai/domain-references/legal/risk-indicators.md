# Layaa AI — Legal Risk Indicators

## Risk Assessment Matrix

### Risk Levels
- **CRITICAL** — Must be resolved before signing. Founder escalation required.
- **HIGH** — Significant exposure. Abhay resolves or escalates within 48 hours.
- **MEDIUM** — Flag in review. Address before or shortly after signing.
- **LOW** — Note and proceed. No blocking action needed.

---

## Risk Matrix by Clause Area

### 1. Scope of Services
| Indicator | Risk Level |
|-----------|-----------|
| Vague or undefined scope | CRITICAL |
| No deliverables list | CRITICAL |
| No change order process | HIGH |
| Broad scope with "and other services as needed" | HIGH |
| Minor ambiguity in deliverable descriptions | MEDIUM |

### 2. Intellectual Property
| Indicator | Risk Level |
|-----------|-----------|
| No IP clause at all | CRITICAL |
| Work-for-hire / full IP transfer including tools | CRITICAL |
| Unclear ownership of custom vs pre-existing IP | HIGH |
| Client wants source code for Layaa frameworks | HIGH |
| No license grant for embedded Layaa IP | MEDIUM |

### 3. Payment Terms
| Indicator | Risk Level |
|-----------|-----------|
| No upfront payment | HIGH |
| Less than 30% upfront | HIGH |
| Net-60 or longer payment terms | MEDIUM |
| No late payment provisions | MEDIUM |
| No right to suspend for non-payment | MEDIUM |

### 4. Limitation of Liability
| Indicator | Risk Level |
|-----------|-----------|
| Unlimited liability | CRITICAL |
| No liability cap | HIGH |
| Cap exceeds 2x total fees | HIGH |
| No exclusion of indirect/consequential damages | HIGH |
| No carve-outs for gross negligence | MEDIUM |

### 5. Indemnification
| Indicator | Risk Level |
|-----------|-----------|
| One-sided against Layaa AI (uncapped) | CRITICAL |
| One-sided against Layaa AI (capped) | HIGH |
| No indemnification clause | MEDIUM |
| Indemnification exceeds liability cap | HIGH |

### 6. Termination
| Indicator | Risk Level |
|-----------|-----------|
| No termination right for Layaa AI | HIGH |
| Less than 15 days notice period | MEDIUM |
| No cure period for breach | HIGH |
| No payment for work completed upon termination | HIGH |
| No survival clauses | MEDIUM |

### 7. Data Protection
| Indicator | Risk Level |
|-----------|-----------|
| No DPDP Act compliance language | CRITICAL |
| No data breach notification obligation | HIGH |
| No data deletion/return on termination | HIGH |
| Client processes sensitive personal data with no DPA | CRITICAL |
| Vague security obligations | MEDIUM |

### 8. Confidentiality
| Indicator | Risk Level |
|-----------|-----------|
| No NDA or confidentiality clause | HIGH |
| One-sided confidentiality (only Layaa bound) | HIGH |
| Survival period less than 1 year | MEDIUM |
| No exclusions/carve-outs | MEDIUM |

### 9. Force Majeure
| Indicator | Risk Level |
|-----------|-----------|
| Missing entirely | MEDIUM |
| One-sided (only client excused) | HIGH |
| No termination right for extended force majeure | LOW |

### 10. Dispute Resolution
| Indicator | Risk Level |
|-----------|-----------|
| Foreign jurisdiction (non-Indian law) | HIGH |
| Foreign arbitration seat | HIGH |
| No arbitration clause (litigation only) | MEDIUM |
| Client's city as exclusive jurisdiction | MEDIUM |

### 11. Warranty
| Indicator | Risk Level |
|-----------|-----------|
| Open-ended / perpetual warranty | HIGH |
| Warranty period exceeds 90 days | MEDIUM |
| Warranty covers third-party tools/APIs | HIGH |
| Money-back guarantee | HIGH |
| No limitation on warranty remedy | MEDIUM |

### 12. Non-Solicitation
| Indicator | Risk Level |
|-----------|-----------|
| Missing entirely | LOW |
| One-sided (only Layaa bound) | MEDIUM |

### 13. Governing Law
| Indicator | Risk Level |
|-----------|-----------|
| Non-Indian governing law | HIGH |
| Ambiguous or unspecified | MEDIUM |

---

## Contract Risk Decision Tree

```
START: Reviewing a contract
  │
  ├─ Any CRITICAL indicators found?
  │   YES → STOP. Do not sign. Escalate to Founders immediately.
  │   NO ↓
  │
  ├─ Count of HIGH indicators?
  │   3+ HIGH → Escalate to Founders. Contract needs significant revision.
  │   1-2 HIGH → Abhay resolves within 48 hours. If unresolvable → Founders.
  │   0 HIGH ↓
  │
  ├─ Count of MEDIUM indicators?
  │   5+ MEDIUM → Flag to Abhay for review before signing.
  │   1-4 MEDIUM → Note concerns. Can proceed with documented awareness.
  │   0 MEDIUM ↓
  │
  └─ LOW only → Proceed. Log any notes for record.
```

---

## Immediate Founder Escalation Required

These situations always require Founder involvement regardless of other factors:

1. Contract value exceeds ₹10L implementation or ₹1L/month retainer
2. Client is in a regulated industry (fintech, healthcare, government) with compliance obligations
3. Client's contract contains non-Indian governing law
4. Client demands unlimited liability or uncapped indemnification
5. Client demands full IP transfer including Layaa AI frameworks
6. Any clause contradicts existing Layaa AI contracts or commitments
7. Client is a direct or indirect competitor
8. Contract involves subcontracting Layaa AI's obligations to third parties

---

## Risk Review Checklist (Quick Scan)

Use this for rapid assessment of incoming contracts:

- [ ] Scope clearly defined with deliverables list
- [ ] IP ownership clause present and acceptable
- [ ] Payment: ≥50% upfront, net-15 or net-30
- [ ] Liability capped at ≤12 months fees
- [ ] Indirect damages excluded
- [ ] Indemnification is mutual and capped
- [ ] Termination with ≥30 days notice and cure period
- [ ] DPDP Act compliance included
- [ ] Indian governing law, Gurgaon arbitration
- [ ] Warranty ≤60 days, re-performance remedy only
- [ ] NDA/confidentiality is mutual
- [ ] Force majeure clause present
- [ ] Non-solicitation clause present
