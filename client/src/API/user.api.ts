import axios from "axios";
import { User } from "@/types/user.types";

const loginUser = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<User>("/api/users/login", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

const registerUser = async (userData: User): Promise<User> => {
  try {
    const response = await axios.post<User>("/api/users/register", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export { loginUser, registerUser };
