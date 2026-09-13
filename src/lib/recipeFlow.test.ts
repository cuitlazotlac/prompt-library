import { describe, expect, it } from "vitest";
import { starterRecipes } from "@/data/recipes";
import { promptGenerator } from "@/lib/promptGenerator";
import { findBestRecipe } from "@/lib/recipeMatcher";

describe("Recipe matching", () => {
  it("finds the landlord recipe from a natural-language request", () => {
    expect(findBestRecipe("Write a difficult email to my landlord", starterRecipes)?.recipe.id).toBe("landlord-email");
  });

  it("returns no match when the catalog has no relevant Recipe", () => {
    expect(findBestRecipe("Help me plan a wedding menu", starterRecipes)).toBeNull();
  });
});

describe("Recipe questions and prompt generation", () => {
  const landlordRecipe = starterRecipes.find((recipe) => recipe.id === "landlord-email")!;

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
