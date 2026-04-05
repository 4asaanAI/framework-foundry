
-- Enums
CREATE TYPE public.team_type AS ENUM ('founders_office', 'marketing', 'revenue', 'delivery', 'support', 'product', 'system');
CREATE TYPE public.agent_status AS ENUM ('idle', 'thinking', 'error', 'awaiting_approval', 'budget_exhausted');
CREATE TYPE public.message_role AS ENUM ('user', 'agent', 'mention_response', 'tool_result');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'timeout');
CREATE TYPE public.task_status AS ENUM ('pending', 'running', 'completed', 'failed', 'awaiting_approval');
CREATE TYPE public.conversation_status AS ENUM ('active', 'budget_exhausted', 'archived');
CREATE TYPE public.notification_category AS ENUM ('budget', 'health', 'task', 'approval', 'system');
CREATE TYPE public.memory_type AS ENUM ('personal', 'shared');
CREATE TYPE public.memory_category AS ENUM ('client_info', 'decision', 'market_data', 'process', 'preference', 'company', 'conversation_handoff');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'founder',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Agents
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  canonical_role TEXT NOT NULL,
  team team_type NOT NULL,
  system_prompt TEXT NOT NULL DEFAULT '',
  prompt_version INTEGER NOT NULL DEFAULT 1,
  default_model TEXT NOT NULL DEFAULT 'gpt-5-mini',
  llm_provider TEXT NOT NULL DEFAULT 'openai',
  budget_tokens INTEGER NOT NULL DEFAULT 100000,
  budget_used INTEGER NOT NULL DEFAULT 0,
  budget_loaned INTEGER NOT NULL DEFAULT 0,
  status agent_status NOT NULL DEFAULT 'idle',
  avatar_initials TEXT NOT NULL DEFAULT 'AI',
  avatar_color TEXT NOT NULL DEFAULT '#10B981',
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view agents" ON public.agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert agents" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can update agents" ON public.agents FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  trigger_keywords TEXT[] NOT NULL DEFAULT '{}',
  plugin TEXT NOT NULL DEFAULT '',
  sub_skills JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view skills" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can update skills" ON public.skills FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can delete skills" ON public.skills FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Agent Skills (many-to-many)
CREATE TABLE public.agent_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(agent_id, skill_id)
);
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view agent_skills" ON public.agent_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage agent_skills" ON public.agent_skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete agent_skills" ON public.agent_skills FOR DELETE TO authenticated USING (true);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Project Agents (many-to-many)
CREATE TABLE public.project_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, agent_id)
);
ALTER TABLE public.project_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view project_agents" ON public.project_agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage project_agents" ON public.project_agents FOR INSERT TO authenticated WITH CHECK (true);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  model_used TEXT NOT NULL DEFAULT 'gpt-5-mini',
  status conversation_status NOT NULL DEFAULT 'active',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  mention_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  model TEXT NOT NULL DEFAULT '',
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  rating INTEGER,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.profile_id = auth.uid()));
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.profile_id = auth.uid()));
CREATE POLICY "Users can update messages in own conversations" ON public.messages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.profile_id = auth.uid()));

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assigned_agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  created_by_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  created_by_profile UUID,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  status task_status NOT NULL DEFAULT 'pending',
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT TO authenticated USING (auth.uid() = created_by_profile);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by_profile);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = created_by_profile);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = created_by_profile);

-- Approvals
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL DEFAULT '',
  action_payload JSONB NOT NULL DEFAULT '{}',
  status approval_status NOT NULL DEFAULT 'pending',
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own approvals" ON public.approvals FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own approvals" ON public.approvals FOR UPDATE TO authenticated USING (auth.uid() = profile_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  source_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  category notification_category NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = profile_id);

-- Agent Memories
CREATE TABLE public.agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  memory_type memory_type NOT NULL DEFAULT 'personal',
  category memory_category NOT NULL DEFAULT 'preference',
  content TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.80,
  is_compressed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view memories" ON public.agent_memories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert memories" ON public.agent_memories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update memories" ON public.agent_memories FOR UPDATE TO authenticated USING (true);

-- Connectors (MCP, plugins, integrations)
CREATE TABLE public.connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'mcp',
  description TEXT NOT NULL DEFAULT '',
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view connectors" ON public.connectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert connectors" ON public.connectors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own connectors" ON public.connectors FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own connectors" ON public.connectors FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON public.approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_connectors_updated_at BEFORE UPDATE ON public.connectors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
