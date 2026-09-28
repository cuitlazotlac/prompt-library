import { FormEvent, useMemo, useState } from "react";
import { Clock3, Folder, FolderPlus, Globe2, Grid2X2, List, Plus, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { getProjects, getRecipes, saveProjects } from "@/lib/recipeLibrary";
import { Project } from "@/types/project";

type LibraryTab = "personal" | "public";
type ViewMode = "grid" | "list";

const dateLabel = (date?: string) => date ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "Not visited yet";

export function MyRecipes() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [folders, setFolders] = useState<Project[]>(getProjects);
  const [recipes] = useState(getRecipes);
  const [tab, setTab] = useState<LibraryTab>("public");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "visited">("updated");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const visibleRecipes = useMemo(() => recipes.filter((recipe) => {
    const isPublic = recipe.visibility === "public";
    const text = `${recipe.name} ${recipe.description} ${recipe.keywords.join(" ")} ${recipe.tags.join(" ")}`.toLowerCase();
    return (tab === "public" ? isPublic : !isPublic) && (selectedFolder === "all" || recipe.projectId === selectedFolder) && text.includes(query.toLowerCase().trim());
  }).sort((a, b) => {
    const field = sortBy === "created" ? "createdAt" : sortBy === "visited" ? "lastVisitedAt" : "updatedAt";
    return (b[field] ?? "").localeCompare(a[field] ?? "");
  }), [recipes, tab, selectedFolder, query, sortBy]);

  const createFolder = (event: FormEvent) => {
    event.preventDefault();
    if (!newFolderName.trim()) return;
    const now = new Date().toISOString();
    const folder: Project = { id: `folder-${Date.now()}`, name: newFolderName.trim(), parentId: selectedFolder === "all" ? undefined : selectedFolder, createdAt: now, updatedAt: now };
    const next = [...folders, folder];
    setFolders(next);
    saveProjects(next);
    setSelectedFolder(folder.id);
    setNewFolderName("");
    setNewFolderOpen(false);
  };

  return <div className="min-h-[calc(100vh-8rem)] bg-background"><div className="container max-w-6xl px-4 py-10 sm:py-14">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-muted-foreground">Browse public Recipes, organize your own, and reuse them anytime</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Browse recipes</h1></div><div className="flex flex-wrap gap-2">{user && <Button onClick={() => setNewFolderOpen(true)} variant="outline" className="w-fit gap-2 rounded-full"><FolderPlus className="h-4 w-4" />New folder</Button>}<Button onClick={() => navigate("/")} className="w-fit gap-2 rounded-full"><Plus className="h-4 w-4" />Create prompt</Button></div></div>
    <div className="mt-8 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-6"><button onClick={() => { setTab("public"); setSelectedFolder("all"); }} className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium ${tab === "public" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}><Globe2 className="h-4 w-4" />Public recipes</button><button onClick={() => { setTab("personal"); setSelectedFolder("all"); }} className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium ${tab === "personal" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}><UserRound className="h-4 w-4" />Personal recipes</button></div>{!(tab === "personal" && !user) && <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes..." className="h-10 rounded-full pl-10" /></div>}</div>
    {newFolderOpen && <form onSubmit={createFolder} className="mt-5 flex max-w-xl flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row"><Input autoFocus required value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder="Folder name" /><Button type="submit" className="rounded-full">Create folder</Button><Button type="button" variant="ghost" onClick={() => setNewFolderOpen(false)} className="rounded-full">Cancel</Button></form>}
    {tab === "personal" && user && <div className="mt-8 flex gap-3 overflow-x-auto pb-1"><button onClick={() => setSelectedFolder("all")} className={`flex min-w-32 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm ${selectedFolder === "all" ? "border-primary bg-primary/20" : "bg-card"}`}><Folder className="h-4 w-4" />All recipes</button>{folders.filter((folder) => !folder.parentId || selectedFolder === folder.parentId).map((folder) => <button key={folder.id} title={`Created ${dateLabel(folder.createdAt)}`} onClick={() => setSelectedFolder(folder.id)} className={`flex min-w-32 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm ${selectedFolder === folder.id ? "border-primary bg-primary/20" : "bg-card"}`}><Folder className="h-4 w-4" />{folder.name}<span className="text-xs text-muted-foreground">{recipes.filter((recipe) => recipe.projectId === folder.id).length}</span></button>)}</div>}
    {tab === "personal" && !user ? <div className="mx-auto mt-16 max-w-md rounded-3xl border bg-card p-10 text-center"><h2 className="text-2xl font-semibold">Save your recipes</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in with Google to save, organize, and reuse your recipes anytime.</p><Button onClick={signInWithGoogle} className="mt-6 gap-2 rounded-full"><FcGoogle className="h-5 w-5" />Sign in with Google</Button></div> : <><div className="mt-10 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{selectedFolder === "all" ? (tab === "public" ? "Public recipes" : "All recipes") : folders.find((folder) => folder.id === selectedFolder)?.name}</h2><p className="mt-1 text-sm text-muted-foreground">{visibleRecipes.length} {visibleRecipes.length === 1 ? "recipe" : "recipes"}</p></div><div className="flex items-center gap-2"><Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}><SelectTrigger className="h-10 w-36 rounded-full px-4 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="updated">Last changed</SelectItem><SelectItem value="created">Date created</SelectItem><SelectItem value="visited">Last visited</SelectItem></SelectContent></Select><button onClick={() => setViewMode("grid")} className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-accent text-black" : "text-muted-foreground"}`} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button><button onClick={() => setViewMode("list")} className={`rounded-lg p-2 ${viewMode === "list" ? "bg-accent text-black" : "text-muted-foreground"}`} aria-label="List view"><List className="h-4 w-4" /></button></div></div>
    <div className={`mt-5 ${viewMode === "grid" ? "grid gap-4 sm:grid-cols-2" : "divide-y rounded-2xl border bg-card"}`}>{visibleRecipes.map((recipe) => <button key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className={viewMode === "grid" ? "rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm" : "flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-accent hover:text-black"}><div className="min-w-0"><p className="truncate text-lg font-semibold">{recipe.name}</p><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.description}</p><p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">{tab === "public" ? <Globe2 className="h-3.5 w-3.5" /> : recipe.projectId ? <Folder className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}{tab === "public" ? "Public recipe" : folders.find((folder) => folder.id === recipe.projectId)?.name ?? "Personal"}</p></div><div className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex"><Clock3 className="h-3.5 w-3.5" />{sortBy === "visited" ? dateLabel(recipe.lastVisitedAt) : sortBy === "created" ? dateLabel(recipe.createdAt) : dateLabel(recipe.updatedAt)}</div></button>)}</div>
    {visibleRecipes.length === 0 && <div className="mt-5 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">No {tab} recipes match that search.</div>}
    </>}
  </div></div>;
}
