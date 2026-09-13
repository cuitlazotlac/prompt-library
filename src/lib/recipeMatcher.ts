import { Recipe } from "@/types/recipe";

export const RECIPE_MATCH_THRESHOLD = 5;

export interface RecipeMatch {
  recipe: Recipe;
  score: number;
}

const stopWords = new Set(["a", "an", "and", "for", "help", "i", "me", "my", "of", "please", "the", "to", "with", "write"]);

const terms = (value: string) => value.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => !stopWords.has(term)) ?? [];

export function findBestRecipe(request: string, recipes: Recipe[], threshold = RECIPE_MATCH_THRESHOLD): RecipeMatch | null {
  const requestedTerms = new Set(terms(request));
  if (requestedTerms.size === 0) return null;

  const matches = recipes.map((recipe) => {
    const fields: Array<[string, number]> = [
      [recipe.name, 4],
      [recipe.description, 2],
      [recipe.category, 2],
      [recipe.tags.join(" "), 3],
      [recipe.keywords.join(" "), 4],
    ];
    const matchedTerms = new Set<string>();
    const score = fields.reduce((total, [field, weight]) => total + terms(field).reduce((fieldScore, term) => {
      if (requestedTerms.has(term)) {
        matchedTerms.add(term);
        return fieldScore + weight;
      }
      return fieldScore;
    }, 0), 0);
    return { recipe, score, matchedTerms };
  }).sort((a, b) => b.score - a.score);

  const best = matches[0];
  // One generic word (for example, "plan") should not route someone into a
  // seemingly unrelated Recipe, even if it appears in several metadata fields.
  return best?.score >= threshold && best.matchedTerms.size >= 2 ? best : null;
}
