import type { Agent } from "@/types/layaa";

// Mock agent data for the framework — 22 agents across 7 teams
export const MOCK_AGENTS: Agent[] = [
  // Founders' Office
  { id: "kabir", name: "Kabir", canonical_role: "Chief of Staff", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 500000, budget_used: 124000, budget_loaned: 0, status: "idle", avatar_initials: "KA", avatar_color: "#10B981", description: "Orchestrates all agents, routes tasks, manages priorities", is_active: true },
  { id: "tara", name: "Tara", canonical_role: "Executive Assistant", team: "founders_office", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 300000, budget_used: 45000, budget_loaned: 0, status: "idle", avatar_initials: "TA", avatar_color: "#8B5CF6", description: "Scheduling, reminders, meeting prep", is_active: true },
  // Marketing
  { id: "mira", name: "Mira", canonical_role: "Marketing Strategist", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 400000, budget_used: 89000, budget_loaned: 0, status: "thinking", avatar_initials: "MI", avatar_color: "#F59E0B", description: "Content strategy, campaigns, brand voice", is_active: true },
  { id: "priya", name: "Priya", canonical_role: "Content Writer", team: "marketing", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 350000, budget_used: 67000, budget_loaned: 0, status: "idle", avatar_initials: "PR", avatar_color: "#EC4899", description: "Blog posts, social media, copywriting", is_active: true },
  // Revenue
  { id: "rishi", name: "Rishi", canonical_role: "Revenue Strategist", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 400000, budget_used: 112000, budget_loaned: 0, status: "idle", avatar_initials: "RI", avatar_color: "#3B82F6", description: "Sales strategy, pipeline management, forecasting", is_active: true },
  { id: "arjun", name: "Arjun", canonical_role: "Outreach Specialist", team: "revenue", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 300000, budget_used: 34000, budget_loaned: 0, status: "idle", avatar_initials: "AR", avatar_color: "#06B6D4", description: "Cold outreach, lead qualification, follow-ups", is_active: true },
  // Legal
  { id: "veda", name: "Veda", canonical_role: "Legal Advisor", team: "legal", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 250000, budget_used: 18000, budget_loaned: 0, status: "idle", avatar_initials: "VE", avatar_color: "#EF4444", description: "Contracts, compliance, DPDP, legal research", is_active: true },
  // Delivery
  { id: "dev", name: "Dev", canonical_role: "Lead Developer", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 600000, budget_used: 230000, budget_loaned: 0, status: "idle", avatar_initials: "DE", avatar_color: "#14B8A6", description: "Code generation, PR review, architecture", is_active: true },
  { id: "neha", name: "Neha", canonical_role: "QA Engineer", team: "delivery", system_prompt: "", prompt_version: 1, default_model: "claude-haiku-4-5", llm_provider: "anthropic", budget_tokens: 200000, budget_used: 15000, budget_loaned: 0, status: "idle", avatar_initials: "NE", avatar_color: "#A855F7", description: "Testing, bug reports, quality assurance", is_active: true },
  // System
  { id: "sage", name: "Sage", canonical_role: "Memory Keeper", team: "system", system_prompt: "", prompt_version: 1, default_model: "gemini-flash", llm_provider: "google", budget_tokens: 1000000, budget_used: 340000, budget_loaned: 0, status: "idle", avatar_initials: "SA", avatar_color: "#6366F1", description: "Extracts and stores memories after conversations", is_active: true },
  { id: "kaiser", name: "Kaiser", canonical_role: "System Monitor", team: "system", system_prompt: "", prompt_version: 1, default_model: "gemini-flash", llm_provider: "google", budget_tokens: 500000, budget_used: 89000, budget_loaned: 0, status: "idle", avatar_initials: "KI", avatar_color: "#78716C", description: "Health checks, budget alerts, system diagnostics", is_active: true },
];

export const TEAM_LABELS: Record<string, string> = {
  founders_office: "Founders' Office",
  marketing: "Marketing",
  revenue: "Revenue",
  legal: "Legal",
  delivery: "Client Delivery",
  system: "System",
  core: "Core",
  product: "Product",
};

export const TEAM_COLORS: Record<string, string> = {
  founders_office: "hsl(160 84% 39%)",
  marketing: "hsl(38 92% 50%)",
  revenue: "hsl(217 91% 60%)",
  legal: "hsl(0 72% 51%)",
  delivery: "hsl(168 76% 42%)",
  system: "hsl(245 58% 51%)",
  core: "hsl(200 80% 50%)",
  product: "hsl(280 68% 60%)",
};
