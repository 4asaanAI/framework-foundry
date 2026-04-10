-- Escalations INSERT tightening
DROP POLICY IF EXISTS "escalations_insert" ON public.escalations;
CREATE POLICY "escalations_insert"
  ON public.escalations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_id
        AND t.created_by_profile = auth.uid()
    )
  );

-- Connectors SELECT to owner only
DROP POLICY IF EXISTS "Users can view own connectors" ON public.connectors;
CREATE POLICY "Users can view own connectors"
  ON public.connectors FOR SELECT TO authenticated
  USING (auth.uid() = created_by);