import { FormEvent, useState } from "react";
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
import { GuidedQuestionFlow } from "@/components/GuidedQuestionFlow";
import { getRecipes } from "@/lib/recipeLibrary";
import { getProjects, saveRecipes } from "@/lib/recipeLibrary";

type Step = "request" | "questions" | "result" | "no-match";

const inspirations = [
  "Write a difficult email to my landlord",
  "Apply for a job I really want",
  "Plan a calmer, more realistic week",
  "Ask for a refund without sounding rude",
  "Prepare for an important conversation",
  "Turn my messy notes into a clear plan",
];

export function RecipeFlow() {
  const [searchParams] = useSearchParams();
  const requestedRecipe = getRecipes().find((item) => item.id === searchParams.get("recipe"));
  const [step, setStep] = useState<Step>(requestedRecipe ? "questions" : "request");
  const [request, setRequest] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(requestedRecipe ?? null);
  const [answers, setAnswers] = useState<RecipeAnswers>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState(requestedRecipe?.name ?? "");
  const [saveProjectId, setSaveProjectId] = useState(requestedRecipe?.projectId ?? "personal");

  const findRecipe = (event: FormEvent) => {
    event.preventDefault();
    const match = findBestRecipe(request, starterRecipes);
    if (!match) {
      setStep("no-match");
      return;
    }
    setRecipe(match.recipe);
    setAnswers({});
    setSaveName(match.recipe.name);
    setSaveProjectId(match.recipe.projectId);
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

  const saveRecipe = () => {
    if (!recipe || !saveName.trim()) return;
    const savedRecipe = { ...recipe, name: saveName.trim(), projectId: saveProjectId, updatedAt: new Date().toISOString() };
    const recipes = getRecipes();
    saveRecipes(recipes.some((item) => item.id === recipe.id) ? recipes.map((item) => item.id === recipe.id ? savedRecipe : item) : [...recipes, savedRecipe]);
    setRecipe(savedRecipe);
    setSaveOpen(false);
    toast.success("Recipe saved");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="container max-w-3xl px-4 py-16 sm:py-28">
        {step === "request" && (
          <section className="mx-auto max-w-2xl text-center">
            <p className="mb-6 inline-flex rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground">A simple place to reuse what works</p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">What do you want ChatGPT to help you with?</h1>
            <form onSubmit={findRecipe} className="mt-10 text-left">
              <Label htmlFor="request" className="mb-2 block text-sm font-medium">Describe what you need</Label>
              <div className="rounded-[1.5rem] border border-border bg-card p-1 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.16)] dark:shadow-none">
                <Textarea id="request" value={request} onChange={(event) => setRequest(event.target.value)} required placeholder="For example: Write a difficult email to my landlord" className="min-h-36 resize-none border-0 bg-transparent px-5 py-4 text-base leading-6 shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0" />
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={!request.trim()} className="gap-2 rounded-full px-6"><Search className="h-4 w-4" />Build a recipe</Button>
              </div>
            </form>
            <div className="mt-10 text-left">
              <p className="mb-3 text-center text-sm text-muted-foreground">Need an idea? Try one of these.</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {inspirations.map((inspiration) => <button key={inspiration} type="button" onClick={() => setRequest(inspiration)} className="rounded-full bg-secondary px-4 py-2 text-muted-foreground transition hover:bg-accent hover:text-foreground">{inspiration}</button>)}
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
              {!saveOpen && <Button onClick={() => setSaveOpen(true)} variant="ghost" className="mt-2 px-0">Save Recipe</Button>}
              {saveOpen && <div className="mt-4 space-y-4 rounded-2xl border bg-card p-4"><div><Label htmlFor="save-name">Name</Label><Input id="save-name" value={saveName} onChange={(event) => setSaveName(event.target.value)} className="mt-2" /></div><div><Label htmlFor="save-project">Project</Label><select id="save-project" value={saveProjectId} onChange={(event) => setSaveProjectId(event.target.value)} className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{getProjects().map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div><div className="flex gap-2"><Button onClick={saveRecipe} className="rounded-full">Save Recipe</Button><Button onClick={() => setSaveOpen(false)} variant="ghost" className="rounded-full">Cancel</Button></div></div>}
            </div>
            <button onClick={restart} className="mt-8 text-sm text-muted-foreground hover:text-foreground">Start another recipe</button>
          </section>
        )}

        {step === "no-match" && (
          <section className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight">We don’t have a recipe for that yet</h1>
            <p className="mt-4 text-muted-foreground">Try one of the starter recipes while we add more ways to help.</p>
            <div className="mt-8 grid gap-3 text-left">{starterRecipes.map((item) => <button key={item.id} onClick={() => { setRecipe(item); setAnswers({}); setStep("questions"); }} className="rounded-lg border p-4 text-left transition hover:bg-accent"><span className="font-medium">{item.name}</span><span className="mt-1 block text-sm text-muted-foreground">{item.description}</span></button>)}</div>
            <Button onClick={restart} variant="outline" className="mt-8">Try another request</Button>
          </section>
        )}
      </div>
    </div>
  );
}
