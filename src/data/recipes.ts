import { Recipe } from "@/types/recipe";

// V1 is deliberately local so the first-use experience has no account or
// network dependency. These records can later be loaded from Firestore.
export const starterRecipes: Recipe[] = [
  {
    id: "landlord-email",
    name: "Write an email to your landlord",
    description: "Handle a difficult housing issue clearly and respectfully.",
    category: "Home",
    projectId: "home",
    tags: ["email", "housing", "communication"],
    keywords: ["landlord", "rent", "apartment", "lease", "maintenance", "tenant", "difficult email"],
    questions: [
      { id: "landlord-recipient", recipeId: "landlord-email", key: "recipient", label: "Who are you writing to?", type: "text", required: true, position: 1 },
      { id: "landlord-situation", recipeId: "landlord-email", key: "situation", label: "What happened?", type: "textarea", required: true, position: 2 },
      { id: "landlord-objective", recipeId: "landlord-email", key: "objective", label: "What would you like them to do?", type: "textarea", required: true, position: 3 },
      { id: "landlord-tone", recipeId: "landlord-email", key: "tone", label: "What tone should it have?", type: "radio", options: ["Calm and firm", "Friendly", "Formal"], required: true, position: 4 },
    ],
    promptTemplate: "Write a clear and professional email.\n\nRecipient: {{recipient}}\nSituation: {{situation}}\nObjective: {{objective}}\nTone: {{tone}}\n\nMake the email natural, concise, and appropriate for the situation.",
    visibility: "public",
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    id: "job-application",
    name: "Write a job application email",
    description: "Create a concise, tailored email for a role you want.",
    category: "Work",
    projectId: "work",
    tags: ["email", "job", "career"],
    keywords: ["job", "application", "apply", "role", "cover letter", "hiring", "career", "resume"],
    questions: [
      { id: "job-role", recipeId: "job-application", key: "role", label: "What role are you applying for?", type: "text", required: true, position: 1 },
      { id: "job-company", recipeId: "job-application", key: "company", label: "What is the company or organization?", type: "text", required: true, position: 2 },
      { id: "job-strengths", recipeId: "job-application", key: "strengths", label: "Which relevant experience or strengths should stand out?", type: "textarea", required: true, position: 3 },
      { id: "job-tone", recipeId: "job-application", key: "tone", label: "Choose a tone", type: "select", options: ["Warm and confident", "Direct and professional", "Enthusiastic"], required: true, position: 4 },
    ],
    promptTemplate: "Write a concise job application email for the {{role}} role at {{company}}.\n\nRelevant experience and strengths: {{strengths}}\nTone: {{tone}}\n\nMake it specific, genuine, and easy to read.",
    visibility: "public",
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
  {
    id: "weekly-plan",
    name: "Make a realistic weekly plan",
    description: "Turn a busy week into a calm, practical plan.",
    category: "Planning",
    projectId: "personal",
    tags: ["planning", "productivity", "routine"],
    keywords: ["plan", "week", "schedule", "organize", "routine", "priorities", "productive"],
    questions: [
      { id: "plan-priorities", recipeId: "weekly-plan", key: "priorities", label: "What are your main priorities this week?", type: "textarea", required: true, position: 1 },
      { id: "plan-constraints", recipeId: "weekly-plan", key: "constraints", label: "What commitments or limits should it work around?", type: "textarea", required: true, position: 2 },
      { id: "plan-style", recipeId: "weekly-plan", key: "style", label: "How detailed should the plan be?", type: "radio", options: ["Simple daily outline", "Detailed time blocks"], required: true, position: 3 },
      { id: "plan-success", recipeId: "weekly-plan", key: "success", label: "What would make this week feel successful?", type: "textarea", required: true, position: 4 },
    ],
    promptTemplate: "Create a realistic weekly plan.\n\nMain priorities: {{priorities}}\nCommitments and limits: {{constraints}}\nPreferred format: {{style}}\nA successful week would feel like: {{success}}\n\nKeep it practical, balanced, and leave room for the unexpected.",
    visibility: "public",
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
  },
];
