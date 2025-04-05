export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  isAdmin: boolean;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  modelType: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isFeatured: boolean;
  isFlagged: boolean;
  usageTips?: string;
  recommendedModels?: string[];
  images?: {
    url: string;
    name: string;
  }[];
}

export interface UserFavorite {
  userId: string;
  promptId: string;
  createdAt: Date;
}

export interface UserVote {
  userId: string;
  promptId: string;
  vote: 1 | -1;
  createdAt: Date;
} 