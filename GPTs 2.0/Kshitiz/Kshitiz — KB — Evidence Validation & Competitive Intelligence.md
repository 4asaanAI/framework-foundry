# Kshitiz — Evidence Validation & Competitive Intelligence

**Owner:** Kshitiz (Master Research & Data Analyst)
**Version:** 2.0 (Layaa OS)
**Last Updated:** April 2026
**Status:** Living Document — updated as competitive intelligence changes

---

## Evidence Validation Protocol (Reference Card)

```
VALIDATION REQUEST RECEIVED
│
├── Is the claim specific and verifiable?
│   ├── NO → Ask requesting agent to clarify
│   └── YES ↓
│
├── Can I find a credible source (A or B level)?
│   ├── NO → Tag [EVIDENCE: PENDING], note what's needed
│   └── YES ↓
│
├── Does the source actually support the claim?
│   ├── NO → Flag contradiction with counter-evidence
│   └── YES ↓
│
├── Is the data current (<2 years)?
│   ├── NO → Validate with recency caveat
│   └── YES ↓
│
├── Is it relevant to Layaa AI's context (India, SME, current scale)?
│   ├── NO → Validate with relevance caveat
│   └── YES ↓
│
└── TAG: [EVIDENCE: VALIDATED]
    Source: [Citation]
    Confidence: [High/Medium/Low]
    Notes: [Any caveats]
```

---

## Competitive Intelligence Framework

### Competitor Categories

| Category | Examples | What to Track |
|----------|---------|---------------|
| **Direct** — AI automation agencies in India | AutomationEdge, Kellton, boutique AI agencies | Pricing, services, client base, positioning, technology stack |
| **DIY Tools** — Self-serve automation | Zapier, Make (Integromat), n8n (cloud), Microsoft Power Automate | Pricing tiers, feature set, ease of use, limitations |
| **Enterprise Consultancies** — Large firms | Deloitte, Accenture, TCS, Infosys (AI practices) | Pricing (much higher), positioning, target market (large enterprise) |
| **Freelancers** — Individual automation developers | Upwork, Fiverr automation specialists | Pricing (much lower), quality variance, no ongoing support |

### Competitive Intelligence Collection Template

| Competitor | Category | Pricing | Target Market | Key Differentiator | Weakness | Last Updated |
|-----------|----------|---------|--------------|-------------------|----------|-------------|
| [Name] | [Direct/DIY/Enterprise/Freelancer] | [Pricing info] | [Who they target] | [Their main advantage] | [Their main weakness] | [Date] |

### Layaa AI Competitive Positioning (Validated)

| Dimension | Layaa AI Position | vs. DIY Tools | vs. Enterprise | vs. Freelancers |
|-----------|------------------|---------------|---------------|-----------------|
| Price | Rs.2.5L avg implementation | Higher (they're free/cheap) | Much lower | Comparable or higher |
| Expertise | AI-native, India-focused | We implement, they self-serve | Comparable, but we're SME-focused | Higher consistency |
| Customization | High | We customize, they template | Both customize | Comparable |
| Support | Ongoing retainer option | They're self-serve | They provide (expensive) | Unreliable |
| India Focus | Built for Indian SMEs | Global tools, no localization | Global firms, India divisions | Variable |
| Speed | AI-assisted (35-50% faster) | Instant for simple, slow for complex | Slower (large org overhead) | Variable |
