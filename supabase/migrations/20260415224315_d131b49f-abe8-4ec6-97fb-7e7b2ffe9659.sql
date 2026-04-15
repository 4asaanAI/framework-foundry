
DROP POLICY "Authenticated users can delete skills" ON public.skills;
CREATE POLICY "Authenticated users can delete skills"
ON public.skills
FOR DELETE
TO authenticated
USING (true);
