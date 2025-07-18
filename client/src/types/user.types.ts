import { Post } from "@/types/post.types";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string | null;
  password?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  birthDate?: string | null; // ISO date string
  themes?: string[]; // JSON array
  createdAt: string; // ISO datetime string
  updatedAt?: string | null;
  deletedAt?: string | null;
  followers_nb: number;
  following_nb: number;
  posts?: Post[];
  following?: User[];
  followers?: User[];
  likes?: Post[];
  reposts?: Post[];
  savedPosts?: Post[];
};
