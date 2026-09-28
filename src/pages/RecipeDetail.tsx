import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Copy, ExternalLink, Folder, Pencil, UserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { duplicateRecipe, getProjects, getPrompts, getRecipes, projectForRecipe, saveRecipes } from "@/lib/recipeLibrary";

export function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const recipe = getRecipes().find((item) => item.id === id);
  const project = recipe ? projectForRecipe(recipe, getProjects()) : undefined;
  const savedPrompt = recipe ? getPrompts().find((prompt) => prompt.recipeId === recipe.id) : undefined;
  useEffect(() => { if (recipe) saveRecipes(getRecipes().map((item) => item.id === recipe.id ? { ...item, lastVisitedAt: new Date().toISOString() } : item)); }, [id]);
  if (!recipe) return <div className="container px-4 py-20 text-center"><p className="text-muted-foreground">Recipe not found.</p><Button onClick={() => navigate("/library")} variant="outline" className="mt-5 rounded-full">Back to recipes</Button></div>;
  const isPublicForVisitor = recipe.visibility === "public" && recipe.authorId !== user?.uid;
  const promptContent = savedPrompt?.content ?? recipe.promptTemplate;
  const copyPrompt = async () => { await navigator.clipboard.writeText(promptContent); };
  return <div className="min-h-[calc(100vh-8rem)] bg-background"><div className="container max-w-2xl px-4 py-12 sm:py-20">
    <button onClick={() => navigate("/library")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Browse recipes</button>
    <nav className="mt-10 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumbs"><Link to="/library" className="flex items-center gap-1 hover:text-foreground">{isPublicForVisitor ? "Public recipes" : <><UserRound className="h-4 w-4" />Personal recipes</>}</Link><ChevronRight className="h-4 w-4" />{!isPublicForVisitor && <><Link to="/library" className="flex items-center gap-1 hover:text-foreground"><Folder className="h-4 w-4" />{project?.name ?? "Personal"}</Link><ChevronRight className="h-4 w-4" /></>}<span className="text-foreground">{recipe.name}</span></nav>
    <h1 className="mt-8 text-4xl font-semibold tracking-tight">{recipe.name}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{recipe.description}</p>
    <section className="mt-10 border-t pt-8"><h2 className="text-xl font-semibold">The prompt</h2><p className="mt-4 whitespace-pre-wrap rounded-2xl border bg-card p-5 text-sm leading-6">{promptContent}</p><div className="mt-4 flex flex-wrap gap-2"><Button onClick={copyPrompt} className="gap-2 rounded-full"><Copy className="h-4 w-4" />Copy Prompt</Button><Button onClick={() => window.open(`https://chatgpt.com/?q=${encodeURIComponent(promptContent)}`, "_blank", "noopener,noreferrer")} variant="outline" className="gap-2 rounded-full"><ExternalLink className="h-4 w-4" />Open ChatGPT</Button></div></section>
    <div className="mt-6 rounded-2xl border bg-card p-5"><p className="text-sm font-medium">Use this Recipe again</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Review or Edit your previous answers</p><Button onClick={() => setDetailsOpen(true)} variant="outline" className="mt-5 w-full rounded-full">View my recipe details</Button><Button onClick={() => setEditOpen(true)} size="lg" className="mt-3 w-full gap-2 rounded-full"><Pencil className="h-4 w-4" />Edit my answers</Button></div>
    {detailsOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true"><div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-background p-6 shadow-xl"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Your answers</h2><Button onClick={() => setDetailsOpen(false)} variant="ghost" className="rounded-full">Close</Button></div><div className="mt-5 space-y-4">{recipe.questions.map((question) => <div key={question.key} className="rounded-2xl border bg-card p-4"><p className="text-sm font-medium">{question.label}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{savedPrompt?.answers?.[question.key] || "Not answered"}</p></div>)}</div></div></div>}
    {editOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-3xl border bg-background p-6 shadow-xl"><h2 className="text-xl font-semibold">How would you like to continue?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose whether to update this recipe or create a separate copy first. Your existing answers will be filled in either way.</p><div className="mt-6 grid gap-3"><Button onClick={() => navigate(`/?recipe=${recipe.id}&edit=1`)} className="rounded-full">Edit existing answers</Button><Button onClick={() => { const copy = duplicateRecipe(recipe.id); navigate(`/?recipe=${copy?.id ?? recipe.id}&edit=1`); }} variant="outline" className="rounded-full">Duplicate recipe first</Button><Button onClick={() => setEditOpen(false)} variant="ghost" className="rounded-full">Cancel</Button></div></div></div>}
  </div></div>;
}
