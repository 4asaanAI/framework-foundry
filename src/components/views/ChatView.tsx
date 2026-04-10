import { useState, useRef, useEffect, useCallback } from "react";
import { useAgents } from "@/hooks/use-agents";
import { useConversations, useMessages } from "@/hooks/use-conversations";
import { useSkills } from "@/hooks/use-skills";
import { usePlugins } from "@/hooks/use-plugins";
import { useConnectors } from "@/hooks/use-connectors";
import { useProjects } from "@/hooks/use-projects";
import { MOCK_AGENTS } from "@/constants/agents";
import { Send, Plus, FolderKanban, ChevronDown, X, FileText, Image, File, PanelRightClose, ThumbsUp, ThumbsDown, Pin, Download, Star, StarOff, GitBranch, Loader2, AlertTriangle, FileArchive, FileType } from "lucide-react";
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
import { extractMemoriesFromMessage, saveExtractedMemories } from "@/lib/memory";
import { detectDelegation, setAgentNameMap } from "@/lib/delegation";
import { onMessageSent } from "@/lib/webhooks";
import { useApprovalWorkflow } from "@/hooks/use-approval-workflow";
import { NewConversationDialog } from "@/components/dialogs/NewConversationDialog";
import { EscalationDialog } from "@/components/dialogs/EscalationDialog";
import { useProjectAgents } from "@/hooks/use-project-agents";

interface ChatViewProps {
 selectedAgentId?: string | null;
 onDelegation?: (delegatedConversationId: string, targetAgentId: string, targetAgentName: string) => void;
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

export function ChatView({ selectedAgentId, onDelegation }: ChatViewProps) {
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
 const [mentionedAgent, setMentionedAgent] = useState<any>(null);
 const [newProjectOpen, setNewProjectOpen] = useState(false);
 const [inputHistoryIndex, setInputHistoryIndex] = useState(-1);
 const [pickerIndex, setPickerIndex] = useState(0);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const textareaRef = useRef<HTMLTextAreaElement>(null);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const draftTimerRef = useRef<ReturnType<typeof setTimeout>>();
 const abortControllerRef = useRef<AbortController | null>(null);

 const { data: dbAgents } = useAgents();
 const { user, profile } = useAuth();
 const queryClient = useQueryClient();
  const { data: projectAgents } = useProjectAgents(selectedProject?.id);
  const agents = projectAgents && projectAgents.length > 0 ? projectAgents : (dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS);
 const { submitForApproval } = useApprovalWorkflow();
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

 // Sync agent name map for delegation
 useEffect(() => {
 setAgentNameMap(agents.map((a) => ({ id: a.id, name: a.name })));
 }, [agents]);

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
 const exportAs = (fmt: string) => {
 let blob: Blob, ext: string;
 if (fmt === "json") {
 blob = new Blob([JSON.stringify(msgs, null, 2)], { type: "application/json" });
 ext = "json";
 } else if (fmt === "txt") {
 const txt = msgs.map((m: any) => `[${m.role}] ${new Date(m.created_at).toLocaleString()}\n${m.content}`).join("\n\n");
 blob = new Blob([txt], { type: "text/plain" });
 ext = "txt";
 } else {
 blob = new Blob([`# Conversation with ${activeAgent.name}\n\n${md}`], { type: "text/markdown" });
 ext = "md";
 }
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url; a.download = `conversation-${activeAgent.name}-${Date.now()}.${ext}`; a.click();
 URL.revokeObjectURL(url);
 };
 exportAs("md");
 toast.success("Conversation exported as Markdown. Use #export-json or #export-txt for other formats.");
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
 agentId: activeAgent.id,
 conversationId,
 profileId: user?.id,
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

 // Client-side memory extraction (fire-and-forget)
 (async () => {
 try {
 const extracted = extractMemoriesFromMessage(fullContent, "agent", conversationId);
 if (extracted.length > 0) {
 await saveExtractedMemories(activeAgent.id, extracted);
 console.log(`[Sage] extracted ${extracted.length} memories from agent response`);
 }
 } catch { /* ignore */ }
 })();

 // Refresh agent data for updated budget_used
 queryClient.invalidateQueries({ queryKey: ["agents"] });
 queryClient.invalidateQueries({ queryKey: ["token-usage"] });
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
 setMessage(""); setAttachedFiles([]);
 localStorage.removeItem(`draft_${activeAgent.id}`);
 queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

 // Fire webhook (fire-and-forget)
 if (user?.id) {
 onMessageSent({
 agentId: activeAgent.id,
 conversationId,
 messageContent: userMsg,
 }).catch(() => {});
 }

 // Approval keyword detection
 const APPROVAL_KEYWORDS = ["delete", "send email", "deploy", "modify billing", "change permissions", "financial transaction", "database migration"];
 const approvalKeyword = APPROVAL_KEYWORDS.find((kw) => userMsg.toLowerCase().includes(kw));
 if (approvalKeyword) {
 submitForApproval({
 agentId: activeAgent.id,
 actionType: approvalKeyword.replace(/\s+/g, "_"),
 actionDescription: `User requested: "${userMsg.slice(0, 100)}"`,
 actionPayload: { message: userMsg },
 conversationId,
 }).catch(() => {});
 }

 // If there's a mentioned agent, delegate to them first
 if (mentionedAgent && mentionedAgent.id !== activeAgent.id) {
 const delegateUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delegate-task`;
 try {
 const delegateResp = await fetch(delegateUrl, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
 },
 body: JSON.stringify({
 fromAgentId: activeAgent.id,
 toAgentId: mentionedAgent.id,
 task: userMsg,
 conversationId,
 profileId: user?.id,
 }),
 });
 if (delegateResp.ok) {
 queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
 queryClient.invalidateQueries({ queryKey: ["agents"] });
 queryClient.invalidateQueries({ queryKey: ["token-usage"] });
 }
 } catch (e) {
 console.error("Delegate error:", e);
 }
 }
 setMentionedAgent(null);

 // Fetch all messages for context and stream primary agent AI response
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
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.includes("pdf")) return <FileType className="h-4 w-4" />;
    if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) return <FileArchive className="h-4 w-4" />;
    if (type.includes("text") || type.includes("markdown")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getFileTypeBadge = (type: string) => {
    if (type.startsWith("image/")) return "IMG";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("zip") || type.includes("archive")) return "ZIP";
    if (type.includes("markdown")) return "MD";
    if (type.includes("text")) return "TXT";
    return "FILE";
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
 return displayMessages.map((msg: any, idx: number) => {
 const isMentionResponse = msg.role === "mention_response";
 const mentionAgent = isMentionResponse ? agents.find(a => a.id === msg.mention_agent_id) : null;
 const displayAgent = isMentionResponse && mentionAgent ? mentionAgent : activeAgent;
 const isForkPoint = msg.parent_message_id === null && branchConversations.some(
 (bc: any) => bc.branch_label?.includes(`msg ${idx + 1}`)
 );

 return (
 <div key={msg.id} className={cn("flex gap-3 py-3", msg.role === "user" ? "flex-row-reverse" : "")}>
 {isForkPoint && (
 <div className="absolute -top-2 right-2">
 <span className="text-[9px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded font-mono">
 BRANCHED AT MSG {idx + 1}
 </span>
 </div>
 )}

 <div className="flex gap-3 max-w-[85%]">
 {msg.role !== "user" && (
 <div className="shrink-0">
 <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: displayAgent.avatar_color }}>
 {displayAgent.avatar_initials}
 </div>
 </div>
 )}
 {msg.role === "user" && (
 <div className="shrink-0 order-last">
 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
 {profile?.initials ?? "U"}
 </div>
 </div>
 )}

 <div className={cn("rounded-2xl px-4 py-2.5 text-sm leading-relaxed", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
 {msg.is_pinned && <Pin className="h-3 w-3 text-warning inline mr-1" />}
 <div className="flex items-center gap-2 mb-1">
 <span className="font-semibold text-xs">
 {msg.role === "user" ? (profile?.name ?? "You") : displayAgent.name}
 </span>
 {isMentionResponse && <span className="text-[9px] bg-accent/20 px-1.5 py-0.5 rounded">mention response</span>}
 <span className="text-[9px] text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
 </div>
 <ReactMarkdown>{msg.content}</ReactMarkdown>

 {msg.attachments && Array.isArray(msg.attachments) && (msg.attachments as any[]).length > 0 && (
 <div className="mt-2 flex flex-wrap gap-2">
 {(msg.attachments as any[]).map((att: any, i: number) => (
 <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-xs hover:bg-muted/80">
 {getFileIcon(att.type || "")}
 {att.name}
 </a>
 ))}
 </div>
 )}
 {(msg.tokens_in > 0 || msg.tokens_out > 0) && (
 <div className="mt-1">
 <span className="text-[9px] text-muted-foreground">
 💰 {msg.tokens_in + msg.tokens_out} tokens
 </span>
 </div>
 )}
 {/* Message action buttons */}
 <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
 {msg.role !== "user" && (
 <>
 <button onClick={() => handleRate(msg.id, 1)}
 className={cn("p-0.5 rounded hover:bg-success/10 transition-colors", msg.rating === 1 ? "text-success" : "text-muted-foreground")}><ThumbsUp className="h-3 w-3" /></button>
 <button onClick={() => handleRate(msg.id, -1)}
 className={cn("p-0.5 rounded hover:bg-destructive/10 transition-colors", msg.rating === -1 ? "text-destructive" : "text-muted-foreground")}><ThumbsDown className="h-3 w-3" /></button>
 <button onClick={() => {
 navigator.clipboard.writeText(msg.content);
 toast.success("Copied to clipboard");
 }} className="p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground" title="Copy">
 <Download className="h-3 w-3" />
 </button>
 </>
 )}
 <button onClick={() => handlePin(msg.id, msg.is_pinned)}
 className={cn("p-0.5 rounded hover:bg-warning/10 transition-colors", msg.is_pinned ? "text-warning" : "text-muted-foreground")}><Pin className="h-3 w-3" /></button>
  <button onClick={() => handleFork(msg.id)}
  className="p-0.5 rounded hover:bg-accent/10 transition-colors text-muted-foreground" title="Branch from here"><GitBranch className="h-3 w-3" /></button>
  {msg.role !== "user" && (
  <button onClick={() => setShowEscalation(true)}
  className="p-0.5 rounded hover:bg-yellow-500/10 transition-colors text-muted-foreground" title="Escalate to human review"><AlertTriangle className="h-3 w-3" /></button>
  )}
  </div>
  </div>
  </div>
  </div>
 );
 });
 };

 const renderPickerList = (items: any[], type: "skill" | "command" | "mention") => (
 <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
 <div className="p-1">
 {items.map((item, idx) => (
 <button key={item.id || item.name} onClick={() => {
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
 <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
 style={{ backgroundColor: item.avatar_color }}>
 {item.avatar_initials}
 </div>
 )}
 <div className="flex-1 min-w-0">
 <span className="text-xs font-medium">
 {type === "skill" ? `/${item.name}` : type === "command" ? `#${item.name}` : `@${item.name}`}
 </span>
 <span className="text-[10px] text-muted-foreground ml-2">
 {type === "mention" ? item.canonical_role : item.description}
 </span>
 </div>
 {type === "skill" && (
 <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{item.category}</span>
 )}
 {type === "command" && (
 <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">built-in</span>
 )}
 {type === "mention" && (
 <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{item.team}</span>
 )}
 </button>
 ))}
 </div>
 </div>
 );

 return (
 <div className="flex flex-col h-full">
 {/* Agent header bar */}
 <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: activeAgent.avatar_color }}>
 {activeAgent.avatar_initials}
 </div>
 <div>
 <div className="font-semibold text-sm">{activeAgent.name}</div>
 <div className="text-[10px] text-muted-foreground">{activeAgent.canonical_role}</div>
 </div>
 {hasSplitScreen && (
 <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
 <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: mentionedAgent!.avatar_color }}>
 {mentionedAgent!.avatar_initials}
 </div>
 <div className="text-xs">
 <span className="text-muted-foreground">@{mentionedAgent!.name} joined</span>
 <button onClick={() => setMentionedAgent(null)} className="p-0.5 hover:bg-accent/20 rounded ml-1"><X className="h-3 w-3" /></button>
 </div>
 </div>
 )}
 </div>

 <div className="flex items-center gap-2">
 {/* New Conversation button */}
 <button
   onClick={() => setShowNewConversation(true)}
   className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
 >
   <Plus className="h-4 w-4" />
   New Conversation
 </button>

 {/* Branch indicator */}
 {branchConversations.length > 0 && (
 <Popover>
 <PopoverTrigger asChild>
 <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
 <GitBranch className="h-3.5 w-3.5" />
 {branchConversations.length} branch{branchConversations.length > 1 ? "es" : ""}
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-48 p-2">
 {branchConversations.map((bc: any) => (
 <div key={bc.id} className="text-xs py-1 text-muted-foreground">{bc.branch_label || bc.title}</div>
 ))}
 </PopoverContent>
 </Popover>
 )}

 <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
 <span>Context</span>
 <Progress value={contextUsage} className={cn("w-16 h-1.5", contextUsage > 80 && "[&>div]:bg-warning")} />
 <span>{Math.round(contextUsage)}%</span>
 </div>
 {activeConversation && (
 <button onClick={handleStarConversation} className="p-1 rounded hover:bg-card transition-colors">
 {activeConversation.is_starred ? <Star className="h-4 w-4 text-warning fill-warning" /> : <StarOff className="h-4 w-4 text-muted-foreground" />}
 </button>
 )}
 <button onClick={() => executeBuiltInCommand("export")} className="p-1 rounded hover:bg-card transition-colors" title="Export conversation">
 <Download className="h-4 w-4 text-muted-foreground" />
 </button>
 <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", streaming ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground")}>
 {streaming ? "thinking" : activeAgent.status ?? "idle"}
 </span>
 </div>
 </div>
 {/* Budget exhaustion banner */}
 {activeAgent.budget_used >= (activeAgent.budget_tokens + (activeAgent.budget_loaned ?? 0)) && (
 <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20">
 <p className="text-xs text-destructive">
 ⚠️ {activeAgent.name}'s token budget is exhausted. Transfer tokens from another agent or increase this agent's allocation.
 </p>
 </div>
 )}

 {/* Messages area */}
 <ScrollArea className="flex-1">
 <div className="max-w-3xl mx-auto p-4 space-y-1">
 {displayMessages.length === 0 && !streaming && (
 <div className="flex flex-col items-center justify-center h-[50vh] text-center">
 <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4" style={{ backgroundColor: activeAgent.avatar_color }}>
 {activeAgent.avatar_initials}
 </div>
 <h2 className="text-lg font-semibold mb-1">Chat with {activeAgent.name}</h2>
 <p className="text-sm text-muted-foreground max-w-md mb-3">{activeAgent.description}</p>
 <p className="text-xs text-muted-foreground">
 Type <code className="bg-muted px-1 py-0.5 rounded">#help</code> for commands, <code className="bg-muted px-1 py-0.5 rounded">/</code> for skills
 </p>
 </div>
 )}
 {renderMessages()}
 {/* Streaming message */}
 {streaming && streamingContent && (
 <div className="flex gap-3 py-3">
 <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: activeAgent.avatar_color }}>
 {activeAgent.avatar_initials}
 </div>
 <div className="bg-card border border-border rounded-2xl px-4 py-2.5 text-sm leading-relaxed">
 <span className="font-semibold text-xs mb-1 block">{activeAgent.name}</span>
 <ReactMarkdown>{streamingContent}</ReactMarkdown>
 </div>
 </div>
 )}
 {streaming && !streamingContent && (
 <div className="flex gap-3 py-3">
 <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: activeAgent.avatar_color }}>
 {activeAgent.avatar_initials}
 </div>
 <div className="bg-card border border-border rounded-2xl px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
 <Loader2 className="h-4 w-4 animate-spin" />
 {activeAgent.name} is thinking...
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>
 </ScrollArea>

 {hasSplitScreen && (
 <div className="w-80 border-l border-border bg-card/30 p-4 overflow-y-auto">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: mentionedAgent!.avatar_color }}>
 {mentionedAgent!.avatar_initials}
 </div>
 <div>
 <div className="text-xs font-medium">{mentionedAgent!.name}</div>
 <div className="text-[9px] text-muted-foreground">{mentionedAgent!.canonical_role}</div>
 </div>
 <button onClick={() => setMentionedAgent(null)} className="ml-auto p-1 rounded hover:bg-card transition-colors" title="Close split view">
 <PanelRightClose className="h-4 w-4 text-muted-foreground" />
 </button>
 </div>
 <p className="text-sm text-muted-foreground">
 @{mentionedAgent!.name} is ready to assist in this conversation.
 </p>
 <p className="text-xs text-muted-foreground mt-2">Responses from this agent will appear here.</p>
 </div>
 )}

 {/* Chat Input */}
 <div className="border-t border-border p-3 bg-card/50">
 <div className="relative max-w-3xl mx-auto">
 {/* Skill picker (/) */}
 {skillPickerOpen && filteredSkills.length > 0 && renderPickerList(filteredSkills.slice(0, 15), "skill")}
 {/* Command picker (#) */}
 {commandPickerOpen && builtInMatches.length > 0 && renderPickerList(builtInMatches, "command")}
 {/* Mention picker (@) */}
 {mentionPickerOpen && filteredAgents.length > 0 && renderPickerList(filteredAgents.slice(0, 10), "mention")}

 <div className="flex items-end gap-2 rounded-xl border border-border bg-card px-2 py-1">
 {/* Plus menu */}
 <Popover open={plusMenuOpen} onOpenChange={setPlusMenuOpen}>
 <PopoverTrigger asChild>
 <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0">
 <Plus className="h-5 w-5" />
 </button>
 </PopoverTrigger>
 <PopoverContent className="w-48 p-2" align="start">
 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
 <FileText className="h-4 w-4" /> Upload file
 </button>
 <button onClick={() => setProjectPickerOpen(!projectPickerOpen)} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
 <FolderKanban className="h-4 w-4" /> {selectedProject ? `Project: ${selectedProject.name}` : "Link project"}
 </button>
 {projectPickerOpen && (
 <div className="mt-1 border-t border-border pt-1">
 {(projects ?? []).map((p: any) => (
 <button key={p.id} onClick={() => { setSelectedProject({ id: p.id, name: p.name }); setProjectPickerOpen(false); setPlusMenuOpen(false); }}
 className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted rounded transition-colors truncate">{p.name}</button>
 ))}
 <button onClick={() => { setNewProjectOpen(true); setPlusMenuOpen(false); }}
 className="w-full text-left px-3 py-1.5 text-xs text-primary hover:bg-primary/5 rounded transition-colors flex items-center gap-1">
 <Plus className="h-3 w-3" /> New project
 </button>
 </div>
 )}
 </PopoverContent>
 </Popover>
  <input ref={fileInputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.zip,.md,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />

  {/* Upload progress */}
  {uploading && (
    <div className="flex items-center gap-2 shrink-0">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-xs text-muted-foreground">Uploading…</span>
    </div>
  )}

 {/* Attachments preview */}
 {attachedFiles.length > 0 && (
 <div className="flex items-center gap-1.5 overflow-x-auto">
  {attachedFiles.map((f, i) => (
  <div key={i} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs shrink-0">
  {getFileIcon(f.type)}
  <span className="truncate max-w-[100px]">{f.name}</span>
  <span className="px-1 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-mono">{getFileTypeBadge(f.type)}</span>
  <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
  </div>
  ))}
 </div>
 )}

 {/* Selected project badge */}
 {selectedProject && (
 <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs shrink-0">
 <FolderKanban className="h-3 w-3" />
 {selectedProject.name}
 <button onClick={() => setSelectedProject(null)}><X className="h-3 w-3" /></button>
 </div>
 )}

 {/* Mentioned agent badge */}
 {mentionedAgent && (
 <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 rounded text-xs shrink-0">
 <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ backgroundColor: mentionedAgent.avatar_color }}>
 {mentionedAgent.avatar_initials}
 </span>
 @{mentionedAgent.name}
 <button onClick={() => setMentionedAgent(null)}><X className="h-3 w-3" /></button>
 </div>
 )}

 <textarea
 ref={textareaRef}
 value={message}
 onChange={handleInputChange}
 onKeyDown={handleKeyDown}
 placeholder={`Message ${activeAgent.name}... (/ for skills, # for commands, @ to mention)`}
 className="flex-1 resize-none bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground min-h-[40px] max-h-[120px] py-2"
 rows={1}
 disabled={sending || uploading}
 />

 <button
 onClick={handleSend}
 disabled={(!message.trim() && attachedFiles.length === 0) || sending || streaming}
 className={cn("p-2 rounded-lg transition-colors shrink-0", message.trim() || attachedFiles.length > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground")}
 >
 {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
 </button>
  </div> {/* close border div */}
 </div>
 </div>

 <NewProjectDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />

 {/* New Conversation Dialog */}
 <NewConversationDialog
   open={showNewConversation}
   onOpenChange={setShowNewConversation}
   onConversationCreated={(agentId) => {
     setShowNewConversation(false);
   }}
  />

  {/* Escalation Dialog */}
  <EscalationDialog
    open={showEscalation}
    onOpenChange={setShowEscalation}
    agentId={activeAgent.id}
    agentName={activeAgent.name}
    conversationId={activeConversation?.id}
    linkedTaskId={null}
    conversationContext={(messages ?? []).slice(-20).map((m: any) => ({ role: m.role, content: m.content }))}
  />
  </div>
  );
}
