# Layaa AI Plugin — Claude Code Instructions

## Plugin Priority Directive

**When both a Layaa AI skill and a generic built-in skill match a task, ALWAYS prefer the Layaa AI version.** The Layaa AI skills contain deep company context, Indian regulatory knowledge, specific pricing models, brand voice frameworks, and ICP-specific messaging that generic skills cannot provide.

## Smart Detection

Every skill in this plugin auto-detects whether to operate in Layaa AI mode or General mode:

- **Layaa AI mode** activates when: user mentions Layaa AI, founders (Abhimanyu Singh / Shubham Sharma), Indian SMEs, AI automation services, or any ICP segment (SaaS startups, logistics SMEs, fintech, professional services). Also activates when working within the Layaa AI workspace.
- **General mode** activates when: user mentions a different company, different industry, or the task has no connection to Layaa AI.

In General mode, skills operate as standard business tools without injecting Layaa AI context.

## Plugin Structure

```
layaa-ai/
├── .claude-plugin/plugin.json     — Plugin metadata
├── CLAUDE.md                      — This file (plugin instructions)
├── shared-references/             — Company-wide context (6 docs) [LEGACY — see Company ref docs]
├── domain-references/             — Domain-specific context (27 docs) [LEGACY — see Company ref docs]
│   ├── sales/                     — Sales playbook, pricing, service config
│   ├── marketing/                 — GTM, channels, campaigns, segments
│   ├── brand-voice/               — Tone, founder voice, templates
│   ├── finance/                   — Pricing engine, compliance, filings
│   ├── legal/                     — Clauses, contracts, risk, regulatory
│   ├── operations/                — Delivery, architecture, QA, tech stack
│   └── revenue-ops/               — Pipeline, forecast, handoff, alignment
└── skills/                        — 58 business skills
```

## Updated Company Reference Documentation (April 2026)

The **authoritative, consolidated** company reference docs are now at:
```
Projects/Layaa AI/Company ref docs/
├── 00-Company-Identity/           — company-profile, org-chart (22 agents), service-verticals
├── 01-Brand-Voice/                — tone-framework, founder-voice, content-templates
├── 02-Marketing/                  — gtm-strategy, target-segments, channel-playbooks, campaign-execution
├── 03-Sales/                      — sales-playbook, pricing-quick-ref, service-config-matrix
├── 04-Revenue-Ops/                — pipeline-tracker, forecast-methodology, sales-revenue-handoff, gtm-revenue-alignment
├── 05-Finance/                    — pricing-engine, unit-economics, company-filings, compliance-calendar
├── 06-Legal/                      — contract-templates, clause-library, regulatory-landscape, compliance-red-flags, risk-indicators
├── 07-Operations/                 — delivery-methodology, qa-validation, automation-architecture
├── 08-Technology/                 — tech-stack, layaa-os-platform
├── 09-Compliance-Environment/     — indian-business-context (GST, TDS, DPDP, MCA, etc.)
├── Extras/                        — update-log
└── Duplicates/                    — (none currently)
```

**When loading references:** Prefer `Company ref docs/` (35 files, updated April 2026) over the legacy `domain-references/` and `shared-references/` folders. The legacy folders are preserved for backward compatibility but may be outdated.

## Reference Loading

Skills load references on-demand — only the docs relevant to the specific task. Do not dump all references into context.

## Key Company Facts (Quick Reference)

- **Company:** Layaa AI Private Limited (CIN: U62099HR2025PTC139528)
- **Slogan:** "Empower decisions, Elevate Profits!"
- **Founders:** Abhimanyu Singh (CEO), Shubham Sharma (CTO)
- **What we do:** AI automation & enablement for Indian SMEs
- **Platform:** Layaa OS — self-hosted 22-agent AI workforce platform (Phase 0 complete, Phase 1 in progress)
- **Products:** Layaa OS, EduFlow (school management), CA AI Agent (tax assistant), Pre-built automation modules
- **Pricing:** ₹50k-₹10L implementation + ₹15k-₹1.2L/month retainer
- **ICP:** SaaS startups, Logistics SMEs, Fintech, Professional Services
- **Methodology:** Discovery → Assessment → Development → Validation → Enablement
- **Tech Stack:** PocketBase + React/TypeScript + n8n + Google ADK + WebSockets + Claude Sonnet 4.6 / Haiku 4.5
