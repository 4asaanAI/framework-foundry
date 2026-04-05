import { useProjects } from "@/hooks/use-projects";
import { FolderKanban, Plus, Users, Loader2 } from "lucide-react";

const MOCK_PROJECTS = [
  { id: "1", name: "EduFlow", description: "AI-powered education platform for client delivery", agent_count: 3, is_active: true },
  { id: "2", name: "Layaa Website", description: "Company website redesign and content update", agent_count: 2, is_active: true },
  { id: "3", name: "Client Onboarding", description: "Sales pipeline and lead management automation", agent_count: 2, is_active: true },
];

export function ProjectsView() {
  const { data: dbProjects, isLoading } = useProjects();
  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        {projects.map((project: any) => (
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
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${project.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {project.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[11px]">{project.agent_count ?? 0} agents</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
