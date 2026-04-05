-- 1. Settings table (key-value store)
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view settings" ON public.settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert settings" ON public.settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update settings" ON public.settings FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Core context (company docs for all agents)
CREATE TABLE public.core_context (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  context_key text NOT NULL,
  content text NOT NULL DEFAULT '',
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.core_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view core_context" ON public.core_context FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert core_context" ON public.core_context FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update core_context" ON public.core_context FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete core_context" ON public.core_context FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_core_context_updated_at BEFORE UPDATE ON public.core_context FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Project knowledge base files
CREATE TABLE public.project_kbs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  content text NOT NULL DEFAULT '',
  file_size integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_kbs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view project_kbs" ON public.project_kbs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert project_kbs" ON public.project_kbs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update project_kbs" ON public.project_kbs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete project_kbs" ON public.project_kbs FOR DELETE TO authenticated USING (true);

-- 4. Chunked KB for retrieval
CREATE TABLE public.project_kb_chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_kb_id uuid NOT NULL REFERENCES public.project_kbs(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL DEFAULT 0,
  content text NOT NULL DEFAULT '',
  keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_kb_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view project_kb_chunks" ON public.project_kb_chunks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert project_kb_chunks" ON public.project_kb_chunks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete project_kb_chunks" ON public.project_kb_chunks FOR DELETE TO authenticated USING (true);

-- 5. Credential vault (metadata only)
CREATE TABLE public.credential_vault (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  provider text NOT NULL DEFAULT '',
  is_configured boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credential_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view credential_vault" ON public.credential_vault FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert credential_vault" ON public.credential_vault FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own credential_vault" ON public.credential_vault FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own credential_vault" ON public.credential_vault FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE TRIGGER update_credential_vault_updated_at BEFORE UPDATE ON public.credential_vault FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Plugins (meta-skill groups)
CREATE TABLE public.plugins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  context text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view plugins" ON public.plugins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert plugins" ON public.plugins FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own plugins" ON public.plugins FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own plugins" ON public.plugins FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE TRIGGER update_plugins_updated_at BEFORE UPDATE ON public.plugins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. References (reference documents)
CREATE TABLE public.references (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  content text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view references" ON public.references FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert references" ON public.references FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own references" ON public.references FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own references" ON public.references FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE TRIGGER update_references_updated_at BEFORE UPDATE ON public.references FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. LLM Providers
CREATE TABLE public.llm_providers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  provider_key text NOT NULL DEFAULT '',
  models jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.llm_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view llm_providers" ON public.llm_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert llm_providers" ON public.llm_providers FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own llm_providers" ON public.llm_providers FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own llm_providers" ON public.llm_providers FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE TRIGGER update_llm_providers_updated_at BEFORE UPDATE ON public.llm_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();