// lib/api/barbershop.ts
import axios from "axios";

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  },
);

export interface BarbershopData {
  nome: string;
  email: string;
  senha: string;
  area_atendimento: string;
  CEP: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
}

export interface BarbershopResponse {
  id: string;
  nome: string;
  email: string;
}

export const barbershopService = {
  async create(data: BarbershopData): Promise<BarbershopResponse> {
    try {
      const response = await api.post<BarbershopResponse>("/barbearias", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error("Dados inválidos. Verifique os campos preenchidos.");
        }
        if (error.response?.status === 409) {
          throw new Error("Email já cadastrado. Tente com outro email.");
        }
        if (error.response?.status === 500) {
          throw new Error(
            "Erro interno do servidor. Tente novamente mais tarde.",
          );
        }
      }
      throw new Error("Erro ao cadastrar barbearia. Tente novamente.");
    }
  },
};

export default barbershopService;
