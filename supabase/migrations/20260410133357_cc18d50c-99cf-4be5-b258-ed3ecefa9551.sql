
-- 1. Fix profiles privilege escalation: remove the duplicate unrestricted INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 2. Fix message_annotations SELECT: restrict to owner only
DROP POLICY IF EXISTS "Authenticated users can view annotations" ON public.message_annotations;
CREATE POLICY "Users can view own annotations"
  ON public.message_annotations FOR SELECT TO authenticated
  USING (auth.uid() = profile_id);

-- 3. Fix project-knowledge storage policies (foldername bug)
DROP POLICY IF EXISTS "pk_insert" ON storage.objects;
CREATE POLICY "pk_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND p.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "pk_delete" ON storage.objects;
CREATE POLICY "pk_delete" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND p.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "pk_select" ON storage.objects;
CREATE POLICY "pk_select" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND (p.created_by = auth.uid() OR p.visibility = 'shared')
    )
  );

-- 4. Fix project_agents DELETE: restrict to project owner only
DROP POLICY IF EXISTS "project_agents_delete" ON public.project_agents;
CREATE POLICY "project_agents_delete"
  ON public.project_agents FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.project_id = project_agents.project_id
        AND p.created_by = auth.uid()
    )
  );
