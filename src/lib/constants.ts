export const AI_MODELS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Mistral',
  'Grok',
  'LLaMA',
  'Midjourney'
] as const;

export type AIModel = typeof AI_MODELS[number]; 