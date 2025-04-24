export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  model: string;
  modelType: string[];
  tags: string[];
  userId: string;
  authorId?: string; // For backward compatibility
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
  favorites?: number;
  favoriteUsers?: string[];
  upvotes?: number;
  usageTips?: string[];
  recommendedModels?: string[];
  images?: {
    url: string;
    name: string;
  }[];
  // Voting related fields
  score?: number;
  userVote?: 'up' | 'down' | null;
  voteCount?: number;
} 