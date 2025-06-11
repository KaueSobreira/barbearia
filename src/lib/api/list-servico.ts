/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  barberShopId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dados de exemplo para desenvolvimento
const servicosMock: Servico[] = [
  {
    id: "1",
    nome: "Corte",
    descricao: "Corte clássico",
    preco: 25.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Corte + Barba",
    descricao: "Corte completo",
    preco: 45.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    nome: "Barba Completa",
    descricao: "Aparar",
    preco: 20.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    nome: "Sobrancelha Masculina",
    descricao: "Aparar",
    preco: 15.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    nome: "Tratamento Capilar",
    descricao: "Hidratação e cuidados",
    preco: 35.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    nome: "Corte Infantil",
    descricao: "Corte especial",
    preco: 20.0,
    barberShopId: "default",
    createdAt: new Date().toISOString(),
  },
];

export const servicoService = {
  async getServicosByBarbearia(barberShopId: string): Promise<Servico[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`🔄 Mock: Buscando serviços para barbearia ${barberShopId}`);

      return servicosMock.map((servico) => ({
        ...servico,
        barberShopId,
      }));
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  },

  async createServico(
    data: Omit<Servico, "id" | "createdAt">,
  ): Promise<Servico> {
    try {
      const novoServico: Servico = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      return novoServico;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw error;
    }
  },

  async getAllServicos(): Promise<Servico[]> {
    try {
      return servicosMock;
    } catch (error) {
      console.error("Erro ao buscar todos os serviços:", error);
      return servicosMock;
    }
  },
};
