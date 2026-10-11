import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Pencil, SkipForward } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { RecipeAnswers } from "@/lib/promptGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [questionOverrides, setQuestionOverrides] = useState<Record<string, string>>({});
  const [isChangingQuestion, setIsChangingQuestion] = useState(false);
  const [questionDraft, setQuestionDraft] = useState("");
  const question = questions[currentQuestionIndex];
  const isFinalQuestion = currentQuestionIndex === questions.length - 1;
  const value = answers[question.key] ?? "";
  const questionLabel = questionOverrides[question.key] ?? question.label;
  const completedCount = questions.filter((item) => Boolean(answers[item.key]?.trim()) || skippedQuestions.has(item.key)).length;
  const remainingCount = Math.max(questions.length - completedCount, 0);
  const progress = questions.length ? Math.round((completedCount / questions.length) * 100) : 100;

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

  const advance = () => {
    setValidationMessage("");
    if (isFinalQuestion) onComplete();
    else setCurrentQuestionIndex((index) => index + 1);
  };

  const skipQuestion = () => {
    onAnswersChange({ ...answers, [question.key]: question.required ? "Not provided" : "" });
    setSkippedQuestions((current) => new Set(current).add(question.key));
    advance();
  };

  const beginQuestionChange = () => {
    setQuestionDraft(questionLabel);
    setIsChangingQuestion(true);
    setValidationMessage("");
  };

  const saveQuestionChange = (event: FormEvent) => {
    event.preventDefault();
    if (!questionDraft.trim()) return;
    setQuestionOverrides({ ...questionOverrides, [question.key]: questionDraft.trim() });
    setIsChangingQuestion(false);
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
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p><p className="mt-1 text-xs text-muted-foreground">{completedCount} answered · {remainingCount} remaining</p></div><span className="text-sm font-medium text-muted-foreground">{progress}%</span></div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Recipe progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      {isChangingQuestion ? <form onSubmit={saveQuestionChange} className="mt-6 rounded-2xl border bg-card p-4"><Label htmlFor="question-edit">Rewrite this question</Label><Input id="question-edit" value={questionDraft} onChange={(event) => setQuestionDraft(event.target.value)} autoFocus className="mt-2 h-12 rounded-xl" /><div className="mt-3 flex gap-2"><Button type="submit" className="rounded-full gap-2"><Check className="h-4 w-4" />Use this question</Button><Button type="button" variant="ghost" onClick={() => setIsChangingQuestion(false)} className="rounded-full">Cancel</Button></div></form> : <><h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{questionLabel}</h1><button type="button" onClick={beginQuestionChange} className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"><Pencil className="h-3.5 w-3.5" />Change this question</button></>}
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
              <Select value={value || undefined} onValueChange={updateAnswer}>
                <SelectTrigger id={question.id} aria-invalid={Boolean(validationMessage)} className="h-14 rounded-2xl px-4 text-base"><SelectValue placeholder="Choose an option" /></SelectTrigger>
                <SelectContent><SelectItem value="__empty" disabled>Choose an option</SelectItem>{question.options?.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
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
          <div className="flex flex-col gap-2 sm:flex-row"><Button type="button" variant="outline" onClick={skipQuestion} className="min-h-12 gap-2 rounded-full"><SkipForward className="h-4 w-4" />Skip question</Button><Button type="submit" size="lg" className="min-h-12 w-full gap-2 rounded-full sm:w-auto">{isFinalQuestion ? "Create my prompt" : "Continue"}<ArrowRight className="h-4 w-4" /></Button></div>
        </div>
      </form>
    </section>
  );
}
