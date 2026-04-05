import type { Agent } from "@/types/layaa";

export const MOCK_AGENTS: Agent[] = [
  // TEAM 1: Founders' Office
  { id: "kabir", name: "Kabir", canonical_role: "Executive Orchestrator", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "claude-opus", llm_provider: "anthropic", budget_tokens: 2000, budget_used: 1850, budget_loaned: 0, status: "idle", avatar_initials: "KA", avatar_color: "#2563EB", description: "Routes approvals, maintains company state, orchestrates all agents", is_active: true },
  { id: "kaiser", name: "Kaiser", canonical_role: "Frontend & UX Architecture", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "claude-opus", llm_provider: "anthropic", budget_tokens: 1500, budget_used: 680, budget_loaned: 0, status: "thinking", avatar_initials: "KI", avatar_color: "#0891B2", description: "Builds UI components, interaction design, all visual layers", is_active: true },

  // TEAM 2: Marketing & Brand
  { id: "mira", name: "Mira", canonical_role: "Marketing Strategist", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 1000, budget_used: 420, budget_loaned: 0, status: "idle", avatar_initials: "MI", avatar_color: "#D97706", description: "Campaign planning, go-to-market, messaging strategy", is_active: true },
  { id: "tara", name: "Tara", canonical_role: "Brand Voice & Content", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 800, budget_used: 310, budget_loaned: 0, status: "idle", avatar_initials: "TA", avatar_color: "#7C3AED", description: "Tone consistency, thought leadership, brand guardian", is_active: true },
  { id: "zoya", name: "Zoya", canonical_role: "Growth Marketing", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 600, budget_used: 180, budget_loaned: 0, status: "idle", avatar_initials: "ZO", avatar_color: "#EC4899", description: "Rapid testing, acquisition channels, retention mechanics", is_active: true },

  // TEAM 3: Revenue
  { id: "rishi", name: "Rishi", canonical_role: "Revenue Operations", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 1200, budget_used: 540, budget_loaned: 0, status: "idle", avatar_initials: "RI", avatar_color: "#2563EB", description: "Pipeline management, deal structure, pricing strategy", is_active: true },
  { id: "yuvaan", name: "Yuvaan", canonical_role: "Sales Enablement", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 1000, budget_used: 220, budget_loaned: 0, status: "idle", avatar_initials: "YU", avatar_color: "#059669", description: "Call prep, sales collateral, proposals & objection handling", is_active: true },
  { id: "veer", name: "Veer", canonical_role: "Pricing & Commercial", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 700, budget_used: 90, budget_loaned: 0, status: "idle", avatar_initials: "VE", avatar_color: "#0284C7", description: "Pricing models, contract terms, discount authority", is_active: true },

  // TEAM 4: Delivery & Operations
  { id: "ujjwal", name: "Ujjwal", canonical_role: "Automation Architect", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 1100, budget_used: 380, budget_loaned: 0, status: "idle", avatar_initials: "UJ", avatar_color: "#14B8A6", description: "Automation workflows, process improvements, n8n builder", is_active: true },
  { id: "rohit", name: "Rohit", canonical_role: "QA & Testing", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 600, budget_used: 150, budget_loaned: 0, status: "idle", avatar_initials: "RO", avatar_color: "#A855F7", description: "Tests functionality, validates outputs, catches bugs", is_active: true },
  { id: "anne", name: "Anne", canonical_role: "Compliance & Risk", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 700, budget_used: 85, budget_loaned: 0, status: "idle", avatar_initials: "AN", avatar_color: "#DC2626", description: "Legal/regulatory compliance, contractual risk, data handling", is_active: true },

  // TEAM 5: Support & Knowledge
  { id: "sage", name: "Sage", canonical_role: "Memory & Knowledge", team: "support", system_prompt: "", prompt_version: 1, default_model: "claude-opus", llm_provider: "anthropic", budget_tokens: 1500, budget_used: 920, budget_loaned: 0, status: "idle", avatar_initials: "SA", avatar_color: "#6366F1", description: "Extracts decisions/insights, stores persistent memory", is_active: true },
  { id: "abhay", name: "Abhay", canonical_role: "Legal & Contracts", team: "support", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 800, budget_used: 210, budget_loaned: 0, status: "idle", avatar_initials: "AB", avatar_color: "#0F766E", description: "Contract drafting, legal risk, regulatory interpretation", is_active: true },
  { id: "preeti", name: "Preeti", canonical_role: "Regulatory Compliance", team: "support", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 600, budget_used: 75, budget_loaned: 0, status: "idle", avatar_initials: "PR", avatar_color: "#BE185D", description: "Indian regulatory landscape, RBI/MCA/MEITY monitoring", is_active: true },
  { id: "kshitiz", name: "Kshitiz", canonical_role: "Research & Intelligence", team: "support", system_prompt: "", prompt_version: 1, default_model: "claude-sonnet", llm_provider: "anthropic", budget_tokens: 700, budget_used: 330, budget_loaned: 0, status: "idle", avatar_initials: "KS", avatar_color: "#4F46E5", description: "Competitive research, market trends, customer insights", is_active: true },
  { id: "nia", name: "Nia", canonical_role: "Campaign Operations", team: "support", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 600, budget_used: 140, budget_loaned: 0, status: "idle", avatar_initials: "NI", avatar_color: "#F97316", description: "Campaign logistics, scheduling, cross-team coordination", is_active: true },

  // TEAM 6: Customer & Product (reserved)
  { id: "arjun", name: "Arjun", canonical_role: "Customer Success", team: "product", system_prompt: "", prompt_version: 1, default_model: "claude-haiku", llm_provider: "anthropic", budget_tokens: 500, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "AR", avatar_color: "#06B6D4", description: "Customer-facing agent (reserved for scale)", is_active: false },
  { id: "dev", name: "Dev", canonical_role: "Product Engineering", team: "product", system_prompt: "", prompt_version: 1, default_model: "claude-opus", llm_provider: "anthropic", budget_tokens: 600, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "DE", avatar_color: "#14B8A6", description: "Product engineering agent (reserved for scale)", is_active: false },

  // TEAM 7: Infrastructure & Systems (reserved)
  { id: "neha", name: "Neha", canonical_role: "Infrastructure", team: "system", system_prompt: "", prompt_version: 1, default_model: "gemini-flash", llm_provider: "google", budget_tokens: 500, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "NE", avatar_color: "#78716C", description: "Infrastructure agent (managed by Shubham)", is_active: false },
  { id: "veda", name: "Veda", canonical_role: "DevOps", team: "system", system_prompt: "", prompt_version: 1, default_model: "gemini-flash", llm_provider: "google", budget_tokens: 500, budget_used: 0, budget_loaned: 0, status: "idle", avatar_initials: "VD", avatar_color: "#57534E", description: "DevOps agent (managed by Shubham)", is_active: false },
];

export const TEAM_LABELS: Record<string, string> = {
  founders_office: "Founders' Office",
  marketing: "Marketing",
  revenue: "Finance",
  delivery: "Tech",
  support: "Legal",
  product: "Product Management",
  system: "System",
};

export const TEAM_COLORS: Record<string, string> = {
  founders_office: "#2563EB",
  marketing: "#D97706",
  revenue: "#059669",
  delivery: "#14B8A6",
  support: "#6366F1",
  product: "#06B6D4",
  system: "#78716C",
};
