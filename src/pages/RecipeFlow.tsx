import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import toast from "react-hot-toast";
import { starterRecipes } from "@/data/recipes";
import { findBestRecipe } from "@/lib/recipeMatcher";
import { promptGenerator, RecipeAnswers } from "@/lib/promptGenerator";
import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GuidedQuestionFlow } from "@/components/GuidedQuestionFlow";
import { getRecipes } from "@/lib/recipeLibrary";
import { getPrompts, getProjects, savePrompt, saveRecipes } from "@/lib/recipeLibrary";
import { deterministicRecipeBuilder } from "@/lib/recipeBuilder";
import { useAuth } from "@/contexts/AuthContext";

type Step = "request" | "questions" | "result";

const inspirations = [
  "Write a difficult email to my landlord",
  "Apply for a job I really want",
  "Plan a calmer, more realistic week",
  "Ask for a refund without sounding rude",
  "Prepare for an important conversation",
  "Turn my messy notes into a clear plan",
];

const placeholderExamples = [
  "Write a kind message to reschedule a meeting",
  "Plan a simple dinner for a busy week",
  "Explain a complicated idea in plain language",
  "Prepare questions for an important conversation",
  "Turn my notes into a clear project plan",
];

export function RecipeFlow() {
  const [searchParams] = useSearchParams();
  const { user, signInWithGoogle } = useAuth();
  const requestedRecipe = getRecipes().find((item) => item.id === searchParams.get("recipe"));
  const requestedPrompt = requestedRecipe ? getPrompts().find((item) => item.recipeId === requestedRecipe.id) : undefined;
  const [step, setStep] = useState<Step>(requestedRecipe ? "questions" : "request");
  const [request, setRequest] = useState("");
  const [placeholderExample, setPlaceholderExample] = useState(placeholderExamples[0]);
  const [recipe, setRecipe] = useState<Recipe | null>(requestedRecipe ?? null);
  const [answers, setAnswers] = useState<RecipeAnswers>(searchParams.get("edit") === "1" ? requestedPrompt?.answers ?? {} : {});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState(requestedRecipe?.name ?? "");
  const [saveProjectId, setSaveProjectId] = useState(requestedRecipe?.projectId ?? "personal");
  const [saveVisibility, setSaveVisibility] = useState<"private" | "public">(requestedRecipe?.visibility ?? "private");
  const [saveAnonymous, setSaveAnonymous] = useState(requestedRecipe?.isAnonymous ?? false);
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    let exampleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeoutId: number;

    const tick = () => {
      const example = placeholderExamples[exampleIndex];
      if (!deleting) {
        characterIndex = Math.min(characterIndex + 1, example.length);
        setPlaceholderExample(example.slice(0, characterIndex));
        if (characterIndex === example.length) {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1800);
          return;
        }
      } else {
        characterIndex = Math.max(characterIndex - 1, 0);
        setPlaceholderExample(example.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          exampleIndex = (exampleIndex + 1) % placeholderExamples.length;
        }
      }
      timeoutId = window.setTimeout(tick, deleting ? 28 : 48);
    };

    timeoutId = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const findRecipe = (event: FormEvent) => {
    event.preventDefault();
    const match = findBestRecipe(request, starterRecipes);
    const nextRecipe = match?.recipe ?? deterministicRecipeBuilder.build(request);
    setRecipe(nextRecipe);
    setAnswers({});
    setSaveName(nextRecipe.name);
    setSaveProjectId(nextRecipe.projectId);
    setSaveVisibility(nextRecipe.visibility);
    setSaveAnonymous(nextRecipe.isAnonymous ?? false);
    setSavedRecipeId(null);
    setStep("questions");
  };

  const generatePrompt = () => {
    if (!recipe) return;
    try {
      setGeneratedPrompt(promptGenerator.generate(recipe, answers));
      setStep("result");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please complete the questions.");
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success("Prompt copied");
    } catch {
      toast.error("Couldn’t copy automatically. Please select and copy the text.");
    }
  };

  const restart = () => {
    setRequest("");
    setRecipe(null);
    setAnswers({});
    setGeneratedPrompt("");
    setCopied(false);
    setSaveOpen(false);
    setStep("request");
  };

  const saveRecipe = async () => {
    if (!recipe || !saveName.trim()) return;
    if (!user) {
      await signInWithGoogle();
      toast.success("You’re signed in locally. Press Save Recipe again to continue.");
      return;
    }
    const savedRecipe = { ...recipe, name: saveName.trim(), projectId: saveProjectId, visibility: saveVisibility, authorId: user?.uid ?? recipe.authorId, isAnonymous: saveAnonymous, authorName: saveAnonymous ? "Anonymous" : recipe.authorName, updatedAt: new Date().toISOString() };
    const recipes = getRecipes();
    saveRecipes(recipes.some((item) => item.id === recipe.id) ? recipes.map((item) => item.id === recipe.id ? savedRecipe : item) : [...recipes, savedRecipe]);
    setRecipe(savedRecipe);
    savePrompt(savedRecipe.id, generatedPrompt, answers);
    setSavedRecipeId(savedRecipe.id);
    setSaveOpen(false);
    toast.success("Recipe saved");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="container max-w-3xl px-4 py-16 sm:py-28">
        {step === "request" && (
          <section className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">What do you want ChatGPT to help you with?</h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">Tell us what you want to achieve. We’ll ask a few questions, build the right prompt, and save it as a reusable Recipe.</p>
            <form onSubmit={findRecipe} className="mt-10 text-left">
              <Label htmlFor="request" className="mb-2 block text-sm font-medium">Describe what you need</Label>
              <div className="rounded-[1.5rem] border border-border bg-card p-1 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.16)] dark:shadow-none">
                <Textarea id="request" value={request} onChange={(event) => setRequest(event.target.value)} required placeholder={`For example: ${placeholderExample}`} className="min-h-36 resize-none border-0 bg-transparent px-5 py-4 text-base leading-6 shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0" />
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={!request.trim()} className="gap-2 rounded-full px-6"><Search className="h-4 w-4" />Build a recipe</Button>
              </div>
            </form>
            <div className="mt-10 text-left">
              <p className="mb-3 text-center text-sm text-muted-foreground">Need an idea? Try one of these.</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {inspirations.map((inspiration) => <button key={inspiration} type="button" onClick={() => setRequest(inspiration)} className="rounded-full bg-secondary px-4 py-2 text-muted-foreground transition hover:bg-accent hover:text-black">{inspiration}</button>)}
              </div>
            </div>
          </section>
        )}

        {step === "questions" && recipe && (
          <GuidedQuestionFlow recipe={recipe} answers={answers} onAnswersChange={setAnswers} onComplete={generatePrompt} onStartOver={restart} />
        )}

        {step === "result" && recipe && (
          <section className="mx-auto max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">{recipe.name}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your prompt is ready</h1>
            <Textarea aria-label="Generated prompt" readOnly value={generatedPrompt} className="mt-8 min-h-72 rounded-[1.5rem] bg-card p-5 font-mono text-sm leading-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-none" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button onClick={copyPrompt} size="lg" className="gap-2 rounded-full">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy prompt"}</Button>
              <Button onClick={() => window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer")} variant="outline" size="lg" className="gap-2 rounded-full"><ExternalLink className="h-4 w-4" />Open ChatGPT</Button>
            </div>
            <div className="mt-12 border-t pt-8">
              <h2 className="font-medium">Want to save this for next time?</h2>
              {!saveOpen && <Button onClick={() => setSaveOpen(true)} variant="secondary" className="mt-3 rounded-lg px-5 py-2.5 font-semibold">Save Recipe</Button>}
              {saveOpen && <div className="mt-4 space-y-4 rounded-2xl border bg-card p-4"><div><Label htmlFor="save-name">Name</Label><Input id="save-name" value={saveName} onChange={(event) => setSaveName(event.target.value)} className="mt-2" /></div><div><Label>Folder</Label><Select value={saveProjectId} onValueChange={setSaveProjectId}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="personal">Personal recipes</SelectItem>{getProjects().map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Who can see it?</Label><Select value={saveVisibility} onValueChange={(value) => { const visibility = value as "private" | "public"; setSaveVisibility(visibility); if (visibility === "private") setSaveAnonymous(false); }}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="private">Personal recipes</SelectItem><SelectItem value="public">Public recipes</SelectItem></SelectContent></Select></div>{saveVisibility === "public" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={saveAnonymous} onChange={(event) => setSaveAnonymous(event.target.checked)} className="h-4 w-4 accent-primary" />Show me as Anonymous</label>}<div className="flex flex-wrap gap-2"><Button onClick={saveRecipe} className="rounded-lg bg-zinc-800 px-5 py-2.5 text-white hover:bg-zinc-700 hover:text-white">Save Recipe</Button><Button onClick={() => setSaveOpen(false)} variant="ghost" className="rounded-lg">Cancel</Button></div></div>}
              {savedRecipeId && <Button onClick={() => window.location.assign(`/recipe/${savedRecipeId}`)} variant="outline" className="mt-3 rounded-lg">View saved recipe</Button>}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
