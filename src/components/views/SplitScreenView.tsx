// src/components/views/SplitScreenView.tsx
// Zoom/Meet-style grid layout for multi-agent delegation conversations

import { useState, useEffect, useRef } from "react";
import { useMessages } from "@/hooks/use-conversations";
import { useAgent } from "@/hooks/use-agents";
import { X, Pin, PinOff, Star, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

export interface DelegationPanel {
  id: string; // unique panel id
  delegatedConversationId: string;
  delegatingAgentName: string;
  delegatedAgentId: string;
  isPinned: boolean;
  isMain: boolean;
  delegationReason?: string; // why this agent was chosen
}

interface SplitScreenViewProps {
  panels: DelegationPanel[];
  onClosePanel: (panelId: string) => void;
  onPinPanel: (panelId: string) => void;
  onSetMainPanel: (panelId: string) => void;
  mainAgentName: string;
  mainConversationId: string;
}

function AgentPanel({
  panel,
  onClose,
  onPin,
  onSetMain,
  mainAgentName,
}: {
  panel: DelegationPanel;
  onClose: () => void;
  onPin: () => void;
  onSetMain: () => void;
  mainAgentName: string;
}) {
  const { data: messages, isLoading } = useMessages(panel.delegatedConversationId);
  const { data: delegatedAgent } = useAgent(panel.delegatedAgentId);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const delegatedAgentName = delegatedAgent?.name ?? "Agent";

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`split-panel-${panel.delegatedConversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${panel.delegatedConversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", panel.delegatedConversationId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [panel.delegatedConversationId, queryClient]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-xl bg-card overflow-hidden transition-all",
        panel.isMain && "ring-2 ring-primary",
        panel.isPinned && "ring-1 ring-warning",
        expanded && "col-span-2 row-span-2"
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: delegatedAgent?.avatar_color || "#666" }}
          >
            {delegatedAgent?.avatar_initials || "?"}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{delegatedAgentName}</div>
            <div className="text-xs text-muted-foreground truncate">
              {panel.delegatingAgentName} &rarr; {delegatedAgentName}
            </div>
            {panel.delegationReason && (
              <div className="text-xs text-muted-foreground/70 truncate italic mt-0.5">
                {panel.delegationReason}
              </div>
            )}
          </div>
          {panel.isMain && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold shrink-0">MAIN</span>
          )}
          {panel.isPinned && (
            <Pin className="w-3 h-3 text-warning shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onSetMain}
            className={cn("p-1 rounded hover:bg-muted transition-all duration-200", panel.isMain ? "text-primary" : "text-muted-foreground")}
            title="Set as main"
          >
            <Star className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPin}
            className={cn("p-1 rounded hover:bg-muted transition-all duration-200", panel.isPinned ? "text-warning" : "text-muted-foreground")}
            title={panel.isPinned ? "Unpin" : "Pin"}
          >
            {panel.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
            title={expanded ? "Minimize" : "Expand"}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          (messages ?? []).map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-0.5 max-w-[90%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <span className="text-xs text-muted-foreground font-medium">
                {msg.role === "user" ? panel.delegatingAgentName : delegatedAgentName}
              </span>
              <div
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <div className="prose prose-sm prose-invert max-w-none [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:leading-relaxed [&_p]:mb-1.5 [&_p]:last:mb-0 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-xs [&_h3]:font-semibold [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:pl-2 [&_blockquote]:text-muted-foreground [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:text-xs [&_a]:text-primary [&_a]:underline">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
        {(!messages || messages.length === 0) && !isLoading && (
          <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
            Waiting for conversation to begin...
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        {messages?.length ?? 0} messages &bull; Auto-conversation between {panel.delegatingAgentName} and {delegatedAgentName}
      </div>
    </div>
  );
}

export function SplitScreenView({
  panels,
  onClosePanel,
  onPinPanel,
  onSetMainPanel,
  mainAgentName,
  mainConversationId,
}: SplitScreenViewProps) {
  // Calculate grid layout based on number of panels (like Zoom)
  const panelCount = panels.length;
  const getGridClass = () => {
    // Mobile: always 1 column. Tablet: 2. Desktop: auto based on count.
    if (panelCount === 1) return "grid-cols-1";
    if (panelCount === 2) return "grid-cols-1 sm:grid-cols-2";
    if (panelCount <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (panelCount <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (panelCount <= 9) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  if (panels.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            Agent Conversations
          </span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">
            {panelCount} active
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Conversations stay open until you close them
        </p>
      </div>

      {/* Grid */}
      <div className={cn("flex-1 grid gap-3 p-3 overflow-auto auto-rows-fr", getGridClass())}>
        {panels.map((panel) => (
          <AgentPanel
            key={panel.id}
            panel={panel}
            onClose={() => onClosePanel(panel.id)}
            onPin={() => onPinPanel(panel.id)}
            onSetMain={() => onSetMainPanel(panel.id)}
            mainAgentName={mainAgentName}
          />
        ))}
      </div>
    </div>
  );
}
