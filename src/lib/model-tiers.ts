/**
 * Model Tier System — Layaa OS
 *
 * Three intelligence tiers for all agents:
 *   Deep  — Complex reasoning, strategy, deep analysis, code architecture
 *   Sharp — Balanced everyday work, good quality at reasonable cost
 *   Quick — Fast tasks, summaries, extraction, drafts
 *
 * Each tier offers multiple provider options. Users can switch tiers
 * mid-conversation (persists for that conversation).
 *
 * Agent defaults: Deep (Kabir, Arya, Ananya), Quick (Kaiser, Sage), Sharp (everyone else)
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type ModelTier = "deep" | "sharp" | "quick";

export interface TierModel {
  id: string;        // model identifier sent to LLM provider
  name: string;      // display name
  provider: string;  // openai, anthropic, google, etc.
}

export interface TierDefinition {
  id: ModelTier;
  name: string;
  label: string;     // shown in UI with usage hint
  description: string;
  icon: string;      // emoji
  color: string;     // Tailwind color class
  models: TierModel[];
  costPerToken: number;  // approximate $ per token for budget tracking
}

// ─── Tier Definitions ───────────────────────────────────────────────────────

export const MODEL_TIERS: TierDefinition[] = [
  {
    id: "deep",
    name: "Deep",
    label: "Deep (complex reasoning & strategy)",
    description: "Maximum intelligence. Use for strategy, architecture, legal review, complex analysis, and critical decisions. Slower and more expensive but highest quality output.",
    icon: "🧠",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    models: [
      { id: "claude-opus-4-6", name: "Claude Opus 4.6", provider: "anthropic" },
      { id: "openai/gpt-5", name: "GPT-5", provider: "openai" },
      { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
    ],
    costPerToken: 0.00006, // ~$60/1M tokens blended
  },
  {
    id: "sharp",
    name: "Sharp",
    label: "Sharp (balanced everyday work)",
    description: "Best balance of speed and quality. Use for most conversations, content creation, research, task execution. Good enough for 90% of work.",
    icon: "⚡",
    color: "text-primary bg-primary/10 border-primary/30",
    models: [
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "anthropic" },
      { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "openai" },
      { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash", provider: "google" },
    ],
    costPerToken: 0.00002, // ~$20/1M tokens blended
  },
  {
    id: "quick",
    name: "Quick",
    label: "Quick (fast tasks & extraction)",
    description: "Fastest and cheapest. Use for summaries, memory extraction, simple lookups, draft generation, and system tasks. Not suitable for complex reasoning.",
    icon: "💨",
    color: "text-success bg-success/10 border-success/30",
    models: [
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", provider: "anthropic" },
      { id: "openai/gpt-5-nano", name: "GPT-5 Nano", provider: "openai" },
      { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "google" },
    ],
    costPerToken: 0.000005, // ~$5/1M tokens blended
  },
];

// ─── Agent Default Tiers ────────────────────────────────────────────────────

const AGENT_DEFAULT_TIERS: Record<string, ModelTier> = {
  // Deep — executive + personal assistants
  kabir: "deep",
  arya: "deep",
  ananya: "deep",
  // Quick — system agents
  kaiser: "quick",
  sage: "quick",
  // Sharp — everyone else (default)
};

/**
 * Get the default tier for an agent.
 * Checks: settings override → hardcoded defaults → "sharp" fallback
 */
export function getAgentDefaultTier(agentId: string): ModelTier {
  // Check localStorage for user overrides
  const overrides = getAgentTierOverrides();
  if (overrides[agentId]) return overrides[agentId];
  // Check hardcoded defaults
  return AGENT_DEFAULT_TIERS[agentId] || "sharp";
}

/**
 * Get user-configured tier overrides for agents.
 */
export function getAgentTierOverrides(): Record<string, ModelTier> {
  try { return JSON.parse(localStorage.getItem("layaa_agent_tier_overrides") || "{}"); }
  catch { return {}; }
}

/**
 * Set a tier override for an agent.
 */
export function setAgentTierOverride(agentId: string, tier: ModelTier): void {
  const overrides = getAgentTierOverrides();
  overrides[agentId] = tier;
  localStorage.setItem("layaa_agent_tier_overrides", JSON.stringify(overrides));
}

// ─── Conversation Tier Tracking ─────────────────────────────────────────────

/**
 * Get the current tier for a conversation.
 * Falls back to agent default if no conversation-level override exists.
 */
export function getConversationTier(conversationId: string, agentId: string): ModelTier {
  const convTiers = getConversationTierMap();
  return convTiers[conversationId] || getAgentDefaultTier(agentId);
}

/**
 * Set the tier for a specific conversation (persists until manually switched).
 */
export function setConversationTier(conversationId: string, tier: ModelTier): void {
  const convTiers = getConversationTierMap();
  convTiers[conversationId] = tier;
  localStorage.setItem("layaa_conversation_tiers", JSON.stringify(convTiers));
}

function getConversationTierMap(): Record<string, ModelTier> {
  try { return JSON.parse(localStorage.getItem("layaa_conversation_tiers") || "{}"); }
  catch { return {}; }
}

// ─── Tier Resolution ────────────────────────────────────────────────────────

/**
 * Get the tier definition object.
 */
export function getTierDefinition(tier: ModelTier): TierDefinition {
  return MODEL_TIERS.find(t => t.id === tier) || MODEL_TIERS[1]; // default Sharp
}

/**
 * Resolve a tier + optional provider preference to an actual model ID.
 * If preferred provider not available, picks the first model in the tier.
 */
export function resolveModelFromTier(tier: ModelTier, preferredProvider?: string): string {
  const tierDef = getTierDefinition(tier);

  if (preferredProvider) {
    const match = tierDef.models.find(m => m.provider === preferredProvider);
    if (match) return match.id;
  }

  // Check global LLM provider setting
  const globalProvider = localStorage.getItem("layaa_llm_provider");
  if (globalProvider) {
    const match = tierDef.models.find(m => m.provider === globalProvider);
    if (match) return match.id;
  }

  // Fallback to first model in tier
  return tierDef.models[0]?.id || "google/gemini-3-flash-preview";
}

/**
 * Get the cost per token for a tier (for real-time cost display).
 */
export function getTierCostPerToken(tier: ModelTier): number {
  return getTierDefinition(tier).costPerToken;
}
