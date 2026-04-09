// src/components/views/SageView.tsx — Sage Manual Memory Extraction UI

import { useState, useEffect, useCallback } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useAgentMemories } from "@/hooks/use-agent-memories";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { MOCK_AGENTS } from "@/constants/agents";
import {
  extractMemoriesFromConversation,
  saveExtractedMemories,
  type ExtractedMemory,
} from "@/lib/memory";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  Play,
  Save,
  CheckCircle2,
  Clock,
  Loader2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_EXTRACTION_KEY = "sage_auto_extraction_enabled";
const LAST_EXTRACTION_KEY = "sage_last_extraction_ts";
const EXTRACTION_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

const CATEGORY_COLORS: Record<string, string> = {
  decision: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  client_info: "bg-green-500/20 text-green-300 border-green-500/30",
  market_data: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  process: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  preference: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  company: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  conversation_handoff: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export function SageView() {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const queryClient = useQueryClient();

  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [extractedMemories, setExtractedMemories] = useState<(ExtractedMemory & { selected: boolean })[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTs, setLastRefreshTs] = useState<string | null>(() =>
    localStorage.getItem("sage_last_refresh_ts")
  );
  const [autoExtraction, setAutoExtraction] = useState(() => {
    return localStorage.getItem(AUTO_EXTRACTION_KEY) === "true";
  });

  const { data: existingMemories } = useAgentMemories(selectedAgentId || undefined);
  const { data: conversations } = useConversations();

  // Pick first conversation for the selected agent to load messages
  const firstConvoId = conversations?.[0]?.id;
  const { data: messages } = useMessages(firstConvoId || "");

  // ── Auto-extraction timer ───────────────────────────────────
  useEffect(() => {
    if (!autoExtraction) return;

    const runAutoExtraction = async () => {
      const lastRun = parseInt(localStorage.getItem(LAST_EXTRACTION_KEY) || "0", 10);
      const now = Date.now();
      if (now - lastRun < EXTRACTION_INTERVAL_MS) return;

      // Process all agents
      for (const agent of agents) {
        if (!agent.id) continue;
        try {
          const { data: convos } = await (await import("@/integrations/supabase/client")).supabase
            .from("conversations")
            .select("id")
            .eq("agent_id", agent.id)
            .gte("updated_at", new Date(lastRun).toISOString());

          if (!convos || convos.length === 0) continue;

          for (const convo of convos) {
            const { data: msgs } = await (await import("@/integrations/supabase/client")).supabase
              .from("messages")
              .select("*")
              .eq("conversation_id", convo.id)
              .order("created_at", { ascending: true });

            if (!msgs || msgs.length === 0) continue;
            const memories = extractMemoriesFromConversation(msgs);
            if (memories.length > 0) {
              await saveExtractedMemories(agent.id, memories);
            }
          }
        } catch (err) {
          console.error(`[Sage Auto] Error processing agent ${agent.name}:`, err);
        }
      }

      localStorage.setItem(LAST_EXTRACTION_KEY, now.toString());
      toast.success("Sage auto-extraction completed");
    };

    // Run immediately on mount (if enough time has passed)
    runAutoExtraction();

    // Then set interval
    const interval = setInterval(runAutoExtraction, EXTRACTION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [autoExtraction, agents]);

  // ── Manual extraction ───────────────────────────────────────
  const handleExtract = useCallback(async () => {
    if (!selectedAgentId || !messages || messages.length === 0) {
      toast.error("Select an agent with conversation history first");
      return;
    }

    setExtracting(true);
    try {
      const results = extractMemoriesFromConversation(messages);
      setExtractedMemories(results.map((m) => ({ ...m, selected: true })));
      if (results.length === 0) {
        toast.info("No memories found in this conversation");
      } else {
        toast.success(`Found ${results.length} potential memories`);
      }
    } catch (err) {
      console.error("[Sage] Extraction error:", err);
      toast.error("Extraction failed");
    } finally {
      setExtracting(false);
    }
  }, [selectedAgentId, messages]);

  // ── Save selected memories ──────────────────────────────────
  const handleSave = useCallback(async () => {
    const selected = extractedMemories.filter((m) => m.selected);
    if (selected.length === 0) {
      toast.error("No memories selected");
      return;
    }

    setSaving(true);
    try {
      const count = await saveExtractedMemories(selectedAgentId, selected);
      toast.success(`Saved ${count} memories`);
      setExtractedMemories([]);
      queryClient.invalidateQueries({ queryKey: ["agent_memories", selectedAgentId] });
    } catch {
      toast.error("Failed to save memories");
    } finally {
      setSaving(false);
    }
  }, [extractedMemories, selectedAgentId, queryClient]);

  const toggleAutoExtraction = () => {
    const next = !autoExtraction;
    setAutoExtraction(next);
    localStorage.setItem(AUTO_EXTRACTION_KEY, next.toString());
    toast.success(next ? "Auto-extraction enabled (every 12h)" : "Auto-extraction disabled");
  };

  // ── Memory Refresh (all agents) ─────────────────────────────
  const handleRefreshMemory = useCallback(async () => {
    setRefreshing(true);
    let totalExtracted = 0;
    let totalArchived = 0;
    try {
      for (const agent of agents) {
        if (!agent.id) continue;
        const { data: convos } = await (await import("@/integrations/supabase/client")).supabase
          .from("conversations")
          .select("id")
          .eq("agent_id", agent.id)
          .limit(5)
          .order("updated_at", { ascending: false });

        if (!convos || convos.length === 0) continue;

        for (const convo of convos) {
          const { data: msgs } = await (await import("@/integrations/supabase/client")).supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convo.id)
            .order("created_at", { ascending: true })
            .limit(100);

          if (!msgs || msgs.length === 0) continue;
          const memories = extractMemoriesFromConversation(msgs);
          if (memories.length > 0) {
            await saveExtractedMemories(agent.id, memories);
            totalExtracted += memories.length;
          }
        }
      }
      const now = new Date().toISOString();
      localStorage.setItem("sage_last_refresh_ts", now);
      setLastRefreshTs(now);
      toast.success(`Memory refreshed: ${totalExtracted} extracted, ${totalArchived} archived`);
      queryClient.invalidateQueries({ queryKey: ["agent_memories"] });
    } catch (err) {
      console.error("[Sage] Refresh error:", err);
      toast.error("Memory refresh failed");
    } finally {
      setRefreshing(false);
    }
  }, [agents, queryClient]);

  const toggleMemorySelection = (index: number) => {
    setExtractedMemories((prev) =>
      prev.map((m, i) => (i === index ? { ...m, selected: !m.selected } : m))
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Sage — Memory Extraction</h1>
            <p className="text-sm text-muted-foreground">
              Extract and manage agent memories from conversations
            </p>
          </div>
        </div>

        {/* Auto-extraction toggle */}
        <button
          onClick={toggleAutoExtraction}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            autoExtraction
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-muted text-muted-foreground border border-border"
          )}
        >
          {autoExtraction ? (
            <ToggleRight className="w-4 h-4" />
          ) : (
            <ToggleLeft className="w-4 h-4" />
          )}
          Auto-Extract
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Agent selector + Extract button */}
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Select Agent
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
                setExtractedMemories([]);
              }}
              className="w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Choose an agent…</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} — {agent.canonical_role}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExtract}
            disabled={!selectedAgentId || extracting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Extraction
          </button>
        </div>

        {/* Extracted memories results */}
        {extractedMemories.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Extracted Memories ({extractedMemories.filter((m) => m.selected).length}/
                {extractedMemories.length} selected)
              </h2>
              <button
                onClick={handleSave}
                disabled={saving || extractedMemories.filter((m) => m.selected).length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Selected
              </button>
            </div>

            <div className="grid gap-2">
              {extractedMemories.map((mem, i) => (
                <div
                  key={i}
                  onClick={() => toggleMemorySelection(i)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    mem.selected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card opacity-60"
                  )}
                >
                  <div className="mt-0.5">
                    <CheckCircle2
                      className={cn(
                        "w-5 h-5 transition-colors",
                        mem.selected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{mem.content}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border",
                          CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {mem.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mem.confidence}% confidence
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mem.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing memories */}
        {selectedAgentId && existingMemories && existingMemories.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Existing Memories ({existingMemories.length})
            </h2>
            <div className="grid gap-2">
              {existingMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3 rounded-lg border border-border bg-card"
                >
                  <p className="text-sm text-foreground">{mem.content}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground"
                      )}
                    >
                      {mem.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mem.confidence}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(mem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {selectedAgentId && (!existingMemories || existingMemories.length === 0) && extractedMemories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Brain className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm">No memories yet. Run extraction to find insights.</p>
          </div>
        )}
      </div>
    </div>
  );
}
