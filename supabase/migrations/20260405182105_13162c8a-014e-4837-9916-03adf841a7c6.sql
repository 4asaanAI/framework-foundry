-- Add custom LLM API key and base URL per agent
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS custom_api_key text DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_api_base_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS budget_period_start timestamp with time zone DEFAULT now();

-- Create token usage log for analytics
CREATE TABLE IF NOT EXISTS public.token_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  conversation_id uuid,
  message_id uuid,
  profile_id uuid NOT NULL,
  model text NOT NULL DEFAULT '',
  tokens_in integer NOT NULL DEFAULT 0,
  tokens_out integer NOT NULL DEFAULT 0,
  cost_usd numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.token_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON public.token_usage_log FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own usage logs"
  ON public.token_usage_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX idx_usage_log_agent ON public.token_usage_log(agent_id);
CREATE INDEX idx_usage_log_profile ON public.token_usage_log(profile_id);
CREATE INDEX idx_usage_log_created ON public.token_usage_log(created_at);