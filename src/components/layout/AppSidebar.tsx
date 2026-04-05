import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAgents } from "@/hooks/use-agents";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_AGENTS, TEAM_LABELS } from "@/constants/agents";
import type { Team } from "@/types/layaa";
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
} from "lucide-react";

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
  { id: "approvals", label: "Approvals", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

function ProfileFooter() {
  const { profile, signOut } = useAuth();
  return (
    <div className="px-3 py-3 border-t border-border">
      <button onClick={signOut} className="flex items-center gap-2 w-full hover:bg-card rounded-lg p-1 transition-colors">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ backgroundColor: (profile?.color ?? "#2563EB") + "20", color: profile?.color ?? "#2563EB" }}
        >
          {profile?.initials ?? "U"}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-medium text-foreground">{profile?.name ?? "User"}</span>
          <span className="text-[10px] text-muted-foreground">Switch profile</span>
        </div>
      </button>
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

      <div className="mt-4 px-2 flex-1 overflow-y-auto">
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
