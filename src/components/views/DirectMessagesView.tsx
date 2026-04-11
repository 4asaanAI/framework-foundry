import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, Paperclip, Image, FileText, File, X, Download, Smile, Search, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function DirectMessagesView() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const otherProfile = profiles?.find((p) => p.user_id !== user?.id);

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
      Promise.all(unread.map((d) =>
        supabase.from("direct_messages").update({ is_read: true }).eq("id", d.id)
      ));
    }
  }, [dms, user]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);
    const newAttachments: typeof attachedFiles = [];
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 20MB)`);
        continue;
      }
      const path = `dm/${user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("chat-attachments").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("chat-attachments").getPublicUrl(path);
      newAttachments.push({ name: file.name, url: urlData.publicUrl, type: file.type });
    }
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    setUploading(false);
  };

  const handleSend = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || !user || !otherProfile || sending) return;
    setSending(true);
    const content = attachedFiles.length > 0
      ? `${message.trim()}\n\n${attachedFiles.map(f => `📎 [${f.name}](${f.url})`).join("\n")}`
      : message.trim();
    const { error } = await supabase.from("direct_messages").insert({
      sender_id: user.id,
      receiver_id: otherProfile.user_id,
      content,
    });
    if (!error) {
      setMessage("");
      setAttachedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["direct-messages"] });
    }
    setSending(false);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-3.5 w-3.5" />;
    if (type.includes("pdf") || type.includes("text")) return <FileText className="h-3.5 w-3.5" />;
    return <File className="h-3.5 w-3.5" />;
  };

  // Group messages by date
  const groupedMessages = (dms ?? []).reduce<Record<string, any[]>>((groups, dm) => {
    const date = new Date(dm.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    if (!groups[date]) groups[date] = [];
    groups[date].push(dm);
    return groups;
  }, {});

  const filteredGrouped = searchQuery
    ? Object.fromEntries(
        Object.entries(groupedMessages).map(([date, msgs]) => [
          date,
          msgs!.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase())),
        ]).filter(([, msgs]) => (msgs as any[]).length > 0)
      )
    : groupedMessages;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0 bg-card/50">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            {otherProfile?.display_name?.charAt(0) || "?"}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-background" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-foreground">{otherProfile?.display_name || "Co-founder"}</span>
          <p className="text-xs text-muted-foreground">Direct Messages · Online</p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={cn("p-2 rounded-lg transition-all duration-200", showSearch ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-6 py-2 border-b border-border bg-muted/30">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="h-8 text-xs"
            autoFocus
          />
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-[700px] mx-auto px-6 py-4 space-y-1">
          {isLoading && (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          )}
          {!isLoading && (!dms || dms.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Send className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a conversation with your co-founder!</p>
            </div>
          )}
          {Object.entries(filteredGrouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium px-2">{date}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {msgs!.map((dm) => {
                const isMine = dm.sender_id === user?.id;
                return (
                  <div key={dm.id} className={cn("flex gap-2 mb-2 group", isMine ? "justify-end" : "justify-start")}>
                    {!isMine && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-1">
                        {otherProfile?.display_name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200",
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    )}>
                      <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary-foreground [&_a]:underline">
                        <ReactMarkdown>{dm.content}</ReactMarkdown>
                      </div>
                      <div className={cn("flex items-center gap-1.5 mt-1", isMine ? "justify-end" : "justify-start")}>
                        <span className={cn("text-xs", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                          {new Date(dm.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMine && (
                          dm.is_read
                            ? <CheckCheck className="h-3 w-3 text-primary-foreground/60" />
                            : <Check className="h-3 w-3 text-primary-foreground/40" />
                        )}
                      </div>
                    </div>
                    {isMine && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-1">
                        {profile?.initials ?? "U"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachment preview */}
      {attachedFiles.length > 0 && (
        <div className="px-6 py-2 border-t border-border bg-muted/30">
          <div className="max-w-[700px] mx-auto flex items-center gap-2 overflow-x-auto">
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs shrink-0">
                {getFileIcon(f.type)}
                <span className="truncate max-w-[120px]">{f.name}</span>
                <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border shrink-0 bg-background">
        <div className="max-w-[700px] mx-auto px-6 py-3">
          <div className="flex items-end gap-2 rounded-2xl bg-card border border-border px-3 py-2 shadow-sm focus-within:border-primary/20 focus-within:shadow-md transition-all duration-200">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0"
              title="Attach file"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Message ${otherProfile?.display_name || "co-founder"}...`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-[120px] py-2"
              style={{ height: "36px" }}
              rows={1}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={(!message.trim() && attachedFiles.length === 0) || sending}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shrink-0"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
