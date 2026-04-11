import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface BudgetStatus {
  allowed: boolean;
  remaining: number;
  percentUsed: number;
  warning: boolean;
}

/** Check an agent's budget status. Returns whether further usage is allowed. */
export async function checkBudget(
  supabase: SupabaseClient,
  agentId: string,
): Promise<BudgetStatus> {
  const { data, error } = await supabase
    .from("agents")
    .select("budget_allocated, budget_used")
    .eq("id", agentId)
    .single();

  if (error) throw new Error(`Budget check failed: ${error.message}`);

  const allocated = data.budget_allocated ?? 0;
  const used = data.budget_used ?? 0;
  const remaining = Math.max(0, allocated - used);
  const percentUsed = allocated > 0 ? (used / allocated) * 100 : 0;

  return {
    allowed: used < allocated,
    remaining,
    percentUsed,
    warning: percentUsed > 80,
  };
}

/** Atomically increment an agent's token usage. */
export async function trackUsage(
  supabase: SupabaseClient,
  agentId: string,
  tokensUsed: number,
): Promise<void> {
  const { error } = await supabase.rpc("increment_budget_used", {
    p_agent_id: agentId,
    p_tokens: tokensUsed,
  });

  if (error) {
    const { error: fallbackError } = await supabase
      .from("agents")
      .update({
        budget_used: supabase.rpc("budget_used_plus", {
          agent_id: agentId,
          amount: tokensUsed,
        }),
      })
      .eq("id", agentId);

    if (fallbackError) {
      throw new Error(`Failed to track usage: ${fallbackError.message}`);
    }
  }
}

/** Return a formatted error response when an agent's budget is exhausted. */
export function handleBudgetExhausted(agentId: string, agentName?: string): Response {
  const name = agentName ?? agentId;
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return new Response(
    JSON.stringify({
      error: "budget_exhausted",
      message: `Agent "${name}" has exceeded its monthly token budget. Budget resets on ${resetDate.toISOString().split("T")[0]}.`,
      reset_date: resetDate.toISOString(),
    }),
    { status: 429, headers: { "Content-Type": "application/json" } },
  );
}

/** Reset all agents' budget_used to 0. Logs previous usage before reset. */
export async function resetMonthlyBudgets(supabase: SupabaseClient): Promise<void> {
  const { data: agents, error: fetchError } = await supabase
    .from("agents")
    .select("id, name, budget_allocated, budget_used")
    .gt("budget_used", 0);

  if (fetchError) throw new Error(`Failed to fetch agents: ${fetchError.message}`);

  if (agents && agents.length > 0) {
    const logEntries = agents.map((a) => ({
      agent_id: a.id,
      agent_name: a.name,
      budget_allocated: a.budget_allocated,
      budget_used: a.budget_used,
      reset_at: new Date().toISOString(),
      period: new Date().toISOString().slice(0, 7),
    }));

    await supabase.from("budget_reset_log").insert(logEntries);
    console.log(`Logged budget usage for ${agents.length} agents`);
  }

  const { error: resetError } = await supabase
    .from("agents")
    .update({ budget_used: 0 })
    .gte("budget_used", 0);

  if (resetError) throw new Error(`Failed to reset budgets: ${resetError.message}`);
  console.log("Monthly budgets reset complete");
}
