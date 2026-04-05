
-- Tighten agent_skills INSERT
DROP POLICY "Authenticated users can manage agent_skills" ON public.agent_skills;
CREATE POLICY "Agent creators can manage agent_skills" ON public.agent_skills FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.created_by = auth.uid()));

DROP POLICY "Authenticated users can delete agent_skills" ON public.agent_skills;
CREATE POLICY "Agent creators can delete agent_skills" ON public.agent_skills FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.created_by = auth.uid()));

-- Tighten project_agents INSERT
DROP POLICY "Authenticated users can manage project_agents" ON public.project_agents;
CREATE POLICY "Project creators can manage project_agents" ON public.project_agents FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.created_by = auth.uid()));

-- Tighten agent_memories INSERT/UPDATE
DROP POLICY "Authenticated users can insert memories" ON public.agent_memories;
CREATE POLICY "Agent creators can insert memories" ON public.agent_memories FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.created_by = auth.uid()));

DROP POLICY "Authenticated users can update memories" ON public.agent_memories;
CREATE POLICY "Agent creators can update memories" ON public.agent_memories FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_id AND a.created_by = auth.uid()));
