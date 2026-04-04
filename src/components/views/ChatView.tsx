import { useState } from "react";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Paperclip, Slash, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_MESSAGES = [
  { id: "1", role: "user" as const, content: "Kabir, can you give me a status update on all active projects?", created_at: "10:32 AM" },
  { id: "2", role: "agent" as const, content: "Good morning, Abhimanyu. Here's your project status overview:\n\n**EduFlow** — Sprint 4, 78% complete. Dev is working on the assessment module. 2 blockers flagged by Neha.\n\n**Layaa Website** — Content draft ready. Mira needs your approval on the hero copy.\n\n**Client Onboarding** — Arjun has 3 warm leads in pipeline. Rishi recommends a follow-up sequence this week.\n\nWould you like me to dive deeper into any of these?", created_at: "10:32 AM" },
  { id: "3", role: "user" as const, content: "Tell Mira to finalize the hero copy and send it to me for review", created_at: "10:34 AM" },
  { id: "4", role: "agent" as const, content: "Done. I've delegated this to **Mira** with the instruction to finalize the hero copy and share it with you. She'll have it ready within the hour.\n\n📋 Task created: *Finalize hero copy — Website* (assigned to Mira)", created_at: "10:34 AM" },
];

export function ChatView() {
  const [message, setMessage] = useState("");
  const activeAgent = MOCK_AGENTS[0]; // Kabir

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 h-14 border-b border-border shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
        >
          {activeAgent.avatar_initials}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{activeAgent.name}</h2>
          <p className="text-[11px] text-muted-foreground">{activeAgent.canonical_role} · {activeAgent.status}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
            {((activeAgent.budget_used / activeAgent.budget_tokens) * 100).toFixed(0)}% budget used
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {MOCK_MESSAGES.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3 animate-fade-in", msg.role === "user" && "flex-row-reverse")}>
            {msg.role === "agent" && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1"
                style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
              >
                {activeAgent.avatar_initials}
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary/10 text-foreground"
                  : "bg-card text-card-foreground border border-border"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="block text-[10px] text-muted-foreground mt-2">{msg.created_at}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border shrink-0">
        <div className="flex items-end gap-2 rounded-xl bg-card border border-border p-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Slash className="h-4 w-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <AtSign className="h-4 w-4" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Kabir... (/ for skills, @ to mention)"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[120px] py-2"
            rows={1}
          />
          <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Messages are processed via n8n proxy · API keys never reach the browser
        </p>
      </div>
    </div>
  );
}
