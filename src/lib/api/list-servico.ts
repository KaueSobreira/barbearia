import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ServicoData {
  nome: string;
  descricao: string;
  preco: number;
  barberShopId: string;
}

export interface ServicoResponse {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  barberShopId: string;
  createdAt: string;
}

export const servicoApiService = {
  async createServico(data: ServicoData): Promise<ServicoResponse> {
    try {
      console.log("Criando serviço:", data);

      const response = await api.post<ServicoResponse>(
        "/barbearias/servicos",
        data,
      );

      console.log("Serviço criado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao criar serviço:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 400) {
          throw new Error("Dados inválidos. Verifique os campos preenchidos.");
        }
        if (error.response?.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.");
        }
        if (error.response?.status === 404) {
          throw new Error("Barbearia não encontrada.");
        }
        if (error.response?.status === 500) {
          throw new Error("Erro interno do servidor. Tente novamente.");
        }
      }
      throw new Error("Erro ao criar serviço. Tente novamente.");
    }
  },
};
