import { useState, useRef, useEffect, useCallback } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { useSkills } from "@/hooks/use-skills";
import { usePlugins } from "@/hooks/use-plugins";
import { useConnectors } from "@/hooks/use-connectors";
import { useProjects } from "@/hooks/use-projects";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Plus, FolderKanban, ChevronDown, X, FileText, Image, File, PanelRightClose, ThumbsUp, ThumbsDown, Pin, Download, Star, StarOff, GitBranch, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { NewProjectDialog } from "@/components/dialogs/NewProjectDialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface ChatViewProps {
  selectedAgentId?: string | null;
}

// Built-in commands triggered by #
const BUILT_IN_COMMANDS = [
  { name: "clear", description: "Archive current conversation history" },
  { name: "new", description: "Start a new conversation with this agent" },
  { name: "export", description: "Export conversation as markdown" },
  { name: "budget", description: "Show current agent's budget status" },
  { name: "status", description: "Show all agents' status" },
  { name: "help", description: "Show available commands" },
];

const MAX_INPUT_HISTORY = 50;
const DRAFT_SAVE_INTERVAL = 2000;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function ChatView({ selectedAgentId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [skillPickerOpen, setSkillPickerOpen] = useState(false);
  const [commandPickerOpen, setCommandPickerOpen] = useState(false);
  const [mentionPickerOpen, setMentionPickerOpen] = useState(false);
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mentionedAgent, setMentionedAgent] = useState<typeof agents[0] | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [inputHistoryIndex, setInputHistoryIndex] = useState(-1);
  const [pickerIndex, setPickerIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: dbAgents } = useAgents();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const { data: skills } = useSkills();
  const { data: plugins } = usePlugins();
  const { data: connectors } = useConnectors("mcp");
  const { data: projects } = useProjects();

  const activeAgent = selectedAgentId
    ? agents.find((a) => a.id === selectedAgentId) ?? agents[0]
    : agents[0];

  const { data: conversations } = useConversations();
  const activeConversation = conversations?.find((c: any) => c.agent_id === activeAgent.id && !c.branch_parent_id);
  const branchConversations = conversations?.filter((c: any) => c.branch_parent_id === activeConversation?.id) ?? [];
  const { data: messages } = useMessages(activeConversation?.id);

  // Restore draft
  useEffect(() => {
    const key = `draft_${activeAgent.id}`;
    const saved = localStorage.getItem(key);
    if (saved) setMessage(saved);
    else setMessage("");
    return () => { if (draftTimerRef.current) clearTimeout(draftTimerRef.current); };
  }, [activeAgent.id]);

  // Auto-save draft
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      const key = `draft_${activeAgent.id}`;
      if (message.trim()) localStorage.setItem(key, message);
      else localStorage.removeItem(key);
    }, DRAFT_SAVE_INTERVAL);
  }, [message, activeAgent.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Reset picker index when picker content changes
  useEffect(() => { setPickerIndex(0); }, [skillPickerOpen, commandPickerOpen, mentionPickerOpen]);

  // Input history
  const getInputHistory = (): string[] => {
    try { return JSON.parse(localStorage.getItem("input_history") || "[]"); } catch { return []; }
  };
  const addToHistory = (text: string) => {
    const history = getInputHistory();
    const filtered = history.filter(h => h !== text);
    filtered.unshift(text);
    localStorage.setItem("input_history", JSON.stringify(filtered.slice(0, MAX_INPUT_HISTORY)));
  };

  // Context window usage
  const estimateContextUsage = () => {
    const msgs = messages ?? [];
    const totalChars = msgs.reduce((sum: number, m: any) => sum + (m.content?.length ?? 0), 0);
    const estimatedTokens = Math.ceil(totalChars / 4);
    const contextLimit = 128000;
    return Math.min((estimatedTokens / contextLimit) * 100, 100);
  };
  const contextUsage = estimateContextUsage();

  // Built-in command execution
  const executeBuiltInCommand = async (cmd: string) => {
    switch (cmd) {
      case "clear":
        if (activeConversation) {
          const { data: msgs } = await supabase.from("messages").select("*").eq("conversation_id", activeConversation.id);
          if (msgs && msgs.length > 0) {
            for (const m of msgs) {
              await (supabase as any).from("message_archives").insert({
                conversation_id: m.conversation_id, original_message_id: m.id,
                content: m.content, role: m.role,
              });
            }
            await supabase.from("messages").delete().eq("conversation_id", activeConversation.id);
            queryClient.invalidateQueries({ queryKey: ["messages", activeConversation.id] });
            toast.success("Conversation archived and cleared");
          }
        }
        break;
      case "new":
        if (user) {
          const { error } = await supabase.from("conversations").insert({
            agent_id: activeAgent.id, profile_id: user.id, title: `New chat with ${activeAgent.name}`,
            project_id: selectedProject?.id ?? null,
          });
          if (!error) {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast.success("New conversation started");
          }
        }
        break;
      case "export": {
        const msgs = messages ?? [];
        const md = msgs.map((m: any) =>
          `**${m.role === "user" ? (profile?.name ?? "You") : activeAgent.name}** (${new Date(m.created_at).toLocaleString()})\n${m.content}`
        ).join("\n\n---\n\n");
        const blob = new Blob([`# Conversation with ${activeAgent.name}\n\n${md}`], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `conversation-${activeAgent.name}-${Date.now()}.md`; a.click();
        URL.revokeObjectURL(url);
        toast.success("Conversation exported");
        break;
      }
      case "budget": {
        const effective = activeAgent.budget_tokens + (activeAgent.budget_loaned ?? 0);
        const used = activeAgent.budget_used ?? 0;
        const pct = effective > 0 ? Math.round((used / effective) * 100) : 0;
        toast.info(`${activeAgent.name}: ${used.toLocaleString()} / ${effective.toLocaleString()} tokens used (${pct}%)`);
        break;
      }
      case "status":
        agents.forEach(a => { toast.info(`${a.name}: ${a.status ?? "idle"}`, { duration: 3000 }); });
        break;
      case "help":
        toast.info("Commands: #clear, #new, #export, #budget, #status, #help. Use / for skills, @ to mention agents.", { duration: 5000 });
        break;
    }
  };

  // Stream AI response
  const streamAIResponse = async (conversationId: string, conversationMessages: any[]) => {
    setStreaming(true);
    setStreamingContent("");

    const chatMessages = conversationMessages.map((m: any) => ({
      role: m.role === "user" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          model: activeAgent.default_model || "google/gemini-3-flash-preview",
          agentName: activeAgent.name,
          agentRole: activeAgent.canonical_role,
          systemPrompt: activeAgent.system_prompt || "",
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        if (resp.status === 429) { toast.error("Rate limited — please wait a moment and try again."); return; }
        if (resp.status === 402) { toast.error("AI credits exhausted — please add funds in Settings > Workspace > Usage."); return; }
        toast.error(errData.error || "AI request failed");
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullContent = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setStreamingContent(fullContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { fullContent += content; setStreamingContent(fullContent); }
          } catch { /* ignore */ }
        }
      }

      // Save agent response to DB
      if (fullContent) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "agent" as const,
          content: fullContent,
          model: activeAgent.default_model || "google/gemini-3-flash-preview",
        });
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.error("Stream error:", e);
      toast.error("Failed to get AI response");
    } finally {
      setStreaming(false);
      setStreamingContent("");
      abortControllerRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);
    setInputHistoryIndex(-1);
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);

    // "/" triggers skill picker
    const lastSlash = textBeforeCursor.lastIndexOf("/");
    // "#" triggers command picker
    const lastHash = textBeforeCursor.lastIndexOf("#");
    const lastAt = textBeforeCursor.lastIndexOf("@");

    if (lastSlash >= 0 && (lastSlash === 0 || textBeforeCursor[lastSlash - 1] === " ")) {
      setSkillPickerOpen(true); setCommandPickerOpen(false); setMentionPickerOpen(false);
    } else { setSkillPickerOpen(false); }

    if (lastHash >= 0 && (lastHash === 0 || textBeforeCursor[lastHash - 1] === " ")) {
      setCommandPickerOpen(true); setSkillPickerOpen(false); setMentionPickerOpen(false);
    } else { setCommandPickerOpen(false); }

    if (lastAt >= 0 && (lastAt === 0 || textBeforeCursor[lastAt - 1] === " ")) {
      setMentionPickerOpen(true); setSkillPickerOpen(false); setCommandPickerOpen(false);
    } else { setMentionPickerOpen(false); }
  };

  // Get currently visible picker items for keyboard nav
  const getPickerItems = () => {
    if (skillPickerOpen) return filteredSkills.slice(0, 15);
    if (commandPickerOpen) return builtInMatches;
    if (mentionPickerOpen) return filteredAgents.slice(0, 10);
    return [];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const items = getPickerItems();
    const anyPickerOpen = skillPickerOpen || commandPickerOpen || mentionPickerOpen;

    // Keyboard navigation within pickers
    if (anyPickerOpen && items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPickerIndex((prev) => Math.min(prev + 1, items.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPickerIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const item = items[pickerIndex];
        if (!item) return;
        if (skillPickerOpen) insertSkill((item as any).name);
        else if (commandPickerOpen) {
          setMessage("#" + (item as any).name);
          setCommandPickerOpen(false);
        }
        else if (mentionPickerOpen) insertMention(item as any);
        return;
      }
      if (e.key === "Escape") {
        setSkillPickerOpen(false); setCommandPickerOpen(false); setMentionPickerOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); return; }

    // Input history navigation when empty
    if (e.key === "ArrowUp" && message === "") {
      e.preventDefault();
      const history = getInputHistory();
      if (history.length > 0) {
        const newIdx = Math.min(inputHistoryIndex + 1, history.length - 1);
        setInputHistoryIndex(newIdx);
        setMessage(history[newIdx]);
      }
    }
    if (e.key === "ArrowDown" && inputHistoryIndex >= 0 && !anyPickerOpen) {
      e.preventDefault();
      const history = getInputHistory();
      const newIdx = inputHistoryIndex - 1;
      if (newIdx < 0) { setInputHistoryIndex(-1); setMessage(""); }
      else { setInputHistoryIndex(newIdx); setMessage(history[newIdx]); }
    }
  };

  const insertSkill = (skillName: string) => {
    const cursorPos = textareaRef.current?.selectionStart ?? message.length;
    const textBeforeCursor = message.slice(0, cursorPos);
    const lastSlash = textBeforeCursor.lastIndexOf("/");
    setMessage(message.slice(0, lastSlash) + "/" + skillName + " " + message.slice(cursorPos));
    setSkillPickerOpen(false);
    textareaRef.current?.focus();
  };

  const insertMention = (agent: typeof agents[0]) => {
    const cursorPos = textareaRef.current?.selectionStart ?? message.length;
    const textBeforeCursor = message.slice(0, cursorPos);
    const lastAt = textBeforeCursor.lastIndexOf("@");
    setMessage(message.slice(0, lastAt) + "@" + agent.name + " " + message.slice(cursorPos));
    setMentionPickerOpen(false);
    setMentionedAgent(agent);
    textareaRef.current?.focus();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);
    const newAttachments: typeof attachedFiles = [];
    for (const file of Array.from(files)) {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("chat-attachments").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("chat-attachments").getPublicUrl(path);
      newAttachments.push({ name: file.name, url: urlData.publicUrl, type: file.type });
    }
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    setUploading(false);
    setPlusMenuOpen(false);
  };

  const removeAttachment = (idx: number) => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || !user || sending || streaming) return;

    // Check for built-in commands (now # prefix)
    const trimmed = message.trim();
    if (trimmed.startsWith("#")) {
      const cmd = trimmed.slice(1).split(" ")[0].toLowerCase();
      const builtIn = BUILT_IN_COMMANDS.find(c => c.name === cmd);
      if (builtIn) {
        await executeBuiltInCommand(cmd);
        setMessage("");
        localStorage.removeItem(`draft_${activeAgent.id}`);
        return;
      }
    }

    // Check budget
    const effective = activeAgent.budget_tokens + (activeAgent.budget_loaned ?? 0);
    if (activeAgent.budget_used >= effective) {
      toast.error(`${activeAgent.name}'s budget is exhausted. Transfer tokens or increase budget.`);
      return;
    }

    setSending(true);
    addToHistory(trimmed);
    try {
      let conversationId = activeConversation?.id;
      if (!conversationId) {
        const { data: newConv, error: convErr } = await supabase
          .from("conversations")
          .insert({ agent_id: activeAgent.id, profile_id: user.id, title: message.slice(0, 60) || "File attachment", project_id: selectedProject?.id ?? null })
          .select("id").single();
        if (convErr) throw convErr;
        conversationId = newConv.id;
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }

      await supabase.from("messages").insert({
        conversation_id: conversationId, role: "user" as const, content: message.trim(),
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        mention_agent_id: mentionedAgent?.id ?? null,
      });
      const userMsg = message.trim();
      setMessage(""); setAttachedFiles([]); setMentionedAgent(null);
      localStorage.removeItem(`draft_${activeAgent.id}`);
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

      // Fetch all messages for context and stream AI response
      const { data: allMsgs } = await supabase.from("messages").select("*")
        .eq("conversation_id", conversationId).order("created_at", { ascending: true });
      
      setSending(false);
      await streamAIResponse(conversationId, allMsgs ?? []);
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send message");
      setSending(false);
    }
  };

  // Fork conversation from a specific message
  const handleFork = async (msgId: string) => {
    if (!user || !activeConversation) return;
    // Get all messages up to and including this one
    const msgs = messages ?? [];
    const msgIndex = msgs.findIndex((m: any) => m.id === msgId);
    if (msgIndex < 0) return;
    const forkedMessages = msgs.slice(0, msgIndex + 1);

    const { data: newConv, error: convErr } = await supabase.from("conversations").insert({
      agent_id: activeAgent.id, profile_id: user.id,
      title: `Branch from ${activeAgent.name}`,
      project_id: activeConversation.project_id ?? null,
      branch_parent_id: activeConversation.id,
      branch_label: `Fork at msg ${msgIndex + 1}`,
    }).select("id").single();

    if (convErr || !newConv) { toast.error("Failed to create branch"); return; }

    // Copy messages to new branch
    for (const m of forkedMessages) {
      await supabase.from("messages").insert({
        conversation_id: newConv.id, role: m.role as any, content: m.content,
        attachments: m.attachments, parent_message_id: m.id,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    toast.success("Conversation branched! Find it in the sidebar.");
  };

  // Message actions
  const handleRate = async (msgId: string, rating: number) => {
    await supabase.from("messages").update({ rating }).eq("id", msgId);
    queryClient.invalidateQueries({ queryKey: ["messages", activeConversation?.id] });
    toast.success(rating === 1 ? "👍 Rated positive" : "👎 Rated negative");
  };

  const handlePin = async (msgId: string, isPinned: boolean) => {
    await supabase.from("messages").update({ is_pinned: !isPinned }).eq("id", msgId);
    queryClient.invalidateQueries({ queryKey: ["messages", activeConversation?.id] });
    toast.success(isPinned ? "Unpinned" : "Pinned");
  };

  const handleStarConversation = async () => {
    if (!activeConversation) return;
    await supabase.from("conversations").update({ is_starred: !activeConversation.is_starred }).eq("id", activeConversation.id);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    toast.success(activeConversation.is_starred ? "Unstarred" : "Starred");
  };

  const displayMessages = messages && messages.length > 0 ? messages : [];
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-3.5 w-3.5" />;
    if (type.includes("pdf")) return <FileText className="h-3.5 w-3.5" />;
    return <File className="h-3.5 w-3.5" />;
  };

  // Search terms for pickers
  const skillSearchTerm = skillPickerOpen
    ? message.slice(message.lastIndexOf("/") + 1).toLowerCase() : "";
  const commandSearchTerm = commandPickerOpen
    ? message.slice(message.lastIndexOf("#") + 1).toLowerCase() : "";
  const mentionSearchTerm = mentionPickerOpen
    ? message.slice(message.lastIndexOf("@") + 1).toLowerCase() : "";

  const builtInMatches = BUILT_IN_COMMANDS.filter(c => c.name.includes(commandSearchTerm));
  const filteredSkills = skills?.filter((s) => s.name.toLowerCase().includes(skillSearchTerm)) ?? [];
  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(mentionSearchTerm) && a.is_active);

  const hasSplitScreen = !!mentionedAgent && mentionedAgent.id !== activeAgent.id;

  const renderMessages = () => {
    return displayMessages.map((msg: any) => (
      <div key={msg.id} className={cn("flex gap-3 animate-fade-in group", msg.role === "user" && "flex-row-reverse")}>
        {msg.role !== "user" && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 border-2 border-border"
            style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
            {activeAgent.avatar_initials}
          </div>
        )}
        {msg.role === "user" && (
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0 mt-1">
            {profile?.initials ?? "U"}
          </div>
        )}
        <div className={cn("max-w-[70%] rounded-lg px-4 py-2 relative", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground")}>
          {msg.is_pinned && <Pin className="h-3 w-3 text-warning absolute -top-1 -right-1" />}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">{msg.role === "user" ? (profile?.name ?? "You") : activeAgent.name}</span>
            <span className="text-[10px] opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
          {msg.attachments && Array.isArray(msg.attachments) && (msg.attachments as any[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {(msg.attachments as any[]).map((att: any, i: number) => (
                <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-background/50 text-[10px] hover:bg-background transition-colors">
                  {getFileIcon(att.type || "")}
                  <span className="truncate max-w-[120px]">{att.name}</span>
                </a>
              ))}
            </div>
          )}
          {(msg.tokens_in > 0 || msg.tokens_out > 0) && (
            <div className="flex items-center gap-3 mt-2 text-[10px] opacity-50">
              <span>💰 {msg.tokens_in + msg.tokens_out} tokens</span>
            </div>
          )}
          {/* Message action buttons */}
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {msg.role !== "user" && (
              <>
                <button onClick={() => handleRate(msg.id, 1)}
                  className={cn("p-0.5 rounded hover:bg-success/10 transition-colors", msg.rating === 1 ? "text-success" : "text-muted-foreground")}>
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button onClick={() => handleRate(msg.id, -1)}
                  className={cn("p-0.5 rounded hover:bg-destructive/10 transition-colors", msg.rating === -1 ? "text-destructive" : "text-muted-foreground")}>
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </>
            )}
            <button onClick={() => handlePin(msg.id, msg.is_pinned)}
              className={cn("p-0.5 rounded hover:bg-warning/10 transition-colors", msg.is_pinned ? "text-warning" : "text-muted-foreground")}>
              <Pin className="h-3 w-3" />
            </button>
            <button onClick={() => handleFork(msg.id)}
              className="p-0.5 rounded hover:bg-accent/10 transition-colors text-muted-foreground" title="Branch from here">
              <GitBranch className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const renderPickerList = (items: any[], type: "skill" | "command" | "mention") => (
    <div className="max-w-[900px] mx-auto px-6">
      <div className="bg-popover border border-border rounded-lg shadow-lg max-h-[200px] overflow-y-auto mb-1">
        {items.map((item, idx) => (
          <button
            key={item.id || item.name}
            onClick={() => {
              if (type === "skill") insertSkill(item.name);
              else if (type === "command") { setMessage("#" + item.name); setCommandPickerOpen(false); }
              else if (type === "mention") insertMention(item);
            }}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-left transition-colors",
              idx === pickerIndex ? "bg-accent/20" : "hover:bg-card"
            )}
          >
            {type === "mention" && (
              <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
                style={{ backgroundColor: item.avatar_color + "20", color: item.avatar_color }}>
                {item.avatar_initials}
              </div>
            )}
            <span className="text-xs font-medium text-foreground">
              {type === "skill" ? `/${item.name}` : type === "command" ? `#${item.name}` : `@${item.name}`}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {type === "mention" ? item.canonical_role : item.description}
            </span>
            {type === "skill" && (
              <span className="ml-auto text-[9px] text-muted-foreground px-1.5 py-0.5 rounded bg-card border border-border">{item.category}</span>
            )}
            {type === "command" && (
              <span className="ml-auto text-[9px] text-muted-foreground px-1.5 py-0.5 rounded bg-card border border-border">built-in</span>
            )}
            {type === "mention" && (
              <span className="ml-auto text-[9px] text-muted-foreground">{item.team}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Agent header bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 border-border"
          style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
          {activeAgent.avatar_initials}
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">{activeAgent.name}</span>
          <span className="text-xs text-muted-foreground ml-2">{activeAgent.canonical_role}</span>
        </div>
        {hasSplitScreen && (
          <div className="flex items-center gap-2 ml-4 px-3 py-1 rounded-lg bg-accent/10 border border-accent/20">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
              style={{ backgroundColor: mentionedAgent!.avatar_color + "20", color: mentionedAgent!.avatar_color }}>
              {mentionedAgent!.avatar_initials}
            </div>
            <span className="text-xs text-accent font-medium">@{mentionedAgent!.name} joined</span>
            <button onClick={() => setMentionedAgent(null)} className="p-0.5 hover:bg-accent/20 rounded">
              <X className="h-3 w-3 text-accent" />
            </button>
          </div>
        )}

        {/* Branch indicator */}
        {branchConversations.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 ml-2 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                <GitBranch className="h-3.5 w-3.5" />
                <span>{branchConversations.length} branch{branchConversations.length > 1 ? "es" : ""}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-1" align="start">
              {branchConversations.map((bc: any) => (
                <button key={bc.id} className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs text-left hover:bg-card transition-colors">
                  <GitBranch className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{bc.branch_label || bc.title}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2" title={`~${Math.round(contextUsage)}% context used`}>
            <span className="text-[10px] text-muted-foreground">Context</span>
            <Progress value={contextUsage} className={cn("w-16 h-1.5", contextUsage > 80 && "[&>div]:bg-warning")} />
            <span className="text-[10px] text-muted-foreground">{Math.round(contextUsage)}%</span>
          </div>
          {activeConversation && (
            <button onClick={handleStarConversation}
              className="p-1 rounded hover:bg-card transition-colors" title={activeConversation.is_starred ? "Unstar" : "Star"}>
              {activeConversation.is_starred ? <Star className="h-4 w-4 text-warning fill-warning" /> : <Star className="h-4 w-4 text-muted-foreground" />}
            </button>
          )}
          <button onClick={() => executeBuiltInCommand("export")} className="p-1 rounded hover:bg-card transition-colors" title="Export conversation">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium",
            streaming ? "bg-primary/20 text-primary" :
            activeAgent.status === "thinking" ? "bg-primary/20 text-primary" :
            activeAgent.status === "error" ? "bg-destructive/20 text-destructive" :
            activeAgent.status === "budget_exhausted" ? "bg-warning/20 text-warning" :
            "bg-success/20 text-success"
          )}>
            {streaming ? "thinking" : activeAgent.status ?? "idle"}
          </span>
        </div>
      </div>

      {/* Budget exhaustion banner */}
      {activeAgent.budget_used >= (activeAgent.budget_tokens + (activeAgent.budget_loaned ?? 0)) && (
        <div className="px-6 py-2 bg-warning/10 border-b border-warning/30 flex items-center gap-3">
          <span className="text-xs text-warning font-medium">⚠️ {activeAgent.name}'s token budget is exhausted.</span>
          <span className="text-[10px] text-muted-foreground">Transfer tokens from another agent or increase this agent's allocation.</span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-hidden flex">
        <div className={cn("flex-1 overflow-y-auto", hasSplitScreen && "border-r border-border")}>
          <div className="max-w-[900px] mx-auto px-6 py-4 space-y-4">
            {displayMessages.length === 0 && !streaming && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
                  {activeAgent.avatar_initials}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Chat with {activeAgent.name}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{activeAgent.description}</p>
                <p className="text-xs text-muted-foreground mt-3">Type <code className="px-1.5 py-0.5 rounded bg-card border border-border">#help</code> for commands, <code className="px-1.5 py-0.5 rounded bg-card border border-border">/</code> for skills</p>
              </div>
            )}
            {renderMessages()}
            {/* Streaming message */}
            {streaming && streamingContent && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 border-2 border-border"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
                  {activeAgent.avatar_initials}
                </div>
                <div className="max-w-[70%] rounded-lg px-4 py-2 bg-card text-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{activeAgent.name}</span>
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  </div>
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{streamingContent}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            {streaming && !streamingContent && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 border-2 border-border"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
                  {activeAgent.avatar_initials}
                </div>
                <div className="max-w-[70%] rounded-lg px-4 py-2 bg-card text-foreground">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">{activeAgent.name} is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {hasSplitScreen && (
          <div className="flex-1 overflow-y-auto bg-card/30">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold"
                style={{ backgroundColor: mentionedAgent!.avatar_color + "20", color: mentionedAgent!.avatar_color }}>
                {mentionedAgent!.avatar_initials}
              </div>
              <span className="text-sm font-medium text-foreground">{mentionedAgent!.name}</span>
              <span className="text-xs text-muted-foreground">{mentionedAgent!.canonical_role}</span>
              <button onClick={() => setMentionedAgent(null)} className="ml-auto p-1 rounded hover:bg-card transition-colors" title="Close split view">
                <PanelRightClose className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="px-4 py-4 text-center text-sm text-muted-foreground">
              <p>@{mentionedAgent!.name} is ready to assist in this conversation.</p>
              <p className="text-xs mt-1">Responses from this agent will appear here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-border shrink-0">
        {/* Skill picker (/) */}
        {skillPickerOpen && filteredSkills.length > 0 && renderPickerList(filteredSkills.slice(0, 15), "skill")}
        {/* Command picker (#) */}
        {commandPickerOpen && builtInMatches.length > 0 && renderPickerList(builtInMatches, "command")}
        {/* Mention picker (@) */}
        {mentionPickerOpen && filteredAgents.length > 0 && renderPickerList(filteredAgents.slice(0, 10), "mention")}

        <div className="max-w-[900px] mx-auto px-6 py-3">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card border border-border text-xs">
                  {getFileIcon(f.type)}
                  <span className="truncate max-w-[120px]">{f.name}</span>
                  <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col rounded-lg bg-card border border-border overflow-hidden">
            <textarea ref={textareaRef} value={message} onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type / for skills, # for commands, @ to mention an agent..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[44px] max-h-[120px] px-4 py-3"
              rows={1}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-border">
              <div className="flex items-center gap-1">
                {/* Project selector */}
                <Popover open={projectPickerOpen} onOpenChange={setProjectPickerOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-colors">
                      <FolderKanban className="h-3.5 w-3.5" />
                      <span>{selectedProject?.name ?? "Work in a project"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-1" align="start">
                    <button onClick={() => { setSelectedProject(null); setProjectPickerOpen(false); }}
                      className={cn("flex items-center gap-2 w-full px-3 py-2 rounded text-xs text-left hover:bg-card transition-colors", !selectedProject && "text-primary font-semibold")}>
                      No project
                    </button>
                    {(projects ?? []).map((p) => (
                      <button key={p.id}
                        onClick={() => { setSelectedProject({ id: p.id, name: p.name }); setProjectPickerOpen(false); }}
                        className={cn("flex items-center gap-2 w-full px-3 py-2 rounded text-xs text-left hover:bg-card transition-colors", selectedProject?.id === p.id && "text-primary font-semibold")}>
                        <FolderKanban className="h-3 w-3 shrink-0" />{p.name}
                      </button>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <button onClick={() => { setProjectPickerOpen(false); setNewProjectOpen(true); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs text-left hover:bg-card transition-colors text-primary">
                        <Plus className="h-3 w-3" /> New project
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Plus menu */}
                <Popover open={plusMenuOpen} onOpenChange={setPlusMenuOpen}>
                  <PopoverTrigger asChild>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-1" align="start">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs hover:bg-card transition-colors text-left">
                      <FileText className="h-3.5 w-3.5" /> Add files or photos
                    </button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center justify-between w-full px-3 py-2 rounded text-xs hover:bg-card transition-colors text-left">
                          <span className="flex items-center gap-2">📋 Skills</span>
                          <ChevronDown className="h-3 w-3 -rotate-90" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-1 max-h-[250px] overflow-y-auto" side="right">
                        {skills?.slice(0, 15).map((s) => (
                          <button key={s.id} onClick={() => { insertSkill(s.name); setPlusMenuOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs hover:bg-card transition-colors text-left">
                            <span className="font-medium">/{s.name}</span>
                          </button>
                        )) ?? <p className="text-xs text-muted-foreground px-3 py-2">No skills available</p>}
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center justify-between w-full px-3 py-2 rounded text-xs hover:bg-card transition-colors text-left">
                          <span className="flex items-center gap-2">🔌 Connectors</span>
                          <ChevronDown className="h-3 w-3 -rotate-90" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-1 max-h-[250px] overflow-y-auto" side="right">
                        {connectors && connectors.length > 0 ? connectors.map((c) => (
                          <div key={c.id} className="flex items-center gap-2 px-3 py-2 text-xs text-foreground">
                            <div className={cn("w-2 h-2 rounded-full", c.is_active ? "bg-success" : "bg-muted-foreground")} />
                            {c.name}
                          </div>
                        )) : <p className="text-xs text-muted-foreground px-3 py-2">No connectors configured</p>}
                      </PopoverContent>
                    </Popover>
                    <button className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs hover:bg-card transition-colors text-left">
                      🧩 Add plugins...
                    </button>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{activeAgent.default_model}</span>
                <button onClick={handleSend}
                  disabled={(!message.trim() && attachedFiles.length === 0) || sending || streaming}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  aria-label="Send message">
                  {sending || streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <input ref={fileInputRef} type="file" multiple className="hidden"
          accept=".pdf,.txt,.md,.json,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.png,.jpg,.jpeg,.heic,.mp3,.mp4,.csv,.xml,.zip"
          onChange={(e) => handleFileUpload(e.target.files)} />
      </div>

      <NewProjectDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />
    </div>
  );
}
