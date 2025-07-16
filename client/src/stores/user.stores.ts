import { create } from "zustand";
import { User } from "@/types/user.types";
import { loginUser, registerUser } from "@/API/user.api";

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: User) => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  //   updateProfile: (userData: Partial<User>) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async () => {
    set({ loading: true, error: null });
    try {
      const user = await loginUser(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutUser();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const newUser = await registerUser(userData);
      set({ user: newUser, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const user = await fetchUser(userId);
      set({ focusedUser: user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // updateProfile: async (userData) => {
  //     set({ loading: true, error: null });
  //     try {
  //         const updatedUser = await fetchUser(userData);
  //         set({ user: updatedUser, loading: false });
  //     } catch (error) {
  //         set({ error: error.message, loading: false });
  //     }
  // },
}));
