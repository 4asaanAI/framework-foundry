-- Step 1: Update profiles to reference new auth user IDs
-- Abhimanyu: old user_id 3154a475... → new user_id 374a1c35...
UPDATE public.profiles 
SET user_id = '374a1c35-e114-4217-bd97-746c7c415c18'
WHERE user_id = '3154a475-1926-4132-85ba-6f62c94085b4';

-- Shubham: old user_id 171ba2be... → new user_id 093c5b25...
UPDATE public.profiles 
SET user_id = '093c5b25-1829-48bf-8c15-5064bf557fbf'
WHERE user_id = '171ba2be-d2d2-4e59-b980-d6b8f3af664b';

-- Step 2: Make agents readable by ALL authenticated users (both admins need to see all 22 agents)
DROP POLICY IF EXISTS "owner_or_admin_select_agents" ON public.agents;
CREATE POLICY "all_authenticated_select_agents" 
ON public.agents FOR SELECT TO authenticated 
USING (true);

-- Step 3: Make profiles readable by ALL authenticated users (both founders see each other)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "all_authenticated_select_profiles" 
ON public.profiles FOR SELECT TO authenticated 
USING (true);

-- Allow profile update by user_id match (keep existing but also ensure it works)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "users_update_own_profile" 
ON public.profiles FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- Allow profile insert with user_id match  
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
CREATE POLICY "users_insert_own_profile" 
ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Step 4: Allow all authenticated users to insert notifications (agents can notify either founder)
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "all_authenticated_insert_notifications" 
ON public.notifications FOR INSERT TO authenticated 
WITH CHECK (true);

-- Step 5: Allow all authenticated to read/insert skills (needed for seeding)
CREATE POLICY "all_authenticated_select_skills" 
ON public.skills FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "all_authenticated_insert_skills" 
ON public.skills FOR INSERT TO authenticated 
WITH CHECK (true);

-- Step 6: Allow authenticated users to insert agents (needed since both are admins managing agents)
DROP POLICY IF EXISTS "Authenticated users can insert agents" ON public.agents;
CREATE POLICY "all_authenticated_insert_agents" 
ON public.agents FOR INSERT TO authenticated 
WITH CHECK (true);

-- Step 7: Allow all authenticated to view/insert tasks (both admins manage all tasks)
DROP POLICY IF EXISTS "tasks_select" ON public.tasks;
CREATE POLICY "all_authenticated_select_tasks" 
ON public.tasks FOR SELECT TO authenticated 
USING (true);

DROP POLICY IF EXISTS "tasks_insert" ON public.tasks;
CREATE POLICY "all_authenticated_insert_tasks" 
ON public.tasks FOR INSERT TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "tasks_update" ON public.tasks;
CREATE POLICY "all_authenticated_update_tasks" 
ON public.tasks FOR UPDATE TO authenticated 
USING (true);

-- Step 8: Allow both admins to view all approvals
DROP POLICY IF EXISTS "Users can view own approvals" ON public.approvals;
CREATE POLICY "all_authenticated_select_approvals"
ON public.approvals FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert approvals" ON public.approvals;
CREATE POLICY "all_authenticated_insert_approvals"
ON public.approvals FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own approvals" ON public.approvals;
CREATE POLICY "all_authenticated_update_approvals"
ON public.approvals FOR UPDATE TO authenticated
USING (true);

-- Step 9: Allow all authenticated to read all conversations (shared platform)
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated can view shared conversations" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "all_authenticated_select_conversations"
ON public.conversations FOR SELECT TO authenticated
USING (true);

-- Step 10: Allow all authenticated to read messages
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Authenticated can view shared messages" ON public.messages;
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "all_authenticated_select_messages"
ON public.messages FOR SELECT TO authenticated
USING (true);

-- Step 11: Allow all authenticated to view notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "all_authenticated_select_notifications"
ON public.notifications FOR SELECT TO authenticated
USING (true);