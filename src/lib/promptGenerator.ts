import { Recipe } from "@/types/recipe";

export type RecipeAnswers = Record<string, string>;

export class DeterministicPromptGenerator {
  generate(recipe: Recipe, answers: RecipeAnswers): string {
    const missing = recipe.questions.filter((question) => question.required && !answers[question.key]?.trim());
    if (missing.length > 0) throw new Error(`Please answer: ${missing.map((question) => question.label).join(", ")}`);

    return recipe.promptTemplate.replace(/{{\s*([\w-]+)\s*}}/g, (_, key: string) => answers[key]?.trim() ?? "");
  }
}

export const promptGenerator = new DeterministicPromptGenerator();
