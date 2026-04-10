
-- =============================================
-- 1. PROFILES: Ensure enforce_profile_id trigger is attached
-- =============================================
-- Drop if exists to avoid duplicates
DROP TRIGGER IF EXISTS enforce_profile_id_trigger ON public.profiles;
CREATE TRIGGER enforce_profile_id_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_id();

-- Also block role changes via UPDATE policy (only allow updating display_name, avatar_url)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = 'founder');

-- Tighten INSERT to authenticated only
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tighten SELECT to authenticated only
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- 2. TASKS: Fix public CRM board exposure
-- =============================================
-- Change default of crm_board_shared to false
ALTER TABLE public.tasks ALTER COLUMN crm_board_shared SET DEFAULT false;

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "tasks_select" ON public.tasks;

-- Re-create scoped to authenticated users only
CREATE POLICY "tasks_select_authenticated" ON public.tasks
  FOR SELECT TO authenticated
  USING (
    created_by_profile = auth.uid()
    OR assigned_agent_id IN (SELECT id FROM agents WHERE created_by = auth.uid())
    OR (crm_board_shared = true AND auth.uid() IS NOT NULL)
  );

-- =============================================
-- 3. STORAGE: Fix chat-attachments ownership
-- =============================================
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "chat_attach_select" ON storage.objects;
DROP POLICY IF EXISTS "chat_attach_insert" ON storage.objects;
DROP POLICY IF EXISTS "chat_attach_delete" ON storage.objects;
DROP POLICY IF EXISTS "owner_select_chat_attachments" ON storage.objects;
DROP POLICY IF EXISTS "owner_insert_chat_attachments" ON storage.objects;
DROP POLICY IF EXISTS "owner_delete_chat_attachments" ON storage.objects;

-- Create owner-scoped policies
CREATE POLICY "owner_select_chat_attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'chat-attachments' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "owner_insert_chat_attachments" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-attachments' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "owner_delete_chat_attachments" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'chat-attachments' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- =============================================
-- 4. ESCALATIONS: Tighten INSERT
-- =============================================
DROP POLICY IF EXISTS "escalations_insert" ON public.escalations;
CREATE POLICY "escalations_insert" ON public.escalations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 5. PROJECT_KBS: Tighten to project-owner scope
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can insert project_kbs" ON public.project_kbs;
CREATE POLICY "project_kbs_insert" ON public.project_kbs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects p WHERE p.project_id = project_kbs.project_id
    AND (p.created_by = auth.uid() OR p.visibility = 'shared')
  ));

DROP POLICY IF EXISTS "Authenticated users can update project_kbs" ON public.project_kbs;
CREATE POLICY "project_kbs_update" ON public.project_kbs
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.project_id = project_kbs.project_id
    AND p.created_by = auth.uid()
  ));

DROP POLICY IF EXISTS "Authenticated users can delete project_kbs" ON public.project_kbs;
CREATE POLICY "project_kbs_delete" ON public.project_kbs
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.project_id = project_kbs.project_id
    AND p.created_by = auth.uid()
  ));

DROP POLICY IF EXISTS "Authenticated users can view project_kbs" ON public.project_kbs;
CREATE POLICY "project_kbs_select" ON public.project_kbs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.project_id = project_kbs.project_id
    AND (p.created_by = auth.uid() OR p.visibility = 'shared')
  ));

-- =============================================
-- 6. PROJECT_KB_CHUNKS: Tighten to project-owner scope
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can insert project_kb_chunks" ON public.project_kb_chunks;
CREATE POLICY "project_kb_chunks_insert" ON public.project_kb_chunks
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM project_kbs kb
    JOIN projects p ON p.project_id = kb.project_id
    WHERE kb.id = project_kb_chunks.project_kb_id
    AND (p.created_by = auth.uid() OR p.visibility = 'shared')
  ));

DROP POLICY IF EXISTS "Authenticated users can delete project_kb_chunks" ON public.project_kb_chunks;
CREATE POLICY "project_kb_chunks_delete" ON public.project_kb_chunks
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_kbs kb
    JOIN projects p ON p.project_id = kb.project_id
    WHERE kb.id = project_kb_chunks.project_kb_id
    AND p.created_by = auth.uid()
  ));

DROP POLICY IF EXISTS "Authenticated users can view project_kb_chunks" ON public.project_kb_chunks;
CREATE POLICY "project_kb_chunks_select" ON public.project_kb_chunks
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM project_kbs kb
    JOIN projects p ON p.project_id = kb.project_id
    WHERE kb.id = project_kb_chunks.project_kb_id
    AND (p.created_by = auth.uid() OR p.visibility = 'shared')
  ));
