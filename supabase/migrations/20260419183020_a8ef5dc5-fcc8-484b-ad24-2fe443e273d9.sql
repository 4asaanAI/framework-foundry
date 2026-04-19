
-- Fix 1: Restrict approvals UPDATE to the designated approver only
DROP POLICY IF EXISTS "all_authenticated_update_approvals" ON public.approvals;
CREATE POLICY "owner_update_approvals"
ON public.approvals FOR UPDATE TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

-- Fix 2: Restrict agents SELECT so credentials aren't readable by every authenticated user.
-- Owner (created_by) and admins keep full read; others get a view without secret columns.
DROP POLICY IF EXISTS "all_authenticated_select_agents" ON public.agents;
CREATE POLICY "owner_or_admin_select_agents_full"
ON public.agents FOR SELECT TO authenticated
USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Public-safe view exposing all non-secret agent columns to all authenticated users.
CREATE OR REPLACE VIEW public.agents_public
WITH (security_invoker = true)
AS
SELECT
  id, name, canonical_role, team, system_prompt, prompt_version,
  default_model, llm_provider, budget_tokens, budget_used, budget_loaned,
  status, avatar_initials, avatar_color, description, is_active,
  created_by, created_at, updated_at, prompt_history,
  budget_period_start, custom_api_base_url
FROM public.agents;

GRANT SELECT ON public.agents_public TO authenticated;

-- Fix 3: Public bucket listing — restrict 'avatars' SELECT to per-user folder
-- (objects can still be fetched by URL since the bucket is public, but listing is locked down).
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'avatars_owner_list'
  ) THEN
    CREATE POLICY "avatars_owner_list"
    ON storage.objects FOR SELECT TO authenticated
    USING (
      bucket_id = 'avatars'
      AND (auth.uid()::text = (storage.foldername(name))[1])
    );
  END IF;
END $$;
