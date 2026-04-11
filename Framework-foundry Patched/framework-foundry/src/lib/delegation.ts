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

// ─── Delegation Reasoning ───────────────────────────────────────────────────

/**
 * Generate a human-readable reason for why a specific agent was chosen.
 */
export function generateDelegationReason(
  task: string,
  targetAgentId: string,
  targetAgentName: string,
  matchType: "explicit_request" | "auto_detected"
): { reason: string; confidence: number } {
  const taskLower = task.toLowerCase();
  const keywords = DELEGATION_MAP[targetAgentId] || DELEGATION_MAP[targetAgentName.toLowerCase()] || [];
  const matched = keywords.filter(kw => taskLower.includes(kw.toLowerCase()));

  if (matchType === "explicit_request") {
    return { reason: `You explicitly mentioned @${targetAgentName}.`, confidence: 1.0 };
  }

  if (matched.length > 0) {
    return {
      reason: `Delegating to ${targetAgentName} because this involves ${matched.slice(0, 3).join(", ")} — their area of expertise.`,
      confidence: 0.7 + (matched.length * 0.05),
    };
  }

  return { reason: `${targetAgentName} is the best role match for this task.`, confidence: 0.6 };
}

// ─── Multi-Turn Delegation ──────────────────────────────────────────────────

const MAX_DELEGATION_TURNS = 5;

/**
 * Execute a multi-turn delegation. Agent A sends task, Agent B responds,
 * A evaluates and may follow up — up to MAX_DELEGATION_TURNS rounds.
 * The conversation happens in the delegated conversation visible in split screen.
 */
export async function executeMultiTurnDelegation(ctx: DelegationContext): Promise<DelegationOutput> {
  // Create delegated conversation
  const { data: newConv } = await supabase.from("conversations")
    .insert({ agent_id: ctx.targetAgentId, profile_id: ctx.userId, title: `${ctx.delegatingAgentName} → ${ctx.targetAgentName}: ${ctx.task.slice(0, 50)}` })
    .select("id").single();

  if (!newConv) throw new Error("Failed to create delegation conversation");
  const delegatedConversationId = newConv.id;

  // Initial message
  await supabase.from("messages").insert({
    conversation_id: delegatedConversationId, role: "user" as const,
    content: `${ctx.delegatingAgentName} asks: ${ctx.task}`, model: ctx.model,
  });

  let lastResponse = "";

  for (let turn = 0; turn < MAX_DELEGATION_TURNS; turn++) {
    // Get delegated agent response
    const response = await callLLM(
      [{ role: "user", content: turn === 0 ? ctx.task : `${ctx.delegatingAgentName}: Please elaborate further.` }],
      ctx.model, ctx.provider, ctx.apiKey
    );

    await supabase.from("messages").insert({
      conversation_id: delegatedConversationId, role: "agent" as const,
      content: response, model: ctx.model,
    });

    lastResponse = response;

    // Stop if response is complete (doesn't end with question, is substantial)
    if (!response.endsWith("?") && response.length > 100) break;

    // Follow up if more turns available
    if (turn < MAX_DELEGATION_TURNS - 1) {
      await supabase.from("messages").insert({
        conversation_id: delegatedConversationId, role: "user" as const,
        content: `${ctx.delegatingAgentName}: Can you provide more specific actionable details?`, model: ctx.model,
      });
    }
  }

  onAgentDelegation({
    fromAgentId: ctx.delegatingAgentId, toAgentId: ctx.targetAgentId,
    conversationId: ctx.mainConversationId, delegatedConversationId,
    task: ctx.task, reason: ctx.reason,
  }).catch(console.error);

  return { delegatedConversationId, delegatedResponse: lastResponse, splitScreenVisible: true };
}

// ─── Chain Workflows ────────────────────────────────────────────────────────

export interface ChainStep {
  agentId: string;
  agentName: string;
  instruction: string;
  status: "pending" | "running" | "completed" | "failed" | "awaiting_approval";
  output?: string;
}

export interface AgentChain {
  id: string;
  name: string;
  steps: ChainStep[];
  status: "pending" | "running" | "completed" | "failed";
  originalPrompt: string;
}

const CHAINS_KEY = "layaa_agent_chains";

export function getChains(): AgentChain[] {
  try { return JSON.parse(localStorage.getItem(CHAINS_KEY) || "[]"); } catch { return []; }
}

function saveChains(chains: AgentChain[]): void {
  localStorage.setItem(CHAINS_KEY, JSON.stringify(chains));
}

export function createChain(name: string, steps: { agentId: string; agentName: string; instruction: string }[], originalPrompt: string): AgentChain {
  const chain: AgentChain = {
    id: `chain-${Date.now()}`, name,
    steps: steps.map(s => ({ ...s, status: "pending" as const })),
    status: "pending", originalPrompt,
  };
  const chains = getChains();
  chains.unshift(chain);
  saveChains(chains);
  return chain;
}

export function deleteChain(chainId: string): void {
  saveChains(getChains().filter(c => c.id !== chainId));
}

/**
 * Build a handoff summary for the next agent in a chain.
 * Instead of passing the full output, summarizes: context, what was done, what the next agent needs to do.
 */
function buildChainHandoff(
  previousAgentName: string,
  previousOutput: string,
  nextInstruction: string,
  originalPrompt: string
): string {
  // Extract key points from previous output (first 3 bullet points or sentences)
  const lines = previousOutput.split("\n").filter(l => l.trim().length > 10);
  const keyPoints = lines
    .filter(l => l.startsWith("-") || l.startsWith("*") || l.startsWith("•") || /^\d+\./.test(l.trim()) || lines.indexOf(l) < 3)
    .slice(0, 5)
    .map(l => l.trim())
    .join("\n");

  return `**Context:** A user originally asked: "${originalPrompt.slice(0, 200)}"

**Previous step:** ${previousAgentName} worked on this and produced the following key points:
${keyPoints || previousOutput.slice(0, 500)}

**Your task:** ${nextInstruction}

**What's expected from you:** Deliver a clear, actionable output that builds on the previous step. Focus on your specific expertise area.`;
}

/**
 * Execute a chain workflow step by step.
 * Each agent receives a summarized handoff from the previous step — not the full raw output.
 * Final step always routes to approval.
 */
export async function executeChain(
  chainId: string,
  userId: string,
  model: string,
  provider: string,
  apiKey: string,
  onStepComplete?: (stepIndex: number, output: string) => void
): Promise<AgentChain> {
  const chains = getChains();
  const chain = chains.find(c => c.id === chainId);
  if (!chain) throw new Error("Chain not found");

  chain.status = "running";
  saveChains(chains);

  let previousOutput = chain.originalPrompt;
  let previousAgentName = "User";

  for (let i = 0; i < chain.steps.length; i++) {
    const step = chain.steps[i];
    const isFinalStep = i === chain.steps.length - 1;

    step.status = "running";
    saveChains(chains);

    // Final step always routes to approval
    if (isFinalStep) {
      step.status = "awaiting_approval";
      saveChains(chains);
      await supabase.from("approvals").insert({
        requesting_agent_id: step.agentId,
        profile_id: userId,
        action_type: "chain_final_step",
        action_description: `Final step of chain "${chain.name}": ${step.agentName} will process the summarized output from ${i} previous step(s).`,
        status: "pending",
      });
      break;
    }

    try {
      // Build summarized handoff (not full output)
      const handoff = i === 0
        ? step.instruction + "\n\nOriginal request: " + chain.originalPrompt
        : buildChainHandoff(previousAgentName, previousOutput, step.instruction, chain.originalPrompt);

      const response = await callLLM(
        [{ role: "user", content: handoff }],
        model, provider, apiKey
      );

      step.output = response;
      step.status = "completed";
      previousOutput = response;
      previousAgentName = step.agentName;
      saveChains(chains);

      if (onStepComplete) onStepComplete(i, response);
    } catch {
      step.status = "failed";
      chain.status = "failed";
      saveChains(chains);
      break;
    }
  }

  if (chain.steps.every(s => s.status === "completed")) {
    chain.status = "completed";
    saveChains(chains);
  }

  return chain;
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
