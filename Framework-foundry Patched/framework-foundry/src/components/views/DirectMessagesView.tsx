import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function DirectMessagesView() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all profiles to find the other founder
  const { data: profiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const otherProfile = profiles?.find((p) => p.user_id !== user?.id);

  // Get DMs
  const { data: dms, isLoading } = useQuery({
    queryKey: ["direct-messages"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("dm-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["direct-messages"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dms]);

  // Mark unread as read
  useEffect(() => {
    if (!user || !dms) return;
    const unread = dms.filter((d) => d.receiver_id === user.id && !d.is_read);
    if (unread.length > 0) {
      unread.forEach((d) => {
        supabase.from("direct_messages").update({ is_read: true }).eq("id", d.id).then(() => {});
      });
    }
  }, [dms, user]);

  const handleSend = async () => {
    if (!message.trim() || !user || !otherProfile || sending) return;
    setSending(true);
    const { error } = await supabase.from("direct_messages").insert({
      sender_id: user.id,
      receiver_id: otherProfile.user_id,
      content: message.trim(),
    });
    if (!error) {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["direct-messages"] });
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
          {otherProfile?.display_name?.charAt(0) || "?"}
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">{otherProfile?.display_name || "Co-founder"}</span>
          <span className="text-xs text-muted-foreground ml-2">Direct Messages</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[700px] mx-auto px-6 py-4 space-y-3">
          {isLoading && (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          )}
          {!isLoading && (!dms || dms.length === 0) && (
            <div className="text-center py-20">
              <p className="text-sm text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          )}
          {dms?.map((dm) => {
            const isMine = dm.sender_id === user?.id;
            return (
              <div key={dm.id} className={cn("flex gap-3", isMine && "flex-row-reverse")}>
                <div className={cn("max-w-[70%] rounded-lg px-4 py-2", isMine ? "bg-primary text-primary-foreground" : "bg-card text-foreground")}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{isMine ? (profile?.name || "You") : (otherProfile?.display_name || "Co-founder")}</span>
                    <span className="text-xs opacity-60">{new Date(dm.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{dm.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border shrink-0">
        <div className="max-w-[700px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Message ${otherProfile?.display_name || "co-founder"}...`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[100px]"
              rows={1}
            />
            <button onClick={handleSend} disabled={!message.trim() || sending}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
