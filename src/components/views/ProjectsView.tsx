import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { FolderKanban, Plus, Users, Loader2, Pencil } from "lucide-react";
import { NewProjectDialog } from "@/components/dialogs/NewProjectDialog";
import { EditProjectDialog } from "@/components/dialogs/EditProjectDialog";
import { ProjectDetailsPanel } from "@/components/dialogs/ProjectDetailsPanel";

const MOCK_PROJECTS = [
 { id: "1", name: "EduFlow", description: "AI-powered education platform for client delivery", agent_count: 3, is_active: true },
 { id: "2", name: "Layaa Website", description: "Company website redesign and content update", agent_count: 2, is_active: true },
 { id: "3", name: "Client Onboarding", description: "Sales pipeline and lead management automation", agent_count: 2, is_active: true },
];

export function ProjectsView() {
 const { data: dbProjects, isLoading } = useProjects();
 const projects = dbProjects && dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;
 const [showNew, setShowNew] = useState(false);
 const [editProject, setEditProject] = useState<any>(null);
 const [detailsProject, setDetailsProject] = useState<any>(null);

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-full">
 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
 </div>
 );
 }

 return (
 <div className="flex-1 overflow-y-auto p-6">
 <div className="max-w-4xl mx-auto">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold">Projects</h1>
 <p className="text-sm text-muted-foreground">Organize work, assign agents, attach knowledge bases</p>
 </div>
 <button onClick={() => setShowNew(true)}
 className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
 <Plus className="h-4 w-4" /> New Project
 </button>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {projects.map((project: any) => {
 const isMock = typeof project.id === "string" && project.id.length === 1;
 return (
 <div
   key={project.id}
   className="group border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
   onClick={() => setDetailsProject(project)}
 >
 <div className="flex items-start justify-between mb-2">
 <h3 className="font-semibold text-sm">{project.name}</h3>
 {!isMock && (
 <button onClick={(e) => { e.stopPropagation(); setEditProject(project); }}
 className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all" title="Edit">
 <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
 </button>
 )}
 </div>
 <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
 <div className="flex items-center justify-between">
 <span className={`text-[10px] px-2 py-0.5 rounded-full ${project.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
 {project.is_active ? "Active" : "Inactive"}
 </span>
 <span className="text-[10px] text-muted-foreground flex items-center gap-1">
 <Users className="h-3 w-3" /> {project.agent_count ?? 0} agents
 </span>
 </div>
 </div>
 );
 })}
 </div>

 <NewProjectDialog open={showNew} onOpenChange={setShowNew} />
 {editProject && <EditProjectDialog open={!!editProject} onOpenChange={(o) => !o && setEditProject(null)} project={editProject} />}
 {detailsProject && (
   <ProjectDetailsPanel
     open={!!detailsProject}
     onOpenChange={(o) => !o && setDetailsProject(null)}
     project={detailsProject}
   />
 )}
 </div>
 </div>
 );
}
