import { FormEvent, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjects, getRecipes, saveProjects } from "@/lib/recipeLibrary";
import { Project } from "@/types/project";

export function MyRecipes() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const recipes = useMemo(() => getRecipes(), []);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = `${recipe.name} ${recipe.description} ${recipe.keywords.join(" ")} ${recipe.tags.join(" ")}`.toLowerCase();
    return (selectedProject === "all" || recipe.projectId === selectedProject) && searchText.includes(query.toLowerCase().trim());
  });

  const createProject = (event: FormEvent) => {
    event.preventDefault();
    const name = newProjectName.trim();
    if (!name) return;
    const project: Project = { id: `project-${Date.now()}`, name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const next = [...projects, project];
    setProjects(next);
    saveProjects(next);
    setSelectedProject(project.id);
    setNewProjectName("");
    setNewProjectOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="container max-w-5xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-medium text-muted-foreground">Your personal library</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">My Recipes</h1></div>
          <Button onClick={() => setNewProjectOpen(true)} variant="outline" className="w-fit gap-2 rounded-full"><Plus className="h-4 w-4" />New Project</Button>
        </div>

        <div className="relative mt-8 max-w-xl"><Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes..." className="h-12 rounded-full pl-11" /></div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button onClick={() => setSelectedProject("all")} className={`rounded-2xl border p-4 text-left transition ${selectedProject === "all" ? "border-primary bg-primary/10" : "bg-card hover:bg-accent"}`}><span className="font-medium">All Recipes</span><span className="mt-1 block text-sm text-muted-foreground">{recipes.length} Recipes</span></button>
          {projects.map((project) => <button key={project.id} onClick={() => setSelectedProject(project.id)} className={`rounded-2xl border p-4 text-left transition ${selectedProject === project.id ? "border-primary bg-primary/10" : "bg-card hover:bg-accent"}`}><span className="font-medium">{project.name}</span><span className="mt-1 block text-sm text-muted-foreground">{recipes.filter((recipe) => recipe.projectId === project.id).length} Recipes</span></button>)}
        </div>

        {newProjectOpen && <form onSubmit={createProject} className="mt-6 flex max-w-xl flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row"><Input autoFocus required value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="Project name" /><Button type="submit" className="rounded-full">Create Project</Button><Button type="button" variant="ghost" onClick={() => setNewProjectOpen(false)} className="rounded-full">Cancel</Button></form>}

        <div className="mt-12"><div className="flex items-baseline justify-between"><h2 className="text-xl font-semibold">{selectedProject === "all" ? "All Recipes" : projects.find((project) => project.id === selectedProject)?.name}</h2><span className="text-sm text-muted-foreground">{filteredRecipes.length} {filteredRecipes.length === 1 ? "Recipe" : "Recipes"}</span></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{filteredRecipes.map((recipe) => <button key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"><p className="text-lg font-semibold">{recipe.name}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.description}</p><p className="mt-5 text-xs font-medium text-muted-foreground">{projects.find((project) => project.id === recipe.projectId)?.name ?? "Personal"}</p></button>)}</div>
          {filteredRecipes.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">No recipes match that search.</div>}
        </div>
      </div>
    </div>
  );
}
