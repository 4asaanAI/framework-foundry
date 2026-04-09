
-- Add approval_messages jsonb to approvals for clarification threads
ALTER TABLE public.approvals ADD COLUMN IF NOT EXISTS approval_messages jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Create escalations table
CREATE TABLE IF NOT EXISTS public.escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  profile_id uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  conversation_context jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  resolved_by uuid,
  feedback text,
  approval_id uuid REFERENCES public.approvals(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own escalations" ON public.escalations FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert escalations" ON public.escalations FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own escalations" ON public.escalations FOR UPDATE TO authenticated USING (auth.uid() = profile_id);
