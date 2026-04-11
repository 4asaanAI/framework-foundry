// src/components/views/SplitScreenView.tsx
// Split-screen UI for agent-to-agent delegation visibility

import { useState, useEffect, useRef } from "react";
import { useMessages } from "@/hooks/use-conversations";
import { useAgent } from "@/hooks/use-agents";
import { X, GitBranch, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

interface SplitScreenViewProps {
  mainConversationId: string;
  delegatedConversationId: string;
  delegatingAgentName: string;
  delegatedAgentId: string;
  onClose: () => void;
  // LLM config for follow-up questions
  model: string;
  provider: string;
  apiKey: string;
}

export function SplitScreenView({
  mainConversationId,
  delegatedConversationId,
  delegatingAgentName,
  delegatedAgentId,
  onClose,
  model,
  provider,
  apiKey,
}: SplitScreenViewProps) {
  const { data: messages, isLoading } = useMessages(delegatedConversationId);
  const { data: delegatedAgent } = useAgent(delegatedAgentId);
  const queryClient = useQueryClient();
  const [followUp, setFollowUp] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const delegatedAgentName = delegatedAgent?.name ?? "Agent";

  // Subscribe to realtime updates on the delegated conversation
  useEffect(() => {
    const channel = supabase
      .channel(`split-screen-${delegatedConversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${delegatedConversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", delegatedConversationId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [delegatedConversationId, queryClient]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFollowUp = async () => {
    if (!followUp.trim() || sending) return;
    setSending(true);

    try {
      // Store follow-up as "user" message (from delegating agent)
      await supabase.from("messages").insert({
        conversation_id: delegatedConversationId,
        role: "user" as const,
        content: `${delegatingAgentName} asks: ${followUp.trim()}`,
        model,
      });
      queryClient.invalidateQueries({ queryKey: ["messages", delegatedConversationId] });

      // Get response from delegated agent via edge function
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const allMessages = [
        ...(messages ?? []).map((m) => ({
          role: m.role === "agent" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        { role: "user" as const, content: followUp.trim() },
      ];

      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          model: delegatedAgent?.default_model || model,
          agentName: delegatedAgentName,
          agentRole: delegatedAgent?.canonical_role || "",
          systemPrompt: delegatedAgent?.system_prompt || "",
          agentId: delegatedAgentId,
          conversationId: delegatedConversationId,
        }),
      });

      if (!resp.ok) throw new Error("Failed to get response");

      // Parse SSE stream
      let fullContent = "";
      if (resp.body) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, nl).replace(/\r$/, "");
            buf = buf.slice(nl + 1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") break;
            try {
              const c = JSON.parse(json).choices?.[0]?.delta?.content;
              if (c) fullContent += c;
            } catch { /* partial */ }
          }
        }
      }

      if (fullContent) {
        await supabase.from("messages").insert({
          conversation_id: delegatedConversationId,
          role: "agent" as const,
          content: fullContent,
          model: delegatedAgent?.default_model || model,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", delegatedConversationId] });

      setFollowUp("");
    } catch (err) {
      console.error("Follow-up failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {delegatingAgentName} → {delegatedAgentName}
          </span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-primary/10">
            Delegation
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Close split-screen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context banner */}
      <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/20 border-b border-border">
        <span className="font-medium text-foreground">{delegatingAgentName}</span> is consulting{" "}
        <span className="font-medium text-foreground">{delegatedAgentName}</span> for specialized input.
        This conversation is stored in {delegatedAgentName}'s history.
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          (messages ?? []).map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-1 max-w-[90%]",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <span className="text-xs text-muted-foreground">
                {msg.role === "user" ? delegatingAgentName : delegatedAgentName}
              </span>
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Follow-up input */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFollowUp();
              }
            }}
            placeholder={`${delegatingAgentName} asks ${delegatedAgentName}...`}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            disabled={sending}
          />
          <button
            onClick={handleFollowUp}
            disabled={!followUp.trim() || sending}
            className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Ask follow-up questions. {delegatingAgentName} will use {delegatedAgentName}'s responses in the final answer.
        </p>
      </div>
    </div>
  );
}
