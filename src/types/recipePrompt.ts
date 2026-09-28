export interface SavedPrompt {
  id: string;
  recipeId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  answers?: Record<string, string>;
}
