import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useWorkContexts } from "@/hooks/use-work-contexts";
import { useAuth } from "@/contexts/AuthContext";
import { FolderKanban, Plus, Users, Loader2, Pencil, FolderOpen, Clock, Search, MoreHorizontal, Archive, Trash2, FolderInput } from "lucide-react";
import { NewProjectDialog } from "@/components/dialogs/NewProjectDialog";
import { EditProjectDialog } from "@/components/dialogs/EditProjectDialog";
import { ProjectDetailsPanel } from "@/components/dialogs/ProjectDetailsPanel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isFileSystemAccessSupported, pickFolder, storeDirectoryHandle } from "@/lib/filesystem";
import { openFolderAsProject } from "@/lib/projects";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MOCK_PROJECTS = [
  { id: "1", name: "EduFlow", description: "AI-powered education platform for client delivery", agent_count: 3, is_active: true },
  { id: "2", name: "Layaa Website", description: "Company website redesign and content update", agent_count: 2, is_active: true },
  { id: "3", name: "Client Onboarding", description: "Sales pipeline and lead management automation", agent_count: 2, is_active: true },
];

export function ProjectsView() {
  const { data: dbProjects, isLoading } = useProjects();
  const { data: contexts } = useWorkContexts();
  const { user } = useAuth();
  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;
  const [showNew, setShowNew] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [detailsProject, setDetailsProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery
    ? projects.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  const handleOpenFolder = async () => {
    if (!isFileSystemAccessSupported()) {
      toast.error("Folder access requires Chrome or Edge browser");
      return;
    }
    if (!user) return;

    try {
      const result = await pickFolder();
      if (!result) return; // user cancelled

      const { projectId, contextId } = await openFolderAsProject({
        folderPath: result.name,
        displayName: result.name,
        userId: user.id,
      });

      // Store the handle in memory for file operations
      storeDirectoryHandle(contextId, result.handle);
      toast.success(`Opened "${result.name}" as a project`);
    } catch (err: any) {
      toast.error(err.message || "Failed to open folder");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-muted" /><div className="h-3 bg-muted rounded w-28" /></div>
              <div className="h-2 bg-muted rounded w-full" />
              <div className="h-2 bg-muted rounded w-3/4" />
              <div className="flex justify-between"><div className="h-4 bg-muted rounded w-16" /><div className="h-3 bg-muted rounded w-20" /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Recent contexts (sorted by last used)
  const recentContexts = (contexts ?? []).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-3 sm:px-6 py-4 sm:py-5 border-b border-border bg-background">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Organize work, assign agents, and manage knowledge — Layaa OS</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFolder}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-primary/20 hover:shadow-sm transition-all duration-200"
            >
              <FolderOpen className="h-4 w-4" /> Open Folder
            </button>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm transition-all duration-200"
            >
              <Plus className="h-4 w-4" /> New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Recent work contexts */}
        {recentContexts.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Recent
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentContexts.map((ctx: any) => (
                <button
                  key={ctx.context_id}
                  onClick={() => {
                    const proj = projects.find((p: any) => (p.project_id || p.id) === ctx.project_id);
                    if (proj) setDetailsProject(proj);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200 shrink-0 min-w-[200px]"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {ctx.context_type === "local_folder" ? <FolderInput className="h-4 w-4 text-primary" /> : <FolderKanban className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{ctx.display_name || ctx.projects?.name || "Untitled"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ctx.last_used_at ? new Date(ctx.last_used_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Never opened"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
          />
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project: any) => {
            const isMock = typeof project.id === "string" && project.id.length === 1;
            const ctx = (contexts ?? []).find((c: any) => c.project_id === (project.project_id || project.id));
            return (
              <div
                key={project.id || project.project_id}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => setDetailsProject(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {ctx?.context_type === "local_folder"
                        ? <FolderInput className="h-4 w-4 text-primary" />
                        : <FolderKanban className="h-4 w-4 text-primary" />}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{project.name}</h3>
                  </div>
                  {!isMock && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-36 p-1" align="end">
                        <button onClick={(e) => { e.stopPropagation(); setEditProject(project); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-muted transition-all duration-200">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-all duration-200">
                          <Archive className="h-3 w-3" /> Archive
                        </button>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                {ctx?.folder_path && (
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1 truncate">
                    <FolderOpen className="h-3 w-3 shrink-0" /> {ctx.folder_path}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs px-2 py-1 rounded-full", project.is_active !== false ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {project.is_active !== false ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> {project.agent_count ?? 0} agents
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FolderKanban className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm">{searchQuery ? "No projects match your search" : "No projects yet. Create one to get started."}</p>
          </div>
        )}
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
  );
}
