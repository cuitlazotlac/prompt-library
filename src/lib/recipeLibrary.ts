import { defaultProjects } from "@/data/projects";
import { starterRecipes } from "@/data/recipes";
import { Project } from "@/types/project";
import { Recipe } from "@/types/recipe";

const PROJECTS_KEY = "prompt-lab.projects";
const RECIPES_KEY = "prompt-lab.recipes";

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

export const projectForRecipe = (recipe: Recipe, projects: Project[]) => projects.find((project) => project.id === recipe.projectId);
