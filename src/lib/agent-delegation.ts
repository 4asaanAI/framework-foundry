/**
 * Agent-to-agent delegation stubs — Task 5
 */
import { supabase } from "@/integrations/supabase/client";

export interface SplitScreenSession {
  id: string;
  sourceConversationId: string;
  targetConversationId: string;
  sourceAgentId: string;
  targetAgentId: string;
  task: string;
  createdAt: string;
}

export async function initiateSplitScreen(
  sourceAgentId: string, targetAgentId: string, task: string,
  userId: string, sourceConversationId: string
): Promise<SplitScreenSession> {
  // Create new conversation for target agent
  const { data: newConv, error } = await supabase.from("conversations").insert({
    agent_id: targetAgentId,
    profile_id: userId,
    title: `Delegated: ${task.slice(0, 50)}`,
    branch_parent_id: sourceConversationId,
    branch_label: `Delegation from agent`,
  }).select("id").single();

  if (error || !newConv) throw new Error("Failed to create delegation conversation");

  // Seed context from source conversation (last 5 messages)
  const { data: contextMsgs } = await supabase.from("messages")
    .select("*")
    .eq("conversation_id", sourceConversationId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (contextMsgs && contextMsgs.length > 0) {
    const contextText = contextMsgs.reverse().map((m: any) =>
      `[${m.role}]: ${m.content.slice(0, 200)}`
    ).join("\n");

    await supabase.from("messages").insert({
      conversation_id: newConv.id,
      role: "tool_result" as any,
      content: `**Context from delegating agent:**\n${contextText}\n\n**Task:** ${task}`,
    });
  }

  return {
    id: newConv.id,
    sourceConversationId,
    targetConversationId: newConv.id,
    sourceAgentId,
    targetAgentId,
    task,
    createdAt: new Date().toISOString(),
  };
}

export async function getSplitScreenContext(conversationId: string) {
  const { data: conv } = await supabase.from("conversations")
    .select("*, agents!conversations_agent_id_fkey(name, avatar_initials, avatar_color)")
    .eq("id", conversationId)
    .single();

  const { data: messages } = await supabase.from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return { conversation: conv, messages: messages ?? [] };
}

export async function closeSplitScreen(
  sessionId: string, sourceConversationId: string, summary: string
): Promise<void> {
  // Store summary as memory in source conversation
  await supabase.from("messages").insert({
    conversation_id: sourceConversationId,
    role: "tool_result" as any,
    content: `**Delegation result:**\n${summary}`,
  });
}
