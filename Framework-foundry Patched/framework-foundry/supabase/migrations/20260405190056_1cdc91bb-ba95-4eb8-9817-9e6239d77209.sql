
-- Direct messages between founders
CREATE TABLE public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DMs"
ON public.direct_messages FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send DMs"
ON public.direct_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark DMs as read"
ON public.direct_messages FOR UPDATE TO authenticated
USING (auth.uid() = receiver_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- Agent knowledge base files
CREATE TABLE public.agent_kbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  file_size INTEGER NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL DEFAULT 'text/plain',
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_kbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view agent_kbs"
ON public.agent_kbs FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Agent creators can insert agent_kbs"
ON public.agent_kbs FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM agents a WHERE a.id = agent_kbs.agent_id AND a.created_by = auth.uid()));

CREATE POLICY "Agent creators can delete agent_kbs"
ON public.agent_kbs FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM agents a WHERE a.id = agent_kbs.agent_id AND a.created_by = auth.uid()));
