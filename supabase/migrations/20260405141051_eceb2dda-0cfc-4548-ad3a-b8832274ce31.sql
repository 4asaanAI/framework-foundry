
-- audit_log table
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_type text NOT NULL DEFAULT 'user',
  actor_id text NOT NULL DEFAULT '',
  action text NOT NULL DEFAULT '',
  target_table text NOT NULL DEFAULT '',
  target_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit_log"
ON public.audit_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert audit_log"
ON public.audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Add prompt_history to agents
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS prompt_history jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add attachments to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false);

CREATE POLICY "Authenticated users can upload chat attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can view chat attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can delete own chat attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-attachments');
