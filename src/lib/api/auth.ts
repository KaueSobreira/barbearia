import axios from "axios";
import { LoginData, LoginResponse } from "../model/login";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const requestData = {
        email: data.email,
        senha: data.password,
      };

      console.log("Sending login request:", {
        url: `${api.defaults.baseURL}/barbearias/login`,
        data: requestData,
      });

      const response = await api.post("/barbearias/login", requestData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      throw error;
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("barberShop");
    }
  },

  getBarberShop() {
    if (typeof window !== "undefined") {
      const barberShop = localStorage.getItem("barberShop");
      return barberShop ? JSON.parse(barberShop) : null;
    }
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveAuth(barberShop: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("barberShop", JSON.stringify(barberShop));
    }
  },

  isAuthenticated(): boolean {
    return !!this.getBarberShop();
  },
};
