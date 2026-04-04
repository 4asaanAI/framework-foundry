import { FolderKanban, Plus, Users } from "lucide-react";

const MOCK_PROJECTS = [
  { id: "1", name: "EduFlow", description: "AI-powered education platform for client delivery", agents: ["dev", "neha", "kabir"], status: "active", progress: 78 },
  { id: "2", name: "Layaa Website", description: "Company website redesign and content update", agents: ["mira", "priya"], status: "active", progress: 45 },
  { id: "3", name: "Client Onboarding", description: "Sales pipeline and lead management automation", agents: ["rishi", "arjun"], status: "active", progress: 30 },
];

export function ProjectsView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organize work, assign agents, attach knowledge bases</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>
      <div className="px-6 py-4 space-y-3">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="rounded-xl border border-border bg-card p-5 hover:glow-border transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{project.progress}%</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[11px]">{project.agents.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
