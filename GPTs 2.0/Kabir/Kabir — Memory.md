# Kabir — Initial Memory

> These are Kabir's foundational institutional memories as of platform launch (April 2026). They represent the starting context Kabir needs to operate from day one. Sage will manage ongoing memory updates, but these provide the baseline.

---

## Company Stage

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Layaa AI is a bootstrap-stage startup with zero external funding. Infrastructure capped at Rs.500/month. | company | 1.0 | Company Context Doc |
| Team consists of 2 founders (Abhimanyu Singh — CEO, Shubham Sharma — CTO) and 22 AI agents. No human employees planned for next 6 months. | company | 1.0 | Company Context Doc |
| Company incorporated 19 December 2024 as Layaa AI Private Limited (CIN: U62099HR2025PTC139528). 100% Indian Promoter Holding. | company | 1.0 | Certificate of Incorporation |
| Pre-revenue stage. All current client engagements are pilot/early deployments. No recurring revenue established yet. | company | 0.9 | Founder context |
| Layaa AI has DPIIT Startup Recognition (Certificate No: DIPP245808, valid till Dec 2035) and Udyam MSME Registration (Micro Enterprise, Services). | company | 1.0 | Registration docs |
| Trademark "Layaa AI" filed under Class 42 (IT/Software services). | company | 1.0 | Trademark filing |

---

## Active Clients & Projects

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **The Aaryans School** — Two CBSE-affiliated branches (Joya and Meerut, Uttar Pradesh). EduFlow deployment active. First real client engagement. | client_info | 1.0 | Founder context |
| **SSA (Akshat Sharma)** — Education client. EduFlow v2 platform deployment. Active engagement. | client_info | 1.0 | Founder context |
| **CA AI Agent** — Product being developed for CA (Chartered Accountant) firms nationwide. Not yet a client — product development stage. Three pricing tiers defined: Solo Rs.25K + Rs.2.5K/mo, Practice Rs.50K + Rs.5K/mo, Firm Rs.1L + Rs.8.5K/mo. | client_info | 0.9 | Product Portfolio doc |
| **Laundry Services Client** — Early-stage automation engagement. Limited details available. | client_info | 0.6 | Company Context Doc |
| No client currently generates recurring revenue. All engagements are implementation-phase or pilot-phase. | company | 0.9 | Founder context |

---

## Current Priorities (April 2026)

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Priority 1: Layaa OS Pilot Launch** — The 22-agent platform must be operational and self-sustaining. Target: April 2026. This is the internal infrastructure moat — not a product for sale. | decision | 1.0 | Founder directive |
| **Priority 2: EduFlow Deployment** — Successful delivery to The Aaryans School and SSA is critical for first revenue and reference clients. Education sector is the beachhead market. | decision | 1.0 | GTM Strategy |
| **Priority 3: SISFS Grant Application** — Rs.20 Lakh Startup India Seed Fund Scheme application being prepared. Priority incubators: DTU IIF (Abhimanyu is DTU alumnus), FITT IIT Delhi, NIET TBI Greater Noida. | decision | 0.9 | Grant Strategy doc |
| **Priority 4: CA AI Agent Development** — Product for Chartered Accountants. Features: WhatsApp document intake, AI data extraction, auto-form population, client PAN-linked database, deadline tracking. | decision | 0.8 | Product Portfolio |
| Phase 1 GTM focuses on education sector beachhead — schools in Gurgaon/NCR, WhatsApp-based outreach, referral-driven growth. Target: 5-10 school clients. | decision | 0.9 | GTM Strategy |

---

## Key Decisions Made

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Layaa OS is built on PocketBase (self-hosted, SQLite-based) + n8n orchestration. Decision made for data sovereignty, cost efficiency, and offline capability. No vendor lock-in. | decision | 1.0 | Platform Architecture |
| LLM strategy: Claude Sonnet 4.6 for complex reasoning, Claude Haiku 4.5 for fast/cheap tasks. Pluggable provider architecture supports OpenAI and Google as fallbacks. | decision | 1.0 | Platform Capabilities |
| All data stays on Indian infrastructure (Indian VPS). Data residency requirement for DPDP Act and IT Act compliance. Backups to Backblaze B2 via rclone. | decision | 1.0 | Data Governance |
| Pricing uses a hybrid formula: FLOOR PRICE = (Labor + Expenses + Overhead + Risk Buffer) x 1.40. CEILING PRICE = Client's Annual Value Created x Value Capture Rate. Minimum viable budget: Rs.50K implementation. | decision | 1.0 | Revenue Model |
| AI-assisted development compression applied: build estimates at 35-50% of traditional hours. Architecture 60-70%, Core logic 30-40%, UI 40-50%, Testing 70-80% of traditional. | decision | 0.9 | Revenue Model |
| Discount authority: Sales team up to 10%, Veer approval 10-20%, Founder approval above 20%. | decision | 1.0 | Revenue Model |
| 5-stage delivery methodology adopted: Discovery (Rohit) → Assessment (Ujjawal) → Development (Ujjawal + builders) → Validation (Rohit) → Enablement (Delivery team). | decision | 1.0 | Delivery Methodology |
| Org chart v2.0 finalized March 2026 with canonical role titles for all 22 agents. Kabir supervises all department agents. Shubham directly manages Client Delivery. | decision | 1.0 | Org Chart v2.0 |

---

## Org Structure Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| **Founders** hold final authority on: strategy, pricing, contracts, hiring, scope, timelines, institutional memory ratification, high-risk decisions (>Rs.50K), equity, regulatory commitments, client commitments. | company | 1.0 | Governance Rules |
| **Abhimanyu Singh (CEO)** — Non-coder, business/strategy focus. DTU B.Tech CS. Prefers clear, actionable, non-technical communication. Uses AI tools 8+ hours daily. Personal agent: Arya. | preference | 1.0 | Company Context |
| **Shubham Sharma (CTO)** — Full-stack developer. Technical precision welcome. React/Next.js/Node.js/n8n/PostgreSQL stack. Directly manages Client Delivery team. Personal agent: Ananya. | preference | 1.0 | Company Context |
| Kabir reports to Founders and supervises all department agents. Kabir does NOT directly manage Client Delivery (that is Shubham's domain), but coordinates cross-functionally. | company | 1.0 | Org Chart v2.0 |
| Kshitiz serves ALL teams horizontally for data validation. All [EVIDENCE: VALIDATED] tags require Kshitiz verification. | process | 1.0 | Agent Directory |
| Forbidden lateral actions exist: Tara cannot directly instruct Nia, Zoya cannot directly instruct Tara, Rishi cannot directly instruct Yuvaan, Anne cannot directly instruct Abhay. These must be brokered through Kabir. | process | 1.0 | Governance Rules |

---

## Revenue Targets & Benchmarks

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| SOM (3-year target): 50-100 SME clients, Rs.50L-1Cr revenue. | company | 0.9 | Market Opportunity |
| Conversion funnel benchmarks: MQL to SQL 25% (red flag <15%), SQL to Proposal 60% (red flag <40%), Proposal to Won 35% (red flag <25%), End-to-end MQL to Won 5-8% (red flag <3%). | market_data | 1.0 | Conversion Funnel Doc |
| Target sales cycle: 42-65 days. Red flag: >120 days. | market_data | 1.0 | Conversion Funnel Doc |
| Red flag thresholds to monitor: margin <30%, CAC:LTV <2.5x, discount >20%, customer concentration >30%, payment terms >60 days, deals >Rs.10L. | process | 1.0 | Revenue Model |
| Implementation fee average Rs.2.5L with 50/50 split (50% deposit on signing, 50% on delivery). Monthly retainers: Starter Rs.15K, Growth Rs.40K, Enterprise custom. | company | 1.0 | Revenue Model |

---

## SISFS Grant Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| SISFS application under preparation for Rs.20 Lakh. Not yet submitted. | company | 0.9 | Grant Strategy |
| Grant allocation plan: Product Deployment Rs.4.5L, Market Launch Rs.4L, Development Rs.4L, Operations Rs.3.5L, Founder Sustenance Rs.4L. | decision | 0.9 | Grant Strategy |
| Target incubators in priority order: (1) DTU IIF — Abhimanyu is DTU alumnus, SISFS-approved; (2) FITT IIT Delhi — reputed tech incubator; (3) NIET TBI Greater Noida — AI/EdTech/SaaS focus. | decision | 0.9 | Grant Strategy |

---

## Platform Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Layaa OS launches April 2026. Phase 0 complete, Phase 1 in progress. 22 agents operational. | company | 1.0 | Platform Capabilities |
| System budget pool: 500K tokens shared between Sage and Kaiser. Individual agents have separate budgets. Monthly reset by Kaiser. | process | 1.0 | Budget System |
| 7 core n8n workflows: sage-extraction, approval-handler, delegation, response, scheduled-memory, budget, notifications. | process | 1.0 | Platform Capabilities |
| Daily backup at 3 AM IST to Backblaze B2 via rclone. Managed by Kaiser. | process | 1.0 | Platform Capabilities |
| Privacy Policy effective February 18, 2026. DPDP Act and IT Act 2000 compliant. All data encrypted in transit and at rest. | company | 1.0 | Data Governance |

---

## Operating Constraints

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Budget is bootstrap only. No external funding. Infrastructure capped at Rs.500/month. Every rupee matters. | company | 1.0 | Operating Constraints |
| All systems must be self-operating. Cannot depend on manual intervention beyond Founder oversight. | process | 1.0 | Operating Constraints |
| All systems must be explainable to a non-coder (Abhimanyu). Complexity is a design failure. | preference | 1.0 | Operating Constraints |
| Token efficiency is critical. Agents should not generate unnecessarily long responses. | process | 1.0 | Budget System |

---

## Brand & Communication Context

| Memory | Category | Confidence | Source |
|--------|----------|------------|--------|
| Brand voice: confident without arrogance, intelligent without jargon, forward-thinking without hype, human-centered not machine-first. | company | 1.0 | Brand Strategy |
| Preferred terms: "Automation" over "AI transformation", "Practical" over "cutting-edge", "SMEs" over "enterprises", "Built for India" over "global solution". | preference | 1.0 | Brand Strategy |
| Banned words: synergy, leverage (as verb), disrupt, revolutionary, game-changing, guru, ninja, rockstar, pivot (casually), circle back. | preference | 1.0 | Brand Strategy |
| Company one-liner: "AI for those who build India — practical automation for real businesses." | company | 1.0 | Brand Strategy |

---

*These memories represent Kabir's initial knowledge state. They will be continuously enriched through conversations, agent interactions, and Sage's automatic memory extraction. Confidence scores will be dynamically adjusted based on validation and feedback.*
