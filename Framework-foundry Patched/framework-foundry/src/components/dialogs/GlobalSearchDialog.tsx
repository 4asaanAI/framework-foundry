import { useState, useEffect, useCallback } from "react";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useAgents } from "@/hooks/use-agents";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useConnectors } from "@/hooks/use-connectors";
import { usePlugins } from "@/hooks/use-plugins";
import { useConversations } from "@/hooks/use-conversations";
import { useTasks } from "@/hooks/use-tasks";
import { Bot, FolderKanban, Wrench, Plug, Puzzle, MessageSquare, Settings, History, CheckSquare, Brain, LayoutDashboard, Shield, Kanban, Clock } from "lucide-react";

const RECENT_SEARCHES_KEY = "layaa_recent_searches";
const MAX_RECENT = 5;

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: string, id?: string) => void;
  onAgentClick?: (agentId: string) => void;
}

export function GlobalSearchDialog({ open, onOpenChange, onNavigate, onAgentClick }: GlobalSearchDialogProps) {
  const { data: agents } = useAgents();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: connectors } = useConnectors();
  const { data: plugins } = usePlugins();
  const { data: conversations } = useConversations();
  const { data: tasks } = useTasks();
  const [scope, setScope] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"); } catch { return []; }
  });

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSelect = (type: string, id?: string, searchQuery?: string) => {
    if (searchQuery) saveRecentSearch(searchQuery);
    onOpenChange(false);
    if (type === "agent" && id && onAgentClick) {
      onAgentClick(id);
    } else {
      onNavigate(type, id);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search agents, projects, chats, tasks, skills..." />
      {/* Scope filter */}
      <div className="flex gap-1 px-3 py-1.5 border-b border-border overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "agents", label: "Agents" },
          { id: "tasks", label: "Tasks" },
          { id: "projects", label: "Projects" },
          { id: "conversations", label: "Chats" },
          { id: "skills", label: "Skills" },
        ].map(s => (
          <button key={s.id} onClick={() => setScope(s.id)}
            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 ${scope === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Recent searches */}
        {recentSearches.length > 0 && scope === "all" && (
          <CommandGroup heading="Recent">
            {recentSearches.map((q, i) => (
              <CommandItem key={i} onSelect={() => {}}>
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{q}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Quick navigation */}
        <CommandGroup heading="Navigate">
          {[
            { id: "chat", label: "Chat", icon: MessageSquare },
            { id: "sage", label: "Sage Memory", icon: Brain },
            { id: "agents", label: "Agents", icon: Bot },
            { id: "projects", label: "Projects", icon: FolderKanban },
            { id: "tasks", label: "Tasks", icon: CheckSquare },
            { id: "crm", label: "CRM Board", icon: Kanban },
            { id: "insights", label: "Dashboard & Analytics", icon: LayoutDashboard },
            { id: "approvals", label: "Approvals", icon: Shield },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(v => (
            <CommandItem key={v.id} onSelect={() => handleSelect(v.id)}>
              <v.icon className="mr-2 h-4 w-4" />
              <span>{v.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Agents */}
        {agents && agents.length > 0 && (scope === "all" || scope === "agents") && (
          <CommandGroup heading="Agents">
            {agents.map(a => (
              <CommandItem key={a.id} onSelect={() => handleSelect("agent", a.id)}>
                <Bot className="mr-2 h-4 w-4" />
                <span>{a.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{a.canonical_role}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (scope === "all" || scope === "projects") && (
          <CommandGroup heading="Projects">
            {projects.map(p => (
              <CommandItem key={(p as any).project_id ?? (p as any).id} onSelect={() => handleSelect("projects")}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>{p.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Chat History */}
        {conversations && conversations.length > 0 && (scope === "all" || scope === "conversations") && (
          <CommandGroup heading="Chat History">
            {conversations.slice(0, 15).map((c: any) => {
              const agentInfo = c.agents;
              return (
                <CommandItem key={c.id} onSelect={() => handleSelect("chat", c.agent_id)}>
                  <History className="mr-2 h-4 w-4 shrink-0" />
                  <span className="text-left truncate flex-1">{c.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground text-right shrink-0">
                    {agentInfo?.name || "Agent"}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Tasks */}
        {tasks && tasks.length > 0 && (scope === "all" || scope === "tasks") && (
          <CommandGroup heading="Tasks">
            {tasks.slice(0, 10).map((t: any) => (
              <CommandItem key={t.id} onSelect={() => handleSelect("tasks")}>
                <CheckSquare className="mr-2 h-4 w-4" />
                <span className="truncate flex-1">{t.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{t.status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (scope === "all" || scope === "skills") && (
          <CommandGroup heading="Skills">
            {skills.slice(0, 10).map(s => (
              <CommandItem key={s.id} onSelect={() => handleSelect("settings")}>
                <Wrench className="mr-2 h-4 w-4" />
                <span>{s.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{s.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Connectors */}
        {connectors && connectors.length > 0 && (
          <CommandGroup heading="Connectors">
            {connectors.map(c => (
              <CommandItem key={c.id} onSelect={() => handleSelect("settings")}>
                <Plug className="mr-2 h-4 w-4" />
                <span>{c.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Plugins */}
        {plugins && plugins.length > 0 && (
          <CommandGroup heading="Plugins">
            {plugins.map(p => (
              <CommandItem key={p.id} onSelect={() => handleSelect("settings")}>
                <Puzzle className="mr-2 h-4 w-4" />
                <span>{p.display_name || p.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
