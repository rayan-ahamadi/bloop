import axios from "@/services/configs/axios";
import { Post } from "@/types/post.types"; // à adapter à ton type

// 🟢 Créer un post
export const createPost = async (postData: Partial<Post>) => {
  const data = new FormData();
  Object.entries(postData).forEach(([key, value]) => {
    if (value !== undefined) {
      data.append(key, value);
    }
  });
  const response = await axios.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 🔵 Liste des posts
export const getPosts = async () => {
  const response = await axios.get("/posts");
  return response.data;
};

// 🌟 Posts populaires
export const getPopularPosts = async () => {
  const response = await axios.get("/posts/popular");
  return response.data;
};

// 🔍 Recherche de posts
export const searchPosts = async (query: string) => {
  const response = await axios.get(`/posts/search?q=${query}`);
  return response.data;
};

// 📄 Détails d’un post
export const getPost = async (id: number) => {
  const response = await axios.get(`/posts/${id}`);
  return response.data;
};

// ✏️ Modifier un post
export const updatePost = async (id: number, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });
  const response = await axios.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ❌ Supprimer un post
export const deletePost = async (id: number) => {
  const response = await axios.delete(`/posts/${id}`);
  return response.data;
};

// 💬 Récupérer les réponses (commentaires ou fils)
export const getPostReplies = async (id: number) => {
  const response = await axios.get(`/posts/${id}/replies`);
  return response.data;
};

// ❤️ Like / Unlike un post
export const toggleLikePost = async (id: number) => {
  const response = await axios.post(`/posts/${id}/like`);
  return response.data;
};

// 👥 Liste des utilisateurs ayant liké le post
export const getPostLikes = async (id: number) => {
  const response = await axios.get(`/posts/${id}/like`);
  return response.data;
};

// 🔁 Reposter un post
export const repostPost = async (id: number) => {
  const response = await axios.post(`/posts/${id}/repost`);
  return response.data;
};

// 🔁 Supprimer un repost
export const deleteRepost = async (id: number) => {
  const response = await axios.delete(`/posts/${id}/repost`);
  return response.data;
};

// 🔁 Liste des utilisateurs ayant repost
export const getPostReposts = async (id: number) => {
  const response = await axios.get(`/posts/${id}/reposts`);
  return response.data;
};

// 🔖 Enregistrer un post (signet)
export const savePost = async (id: number) => {
  const response = await axios.post(`/posts/${id}/save`);
  return response.data;
};
