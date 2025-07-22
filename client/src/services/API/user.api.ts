import axios from "@/services/configs/axios"; // ou le bon chemin de ton axios configuré
import { User } from "@/types/user.types"; // à adapter à ton type

// Register (POST)
export const registerUser = async (userData: Partial<User>) => {
  const data = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => data.append(`${key}[]`, v));
    } else {
      data.append(key, value instanceof File ? value : String(value));
    }
  });

  const response = await axios.post("/users/register/", data); // ✅ ne pas mettre headers
  return response.data;
};

// Get profile (GET /me, JWT Auth)
export const getProfile = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

// Login (POST à /login_check, JWT Auth)
export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post("/login_check/", credentials);
  return response.data; // { token: string }
};

// Liste des utilisateurs (GET /)
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("/users/");
  return response.data;
};

// Lire un utilisateur (GET /{id})
export const fetchUserById = async (id: number) => {
  const response = await axios.get(`/users/${id}/`);
  return response.data;
};

// Modifier un utilisateur (POST /{id})
export const updateUser = async (id: number, updatedData: Partial<User>) => {
  const data = new FormData();
  Object.entries(updatedData).forEach(([key, value]) => {
    if (value !== undefined) {
      data.append(key, value);
    }
  });
  const response = await axios.post(`/users/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Supprimer un utilisateur (DELETE /{id})
export const deleteUser = async (id: number) => {
  const response = await axios.delete(`/users/${id}/`);
  return response.data;
};

// Suivre un utilisateur (POST /{id}/follow)
export const followUser = async (id: number) => {
  const response = await axios.post(`/users/${id}/follow/`);
  return response.data;
};
