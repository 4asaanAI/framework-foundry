-- Auto-recompute agent.status whenever budget fields change
CREATE OR REPLACE FUNCTION public.recompute_agent_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  available integer;
BEGIN
  available := COALESCE(NEW.budget_tokens, 0) + COALESCE(NEW.budget_loaned, 0);

  -- If budget recovered and agent was marked exhausted, flip back to idle
  IF NEW.status = 'budget_exhausted' AND COALESCE(NEW.budget_used, 0) < available THEN
    NEW.status := 'idle';
  END IF;

  -- If budget actually exhausted, flip to budget_exhausted (unless mid-thinking/error/awaiting)
  IF COALESCE(NEW.budget_used, 0) >= available
     AND NEW.status NOT IN ('thinking', 'error', 'awaiting_approval', 'budget_exhausted') THEN
    NEW.status := 'budget_exhausted';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_recompute_agent_status ON public.agents;
CREATE TRIGGER trg_recompute_agent_status
BEFORE UPDATE OF budget_tokens, budget_used, budget_loaned, status ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.recompute_agent_status();

-- One-time fix: recover any agent whose budget already recovered
UPDATE public.agents
SET status = 'idle'
WHERE status = 'budget_exhausted'
  AND budget_used < (budget_tokens + budget_loaned);