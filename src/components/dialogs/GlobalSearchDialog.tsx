import { useState, useEffect, useCallback } from "react";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useAgents } from "@/hooks/use-agents";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useConnectors } from "@/hooks/use-connectors";
import { usePlugins } from "@/hooks/use-plugins";
import { useConversations } from "@/hooks/use-conversations";
import { Bot, FolderKanban, Wrench, Plug, Puzzle, MessageSquare, Settings, History } from "lucide-react";

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

  const handleSelect = (type: string, id?: string) => {
    onOpenChange(false);
    if (type === "agent" && id && onAgentClick) {
      onAgentClick(id);
    } else {
      onNavigate(type, id);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search agents, projects, chats, skills, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick navigation */}
        <CommandGroup heading="Navigate">
          {["Chat", "Agents", "Projects", "Tasks", "Dashboard", "Approvals", "Settings"].map(v => (
            <CommandItem key={v} onSelect={() => handleSelect(v.toLowerCase())}>
              {v === "Chat" && <MessageSquare className="mr-2 h-4 w-4" />}
              {v === "Agents" && <Bot className="mr-2 h-4 w-4" />}
              {v === "Projects" && <FolderKanban className="mr-2 h-4 w-4" />}
              {v === "Settings" && <Settings className="mr-2 h-4 w-4" />}
              <span>{v}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Agents */}
        {agents && agents.length > 0 && (
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
        {projects && projects.length > 0 && (
          <CommandGroup heading="Projects">
            {projects.map(p => (
              <CommandItem key={p.id} onSelect={() => handleSelect("projects")}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>{p.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Chat History */}
        {conversations && conversations.length > 0 && (
          <CommandGroup heading="Chat History">
            {conversations.slice(0, 15).map((c: any) => {
              const agentInfo = c.agents;
              return (
                <CommandItem key={c.id} onSelect={() => handleSelect("chat", c.agent_id)}>
                  <History className="mr-2 h-4 w-4 shrink-0" />
                  <span className="text-left truncate flex-1">{c.title}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground text-right shrink-0">
                    {agentInfo?.name || "Agent"}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
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
