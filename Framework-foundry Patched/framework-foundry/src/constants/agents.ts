import type { Agent } from "@/types/layaa";

export const MOCK_AGENTS: Agent[] = [
  // ── EXECUTIVE & ORCHESTRATION ──────────────────────────────────────────────
  { id: "kabir", name: "Kabir", canonical_role: "Executive Strategy Orchestrator", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5", llm_provider: "openai", budget_tokens: 2000, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "KA", avatar_color: "#2563EB", description: "Supervises all department agents, synthesises cross-team outputs, resolves conflicts", is_active: true },
  { id: "kshitiz", name: "Kshitiz", canonical_role: "Master Research & Data Analyst", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 800, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "KS", avatar_color: "#4F46E5", description: "Serves all teams. Data validation authority, competitive research, market intelligence", is_active: true },

  // ── MARKETING & GROWTH ─────────────────────────────────────────────────────
  { id: "mira", name: "Mira", canonical_role: "Marketing Strategist", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 1000, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "MI", avatar_color: "#D97706", description: "Marketing team lead — campaign planning, go-to-market, messaging strategy", is_active: true },
  { id: "tara", name: "Tara", canonical_role: "Brand Voice & Content Architect", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 800, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "TA", avatar_color: "#7C3AED", description: "Tone consistency, thought leadership, brand guardian. Reports to Mira", is_active: true },
  { id: "zoya", name: "Zoya", canonical_role: "Performance Marketing & Growth Architect", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 700, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "ZO", avatar_color: "#EC4899", description: "Paid performance, A/B testing, acquisition channels, retention mechanics. Reports to Mira", is_active: true },
  { id: "nia", name: "Nia", canonical_role: "Campaign & Funnel Execution Coordinator", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "NI", avatar_color: "#F97316", description: "Campaign logistics, funnel coordination, scheduling, cross-team horizontal support", is_active: true },

  // ── REVENUE & FINANCE ──────────────────────────────────────────────────────
  { id: "rishi", name: "Rishi", canonical_role: "Revenue Operations Strategist", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 1200, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "RI", avatar_color: "#059669", description: "Pipeline management, deal structure, revenue strategy", is_active: true },
  { id: "yuvaan", name: "Yuvaan", canonical_role: "Sales Enablement Specialist", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 1000, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "YU", avatar_color: "#0284C7", description: "Call prep, sales collateral, proposals & objection handling", is_active: true },
  { id: "veer", name: "Veer", canonical_role: "Pricing & Unit Economics Specialist", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 700, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "VE", avatar_color: "#0891B2", description: "Pricing models, unit economics, contract terms, discount authority", is_active: true },
  { id: "anne", name: "Anne", canonical_role: "Chartered Compliance Assistant", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 700, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AN", avatar_color: "#DC2626", description: "Financial compliance, chartered accounting standards, audit readiness", is_active: true },
  { id: "aarav", name: "Aarav", canonical_role: "Finance & Accounts Executive", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AA", avatar_color: "#16A34A", description: "Bookkeeping, invoicing, expense tracking, financial reporting", is_active: true },

  // ── LEGAL & GOVERNANCE ─────────────────────────────────────────────────────
  { id: "abhay", name: "Abhay", canonical_role: "Legal & Contracts Advisor", team: "legal", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 800, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AB", avatar_color: "#0F766E", description: "Contract drafting, legal risk, regulatory interpretation, NDA & SLA review", is_active: true },
  { id: "preeti", name: "Preeti", canonical_role: "Regulatory Compliance & Data Governance Advisor", team: "legal", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "PR", avatar_color: "#BE185D", description: "Indian regulatory landscape, DPDP, RBI/MCA/MEITY monitoring, data governance", is_active: true },

  // ── CLIENT DELIVERY & PRODUCT ──────────────────────────────────────────────
  { id: "rohit", name: "Rohit", canonical_role: "QA & Validation Specialist", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "RO", avatar_color: "#A855F7", description: "Tests functionality, validates deliverables, catches errors before client delivery", is_active: true },
  { id: "ujjawal", name: "Ujjawal", canonical_role: "Automation Architect", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 1100, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "UJ", avatar_color: "#14B8A6", description: "Automation workflows, n8n builder, API integrations, process improvements", is_active: true },
  { id: "arjun", name: "Arjun", canonical_role: "Client Strategy & Discovery Specialist", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 700, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AR", avatar_color: "#06B6D4", description: "Client discovery, requirement mapping, onboarding strategy, stakeholder alignment", is_active: true },
  { id: "arush", name: "Arush", canonical_role: "Documentation & Enablement Specialist", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-nano", llm_provider: "openai", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AU", avatar_color: "#8B5CF6", description: "SOPs, knowledge bases, training materials, handover documentation", is_active: true },
  { id: "dev", name: "Dev", canonical_role: "Internal Product Manager", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5-mini", llm_provider: "openai", budget_tokens: 800, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "DE", avatar_color: "#2563EB", description: "Internal product roadmap, sprint planning, backlog, feature prioritisation", is_active: true },

  // ── SYSTEM AGENTS (non-conversational background services) ─────────────────
  { id: "kaiser", name: "Kaiser", canonical_role: "System Administrator Agent", team: "system", system_prompt: "", prompt_version: 1, default_model: "google/gemini-2.5-flash", llm_provider: "google", budget_tokens: 1500, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "KI", avatar_color: "#0891B2", description: "Cron jobs, system health monitoring, backups, infrastructure automation", is_active: true },
  { id: "sage", name: "Sage", canonical_role: "Memory & Context Keeper", team: "system", system_prompt: "", prompt_version: 1, default_model: "google/gemini-2.5-flash", llm_provider: "google", budget_tokens: 1500, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "SA", avatar_color: "#6366F1", description: "Memory extraction, relevance scoring, context summarisation across all agents", is_active: true },

  // ── PERSONAL AGENTS ────────────────────────────────────────────────────────
  { id: "arya", name: "Arya", canonical_role: "Personal Assistant — Abhimanyu", team: "personal", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5", llm_provider: "openai", budget_tokens: 2000, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AR", avatar_color: "#E87A2E", description: "Personal assistant for Abhimanyu (Founder). Manages tasks, context, and daily priorities", is_active: true },
  { id: "ananya", name: "Ananya", canonical_role: "Personal Assistant — Shubham", team: "personal", system_prompt: "", prompt_version: 1, default_model: "openai/gpt-5", llm_provider: "openai", budget_tokens: 2000, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AN", avatar_color: "#2B5797", description: "Personal assistant for Shubham (Co-Founder/CTO). Manages tasks, context, and daily priorities", is_active: true },
];

export const TEAM_LABELS: Record<string, string> = {
  founders_office: "Executive",
  marketing: "Marketing & Growth",
  revenue: "Revenue & Finance",
  delivery: "Client Delivery & Product",
  legal: "Legal & Governance",
  system: "System Agents",
  personal: "Personal Agents",
};

export const TEAM_COLORS: Record<string, string> = {
  founders_office: "#2563EB",
  marketing: "#D97706",
  revenue: "#059669",
  delivery: "#14B8A6",
  legal: "#0F766E",
  system: "#6366F1",
  personal: "#E87A2E",
};
