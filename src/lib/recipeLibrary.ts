import { defaultProjects } from "@/data/projects";
import { starterRecipes } from "@/data/recipes";
import { Project } from "@/types/project";
import { Recipe } from "@/types/recipe";
import { SavedPrompt } from "@/types/recipePrompt";

const PROJECTS_KEY = "prompt-lab.projects";
const RECIPES_KEY = "prompt-lab.recipes";
const PROMPTS_KEY = "prompt-lab.prompts";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
};

export const getProjects = () => read<Project[]>(PROJECTS_KEY, defaultProjects);
export const saveProjects = (projects: Project[]) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
export const getRecipes = () => read<Recipe[]>(RECIPES_KEY, starterRecipes);
export const saveRecipes = (recipes: Recipe[]) => localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
export const getPrompts = () => read<SavedPrompt[]>(PROMPTS_KEY, []);
export const savePrompts = (prompts: SavedPrompt[]) => localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));

export const savePrompt = (recipeId: string, content: string, answers: Record<string, string> = {}) => {
  const prompts = getPrompts();
  const now = new Date().toISOString();
  const existing = prompts.find((prompt) => prompt.recipeId === recipeId);
  const savedPrompt: SavedPrompt = existing
    ? { ...existing, content, answers, updatedAt: now }
    : { id: `prompt-${Date.now()}`, recipeId, content, answers, createdAt: now, updatedAt: now };
  savePrompts(existing ? prompts.map((prompt) => prompt.recipeId === recipeId ? savedPrompt : prompt) : [...prompts, savedPrompt]);
  return savedPrompt;
};

export const duplicateRecipe = (recipeId: string) => {
  const recipe = getRecipes().find((item) => item.id === recipeId);
  if (!recipe) return null;
  const now = new Date().toISOString();
  const copyId = `recipe-${Date.now()}`;
  const copy: Recipe = { ...recipe, id: copyId, name: `${recipe.name} (Copy)`, createdAt: now, updatedAt: now, questions: recipe.questions.map((question) => ({ ...question, id: `${question.id}-${copyId}`, recipeId: copyId })) };
  // Keep the copied pair independent: the new Recipe gets its own Prompt ID.
  const originalPrompt = getPrompts().find((prompt) => prompt.recipeId === recipeId);
  saveRecipes([...getRecipes(), copy]);
  if (originalPrompt) savePrompts([...getPrompts(), { ...originalPrompt, id: `prompt-${Date.now()}`, recipeId: copy.id, createdAt: now, updatedAt: now }]);
  return copy;
};

export const projectForRecipe = (recipe: Recipe, projects: Project[]) => projects.find((project) => project.id === recipe.projectId);
