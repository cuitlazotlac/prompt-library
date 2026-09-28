import { Recipe, RecipeQuestionType } from "@/types/recipe";

export type TaskType = "communication" | "planning" | "decision" | "practical" | "preparation" | "general";

export interface TaskDefinition {
  goal: string;
  desiredOutput: string;
  audience?: string;
  context: string;
  constraints: string[];
  successCriteria: string[];
  knownInformation: string[];
  missingInformation: string[];
  taskType: TaskType;
  originalRequest: string;
}

export interface RecipeBuilder {
  build(request: string): Recipe;
}

export interface RecipeSpecQuestion {
  key: string;
  label: string;
  type: RecipeQuestionType;
  options?: string[];
  required: boolean;
  position: number;
}

export interface RecipeSpec {
  name: string;
  description: string;
  questions: RecipeSpecQuestion[];
  promptTemplate: string;
}

const questionTypes = new Set<RecipeQuestionType>(["text", "textarea", "select", "radio"]);

export function understandIntent(request: string): TaskDefinition {
  const originalRequest = request.trim();
  const text = originalRequest.toLowerCase();
  const taskType: TaskType = /email|message|tell|ask|apologize|complaint|landlord|boss|manager/.test(text)
    ? "communication"
    : /trip|travel|week|schedule|organize|move|itinerary|plan/.test(text)
      ? "planning"
      : /compare|decide|decision|buy or rent|job offers|choose/.test(text)
        ? "decision"
        : /packing list|grocery list|shopping list|checklist|list/.test(text)
          ? "practical"
          : /prepare|interview|conversation|talk with/.test(text) ? "preparation" : "general";
  const audienceMatch = text.match(/(?:to|with|tell) (?:my |the )?(landlord|boss|manager|recruiter|teacher|partner|friend|dad|brother|customer)/);
  const audience = audienceMatch?.[1];
  const desiredOutput = taskType === "communication" ? (text.includes("email") ? "email" : "message")
    : taskType === "planning" ? (text.includes("trip") || text.includes("travel") ? "itinerary" : "realistic plan")
      : taskType === "decision" ? "comparison or decision framework"
        : taskType === "practical" ? "checklist"
          : taskType === "preparation" ? "talking points and preparation guide" : "useful response";
  const constraints = [
    originalRequest.match(/\b(?:tomorrow|today|this week|next week|by Friday|for \d+ days?)\b/i)?.[0],
    originalRequest.match(/\b(?:under|within|budget(?: of)?)[^,.]+/i)?.[0],
    originalRequest.match(/\b(?:vegetarian|beginner|weekends?|carry-on|professional|concise|short)\b/i)?.[0],
  ].filter((value): value is string => Boolean(value));
  const knownInformation = [originalRequest, audience ? `Audience: ${audience}` : "", constraints.length ? `Constraints: ${constraints.join(", ")}` : ""].filter(Boolean);
  const goal = taskType === "communication" ? `Communicate the user's situation ${audience ? `to their ${audience}` : "clearly"} and get a useful response.`
    : taskType === "planning" ? `Create a realistic ${desiredOutput} that fits the user's situation.`
      : taskType === "decision" ? "Help the user make a confident, well-reasoned choice." : `Create a useful ${desiredOutput} for the user's request.`;
  const missingInformation = taskType === "communication"
    ? [audience ? "the specific outcome they want from the recipient" : "the recipient and desired outcome", text.includes("sick") || text.includes("health") ? "how much personal detail to share" : "any important detail the recipient should know"]
    : taskType === "planning"
      ? text.includes("trip") || text.includes("travel") ? ["dates or season", text.includes("budget") ? "" : "approximate budget", "pace or accessibility preferences"].filter(Boolean) : [text.includes("gym") ? "which days work for the gym" : "fixed commitments", "how much time the main priorities need"]
        : taskType === "decision" ? ["the options being compared", "the priorities that matter most", "important constraints"] : ["the details that would change the result", "what success should look like"];
  const successCriteria = taskType === "communication" ? ["The message is clear and appropriate for the relationship.", "The recipient understands the requested next step."] : taskType === "planning" ? ["The plan is realistic and accounts for stated constraints."] : ["The result is specific enough to act on."];
  return { goal, desiredOutput, audience, context: originalRequest, constraints, successCriteria, knownInformation, missingInformation, taskType, originalRequest };
}

export function validateRecipeSpec(spec: RecipeSpec): spec is RecipeSpec {
  return Boolean(
    spec && spec.name.trim() && spec.description.trim() && spec.promptTemplate.trim()
      && spec.questions.length > 0 && spec.questions.length <= 5
      && spec.questions.every((question) => question.key.trim() && question.label.trim() && questionTypes.has(question.type)
        && (question.type === "text" || question.type === "textarea" || Boolean(question.options?.length))),
  );
}

/**
 * Local fallback while an AI Recipe provider is not configured. It creates a
 * real structured Recipe, so the user experience is identical to a retrieved
 * Recipe and the builder can later be replaced by an AI-backed adapter.
 */
export function buildFallbackRecipe(request: string): Recipe {
  const task = understandIntent(request);
  const cleanRequest = task.originalRequest;
  const id = `dynamic-${Date.now()}`;
  const questions: RecipeSpecQuestion[] = task.missingInformation.slice(0, task.taskType === "general" ? 2 : 4).map((missing, index) => {
    const isChoice = /personal detail|pace|walking|accessibility/.test(missing);
    const options = /personal detail/.test(missing) ? ["Keep the reason private", "Mention it briefly", "Explain openly"] : /pace|walking|accessibility/.test(missing) ? ["Walk a lot", "A balanced pace", "Keep it relaxed"] : undefined;
    return {
      key: `detail${index + 1}`,
      label: missing.charAt(0).toUpperCase() + missing.slice(1) + "?",
      type: isChoice ? "radio" : /dates|budget|which days|options/.test(missing) ? "text" : "textarea",
      options,
      required: true,
      position: index + 1,
    };
  });
  if (questions.length === 0) questions.push({ key: "additionalDetail", label: "What else would make the result more useful?", type: "textarea", required: true, position: 1 });
  const spec: RecipeSpec = {
    name: `${task.desiredOutput.charAt(0).toUpperCase() + task.desiredOutput.slice(1)}${task.audience ? ` for ${task.audience}` : ""}`,
    description: task.successCriteria[0],
    questions,
    promptTemplate: `Understand this task: ${task.goal}\n\nOriginal request:\n{{request}}\n\nKnown information:\n${task.knownInformation.join("\n")}\n\nAdditional details:\n${questions.map((question) => `${question.label.replace(/\?$/, "")}: {{${question.key}}}`).join("\n")}\n\nSuccess criteria:\n${task.successCriteria.join(" ")}\n\nCreate a ${task.desiredOutput} that is specific, useful, and ready to use.`,
  };

  if (!validateRecipeSpec(spec)) throw new Error("Unable to create a Recipe for this request.");
  return {
    id,
    name: spec.name,
    description: spec.description,
    category: "Personal",
    projectId: "personal",
    tags: ["personal"],
    keywords: cleanRequest.toLowerCase().split(/\s+/).filter(Boolean),
    questions: spec.questions.map((question) => ({ ...question, id: `${id}-${question.key}`, recipeId: id })),
    promptTemplate: spec.promptTemplate.replace("{{request}}", cleanRequest),
    visibility: "private",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// This is the replaceable boundary for a future structured AI Recipe builder.
export const deterministicRecipeBuilder: RecipeBuilder = { build: buildFallbackRecipe };
