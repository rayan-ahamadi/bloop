import { User } from "@/types/user.types"; // à adapter à votre type User

export type Post = {
  id: number;
  user: User; // à définir selon votre modèle User
  content: string;
  type: "original" | "retweet" | "reply";
  parentPost: Post | null;
  language: string;
  likesCount: number;
  retweetsCount: number;
  savedCount: number;
  viewsCount: number;
  impressionsCount: number;
  clicksCount: number;
  engagementScore: number;
  isPinned: boolean;
  status: "active" | "hidden" | "deleted";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
