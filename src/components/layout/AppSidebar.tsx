import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { EditProfileDialog } from "@/components/dialogs/EditProfileDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onAgentClick?: (agentId: string) => void;
}

const NAV_ITEMS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "approvals", label: "Approvals", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Blocks },
  { id: "settings", label: "Settings", icon: Settings },
];

function ChatHistoryItem({ conv, agents, onSelect }: { conv: any; agents: any[]; onSelect: () => void }) {
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
    <div className="group flex items-center gap-1.5 rounded-lg hover:bg-card transition-colors px-2 py-1.5">
      {conv.is_starred && <Star className="h-2.5 w-2.5 text-warning shrink-0 fill-warning" />}
      {renaming ? (
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
            className="flex-1 bg-background border border-border rounded px-1.5 py-0.5 text-[11px] text-foreground outline-none focus:border-primary"
          />
          <button onClick={handleRename} className="p-0.5 text-success"><Check className="h-3 w-3" /></button>
          <button onClick={() => setRenaming(false)} className="p-0.5 text-muted-foreground"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <button onClick={onSelect} className="flex items-center gap-1.5 flex-1 min-w-0 text-left">
          {agent && (
            <div
              className="w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold shrink-0"
              style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}
            >
              {agent.avatar_initials}
            </div>
          )}
          <span className="text-[11px] text-muted-foreground truncate group-hover:text-foreground transition-colors">{conv.title}</span>
        </button>
      )}
      {!renaming && (
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all shrink-0">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1" align="start" side="right">
            <button onClick={() => { setRenaming(true); setRenameValue(conv.title); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[11px] text-foreground hover:bg-muted transition-colors">
              <Pencil className="h-3 w-3" /> Rename
            </button>
            <button onClick={handleStar}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[11px] text-foreground hover:bg-muted transition-colors">
              {conv.is_starred ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
              {conv.is_starred ? "Unpin" : "Pin to top"}
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[11px] text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

function ChatHistorySection({ onAgentClick, onViewChange }: { onAgentClick?: (agentId: string) => void; onViewChange: (view: string) => void }) {
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
    <div className="px-2 mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <History className="h-3 w-3" />
        Chat History
        {sorted.length > 0 && <span className="ml-auto text-[9px] font-normal">{sorted.length}</span>}
      </button>
      {expanded && (
        <div className="space-y-0.5 mt-1 max-h-[200px] overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-[10px] text-muted-foreground px-3 py-2">No conversations yet</p>
          ) : (
            sorted.map((conv: any) => (
              <ChatHistoryItem
                key={conv.id}
                conv={conv}
                agents={agents}
                onSelect={() => {
                  if (onAgentClick) onAgentClick(conv.agent_id);
                  onViewChange("chat");
                }}
              />
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
    <div className="px-3 py-3 border-t border-border">
      <div className="flex items-center gap-2">
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 flex-1 hover:bg-card rounded-lg p-1 transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: (profile?.color ?? "#2563EB") + "20", color: profile?.color ?? "#2563EB" }}
          >
            {profile?.initials ?? "U"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-foreground">{profile?.name ?? "User"}</span>
            <span className="text-[10px] text-muted-foreground">Edit profile</span>
          </div>
        </button>
        <button
          onClick={signOut}
          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-card transition-colors text-[10px]"
          title="Switch profile"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
      <EditProfileDialog open={showEdit} onOpenChange={setShowEdit} />
    </div>
  );
}

export function AppSidebar({ activeView, onViewChange, onAgentClick }: SidebarProps) {
  const { data: dbAgents } = useAgents();
  const agents = dbAgents && dbAgents.length > 0 ? dbAgents : MOCK_AGENTS;
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    founders_office: true,
    marketing: true,
  });

  const teams = [...new Set(agents.map((a) => a.team))] as Team[];

  const toggleTeam = (team: string) => {
    setExpandedTeams((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  return (
    <aside className="flex flex-col w-[240px] h-full bg-background border-r border-border shrink-0">
      <div className="px-3 py-3">
        <button
          onClick={() => onViewChange("chat")}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>
      </div>

      <nav className="px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors",
              activeView === item.id
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
            {item.id === "approvals" && (
              <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-warning/20 text-warning text-[10px] font-bold">
                2
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Chat History */}
      <ChatHistorySection onAgentClick={onAgentClick} onViewChange={onViewChange} />

      <div className="mt-2 px-2 flex-1 overflow-y-auto">
        <h4 className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Agents
        </h4>
        {teams.map((team) => {
          const teamAgents = agents.filter((a) => a.team === team);
          const isExpanded = expandedTeams[team];
          return (
            <div key={team} className="mb-1">
              <button
                onClick={() => toggleTeam(team)}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 rounded text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {TEAM_LABELS[team] || team}
              </button>
              {isExpanded && (
                <div className="space-y-0.5 ml-2">
                  {teamAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => onAgentClick ? onAgentClick(agent.id) : onViewChange("chat")}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-1.5 rounded text-xs transition-colors",
                        agent.is_active
                          ? "text-foreground hover:bg-card"
                          : "text-muted-foreground opacity-60"
                      )}
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ backgroundColor: agent.avatar_color + "20", color: agent.avatar_color }}
                      >
                        {agent.avatar_initials}
                      </div>
                      <span className="truncate">{agent.name}</span>
                      {agent.status === "thinking" && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                      )}
                      {!agent.is_active && (
                        <span className="ml-auto text-[9px] text-muted-foreground">⚠️</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ProfileFooter />
    </aside>
  );
}
