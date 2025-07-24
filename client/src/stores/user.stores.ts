import { create } from "zustand";
import { User } from "@/types/user.types";
import {
  loginUser,
  getProfile,
  fetchUserById as fetchUserApi,
} from "@/services/API/user.api";
import { persist } from "zustand/middleware";

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  // register: (userData: User) => Promise<void>;
  fetchUser: (userId: number) => Promise<void>;
  //   updateProfile: (userData: Partial<User>) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const token = await loginUser({ username, password });
          localStorage.setItem("token", token.token); // Stocke le token JWT
          const profile = await getProfile();
          set({ user: profile, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          localStorage.removeItem("token");
          set({ user: null, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      getProfile: async () => {
        set({ loading: true, error: null });
        try {
          const profile = await getProfile();
          set({ user: profile, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });

          // Une erreur dans le dashboard signifie que le token n'est plus valide
          set({ user: null }); // Réinitialise l'utilisateur en cas d'erreur
          localStorage.removeItem("token"); // Supprime le token en cas d'erreur
          throw error; // Propagation de l'erreur pour gestion ultérieure
        }
      },

      // register: async (userData: User) => {
      //   set({ loading: true, error: null });
      //   try {
      //     const newUser = await registerUser(userData);
      //     set({ user: newUser, loading: false });
      //   } catch (error) {
      //     set({
      //       error: error instanceof Error ? error.message : String(error),
      //       loading: false,
      //     });
      //   }
      // },

      fetchUser: async (userId: number) => {
        set({ loading: true, error: null });
        try {
          const user = await fetchUserApi(userId);
          set({ user, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      // updateProfile: async (userData: Partial<User>) => {
      //     set({ loading: true, error: null });
      //     try {
      //         const updatedUser = await fetchUserApi(userData);
      //         set({ user: updatedUser, loading: false });
      //     } catch (error) {
      //         set({ error: error instanceof Error ? error.message : String(error), loading: false });
      //     }
      // },
    }),
    {
      name: "user-storage", // Nom de la clé dans localStorage
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => {
        console.log("🔁 Rehydrating Zustand store...");
        return (state) => {
          console.log("✅ Rehydrated with state:", state);
        };
      },
    }
  )
);
