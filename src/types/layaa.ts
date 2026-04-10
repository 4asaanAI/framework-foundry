// Layaa OS Type Definitions

export type Team =
  | "founders_office"
  | "marketing"
  | "revenue"
  | "delivery"
  | "support"
  | "product"
  | "system";

export type AgentStatus =
  | "idle"
  | "thinking"
  | "error"
  | "awaiting_approval"
  | "budget_exhausted";

export type MessageRole = "user" | "agent" | "mention_response" | "tool_result";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "timeout";

export type TaskStatus = "pending" | "running" | "completed" | "failed" | "awaiting_approval";

export type ConversationStatus = "active" | "budget_exhausted" | "archived";

export type NotificationCategory = "budget" | "health" | "task" | "approval" | "system";

export type MemoryType = "personal" | "shared";

export type MemoryCategory =
  | "client_info"
  | "decision"
  | "market_data"
  | "process"
  | "preference"
  | "company"
  | "conversation_handoff";

export interface Agent {
  id: string;
  name: string;
  canonical_role: string;
  team: Team;
  system_prompt: string;
  prompt_version: number;
  default_model: string;
  llm_provider: string;
  budget_tokens: number;
  budget_used: number;
  budget_loaned: number;
  status: AgentStatus;
  avatar_initials: string;
  avatar_color: string;
  description: string;
  is_active: boolean;
}

export interface Conversation {
  id: string;
  profile_id: string;
  agent_id: string;
  agent?: Agent;
  project_id?: string;
  title: string;
  model_used: string;
  status: ConversationStatus;
  is_archived: boolean;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  mention_agent_id?: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  response_time_ms: number;
  rating?: number;
  is_pinned: boolean;
  created_at: string;
}

export interface AgentMemory {
  id: string;
  agent_id: string;
  memory_type: MemoryType;
  category: MemoryCategory;
  content: string;
  confidence: number;
  is_compressed: boolean;
  created_at: string;
}

export interface Project {
  project_id: string;
  /** Alias for project_id — used throughout UI code */
  get id(): string;
  name: string;
  description: string | null;
  instructions: string | null;
  created_by: string | null;
  visibility: string | null;
  is_archived: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Map a raw DB project row to our Project interface (adds `id` alias) */
export function toProject(row: Record<string, unknown>): Project {
  const r = row as any;
  return {
    ...r,
    get id() { return r.project_id; },
  } as Project;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_agent_id: string;
  assigned_agent?: Agent;
  created_by_agent_id: string;
  created_by_profile: string;
  project_id?: string;
  status: TaskStatus;
  is_recurring: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalItem {
  id: string;
  requesting_agent_id: string;
  requesting_agent?: Agent;
  action_type: string;
  action_description: string;
  action_payload: Record<string, unknown>;
  status: ApprovalStatus;
  conversation_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  body: string;
  source_agent_id?: string;
  category: NotificationCategory;
  is_read: boolean;
  action_url?: string;
  created: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger_keywords: string[];
  plugin: string;
  is_active: boolean;
}
