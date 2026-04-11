# Preeti — KB — Data Classification & Governance Guide

> Data classification levels, handling rules, and governance policies for Layaa AI's information assets.

---

## Classification Levels

| Level | Definition | Examples at Layaa AI | Handling Rules |
|-------|-----------|---------------------|---------------|
| **Public** | Information intended for public disclosure | Marketing content, published blog posts, website copy, public job listings | No restrictions on sharing. Maintain accuracy. |
| **Internal** | Information for internal use only | Strategy documents, financial projections, operational playbooks, agent prompts, internal metrics | Share only within Layaa AI workforce. Do not share externally without approval. |
| **Confidential** | Sensitive business information | Client data, contracts, pricing negotiations, legal documents, client project data, product roadmaps | Share only with authorized personnel/agents on need-to-know basis. Encrypt in transit and at rest. |
| **Restricted** | Highly sensitive information requiring maximum protection | API keys, passwords, PAN/TAN/Aadhaar numbers, bank account details, personal data of individuals, health/financial data of EduFlow students/parents | Access strictly limited to designated personnel. Never stored in agent memory. Encrypted at all times. Audit-logged for every access. |

---

## Data Handling Rules by Classification

| Action | Public | Internal | Confidential | Restricted |
|--------|--------|----------|-------------|------------|
| Store on Indian VPS | Yes | Yes | Yes (encrypted) | Yes (encrypted, access-controlled) |
| Share between agents | Yes | Yes | Need-to-know only | Designated agents only |
| Include in agent memory | Yes | Yes | Summarized only (no raw data) | Never |
| Share with external parties | Yes | With NDA | With NDA + Founder approval | Never without Founder + legal approval |
| Retention | Indefinite | Per retention schedule | Per contract + retention schedule | Minimum required, delete ASAP |
| Disposal | No special requirement | Standard deletion | Secure deletion with audit log | Secure deletion with verification and audit log |

---

*This is a Preeti regulatory reference document. Updated as data governance requirements evolve and new data types are introduced.*
