// src/components/views/SplitScreenView.tsx
// Zoom/Meet-style grid layout for multi-agent delegation conversations
// Users can participate directly in delegated agent conversations

import { useState, useEffect, useRef } from "react";
import { useMessages } from "@/hooks/use-conversations";
import { useAgent } from "@/hooks/use-agents";
import { X, Pin, PinOff, Star, Loader2, Maximize2, Minimize2, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export interface DelegationPanel {
  id: string;
  delegatedConversationId: string;
  delegatingAgentName: string;
  delegatedAgentId: string;
  isPinned: boolean;
  isMain: boolean;
  delegationReason?: string;
}

interface SplitScreenViewProps {
  panels: DelegationPanel[];
  onClosePanel: (panelId: string) => void;
  onPinPanel: (panelId: string) => void;
  onSetMainPanel: (panelId: string) => void;
  mainAgentName: string;
  mainConversationId: string;
}

// ─── Agent Panel with User Input ───

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [sendingInput, setSendingInput] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  // Detect if conversation is awaiting user input (last message is a question from agent)
  const lastMessage = messages?.[messages.length - 1];
  const isAwaitingInput = lastMessage?.role === "agent" && lastMessage.content?.trim().endsWith("?");

  // Detect completion (agent gave substantial non-question answer after at least 2 messages)
  useEffect(() => {
    if (messages && messages.length >= 2) {
      const last = messages[messages.length - 1];
      if (last.role === "agent" && !last.content?.trim().endsWith("?") && last.content.length > 100) {
        setIsComplete(true);
      }
    }
  }, [messages]);

  // Send user message directly to this delegated conversation
  const handleSendUserMessage = async () => {
    if (!userInput.trim() || sendingInput || !user) return;
    setSendingInput(true);
    try {
      await supabase.from("messages").insert({
        conversation_id: panel.delegatedConversationId,
        role: "user" as const,
        content: `[You]: ${userInput.trim()}`,
        model: delegatedAgent?.default_model || "google/gemini-3-flash-preview",
      });
      queryClient.invalidateQueries({ queryKey: ["messages", panel.delegatedConversationId] });
      setUserInput("");
      setIsComplete(false);

      // Call the delegated agent to respond to user input
      const resp = await supabase.functions.invoke("delegate-task", {
        body: {
          fromAgentId: panel.delegatedAgentId, // self-delegation for user follow-up
          toAgentId: panel.delegatedAgentId,
          task: `The user (human founder) is now speaking directly to you in this conversation. They said: "${userInput.trim()}". Respond to them directly and helpfully.`,
          conversationId: panel.delegatedConversationId,
          profileId: user.id,
        },
      });
      
      if (resp.error) {
        console.error("Panel response error:", resp.error);
      }
      queryClient.invalidateQueries({ queryKey: ["messages", panel.delegatedConversationId] });
    } catch (e) {
      console.error("Panel send error:", e);
      toast.error("Failed to send message");
    } finally {
      setSendingInput(false);
    }
  };

  // Get message attribution
  const getMessageLabel = (msg: any) => {
    if (msg.content?.startsWith("[You]:")) return "You";
    if (msg.role === "user") return panel.delegatingAgentName;
    if (msg.role === "agent" || msg.role === "mention_response") return delegatedAgentName;
    return msg.role;
  };

  const getDisplayContent = (msg: any) => {
    // Strip [You]: prefix for display
    if (msg.content?.startsWith("[You]: ")) return msg.content.slice(7);
    return msg.content;
  };

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
          {isComplete && (
            <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold shrink-0">
              <CheckCircle2 className="w-3 h-3" /> Done
            </span>
          )}
          {isAwaitingInput && !isComplete && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0 animate-pulse">
              Awaiting your input
            </span>
          )}
          {panel.isMain && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold shrink-0">MAIN</span>
          )}
          {panel.isPinned && (
            <Pin className="w-3 h-3 text-warning shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={onSetMain} className={cn("p-1 rounded hover:bg-muted transition-all duration-200", panel.isMain ? "text-primary" : "text-muted-foreground")} title="Set as main">
            <Star className="w-3.5 h-3.5" />
          </button>
          <button onClick={onPin} className={cn("p-1 rounded hover:bg-muted transition-all duration-200", panel.isPinned ? "text-warning" : "text-muted-foreground")} title={panel.isPinned ? "Unpin" : "Pin"}>
            {panel.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground" title={expanded ? "Minimize" : "Expand"}>
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onClose} className="p-1 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Close">
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
          (messages ?? []).map((msg) => {
            const label = getMessageLabel(msg);
            const isUserMessage = label === "You" || msg.role === "user";
            const displayContent = getDisplayContent(msg);
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-0.5 max-w-[90%]",
                  label === "You" ? "ml-auto items-end" : isUserMessage ? "mr-auto items-start" : "mr-auto items-start"
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  label === "You" ? "text-primary" : "text-muted-foreground"
                )}>
                  {label === "You" ? "You (via " + panel.delegatingAgentName + ")" : label}
                </span>
                <div
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs leading-relaxed",
                    label === "You"
                      ? "bg-primary/20 text-foreground border border-primary/30"
                      : isUserMessage
                        ? "bg-primary/10 text-foreground"
                        : "bg-muted text-foreground"
                  )}
                >
                  <div className="prose prose-sm prose-invert max-w-none [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:leading-relaxed [&_p]:mb-1.5 [&_p]:last:mb-0 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-xs [&_h3]:font-semibold [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:pl-2 [&_blockquote]:text-muted-foreground [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:text-xs [&_a]:text-primary [&_a]:underline">
                    <ReactMarkdown>{displayContent}</ReactMarkdown>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        {(!messages || messages.length === 0) && !isLoading && (
          <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
            Waiting for conversation to begin...
          </div>
        )}
      </div>

      {/* User Input Area */}
      <div className="px-3 py-2 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendUserMessage(); } }}
            placeholder={isAwaitingInput ? "Agent is waiting for your input..." : `Message ${delegatedAgentName}...`}
            className={cn(
              "flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all",
              isAwaitingInput && "ring-1 ring-amber-500/50 border-amber-500/30"
            )}
            disabled={sendingInput}
          />
          <button
            onClick={handleSendUserMessage}
            disabled={!userInput.trim() || sendingInput}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              userInput.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"
            )}
          >
            {sendingInput ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {messages?.length ?? 0} messages &bull; {isComplete ? "Delegation complete" : "Live conversation"}
        </div>
      </div>
    </div>
  );
}

// ─── Split Screen Container ───

export function SplitScreenView({
  panels,
  onClosePanel,
  onPinPanel,
  onSetMainPanel,
  mainAgentName,
  mainConversationId,
}: SplitScreenViewProps) {
  const panelCount = panels.length;
  const getGridClass = () => {
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
          Type in any panel to join the conversation
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
