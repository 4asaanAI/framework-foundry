import { useState, useRef, useEffect } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { useSkills } from "@/hooks/use-skills";
import { usePlugins } from "@/hooks/use-plugins";
import { useConnectors } from "@/hooks/use-connectors";
import { useProjects } from "@/hooks/use-projects";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Plus, FolderKanban, ChevronDown, X, FileText, Image, File, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { NewProjectDialog } from "@/components/dialogs/NewProjectDialog";

interface ChatViewProps {
  selectedAgentId?: string | null;
}

export function ChatView({ selectedAgentId }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [skillPickerOpen, setSkillPickerOpen] = useState(false);
  const [mentionPickerOpen, setMentionPickerOpen] = useState(false);
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mentionedAgent, setMentionedAgent] = useState<typeof agents[0] | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  const activeConversation = conversations?.find((c: any) => c.agent_id === activeAgent.id);
  const { data: messages } = useMessages(activeConversation?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessage(val);
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastSlash = textBeforeCursor.lastIndexOf("/");
    const lastAt = textBeforeCursor.lastIndexOf("@");

    if (lastSlash >= 0 && (lastSlash === 0 || textBeforeCursor[lastSlash - 1] === " ")) {
      setSkillPickerOpen(true); setMentionPickerOpen(false);
    } else { setSkillPickerOpen(false); }

    if (lastAt >= 0 && (lastAt === 0 || textBeforeCursor[lastAt - 1] === " ")) {
      setMentionPickerOpen(true); setSkillPickerOpen(false);
    } else { setMentionPickerOpen(false); }
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
    if ((!message.trim() && attachedFiles.length === 0) || !user || sending) return;
    setSending(true);
    try {
      let conversationId = activeConversation?.id;
      if (!conversationId) {
        const { data: newConv, error: convErr } = await supabase
          .from("conversations")
          .insert({ agent_id: activeAgent.id, profile_id: user.id, title: message.slice(0, 60) || "File attachment", project_id: selectedProject?.id ?? null })
          .select("id").single();
        if (convErr) throw convErr;
        conversationId = newConv.id;
      }
      await supabase.from("messages").insert({
        conversation_id: conversationId, role: "user" as const, content: message.trim(),
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        mention_agent_id: mentionedAgent?.id ?? null,
      });
      setMessage(""); setAttachedFiles([]); setMentionedAgent(null);
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send message");
    } finally { setSending(false); }
  };

  const displayMessages = messages && messages.length > 0 ? messages : [];
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-3.5 w-3.5" />;
    if (type.includes("pdf")) return <FileText className="h-3.5 w-3.5" />;
    return <File className="h-3.5 w-3.5" />;
  };

  const searchTerm = skillPickerOpen
    ? message.slice(message.lastIndexOf("/") + 1).toLowerCase()
    : mentionPickerOpen ? message.slice(message.lastIndexOf("@") + 1).toLowerCase() : "";

  const filteredSkills = skills?.filter((s) => s.name.toLowerCase().includes(searchTerm)) ?? [];
  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(searchTerm) && a.is_active);

  // Split-screen: check if there's a mentioned agent in the conversation
  const hasSplitScreen = !!mentionedAgent && mentionedAgent.id !== activeAgent.id;

  const renderMessages = (agentFilter?: string) => {
    const msgs = agentFilter
      ? displayMessages.filter(m => m.role === "user" || m.mention_agent_id === agentFilter || (!m.mention_agent_id && !agentFilter))
      : displayMessages;

    return msgs.map((msg) => (
      <div key={msg.id} className={cn("flex gap-3 animate-fade-in", msg.role === "user" && "flex-row-reverse")}>
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
        <div className={cn("max-w-[70%] rounded-lg px-4 py-2", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground")}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">{msg.role === "user" ? (profile?.name ?? "You") : activeAgent.name}</span>
            <span className="text-[10px] opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
        </div>
      </div>
    ));
  };

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
        <span className={cn("ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium",
          activeAgent.status === "thinking" ? "bg-primary/20 text-primary" :
          activeAgent.status === "error" ? "bg-destructive/20 text-destructive" :
          "bg-success/20 text-success"
        )}>
          {activeAgent.status ?? "idle"}
        </span>
      </div>

      {/* Messages area — with optional split screen */}
      <div className="flex-1 overflow-hidden flex">
        <div className={cn("flex-1 overflow-y-auto", hasSplitScreen && "border-r border-border")}>
          <div className="max-w-[900px] mx-auto px-6 py-4 space-y-4">
            {displayMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
                  style={{ backgroundColor: activeAgent.avatar_color + "20", color: activeAgent.avatar_color }}>
                  {activeAgent.avatar_initials}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Chat with {activeAgent.name}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{activeAgent.description}</p>
              </div>
            )}
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Split screen for mentioned agent */}
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
        {skillPickerOpen && filteredSkills.length > 0 && (
          <div className="max-w-[900px] mx-auto px-6">
            <div className="bg-popover border border-border rounded-lg shadow-lg max-h-[200px] overflow-y-auto mb-1">
              {filteredSkills.slice(0, 10).map((skill) => (
                <button key={skill.id} onClick={() => insertSkill(skill.name)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-card text-left transition-colors">
                  <span className="text-xs font-medium text-foreground">/{skill.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{skill.description}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground px-1.5 py-0.5 rounded bg-card border border-border">{skill.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {mentionPickerOpen && filteredAgents.length > 0 && (
          <div className="max-w-[900px] mx-auto px-6">
            <div className="bg-popover border border-border rounded-lg shadow-lg max-h-[200px] overflow-y-auto mb-1">
              {filteredAgents.slice(0, 10).map((agent) => (
                <button key={agent.id} onClick={() => insertMention(agent)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-card text-left transition-colors">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}>
                    {agent.avatar_initials}
                  </div>
                  <span className="text-xs font-medium text-foreground">@{agent.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{agent.canonical_role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type / for skills, @ to mention an agent..."
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
                  disabled={(!message.trim() && attachedFiles.length === 0) || sending}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  aria-label="Send message">
                  <Send className="h-4 w-4" />
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
