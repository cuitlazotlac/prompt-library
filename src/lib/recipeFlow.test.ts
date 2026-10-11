import { describe, expect, it } from "vitest";
import { starterRecipes } from "@/data/recipes";
import { promptGenerator } from "@/lib/promptGenerator";
import { findBestRecipe } from "@/lib/recipeMatcher";
import { buildFallbackRecipe, understandIntent, validateRecipeSpec } from "@/lib/recipeBuilder";

describe("Recipe matching", () => {
  it("finds the landlord recipe from a natural-language request", () => {
    expect(findBestRecipe("Write a difficult email to my landlord", starterRecipes)?.recipe.id).toBe("landlord-email");
  });

  it("understands a natural job request as the job application recipe", () => {
    expect(findBestRecipe("Apply for a job I really want", starterRecipes)?.recipe.id).toBe("job-application");
  });

  it("returns no match when the catalog has no relevant Recipe", () => {
    expect(findBestRecipe("Help me plan a wedding menu", starterRecipes)).toBeNull();
  });
});

describe("Universal Recipe builder", () => {
  it("builds a structured fallback Recipe for an unmatched request", () => {
    const recipe = buildFallbackRecipe("Prepare a presentation for my community group");
    expect(recipe.questions.length).toBeGreaterThanOrEqual(4);
    expect(recipe.questions.length).toBeLessThanOrEqual(5);
    expect(recipe.promptTemplate).toContain("Prepare a presentation for my community group");
    expect(recipe.questions.every((question) => question.recipeId === recipe.id)).toBe(true);
  });

  it("rejects malformed Recipe specifications", () => {
    expect(validateRecipeSpec({ name: "", description: "", questions: [], promptTemplate: "" })).toBe(false);
  });

  it("extracts known audience and constraints before designing questions", () => {
    const task = understandIntent("Tell my boss I need to work from home tomorrow because my son is sick");
    expect(task.taskType).toBe("communication");
    expect(task.audience).toBe("boss");
    expect(task.constraints).toContain("tomorrow");
    expect(task.knownInformation.join(" ")).toContain("my son is sick");
  });

  it("creates task-specific travel questions instead of generic context questions", () => {
    const recipe = buildFallbackRecipe("Plan a 5-day trip to Rome with my girlfriend; we love food and history");
    expect(recipe.questions.map((question) => question.label).join(" ")).toMatch(/budget|dates|pace/i);
  });

  it.each([
    "Write an email to my landlord about a rent increase",
    "Help me organize my move",
    "Compare these two job offers",
    "Make me a packing list for a two-week trip",
    "Help me apologize to a friend",
  ])("creates a usable Recipe for %s", (request) => {
    const recipe = buildFallbackRecipe(request);
    expect(recipe.promptTemplate).toContain(request);
    expect(recipe.questions.length).toBeGreaterThanOrEqual(4);
    expect(recipe.questions.length).toBeLessThanOrEqual(5);
  });
});

describe("Recipe questions and prompt generation", () => {
  const landlordRecipe = starterRecipes.find((recipe) => recipe.id === "landlord-email")!;

  it("keeps every starter recipe at four or more questions", () => {
    expect(starterRecipes.every((recipe) => recipe.questions.length >= 4)).toBe(true);
  });

  it("keeps the V1 question types represented in the starter catalog", () => {
    expect(new Set(starterRecipes.flatMap((recipe) => recipe.questions.map((question) => question.type)))).toEqual(
      new Set(["text", "textarea", "select", "radio"]),
    );
  });

  it("interpolates answers into a deterministic prompt", () => {
    const result = promptGenerator.generate(landlordRecipe, {
      recipient: "My property manager",
      situation: "The heating has been unreliable for two weeks.",
      objective: "Arrange a repair this week.",
      tone: "Calm and firm",
    });
    expect(result).toContain("My property manager");
    expect(result).toContain("Arrange a repair this week.");
    expect(result).not.toContain("{{recipient}}");
  });

  it("rejects a missing required answer", () => {
    expect(() => promptGenerator.generate(landlordRecipe, { recipient: "My property manager" })).toThrow("What happened?");
  });
});
