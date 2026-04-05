-- Allow any authenticated user to update tasks (for CRM board drag-drop)
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Authenticated users can update tasks"
ON public.tasks FOR UPDATE TO authenticated
USING (true);

-- Allow any authenticated user to delete tasks
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Authenticated users can delete tasks"
ON public.tasks FOR DELETE TO authenticated
USING (true);

-- Allow authenticated users to insert approvals (for agent-generated approvals)
CREATE POLICY "Authenticated users can insert approvals"
ON public.approvals FOR INSERT TO authenticated
WITH CHECK (auth.uid() = profile_id);

-- Allow authenticated users to insert notifications (for system notifications)
CREATE POLICY "Authenticated users can insert notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = profile_id);