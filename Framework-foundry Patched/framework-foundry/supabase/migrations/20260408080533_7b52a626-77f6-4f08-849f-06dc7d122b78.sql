-- 1. failed_writes — offline retry queue
CREATE TABLE public.failed_writes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT NOT NULL DEFAULT '',
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.failed_writes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view failed_writes" ON public.failed_writes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert failed_writes" ON public.failed_writes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update failed_writes" ON public.failed_writes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete failed_writes" ON public.failed_writes FOR DELETE TO authenticated USING (true);

-- 2. message_archives — compressed message storage
CREATE TABLE public.message_archives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  compressed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.message_archives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view message_archives" ON public.message_archives FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert message_archives" ON public.message_archives FOR INSERT TO authenticated WITH CHECK (true);

-- 3. message_annotations — comment layer on messages
CREATE TABLE public.message_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.message_annotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view annotations" ON public.message_annotations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own annotations" ON public.message_annotations FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own annotations" ON public.message_annotations FOR UPDATE TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own annotations" ON public.message_annotations FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- 4. db_health_log — Kaiser health monitoring
CREATE TABLE public.db_health_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  db_size_mb NUMERIC NOT NULL DEFAULT 0,
  db_capacity_mb NUMERIC NOT NULL DEFAULT 0,
  occupancy_pct NUMERIC NOT NULL DEFAULT 0,
  action_taken TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.db_health_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view db_health_log" ON public.db_health_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert db_health_log" ON public.db_health_log FOR INSERT TO authenticated WITH CHECK (true);