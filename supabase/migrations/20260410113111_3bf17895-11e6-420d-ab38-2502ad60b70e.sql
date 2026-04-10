
-- 1. PROFILES: Prevent privilege escalation by forcing id = user_id on insert
CREATE OR REPLACE FUNCTION public.enforce_profile_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.id := NEW.user_id;
  -- Strip role on insert — only service role should set roles
  IF TG_OP = 'INSERT' THEN
    NEW.role := 'founder';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_profile_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_id();

-- 2. APPROVAL_QUEUE: Restrict to approver only
DROP POLICY IF EXISTS "approval_queue_select" ON public.approval_queue;
DROP POLICY IF EXISTS "approval_queue_update" ON public.approval_queue;

CREATE POLICY "approval_queue_select" ON public.approval_queue
  FOR SELECT TO authenticated
  USING (approver_id = auth.uid());

CREATE POLICY "approval_queue_update" ON public.approval_queue
  FOR UPDATE TO authenticated
  USING (approver_id = auth.uid());

CREATE POLICY "approval_queue_insert" ON public.approval_queue
  FOR INSERT TO authenticated
  WITH CHECK (approver_id = auth.uid());

-- 3. MESSAGE_ARCHIVES: Restrict to conversation owner
DROP POLICY IF EXISTS "message_archives_select" ON public.message_archives;
DROP POLICY IF EXISTS "message_archives_insert" ON public.message_archives;

CREATE POLICY "message_archives_select" ON public.message_archives
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = message_archives.conversation_id
        AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "message_archives_insert" ON public.message_archives
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = message_archives.conversation_id
        AND c.profile_id = auth.uid()
    )
  );

-- 4. ESCALATIONS: Restrict to task owner/creator
DROP POLICY IF EXISTS "escalations_select" ON public.escalations;
DROP POLICY IF EXISTS "escalations_update" ON public.escalations;
DROP POLICY IF EXISTS "escalations_insert" ON public.escalations;

CREATE POLICY "escalations_select" ON public.escalations
  FOR SELECT TO authenticated
  USING (
    resolved_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = escalations.task_id
        AND t.created_by_profile = auth.uid()
    )
  );

CREATE POLICY "escalations_insert" ON public.escalations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "escalations_update" ON public.escalations
  FOR UPDATE TO authenticated
  USING (resolved_by = auth.uid())
  WITH CHECK (resolved_by = auth.uid());

-- 5. SETTINGS: Restrict writes to admin only
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.settings;

CREATE POLICY "Admin can insert settings" ON public.settings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update settings" ON public.settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. CORE_CONTEXT: Restrict writes to admin/owner
DROP POLICY IF EXISTS "Authenticated users can insert core_context" ON public.core_context;
DROP POLICY IF EXISTS "Authenticated users can update core_context" ON public.core_context;
DROP POLICY IF EXISTS "Authenticated users can delete core_context" ON public.core_context;

CREATE POLICY "Admin can insert core_context" ON public.core_context
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update core_context" ON public.core_context
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete core_context" ON public.core_context
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. DB_HEALTH_LOG: Remove permissive insert
DROP POLICY IF EXISTS "Authenticated users can insert db_health_log" ON public.db_health_log;

CREATE POLICY "Admin can insert db_health_log" ON public.db_health_log
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. FAILED_WRITES: Already admin-scoped, no changes needed

-- 9. CHAT-ATTACHMENTS STORAGE: Fix overly permissive SELECT
DROP POLICY IF EXISTS "Authenticated users can read chat-attachments" ON storage.objects;
DROP POLICY IF EXISTS "chat_attachments_select" ON storage.objects;

CREATE POLICY "Users can read own chat-attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 10. PROJECT-KNOWLEDGE STORAGE: Add policies
CREATE POLICY "pk_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND (p.created_by = auth.uid() OR p.visibility = 'shared')
    )
  );

CREATE POLICY "pk_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "pk_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-knowledge'
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.project_id::text = (storage.foldername(name))[1]
        AND p.created_by = auth.uid()
    )
  );

-- 11. Fix update_updated_at_column search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
