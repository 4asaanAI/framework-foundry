// Database abstraction types — database-agnostic interfaces

export interface Conversation {
  id: string;
  agent_id: string;
  profile_id: string;
  title: string;
  project_id: string | null;
  branch_parent_id: string | null;
  branch_label: string | null;
  is_starred: boolean;
  is_archived: boolean;
  status: string;
  model_used: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "agent" | "mention_response" | "tool_result";
  content: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  response_time_ms: number;
  attachments: any[];
  is_pinned: boolean;
  rating: number | null;
  mention_agent_id: string | null;
  parent_message_id: string | null;
  branch_index: number | null;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  canonical_role: string;
  team: string;
  description: string;
  system_prompt: string;
  default_model: string;
  llm_provider: string;
  custom_api_key: string | null;
  custom_api_base_url: string | null;
  avatar_initials: string;
  avatar_color: string;
  is_active: boolean;
  status: string;
  budget_tokens: number;
  budget_used: number;
  budget_loaned: number;
  budget_period_start: string | null;
  prompt_version: number;
  prompt_history: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentMemory {
  id: string;
  agent_id: string;
  content: string;
  memory_type: string;
  category: string;
  confidence: number;
  is_compressed: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_agent_id: string;
  created_by_profile: string | null;
  created_by_agent_id: string | null;
  status: string;
  due_date: string | null;
  is_recurring: boolean;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApprovalItem {
  id: string;
  requesting_agent_id: string;
  profile_id: string;
  action_type: string;
  action_description: string;
  action_payload: any;
  status: string;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  project_id: string;
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  visibility: string | null;
  is_archived: boolean | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}
