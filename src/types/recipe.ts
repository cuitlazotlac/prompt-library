export type RecipeQuestionType = "text" | "textarea" | "select" | "radio";

export interface RecipeQuestion {
  id: string;
  recipeId: string;
  key: string;
  label: string;
  type: RecipeQuestionType;
  options?: string[];
  required: boolean;
  position: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  projectId: string;
  tags: string[];
  keywords: string[];
  questions: RecipeQuestion[];
  promptTemplate: string;
  authorId?: string;
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
}
