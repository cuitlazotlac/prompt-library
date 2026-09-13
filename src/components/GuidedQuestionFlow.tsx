import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { RecipeAnswers } from "@/lib/promptGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GuidedQuestionFlowProps {
  recipe: Recipe;
  answers: RecipeAnswers;
  onAnswersChange: (answers: RecipeAnswers) => void;
  onComplete: () => void;
  onStartOver: () => void;
}

export function GuidedQuestionFlow({ recipe, answers, onAnswersChange, onComplete, onStartOver }: GuidedQuestionFlowProps) {
  const questions = useMemo(() => recipe.questions.slice().sort((a, b) => a.position - b.position), [recipe]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const question = questions[currentQuestionIndex];
  const isFinalQuestion = currentQuestionIndex === questions.length - 1;
  const value = answers[question.key] ?? "";

  const updateAnswer = (nextValue: string) => {
    onAnswersChange({ ...answers, [question.key]: nextValue });
    if (validationMessage) setValidationMessage("");
  };

  const continueFlow = (event: FormEvent) => {
    event.preventDefault();
    if (question.required && !value.trim()) {
      setValidationMessage("Please answer this question to continue.");
      return;
    }

    setValidationMessage("");
    if (isFinalQuestion) {
      onComplete();
    } else {
      setCurrentQuestionIndex((index) => index + 1);
    }
  };

  const goBack = () => {
    setValidationMessage("");
    if (currentQuestionIndex === 0) {
      onStartOver();
      return;
    }
    setCurrentQuestionIndex((index) => index - 1);
  };

  return (
    <section className="mx-auto w-full max-w-xl">
      <p className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{question.label}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{recipe.name}</p>

      <form onSubmit={continueFlow} className="mt-10">
        <fieldset aria-describedby={validationMessage ? `${question.id}-error` : undefined}>
          <legend className="sr-only">{question.label}</legend>
          {question.type === "text" && (
            <Input id={question.id} value={value} onChange={(event) => updateAnswer(event.target.value)} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? `${question.id}-error` : undefined} className="h-14 rounded-2xl px-4 text-base" autoFocus />
          )}
          {question.type === "textarea" && (
            <Textarea id={question.id} value={value} onChange={(event) => updateAnswer(event.target.value)} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? `${question.id}-error` : undefined} className="min-h-44 rounded-2xl p-4 text-base leading-6" autoFocus />
          )}
          {question.type === "select" && (
            <div className="space-y-2">
              <Label htmlFor={question.id} className="sr-only">{question.label}</Label>
              <select id={question.id} value={value} onChange={(event) => updateAnswer(event.target.value)} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? `${question.id}-error` : undefined} className="h-14 w-full rounded-2xl border border-input bg-background px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" autoFocus>
                <option value="">Choose an option</option>
                {question.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          )}
          {question.type === "radio" && (
            <div className="grid gap-3" role="radiogroup" aria-label={question.label} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? `${question.id}-error` : undefined}>
              {question.options?.map((option) => (
                <label key={option} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-input bg-card px-4 text-base transition hover:border-foreground/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input type="radio" name={question.key} value={option} checked={value === option} onChange={() => updateAnswer(option)} className="h-5 w-5 accent-primary" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div aria-live="polite" className="mt-3 min-h-6">
          {validationMessage && <p id={`${question.id}-error`} role="alert" className="text-sm font-medium text-destructive">{validationMessage}</p>}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={goBack} className="min-h-12 gap-2 self-start rounded-full px-3 text-muted-foreground"><ArrowLeft className="h-4 w-4" />{currentQuestionIndex === 0 ? "Start over" : "Back"}</Button>
          <Button type="submit" size="lg" className="min-h-12 w-full gap-2 rounded-full sm:w-auto">{isFinalQuestion ? "Create my prompt" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>
        </div>
      </form>
    </section>
  );
}
