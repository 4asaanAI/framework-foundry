/**
 * Database abstraction layer — all Supabase queries go through here.
 * When migrating to PocketBase or another backend, only this file changes.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message, Agent, AgentMemory, Task, ApprovalItem, Project } from "./db-types";
import { toProject } from "@/types/layaa";

// ─── CONVERSATIONS ───

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("profile_id", userId)
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Failed to fetch conversations: ${error.message}`);
  return (data ?? []) as Conversation[];
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();
  if (error) throw new Error(`Failed to fetch conversation: ${error.message}`);
  return data as Conversation;
}

export async function createConversation(
  userId: string, agentId: string, title: string, projectId?: string | null
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ agent_id: agentId, profile_id: userId, title, project_id: projectId ?? null })
    .select("*")
    .single();
  if (error) throw new Error(`Failed to create conversation: ${error.message}`);
  return data as Conversation;
}

export async function updateConversation(
  conversationId: string, updates: Record<string, any>
): Promise<Conversation> {
  const { data, error } = await supabase
    .from("conversations")
    .update(updates as any)
    .eq("id", conversationId)
    .select("*")
    .single();
  if (error) throw new Error(`Failed to update conversation: ${error.message}`);
  return data as Conversation;
}

export async function archiveConversation(conversationId: string): Promise<void> {
  const { error } = await supabase.from("conversations").update({ is_archived: true }).eq("id", conversationId);
  if (error) throw new Error(`Failed to archive conversation: ${error.message}`);
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase.from("conversations").delete().eq("id", conversationId);
  if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
}

// ─── MESSAGES ───

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return (data ?? []) as Message[];
}

export async function createMessage(
  conversationId: string, role: Message["role"], content: string,
  opts?: { model?: string; tokens_in?: number; tokens_out?: number; cost_usd?: number; response_time_ms?: number; attachments?: any[]; mention_agent_id?: string | null; parent_message_id?: string | null }
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId, role, content,
      model: opts?.model ?? "", tokens_in: opts?.tokens_in ?? 0,
      tokens_out: opts?.tokens_out ?? 0, cost_usd: opts?.cost_usd ?? 0,
      response_time_ms: opts?.response_time_ms ?? 0,
      attachments: opts?.attachments ?? [],
      mention_agent_id: opts?.mention_agent_id ?? null,
      parent_message_id: opts?.parent_message_id ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Failed to create message: ${error.message}`);
  return data as Message;
}

export async function updateMessage(
  messageId: string, updates: Partial<Pick<Message, "rating" | "is_pinned" | "content">>
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .update(updates)
    .eq("id", messageId)
    .select("*")
    .single();
  if (error) throw new Error(`Failed to update message: ${error.message}`);
  return data as Message;
}

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", messageId);
  if (error) throw new Error(`Failed to delete message: ${error.message}`);
}

// ─── AGENTS ───

export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase.from("agents").select("*").order("name");
  if (error) throw new Error(`Failed to fetch agents: ${error.message}`);
  return (data ?? []) as Agent[];
}

export async function getAgent(agentId: string): Promise<Agent> {
  const { data, error } = await supabase.from("agents").select("*").eq("id", agentId).single();
  if (error) throw new Error(`Failed to fetch agent: ${error.message}`);
  return data as Agent;
}

export async function createAgent(agent: Partial<Agent> & { name: string; canonical_role: string; team: string }): Promise<Agent> {
  const { data, error } = await supabase.from("agents").insert(agent as any).select("*").single();
  if (error) throw new Error(`Failed to create agent: ${error.message}`);
  return data as Agent;
}

export async function updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
  const { data, error } = await supabase.from("agents").update(updates as any).eq("id", agentId).select("*").single();
  if (error) throw new Error(`Failed to update agent: ${error.message}`);
  return data as Agent;
}

export async function updateAgentBudget(agentId: string, tokensUsed: number, costUsd: number): Promise<void> {
  const agent = await getAgent(agentId);
  const { error } = await supabase.from("agents").update({
    budget_used: agent.budget_used + tokensUsed,
  }).eq("id", agentId);
  if (error) throw new Error(`Failed to update agent budget: ${error.message}`);
}

// ─── MEMORIES ───

export async function getAgentMemories(agentId: string, memoryType?: string): Promise<AgentMemory[]> {
  let query = supabase.from("agent_memories").select("*").eq("agent_id", agentId).order("created_at", { ascending: false });
  if (memoryType) query = query.eq("memory_type", memoryType as any);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch memories: ${error.message}`);
  return (data ?? []) as AgentMemory[];
}

export async function createMemory(
  agentId: string, content: string, type: string, category: string, confidence: number
): Promise<AgentMemory> {
  const { data, error } = await supabase
    .from("agent_memories")
    .insert({ agent_id: agentId, content, memory_type: type as any, category: category as any, confidence })
    .select("*")
    .single();
  if (error) throw new Error(`Failed to create memory: ${error.message}`);
  return data as AgentMemory;
}

export async function updateMemory(memoryId: string, updates: Partial<Pick<AgentMemory, "content" | "confidence" | "category">>): Promise<AgentMemory> {
  const { data, error } = await supabase.from("agent_memories").update(updates as any).eq("id", memoryId).select("*").single();
  if (error) throw new Error(`Failed to update memory: ${error.message}`);
  return data as AgentMemory;
}

export async function deleteMemory(memoryId: string): Promise<void> {
  const { error } = await supabase.from("agent_memories").delete().eq("id", memoryId);
  if (error) throw new Error(`Failed to delete memory: ${error.message}`);
}

export async function searchMemories(agentId: string, query: string): Promise<AgentMemory[]> {
  const { data, error } = await supabase
    .from("agent_memories")
    .select("*")
    .eq("agent_id", agentId)
    .ilike("content", `%${query}%`)
    .order("confidence", { ascending: false })
    .limit(20);
  if (error) throw new Error(`Failed to search memories: ${error.message}`);
  return (data ?? []) as AgentMemory[];
}

// ─── TASKS ───

export async function getTasks(filters?: { status?: string; assigned_agent_id?: string; created_by_profile?: string }): Promise<Task[]> {
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
  if (filters?.status) query = query.eq("status", filters.status as any);
  if (filters?.assigned_agent_id) query = query.eq("assigned_agent_id", filters.assigned_agent_id);
  if (filters?.created_by_profile) query = query.eq("created_by_profile", filters.created_by_profile);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
  return (data ?? []) as Task[];
}

export async function createTask(task: Partial<Task> & { title: string; assigned_agent_id: string }): Promise<Task> {
  const { data, error } = await supabase.from("tasks").insert(task as any).select("*").single();
  if (error) throw new Error(`Failed to create task: ${error.message}`);
  return data as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase.from("tasks").update(updates as any).eq("id", taskId).select("*").single();
  if (error) throw new Error(`Failed to update task: ${error.message}`);
  return data as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(`Failed to delete task: ${error.message}`);
}

// ─── APPROVALS ───

export async function getApprovals(status?: string): Promise<ApprovalItem[]> {
  let query = supabase.from("approvals").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status as any);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch approvals: ${error.message}`);
  return (data ?? []) as ApprovalItem[];
}

export async function createApproval(approval: Partial<ApprovalItem> & { requesting_agent_id: string; profile_id: string; action_type: string }): Promise<ApprovalItem> {
  const { data, error } = await supabase.from("approvals").insert(approval as any).select("*").single();
  if (error) throw new Error(`Failed to create approval: ${error.message}`);
  return data as ApprovalItem;
}

export async function updateApproval(approvalId: string, status: string): Promise<ApprovalItem> {
  const { data, error } = await supabase.from("approvals").update({ status: status as any }).eq("id", approvalId).select("*").single();
  if (error) throw new Error(`Failed to update approval: ${error.message}`);
  return data as ApprovalItem;
}

// ─── SETTINGS ───

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(`Failed to fetch setting: ${error.message}`);
  return data?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { data: existing } = await supabase.from("settings").select("id").eq("key", key).maybeSingle();
  if (existing) {
    const { error } = await supabase.from("settings").update({ value }).eq("key", key);
    if (error) throw new Error(`Failed to update setting: ${error.message}`);
  } else {
    const { error } = await supabase.from("settings").insert({ key, value });
    if (error) throw new Error(`Failed to insert setting: ${error.message}`);
  }
}

export async function getSettings(keys?: string[]): Promise<Record<string, string>> {
  let query = supabase.from("settings").select("key, value");
  if (keys) query = query.in("key", keys);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch settings: ${error.message}`);
  const result: Record<string, string> = {};
  (data ?? []).forEach(s => { result[s.key] = s.value; });
  return result;
}

// ─── PROJECTS ───

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return (data ?? []).map((r: any) => toProject(r));
}

// ─── TOKEN USAGE ───

export async function logTokenUsage(
  agentId: string, profileId: string, tokensIn: number, tokensOut: number, model: string,
  opts?: { conversationId?: string; messageId?: string; costUsd?: number }
): Promise<void> {
  const { error } = await supabase.from("token_usage_log").insert({
    agent_id: agentId, profile_id: profileId,
    tokens_in: tokensIn, tokens_out: tokensOut, model,
    conversation_id: opts?.conversationId ?? null,
    message_id: opts?.messageId ?? null,
    cost_usd: opts?.costUsd ?? 0,
  });
  if (error) throw new Error(`Failed to log token usage: ${error.message}`);
}

// Export as namespace for convenience
const db = {
  getConversations, getConversation, createConversation, updateConversation, archiveConversation, deleteConversation,
  getMessages, createMessage, updateMessage, deleteMessage,
  getAgents, getAgent, createAgent, updateAgent, updateAgentBudget,
  getAgentMemories, createMemory, updateMemory, deleteMemory, searchMemories,
  getTasks, createTask, updateTask, deleteTask,
  getApprovals, createApproval, updateApproval,
  getSetting, setSetting, getSettings,
  getProjects, logTokenUsage,
};
export default db;
