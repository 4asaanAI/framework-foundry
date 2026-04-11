-- 1. Fix profiles INSERT
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'founder');

-- 2. Fix shared project policies to authenticated only
DROP POLICY IF EXISTS "Anyone can view shared projects" ON public.projects;
CREATE POLICY "Authenticated can view shared projects"
  ON public.projects FOR SELECT TO authenticated
  USING (visibility = 'shared' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Anyone can view shared conversations" ON public.conversations;
CREATE POLICY "Authenticated can view shared conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = conversations.project_id AND p.visibility = 'shared')
  );

DROP POLICY IF EXISTS "Anyone can view shared messages" ON public.messages;
CREATE POLICY "Authenticated can view shared messages"
  ON public.messages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.profile_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = messages.project_id AND p.visibility = 'shared')
  );

DROP POLICY IF EXISTS "Anyone can view shared knowledge" ON public.project_knowledge;
CREATE POLICY "Authenticated can view shared knowledge"
  ON public.project_knowledge FOR SELECT TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = project_knowledge.project_id AND p.visibility = 'shared')
  );

DROP POLICY IF EXISTS "Anyone can view shared knowledge chunks" ON public.project_knowledge_chunks;
CREATE POLICY "Authenticated can view shared knowledge chunks"
  ON public.project_knowledge_chunks FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = project_knowledge_chunks.project_id AND p.visibility = 'shared')
  );

DROP POLICY IF EXISTS "Anyone can view shared project agents" ON public.project_agents;
CREATE POLICY "Authenticated can view shared project agents"
  ON public.project_agents FOR SELECT TO authenticated
  USING (
    added_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = project_agents.project_id AND p.visibility = 'shared')
  );

DROP POLICY IF EXISTS "Anyone can view shared file contents" ON public.file_contents;
CREATE POLICY "Authenticated can view shared file contents"
  ON public.file_contents FOR SELECT TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.project_id = file_contents.project_id AND p.visibility = 'shared')
  );

-- 3. Fix CRM updates log
DROP POLICY IF EXISTS "crm_updates_log_select" ON public.crm_updates_log;
CREATE POLICY "crm_updates_log_select"
  ON public.crm_updates_log FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = crm_updates_log.task_id AND t.created_by_profile = auth.uid())
  );