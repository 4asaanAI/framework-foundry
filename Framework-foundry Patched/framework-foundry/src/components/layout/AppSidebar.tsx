import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAgents } from "@/hooks/use-agents";
import { useConversations } from "@/hooks/use-conversations";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import type { Team } from "@/types/layaa";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare,
  Bot,
  FolderKanban,
  CheckSquare,
  LayoutDashboard,
  Shield,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  LogOut,
  History,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Check,
  X,
  MoreHorizontal,
  BarChart3,
  Blocks,
  Kanban,
  Mail,
  GitBranch,
  Brain,
} from "lucide-react";
import { EditProfileDialog } from "@/components/dialogs/EditProfileDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NewConversationDialog } from "@/components/dialogs/NewConversationDialog";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAgentClick?: (agentId: string) => void;
  selectedAgentId?: string | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "sage", label: "Sage Memory", icon: Brain },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "crm", label: "CRM Board", icon: Kanban },
  { id: "insights", label: "Dashboard & Analytics", icon: LayoutDashboard },
  { id: "approvals", label: "Approvals", icon: Shield },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "customize", label: "Customize", icon: Blocks },
  { id: "settings", label: "Settings", icon: Settings },
];

function ChatHistoryItem({ conv, agents, onSelect, isActive }: { conv: any; agents: any[]; onSelect: () => void; isActive: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conv.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (renaming) inputRef.current?.focus();
  }, [renaming]);

  const agent = agents.find((a: any) => a.id === conv.agent_id);

  const handleRename = async () => {
    if (!renameValue.trim()) return;
    const { error } = await supabase.from("conversations").update({ title: renameValue.trim() }).eq("id", conv.id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Chat renamed");
    }
    setRenaming(false);
  };

  const handleStar = async () => {
    const { error } = await supabase.from("conversations").update({ is_starred: !conv.is_starred }).eq("id", conv.id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success(conv.is_starred ? "Unpinned" : "Pinned to top");
    }
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("conversations").update({ is_archived: true }).eq("id", conv.id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Chat deleted");
    }
    setMenuOpen(false);
  };

  return (
    <div className={cn("group flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors cursor-pointer", isActive ? "bg-primary/5 border border-primary/20" : "hover:bg-card/80")} onClick={onSelect}>
      {conv.is_starred && <Star className="h-3 w-3 text-warning shrink-0 fill-warning" />}
      {conv.branch_parent_id && <GitBranch className="h-3 w-3 text-muted-foreground shrink-0" />}
      {renaming ? (
        <div className="flex items-center gap-1 flex-1">
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
            className="flex-1 bg-background border border-border rounded px-1.5 py-0.5 text-xs text-foreground outline-none focus:border-primary"
          />
          <button onClick={() => setRenaming(false)} className="p-0.5 text-muted-foreground"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <div className="text-xs truncate text-foreground">{conv.branch_parent_id ? `↳ ${conv.title}` : conv.title}</div>
          {agent && (
            <div className="text-xs text-muted-foreground truncate">{agent.name}</div>
          )}
        </div>
      )}
      {!renaming && (
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1" align="end">
            <button onClick={() => { setRenaming(true); setRenameValue(conv.title); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-foreground hover:bg-muted transition-all duration-200">
              <Pencil className="h-3 w-3" /> Rename
            </button>
            <button onClick={handleStar} className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-foreground hover:bg-muted transition-all duration-200">
              {conv.is_starred ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
              {conv.is_starred ? "Unpin" : "Pin to top"}
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-destructive hover:bg-destructive/10 transition-all duration-200">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

function ChatHistorySection({ onAgentClick, onViewChange, selectedAgentId, activeView }: { onAgentClick?: (agentId: string) => void; onViewChange: (view: string) => void; selectedAgentId?: string | null; activeView: string }) {
  const [expanded, setExpanded] = useState(true);
  const { data: conversations } = useConversations();
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;

  const sorted = [...(conversations ?? [])].sort((a: any, b: any) => {
    if (a.is_starred && !b.is_starred) return -1;
    if (!a.is_starred && b.is_starred) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-200"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <History className="h-3 w-3" />
        Chat History
        {sorted.length > 0 && <span className="ml-auto text-xs opacity-60">{sorted.length}</span>}
      </button>
      {expanded && (
        <div className="mt-1 space-y-0.5 px-1">
          {sorted.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground italic">
              No conversations yet
            </div>
          ) : (
            sorted.map((conv: any) => (
              <ChatHistoryItem key={conv.id} conv={conv} agents={agents} isActive={activeView === "chat" && conv.agent_id === selectedAgentId && !conv.branch_parent_id} onSelect={() => {
                if (onAgentClick) onAgentClick(conv.agent_id);
                onViewChange("chat");
              }} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ProfileFooter() {
  const { profile, signOut } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  return (
    <div className="p-3 border-t border-border flex items-center gap-2">
      <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 flex-1 hover:bg-card rounded-lg p-1 transition-all duration-200">
        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-primary text-xs font-bold bg-primary/20">
          {profile?.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : (profile?.initials ?? "U")}
        </div>
        <span className="text-xs truncate">{profile?.name ?? "User"}</span>
      </button>
      <button onClick={signOut} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200" title="Sign out">
        <LogOut className="h-4 w-4" />
      </button>
      {showEdit && <EditProfileDialog open={showEdit} onOpenChange={setShowEdit} />}
    </div>
  );
}

export function AppSidebar({ activeView, onViewChange, onAgentClick, selectedAgentId, mobileOpen, onMobileClose }: SidebarProps) {
  const { data: dbAgents } = useAgents();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    founders_office: true,
    marketing: true,
  });
  const [showNewConversation, setShowNewConversation] = useState(false);

  const teams = [...new Set(agents.map((a) => a.team))] as Team[];

  const toggleTeam = (team: string) => {
    setExpandedTeams((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  const handleNewConversation = useCallback(async () => {
    setShowNewConversation(true);
  }, []);

  const handleNavClick = (view: string) => {
    onViewChange(view);
    if (onMobileClose) onMobileClose();
  };

  const handleAgentSelect = (agentId: string) => {
    if (onAgentClick) onAgentClick(agentId);
    handleNavClick("chat");
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}
    <aside className={cn(
      "w-64 sm:w-56 bg-sidebar border-r border-border flex flex-col h-full",
      "fixed lg:relative z-50 lg:z-auto",
      "transition-transform duration-300 ease-out",
      mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* New Conversation button */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={handleNewConversation}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow"
        >
          <Plus className="h-3.5 w-3.5" />
          New Conversation
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
              (activeView === item.id || (item.id === "insights" && (activeView === "dashboard" || activeView === "analytics")))
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/60"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        ))}

        {/* Chat History */}
        <ChatHistorySection onAgentClick={onAgentClick} onViewChange={onViewChange} selectedAgentId={selectedAgentId} activeView={activeView} />
      </nav>

      {/* Profile footer */}
      <ProfileFooter />

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onConversationCreated={(agentId) => {
          if (onAgentClick) onAgentClick(agentId);
          onViewChange("chat");
        }}
      />
    </aside>
    </>
  );
}
