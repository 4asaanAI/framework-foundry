import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Paperclip, Slash, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_MESSAGES = [
  { id: "1", role: "user" as const, content: "Kabir, can you give me a status update on all active projects?", created_at: "10:32 AM", tokens: 45 },
  { id: "2", role: "agent" as const, content: "Good morning, Abhimanyu. Here's your project status overview:\n\n**EduFlow** — Sprint 4, 78% complete. Dev is working on the assessment module. 2 blockers flagged by Rohit.\n\n**Layaa Website** — Content draft ready. Mira needs your approval on the hero copy.\n\n**Client Onboarding** — Yuvaan has 3 warm leads in pipeline. Rishi recommends a follow-up sequence this week.\n\nWould you like me to dive deeper into any of these?", created_at: "10:32 AM", tokens: 150 },
  { id: "3", role: "user" as const, content: "Tell Mira to finalize the hero copy and send it to me for review", created_at: "10:34 AM", tokens: 30 },
  { id: "4", role: "agent" as const, content: "Done. I've delegated this to **Mira** with the instruction to finalize the hero copy and share it with you. She'll have it ready within the hour.\n\n📋 Task created: *Finalize hero copy — Website* (assigned to Mira)", created_at: "10:34 AM", tokens: 80 },
];

export function ChatView() {
  const [message, setMessage] = useState("");
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const activeAgent = agents[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-4 space-y-4">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3 animate-fade-in", msg.role === "user" && "flex-row-reverse")}>
              {msg.role === "agent" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 border-2 border-border"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}
                >
                  {activeAgent.avatar_initials}
                </div>
              )}
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0 mt-1">
                  A
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
                  <span className="text-xs font-semibold">{msg.role === "user" ? "Abhimanyu" : activeAgent.name}</span>
                  <span className="text-[10px] opacity-60">{msg.created_at}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] opacity-50">
                  <span>💰 {msg.tokens} tokens</span>
                </div>
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
              placeholder={`Message ${activeAgent.name}... (/ for skills, @ to mention)`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[120px] py-2"
              rows={1}
            />
            <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
