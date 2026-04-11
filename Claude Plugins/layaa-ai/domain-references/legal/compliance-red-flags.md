# Layaa AI — Compliance Red Flags & Escalation

## Risk Categories

### 1. Data Privacy
| Red Flag | Severity |
|----------|----------|
| Processing personal data without valid consent | CRITICAL |
| No privacy policy published on website | HIGH |
| Cross-border data transfer to restricted country | CRITICAL |
| No data processing agreement with client | HIGH |
| Collecting more data than necessary for service | MEDIUM |
| No data retention/deletion policy | MEDIUM |
| Children's data processed without parental consent | CRITICAL |
| No breach response plan in place | HIGH |

### 2. Contractual
| Red Flag | Severity |
|----------|----------|
| Work started without signed contract | CRITICAL |
| Unsigned contract with active deliverables | CRITICAL |
| Missing key clauses (IP, liability, data protection) | HIGH |
| Scope creep without written change order | HIGH |
| Verbal agreements contradicting written terms | HIGH |
| Contract expired but work continuing | MEDIUM |
| SoW missing from MSA engagement | MEDIUM |

### 3. Intellectual Property
| Red Flag | Severity |
|----------|----------|
| Using client IP without written license | CRITICAL |
| No IP assignment clause in developer contracts | HIGH |
| Open-source license conflicts (GPL in proprietary deliverables) | HIGH |
| Delivering Layaa AI frameworks as client-owned IP | CRITICAL |
| No IP ownership documentation for internal tools | MEDIUM |
| Using unlicensed software/tools in client delivery | HIGH |

### 4. Financial Compliance
| Red Flag | Severity |
|----------|----------|
| Missed GST filing deadline | CRITICAL |
| Incorrect GST invoicing (wrong rate, missing details) | HIGH |
| TDS not deposited by 7th of following month | HIGH |
| Undeclared income or unreported revenue | CRITICAL |
| Cash transactions exceeding ₹2L (Income Tax Act) | CRITICAL |
| No proper invoice for services rendered | HIGH |
| Advance tax installment missed | MEDIUM |

### 5. Corporate Compliance
| Red Flag | Severity |
|----------|----------|
| Missed MCA annual filing (AOC-4, MGT-7) | CRITICAL |
| Board meeting gap exceeding 120 days | HIGH |
| AGM not held before September 30 | CRITICAL |
| Statutory registers not maintained | MEDIUM |
| Director KYC (DIR-3) not filed by September 30 | HIGH |
| INC-20A not filed within 180 days of incorporation | CRITICAL |
| Changes in directors not filed (DIR-12) within 30 days | HIGH |

### 6. Employment
| Red Flag | Severity |
|----------|----------|
| Misclassification of employees as contractors | HIGH |
| Missing PF/ESI registration (if threshold met) | HIGH |
| No written employment/contractor agreements | HIGH |
| Sexual harassment policy missing (10+ employees) | CRITICAL |
| Working without Shops & Establishments registration | MEDIUM |
| Wage payment delays beyond statutory period | HIGH |

### 7. Cybersecurity
| Red Flag | Severity |
|----------|----------|
| No cyber incident response plan | HIGH |
| CERT-In incident not reported within 6 hours | CRITICAL |
| No log retention for 180 days | HIGH |
| Client credentials stored in plaintext | CRITICAL |
| No security measures for personal data processing | HIGH |
| Shared passwords / no access controls | MEDIUM |
| No backup/disaster recovery plan | MEDIUM |

### 8. Client-Specific
| Red Flag | Severity |
|----------|----------|
| Handling regulated industry data without compliance review | CRITICAL |
| SLA breach pattern (3+ in 30 days) | HIGH |
| Client data accessed by unauthorized personnel | CRITICAL |
| Deliverables don't meet acceptance criteria | MEDIUM |
| Client complaints about data handling | HIGH |
| No client consent for subprocessor use | HIGH |

### 9. Startup Compliance
| Red Flag | Severity |
|----------|----------|
| DPIIT recognition lapsed or not renewed | MEDIUM |
| 80-IAC tax benefit claimed incorrectly | CRITICAL |
| Udyam registration details not updated after changes | LOW |
| Self-certification not completed annually | MEDIUM |
| Turnover exceeding ₹100 crore (loses startup status) | HIGH |

---

## Escalation Decision Tree

```
Issue Detected
│
├── CRITICAL severity?
│   YES → ESCALATE within 1 HOUR
│   │     To: Founders (via Kabir)
│   │     Include: Issue description, immediate risk, proposed action
│   │     Required: Daily updates until resolved
│   NO ↓
│
├── HIGH severity?
│   YES → Can resolve within 24 hours?
│   │     YES → Resolve. INFORM Kabir at next sync.
│   │     NO  → ESCALATE within 24 hours to Kabir.
│   │           Include: Issue, root cause, options, recommendation
│   │           Required: Weekly updates until resolved
│   NO ↓
│
├── MEDIUM severity?
│   YES → INFORM at weekly sync
│   │     Log issue with resolution plan
│   │     Handle independently
│   NO ↓
│
└── LOW severity
    → HANDLE independently
    → Log for records
    → Mention at sync if relevant
```

---

## Scenario Playbooks

### Scenario 1: Data Breach Discovered
1. **Contain** — Isolate affected systems immediately
2. **Assess** — Determine scope (what data, how many records, which clients)
3. **Report** — CERT-In within 6 hours; affected clients within 72 hours
4. **Escalate** — Founders within 1 hour
5. **Remediate** — Fix vulnerability, restore from backup if needed
6. **Document** — Full incident report within 7 days
7. **Post-mortem** — Root cause analysis, policy updates

### Scenario 2: Missed Statutory Filing
1. **Assess** — Which filing, how late, penalty implications
2. **File immediately** — Submit with additional fees/penalties
3. **Escalate** — Founders if penalty exceeds ₹50k or involves legal notice
4. **Prevent** — Update compliance calendar alerts, add buffer
5. **Document** — Log reason for miss, corrective actions

### Scenario 3: Client Contract Dispute
1. **Review** — Pull signed contract, relevant communications
2. **Assess** — Layaa AI's position (breach by us vs. by client)
3. **Consult** — Abhay reviews legal position
4. **Negotiate** — Attempt resolution before formal dispute
5. **Escalate** — Founders if dispute exceeds ₹5L or threatens relationship
6. **Document** — All communications in writing

### Scenario 4: Regulatory Notice Received
1. **Do not ignore** — Even preliminary notices require response
2. **Assess** — Which authority, what requirement, deadline
3. **Escalate** — Founders immediately regardless of severity
4. **Engage counsel** — External legal if needed
5. **Respond** — Within deadline (typically 15-30 days)
6. **Document** — Full response trail

---

## Post-Escalation Process

After escalating to Kabir/Founders:
1. Await decision (approve plan, modify, escalate to external counsel)
2. Execute approved plan with committed timeline
3. Provide updates per severity (daily for CRITICAL, weekly for HIGH)
4. Document closure once resolved
5. Post-mortem for CRITICAL issues: What happened? How to prevent?
6. Update policies/procedures if gap identified
7. Propose memory update if pattern detected (3+ occurrences)
