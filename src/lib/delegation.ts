// src/lib/delegation.ts
// Agent-to-agent delegation detection and orchestration logic

import { supabase } from "@/integrations/supabase/client";
import { callLLM } from "@/lib/llm";
import { onAgentDelegation } from "@/lib/webhooks";

// ─── Delegation keyword map — All 22 agents ───

const DELEGATION_MAP: Record<string, string[]> = {
  // Executive & Orchestration
  kabir: ["strategy", "orchestrate", "approve", "company state", "executive", "decision", "prioritize", "roadmap", "cross-team", "conflict", "synthesize"],
  kshitiz: ["research", "competitive", "market trends", "customer insights", "intelligence", "benchmark", "data analysis", "data validation", "market data"],

  // Marketing & Growth
  mira: ["marketing", "campaign", "brand strategy", "go-to-market", "GTM", "SEO", "content marketing", "messaging", "positioning"],
  tara: ["brand", "voice", "tone", "copywriting", "tagline", "thought leadership", "content", "writing style"],
  zoya: ["growth hack", "retention", "A/B test", "acquisition channel", "viral", "referral", "churn", "paid ads", "performance marketing"],
  nia: ["campaign ops", "scheduling", "funnel", "logistics", "cross-team", "timeline", "campaign coordination", "execution"],

  // Revenue & Finance
  rishi: ["revenue", "pipeline", "deal", "sales strategy", "revenue ops", "CRM", "forecast", "quota"],
  yuvaan: ["sales", "call prep", "proposal", "objection", "collateral", "pitch deck", "demo", "outbound", "prospect"],
  veer: ["pricing", "unit economics", "contract terms", "discount", "commercial", "deal structure", "SaaS pricing", "margins"],
  anne: ["compliance", "financial compliance", "audit", "chartered accountant", "audit trail", "financial risk"],
  aarav: ["bookkeeping", "invoice", "expense", "accounts", "GST", "TDS", "financial report", "P&L", "balance sheet", "payroll"],

  // Legal & Governance
  abhay: ["legal", "contract", "agreement", "liability", "terms", "NDA", "SLA", "legal risk", "clause"],
  preeti: ["regulatory", "DPDP", "data protection", "privacy policy", "RBI", "MCA", "MEITY", "data governance", "GDPR"],

  // Client Delivery & Product
  rohit: ["QA", "test", "testing", "bug", "validate", "quality assurance", "regression", "debug", "review output"],
  ujjawal: ["automate", "workflow", "automation", "integration", "n8n", "zapier", "API", "webhook", "process improvement"],
  arjun: ["client", "discovery", "onboarding", "requirement", "stakeholder", "client strategy", "scoping"],
  arush: ["documentation", "SOP", "knowledge base", "training", "handover", "enablement", "guide", "manual"],
  dev: ["product", "roadmap", "sprint", "backlog", "feature", "product manager", "prioritisation", "ticket"],

  // System Agents
  kaiser: ["system health", "cron", "backup", "infrastructure", "monitoring", "admin", "server", "uptime"],
  sage: ["memory", "remember", "recall", "context", "history", "decision log", "insight", "knowledge"],

  // Personal Agents
  arya: ["abhimanyu", "my tasks", "my calendar", "my priorities", "my schedule"],
  ananya: ["shubham", "tech tasks", "CTO", "technical priorities"],
};

// Agent name → agent ID mapping (populated from DB at runtime)
let agentNameToId: Record<string, string> = {};

export function setAgentNameMap(agents: Array<{ id: string; name: string }>): void {
  agentNameToId = {};
  for (const agent of agents) {
    agentNameToId[agent.name.toLowerCase()] = agent.id;
  }
}

// ─── Detection ───

export interface DelegationResult {
  shouldDelegate: boolean;
  targetAgentName?: string;
  targetAgentId?: string;
  reason: "explicit_request" | "auto_detected" | "none";
  task?: string;
}

/**
 * Detect if a message should trigger delegation.
 * Checks explicit @mentions first, then keyword-based auto-detection.
 */
export function detectDelegation(
  userMessage: string,
  currentAgentName: string
): DelegationResult {
  const lower = userMessage.toLowerCase();

  // 1. Explicit @mention: "@Mira help with..."
  const mentionMatch = userMessage.match(/@(\w+)/);
  if (mentionMatch) {
    const mentionedName = mentionMatch[1].toLowerCase();
    // Don't delegate to self
    if (mentionedName !== currentAgentName.toLowerCase()) {
      const agentId = agentNameToId[mentionedName];
      if (agentId) {
        const taskStart = userMessage.indexOf(mentionMatch[0]) + mentionMatch[0].length;
        const task = userMessage.slice(taskStart).trim() || userMessage;
        return {
          shouldDelegate: true,
          targetAgentName: mentionMatch[1],
          targetAgentId: agentId,
          reason: "explicit_request",
          task,
        };
      }
    }
  }

  // 2. Keyword-based auto-detection
  for (const [agentName, keywords] of Object.entries(DELEGATION_MAP)) {
    // Don't delegate to self
    if (agentName === currentAgentName.toLowerCase()) continue;

    const matched = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
    if (matched.length >= 1) {
      const agentId = agentNameToId[agentName];
      if (agentId) {
        return {
          shouldDelegate: true,
          targetAgentName: agentName.charAt(0).toUpperCase() + agentName.slice(1),
          targetAgentId: agentId,
          reason: "auto_detected",
          task: `User mentioned: ${matched.join(", ")}. Full message: "${userMessage}"`,
        };
      }
    }
  }

  return { shouldDelegate: false, reason: "none" };
}

// ─── Delegation execution ───

export interface DelegationContext {
  userId: string;
  mainConversationId: string;
  delegatingAgentId: string;
  delegatingAgentName: string;
  targetAgentId: string;
  targetAgentName: string;
  userMessage: string;
  conversationHistory: string[]; // last N messages for context
  task: string;
  reason: "explicit_request" | "auto_detected";
  // LLM config
  model: string;
  provider: string;
  apiKey: string;
}

export interface DelegationOutput {
  delegatedConversationId: string;
  delegatedResponse: string;
  splitScreenVisible: boolean;
}

/**
 * Execute a delegation: create a sub-conversation, ask the target agent,
 * and return the response for split-screen display.
 */
export async function executeDelegation(ctx: DelegationContext): Promise<DelegationOutput> {
  // 1. Create delegated conversation
  const { data: newConv, error: convErr } = await supabase
    .from("conversations")
    .insert({
      agent_id: ctx.targetAgentId,
      profile_id: ctx.userId,
      title: `${ctx.delegatingAgentName} delegated: ${ctx.task.slice(0, 50)}`,
    })
    .select("id")
    .single();

  if (convErr || !newConv) {
    throw new Error(`Failed to create delegated conversation: ${convErr?.message}`);
  }

  const delegatedConversationId = newConv.id;

  // 2. Build delegation prompt
  const contextStr = ctx.conversationHistory.length > 0
    ? `Context (recent messages):\n${ctx.conversationHistory.join("\n")}`
    : "";

  const delegationPrompt = `You are ${ctx.targetAgentName}.

${ctx.delegatingAgentName} (another AI agent) is helping a user. The user asked:
"${ctx.userMessage}"

${contextStr}

${ctx.delegatingAgentName} needs your specific expertise on:
${ctx.task}

Please provide your analysis. Be specific, actionable, and concise.
Format: Clear bullet points. Assume ${ctx.delegatingAgentName} will use your response to answer the user.`;

  // 3. Store Kaiser's ask as "user" message in delegated conversation
  await supabase.from("messages").insert({
    conversation_id: delegatedConversationId,
    role: "user" as const,
    content: delegationPrompt,
    model: ctx.model,
  });

  // 4. Call LLM for delegated agent's response
  const delegatedResponse = await callLLM(
    [{ role: "user", content: delegationPrompt }],
    ctx.model,
    ctx.provider,
    ctx.apiKey
  );

  // 5. Store delegated agent's response
  await supabase.from("messages").insert({
    conversation_id: delegatedConversationId,
    role: "agent" as const,
    content: delegatedResponse,
    model: ctx.model,
  });

  // 6. Fire webhook (fire-and-forget)
  onAgentDelegation({
    fromAgentId: ctx.delegatingAgentId,
    toAgentId: ctx.targetAgentId,
    conversationId: ctx.mainConversationId,
    delegatedConversationId,
    task: ctx.task,
    reason: ctx.reason,
  }).catch(console.error);

  return {
    delegatedConversationId,
    delegatedResponse,
    splitScreenVisible: true,
  };
}

/**
 * After delegation, Kaiser synthesizes the final answer incorporating
 * the delegated agent's response.
 */
export async function synthesizeDelegationResponse(params: {
  delegatingAgentName: string;
  targetAgentName: string;
  userMessage: string;
  delegatedResponse: string;
  model: string;
  provider: string;
  apiKey: string;
}): Promise<string> {
  const synthesisPrompt = `I (${params.delegatingAgentName}) asked ${params.targetAgentName} for input on the user's request.

User asked: "${params.userMessage}"

${params.targetAgentName}'s analysis:
"${params.delegatedResponse}"

Now provide a complete, well-structured answer to the user that incorporates ${params.targetAgentName}'s expertise.
At the end, add a footnote: "Consulted with ${params.targetAgentName} for this analysis."`;

  return callLLM(
    [{ role: "user", content: synthesisPrompt }],
    params.model,
    params.provider,
    params.apiKey
  );
}

// ─── Agent Chain Types & CRUD ───

export interface AgentChain {
  id: string;
  name: string;
  steps: { agent_id: string; instruction: string }[];
  created_by: string;
  created_at: string;
}

export async function createChain(
  name: string,
  steps: { agent_id: string; instruction: string }[],
  userId: string
): Promise<AgentChain> {
  const { data, error } = await supabase
    .from("settings")
    .insert({
      key: `chain:${crypto.randomUUID()}`,
      value: JSON.stringify({ name, steps, created_by: userId }),
    })
    .select("*")
    .single();
  if (error) throw error;
  const parsed = JSON.parse(data.value);
  return { id: data.id, name: parsed.name, steps: parsed.steps, created_by: parsed.created_by, created_at: data.created_at };
}

export async function getChains(): Promise<AgentChain[]> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .like("key", "chain:%");
  if (error) throw error;
  return (data ?? []).map((row) => {
    const parsed = JSON.parse(row.value);
    return { id: row.id, name: parsed.name, steps: parsed.steps, created_by: parsed.created_by, created_at: row.created_at };
  });
}

export async function deleteChain(chainId: string): Promise<void> {
  const { error } = await supabase.from("settings").delete().eq("id", chainId);
  if (error) throw error;
}

export async function executeChain(
  chain: AgentChain,
  initialInput: string,
  _opts?: { model?: string; provider?: string }
): Promise<string[]> {
  const results: string[] = [];
  let currentInput = initialInput;
  for (const step of chain.steps) {
    const result = await callLLM(
      [{ role: "user", content: `${step.instruction}\n\nContext:\n${currentInput}` }],
      _opts?.model ?? "gpt-4o-mini",
      _opts?.provider ?? "openai",
      ""
    );
    results.push(result);
    currentInput = result;
  }
  return results;
}
