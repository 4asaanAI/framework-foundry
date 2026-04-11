// src/components/views/SageView.tsx — Sage Manual Memory Extraction UI

import { useState, useEffect, useCallback } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useAgentMemories } from "@/hooks/use-agent-memories";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { MOCK_AGENTS } from "@/constants/agents";
import { TEAM_LABELS, TEAM_COLORS } from "@/constants/agents";
import {
  extractMemoriesFromConversation,
  saveExtractedMemories,
  synthesizeAgentMemory,
  purgeAutoExtractedMemories,
  syncPlatformSharedMemory,
  getPlatformSharedMemory,
  getPendingConflicts,
  resolveConflict,
  exportMemories,
  type ExtractedMemory,
  type MemoryConflict,
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
  ArrowLeft,
  FileText,
  Trash2,
  Search,
  Download,
  AlertTriangle,
  Globe,
  Calendar,
  SortAsc,
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
  const [synthesizedPreview, setSynthesizedPreview] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [purging, setPurging] = useState(false);
  // Search, filter, sort
  const [memorySearch, setMemorySearch] = useState("");
  const [memoryFilter, setMemoryFilter] = useState("all");
  const [memorySortBy, setMemorySortBy] = useState<"date" | "confidence">("date");
  // View mode
  const [memoryViewMode, setMemoryViewMode] = useState<"cards" | "timeline">("cards");
  // Conflicts
  const [conflicts, setConflicts] = useState<MemoryConflict[]>([]);
  // Shared memory
  const [sharedMemory, setSharedMemory] = useState<string | null>(null);
  const [showSharedMemory, setShowSharedMemory] = useState(false);
  const [syncingShared, setSyncingShared] = useState(false);

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
      // Also sync platform shared memory alongside extraction
      try { await syncPlatformSharedMemory(); } catch { /* ignore sync errors */ }
      toast.success("Sage auto-extraction + shared memory sync completed");
    };

    runAutoExtraction();
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
      toast.success(`Memory refreshed: ${totalExtracted} extracted`);
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

  const handleBackToGrid = () => {
    setSelectedAgentId("");
    setExtractedMemories([]);
    setSynthesizedPreview(null);
  };

  // Synthesize: generate instruction markdown preview for the selected agent
  const handleSynthesize = useCallback(async () => {
    if (!selectedAgentId) return;
    setSynthesizing(true);
    try {
      const result = await synthesizeAgentMemory(selectedAgentId);
      setSynthesizedPreview(result.markdown || "No memories to synthesize.");
      toast.success(`Synthesized ${result.totalMemories} memories (avg confidence: ${Math.round(result.confidenceAvg * 100)}%)`);
    } catch {
      toast.error("Synthesis failed");
    } finally {
      setSynthesizing(false);
    }
  }, [selectedAgentId]);

  // Load conflicts
  useEffect(() => {
    setConflicts(getPendingConflicts());
  }, [selectedAgentId, existingMemories]);

  // Sync platform shared memory
  const handleSyncShared = useCallback(async () => {
    setSyncingShared(true);
    try {
      const result = await syncPlatformSharedMemory();
      toast.success(`Sage synced ${result.memoriesCollected} memories from ${result.agentsScanned} agents to platform shared memory`);
      const content = await getPlatformSharedMemory();
      setSharedMemory(content);
    } catch {
      toast.error("Shared memory sync failed");
    } finally {
      setSyncingShared(false);
    }
  }, []);

  // Load shared memory on demand
  const handleViewSharedMemory = useCallback(async () => {
    const content = await getPlatformSharedMemory();
    setSharedMemory(content);
    setShowSharedMemory(true);
  }, []);

  // Handle conflict resolution
  const handleResolveConflict = useCallback(async (conflict: MemoryConflict, keepNew: boolean) => {
    const { supabase } = await import("@/integrations/supabase/client");
    if (keepNew) {
      // Archive the old one, save the new one
      await supabase.from("agent_memories").update({ is_compressed: true }).eq("id", conflict.existingId);
      await supabase.from("agent_memories").insert({
        agent_id: conflict.agentId,
        content: conflict.newContent,
        category: conflict.category as any,
        confidence: 0.9,
        memory_type: "personal",
      });
      toast.success("Kept newer memory, archived older");
    } else {
      toast.success("Kept existing memory, discarded newer");
    }
    resolveConflict(conflict.existingId, keepNew);
    setConflicts(getPendingConflicts());
    queryClient.invalidateQueries({ queryKey: ["agent_memories"] });
  }, [queryClient]);

  // Filter + sort existing memories
  const filteredMemories = (existingMemories ?? [])
    .filter(m => {
      if (memorySearch && !m.content.toLowerCase().includes(memorySearch.toLowerCase())) return false;
      if (memoryFilter !== "all" && m.category !== memoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (memorySortBy === "confidence") return Number(b.confidence) - Number(a.confidence);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Purge auto-extracted memories (one-time cleanup)
  const handlePurge = useCallback(async () => {
    setPurging(true);
    try {
      const count = await purgeAutoExtractedMemories();
      toast.success(`Sage purged ${count} auto-extracted memories. Manually saved memories preserved.`);
      queryClient.invalidateQueries({ queryKey: ["agent_memories"] });
    } catch {
      toast.error("Purge failed");
    } finally {
      setPurging(false);
    }
  }, [queryClient]);

  // Group agents by team
  const teamGroups = agents.reduce<Record<string, typeof agents>>((acc, agent) => {
    const team = agent.team || "other";
    if (!acc[team]) acc[team] = [];
    acc[team].push(agent);
    return acc;
  }, {});

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          {selectedAgentId && (
            <button
              onClick={handleBackToGrid}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {selectedAgent ? `${selectedAgent.name} — Memories` : "Sage — Memory Extraction"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedAgent
                ? `${selectedAgent.canonical_role} • ${selectedAgent.team}`
                : "Select an agent to view and extract memories"}
            </p>
          </div>
        </div>

        {/* Auto-extraction toggle + Refresh button */}
        <div className="flex items-center gap-2">
          {lastRefreshTs && (
            <span className="text-xs text-muted-foreground">
              Last refresh: {new Date(lastRefreshTs).toLocaleString()}
            </span>
          )}
          <button
            onClick={handleRefreshMemory}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 disabled:opacity-50 transition-all duration-200"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Memory
          </button>
          <button
            onClick={toggleAutoExtraction}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
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
          <button
            onClick={handleSyncShared}
            disabled={syncingShared}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 disabled:opacity-50 transition-all duration-200"
          >
            {syncingShared ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Sync Shared
          </button>
          <button
            onClick={handleViewSharedMemory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            View Shared
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Shared memory viewer */}
        {showSharedMemory && sharedMemory && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" /> Platform Shared Memory
              </h2>
              <div className="flex gap-1">
                <button onClick={() => exportMemories({ type: "platform", format: "md" })} className="px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all duration-200"><Download className="h-3 w-3 inline mr-1" />.md</button>
                <button onClick={() => exportMemories({ type: "platform", format: "pdf" })} className="px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all duration-200">.pdf</button>
                <button onClick={() => setShowSharedMemory(false)} className="text-xs text-muted-foreground hover:text-foreground transition-all duration-200 ml-2">Close</button>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">{sharedMemory}</div>
          </div>
        )}

        {/* Agent cards grid (shown when no agent selected) */}
        {!selectedAgentId && !showSharedMemory && (
          <div className="space-y-6">
            {Object.entries(teamGroups).map(([team, teamAgents]) => (
              <div key={team}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAM_COLORS[team] || "#666" }} />
                  {TEAM_LABELS[team] || team}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {teamAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setExtractedMemories([]);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-110"
                        style={{ backgroundColor: agent.avatar_color }}
                      >
                        {agent.avatar_initials}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{agent.canonical_role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agent memory view (shown when agent selected) */}
        {selectedAgentId && (
          <>
            {/* Extract button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleExtract}
                disabled={!selectedAgentId || extracting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {extracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run Extraction
              </button>
              <button
                onClick={handleSynthesize}
                disabled={!selectedAgentId || synthesizing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {synthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Synthesize
              </button>
              <button
                onClick={handlePurge}
                disabled={purging}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive font-medium text-sm hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {purging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Purge Auto-Extracted
              </button>
            </div>

            {/* Synthesized preview */}
            {synthesizedPreview && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Sage Synthesized Instructions — {selectedAgent?.name}
                  </h2>
                  <button
                    onClick={() => setSynthesizedPreview(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >Close preview</button>
                </div>
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">
                  {synthesizedPreview}
                </div>
                <p className="text-xs text-muted-foreground">
                  This is what gets injected into {selectedAgent?.name}'s system prompt at the start of every conversation. Powered by Sage Memory Intelligence — Layaa OS.
                </p>
              </div>
            )}

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
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                            "w-5 h-5 transition-all duration-200",
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
                            {Math.round(mem.confidence * 100)}% confidence
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

            {/* Conflict resolution panel */}
            {conflicts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Memory Conflicts ({conflicts.length})
                </h2>
                {conflicts.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Existing Memory</p>
                        <p className="text-sm text-foreground">{c.existingContent}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                        <p className="text-xs font-semibold text-primary mb-1">New Memory</p>
                        <p className="text-sm text-foreground">{c.newContent}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleResolveConflict(c, true)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-200">Keep New</button>
                      <button onClick={() => handleResolveConflict(c, false)} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-all duration-200">Keep Existing</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search, filter, sort, view mode, export controls */}
            {existingMemories && existingMemories.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input value={memorySearch} onChange={e => setMemorySearch(e.target.value)} placeholder="Search memories..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200" />
                  </div>
                  <select value={memoryFilter} onChange={e => setMemoryFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-card text-xs">
                    <option value="all">All categories</option>
                    <option value="decision">Decisions</option>
                    <option value="preference">Preferences</option>
                    <option value="process">Processes</option>
                    <option value="company">Company</option>
                    <option value="client_info">Client Info</option>
                    <option value="market_data">Market Data</option>
                  </select>
                  <select value={memorySortBy} onChange={e => setMemorySortBy(e.target.value as any)} className="px-3 py-2 rounded-xl border border-border bg-card text-xs">
                    <option value="date">Sort by Date</option>
                    <option value="confidence">Sort by Confidence</option>
                  </select>
                  <div className="flex gap-1">
                    <button onClick={() => setMemoryViewMode("cards")} className={cn("p-2 rounded-lg text-xs transition-all duration-200", memoryViewMode === "cards" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")} title="Card view"><SortAsc className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setMemoryViewMode("timeline")} className={cn("p-2 rounded-lg text-xs transition-all duration-200", memoryViewMode === "timeline" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")} title="Timeline view"><Calendar className="h-3.5 w-3.5" /></button>
                  </div>
                  {/* Export dropdown */}
                  <div className="flex gap-1">
                    <button onClick={() => exportMemories({ type: "agent", agentId: selectedAgentId, agentName: selectedAgent?.name, format: "md" })} className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all duration-200">.md</button>
                    <button onClick={() => exportMemories({ type: "agent", agentId: selectedAgentId, agentName: selectedAgent?.name, format: "pdf" })} className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all duration-200">.pdf</button>
                    <button onClick={() => exportMemories({ type: "agent", agentId: selectedAgentId, agentName: selectedAgent?.name, format: "docx" })} className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-all duration-200">.docx</button>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Memories ({filteredMemories.length})
                </h2>

                {/* Timeline view */}
                {memoryViewMode === "timeline" ? (
                  <div className="relative pl-6 border-l-2 border-border space-y-4">
                    {filteredMemories.map((mem) => (
                      <div key={mem.id} className="relative">
                        <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <div className="p-3 rounded-xl border border-border bg-card ml-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground font-mono">{new Date(mem.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border", CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground")}>{mem.category.replace(/_/g, " ")}</span>
                            <span className="text-xs text-muted-foreground font-mono">{Math.round(mem.confidence * 100)}%</span>
                          </div>
                          <p className="text-sm text-foreground">{mem.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Card view */
                  <div className="grid gap-2">
                    {filteredMemories.map((mem) => (
                      <div key={mem.id} className="p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-all duration-200">
                        <p className="text-sm text-foreground">{mem.content}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border", CATEGORY_COLORS[mem.category] || "bg-muted text-muted-foreground")}>{mem.category.replace(/_/g, " ")}</span>
                          <span className="text-xs text-muted-foreground">{Math.round(mem.confidence * 100)}%</span>
                          <span className="text-xs text-muted-foreground">{new Date(mem.created_at).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{mem.memory_type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {(!existingMemories || existingMemories.length === 0) && extractedMemories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Brain className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">No memories yet. Run extraction to find insights.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
