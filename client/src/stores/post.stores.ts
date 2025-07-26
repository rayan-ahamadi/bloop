import Post from "@/types/post.types";
import { create } from "zustand";

import {
  createPost,
  getPosts,
  getPost,
  toggleLikePost,
  repostPost,
  savePost,
  deleteRepost,
} from "@/services/API/post.api";

type PostState = {
  loading: boolean;
  error: string | null;
  addPost: (post: Post) => void;
  fetchPosts: () => Promise<void>;
  fetchPost: (id: number) => Promise<Post | null>;
  toggleLike: (postId: number) => Promise<void>;
  repost: (postId: number) => Promise<void>;
  savePost: (postId: number) => Promise<void>;
  deleteRepost: (postId: number) => Promise<void>;
};

export const usePostStore = create<PostState>((set) => ({
  loading: false,
  error: null,

  addPost: async (post: Post) => {
    set({ loading: true, error: null });
    try {
      const response = await createPost(post);
      if (response.error) {
        throw new Error(response.error);
      }
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const posts = await getPosts();
      set({ loading: false });
      return posts;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  fetchPost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const post = await getPost(id);
      set({ loading: false });
      return post;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  toggleLike: async (postId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await toggleLikePost(postId);
      set({ loading: false });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  repost: async (postId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await repostPost(postId);
      set({ loading: false });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  savePost: async (postId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await savePost(postId);
      set({ loading: false });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },

  deleteRepost: async (postId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await deleteRepost(postId);
      set({ loading: false });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
      throw error; // ← important : on relânce l'erreur ici
    }
  },
}));
