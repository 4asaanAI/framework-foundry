import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Paperclip, Slash, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface ChatViewProps {
  selectedAgentId?: string | null;
}

export function ChatView({ selectedAgentId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { data: dbAgents } = useAgents();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  
  const activeAgent = selectedAgentId 
    ? agents.find((a) => a.id === selectedAgentId) ?? agents[0]
    : agents[0];

  // Find or use the latest conversation for this agent
  const { data: conversations } = useConversations();
  const activeConversation = conversations?.find((c: any) => c.agent_id === activeAgent.id);
  const { data: messages } = useMessages(activeConversation?.id);

  const handleSend = async () => {
    if (!message.trim() || !user || sending) return;
    setSending(true);

    try {
      let conversationId = activeConversation?.id;

      // Create conversation if none exists
      if (!conversationId) {
        const { data: newConv, error: convErr } = await supabase
          .from("conversations")
          .insert({ agent_id: activeAgent.id, profile_id: user.id, title: message.slice(0, 60) })
          .select("id")
          .single();
        if (convErr) throw convErr;
        conversationId = newConv.id;
      }

      // Insert message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user" as const,
        content: message.trim(),
      });

      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  const displayMessages = messages && messages.length > 0 ? messages : [];

  return (
    <div className="flex flex-col h-full">
      {/* Agent header bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 border-border"
          style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
        >
          {activeAgent.avatar_initials}
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">{activeAgent.name}</span>
          <span className="text-xs text-muted-foreground ml-2">{activeAgent.canonical_role}</span>
        </div>
        <span className={cn("ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium",
          activeAgent.status === "thinking" ? "bg-primary/20 text-primary" :
          activeAgent.status === "error" ? "bg-destructive/20 text-destructive" :
          "bg-success/20 text-success"
        )}>
          {activeAgent.status ?? "idle"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-4 space-y-4">
          {displayMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
                style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
              >
                {activeAgent.avatar_initials}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Chat with {activeAgent.name}</h3>
              <p className="text-sm text-muted-foreground max-w-md">{activeAgent.description}</p>
            </div>
          )}
          {displayMessages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3 animate-fade-in", msg.role === "user" && "flex-row-reverse")}>
              {msg.role !== "user" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 border-2 border-border"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
                >
                  {activeAgent.avatar_initials}
                </div>
              )}
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0 mt-1">
                  {profile?.initials ?? "U"}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">{msg.role === "user" ? (profile?.name ?? "You") : activeAgent.name}</span>
                  <span className="text-[10px] opacity-60">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {(msg.tokens_in > 0 || msg.tokens_out > 0) && (
                  <div className="flex items-center gap-3 mt-2 text-[10px] opacity-50">
                    <span>💰 {msg.tokens_in + msg.tokens_out} tokens</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border shrink-0">
        <div className="max-w-[900px] mx-auto px-6 py-3">
          <div className="flex items-end gap-2 rounded-lg bg-card border border-border p-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Attach file">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Use skill">
              <Slash className="h-4 w-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Mention agent">
              <AtSign className="h-4 w-4" />
            </button>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Message ${activeAgent.name}... (/ for skills, @ to mention)`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[120px] py-2"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
