import { User } from "@/types";
import api from "./api";

export const authService = {
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);

    // Obtener datos del usuario
    const userRes = await api.get("/users/me");
    localStorage.setItem("user", JSON.stringify(userRes.data));

    return userRes.data as User;
  },

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role: "investor" | "agent";
    referral_code?: string;
  }) {
    const response = await api.post("/auth/register", data);
    return response.data as User;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
