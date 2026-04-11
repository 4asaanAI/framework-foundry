import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LLMConfig } from "@/lib/llm";

const LLM_SETTING_KEYS = ["llm_provider", "llm_model", "llm_api_key", "llm_base_url"];

export function useLLMConfig() {
  return useQuery({
    queryKey: ["llm-config"],
    queryFn: async (): Promise<LLMConfig> => {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", LLM_SETTING_KEYS);
      if (error) throw error;

      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => { map[r.key] = r.value; });

      return {
        provider: map["llm_provider"] || "lovable",
        model: map["llm_model"] || "google/gemini-3-flash-preview",
        apiKey: map["llm_api_key"] || "",
        baseUrl: map["llm_base_url"] || "",
      };
    },
  });
}

export function useSaveLLMConfig() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (config: LLMConfig) => {
      const pairs = [
        { key: "llm_provider", value: config.provider },
        { key: "llm_model", value: config.model },
        { key: "llm_api_key", value: config.apiKey },
        { key: "llm_base_url", value: config.baseUrl },
      ];
      for (const p of pairs) {
        const { data: existing } = await supabase
          .from("settings")
          .select("id")
          .eq("key", p.key)
          .maybeSingle();
        if (existing) {
          await supabase.from("settings").update({ value: p.value }).eq("key", p.key);
        } else {
          await supabase.from("settings").insert({ key: p.key, value: p.value });
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["llm-config"] }),
  });
}
