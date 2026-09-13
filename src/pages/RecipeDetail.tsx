import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProjects, getRecipes, projectForRecipe } from "@/lib/recipeLibrary";

export function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const recipe = getRecipes().find((item) => item.id === id);
  const project = recipe ? projectForRecipe(recipe, getProjects()) : undefined;

  if (!recipe) return <div className="container px-4 py-20 text-center"><p className="text-muted-foreground">Recipe not found.</p><Button onClick={() => navigate("/library")} variant="outline" className="mt-5 rounded-full">Back to My Recipes</Button></div>;

  return <div className="min-h-[calc(100vh-8rem)] bg-background"><div className="container max-w-2xl px-4 py-12 sm:py-20"><button onClick={() => navigate("/library")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />My Recipes</button><p className="mt-12 text-sm font-medium text-muted-foreground">{project?.name ?? "Personal"}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{recipe.name}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{recipe.description}</p><div className="mt-10 rounded-2xl border bg-card p-5"><p className="text-sm font-medium">A guided Recipe</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Answer a few simple questions and get a ready-to-use prompt.</p><Button onClick={() => navigate(`/?recipe=${recipe.id}`)} size="lg" className="mt-6 w-full gap-2 rounded-full">Use Recipe <ArrowRight className="h-4 w-4" /></Button></div></div></div>;
}
