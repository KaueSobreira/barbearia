// lib/api/list-servico.ts
import axios from "axios";
import {
  DeleteServicoData,
  Servico,
  ServicoApiResponse,
  ServicoData,
  ServicoResponse,
  UpdateServicoData,
} from "../model/servico";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export const servicoService = {
  async getServicosByBarbearia(barberShopId: string): Promise<Servico[]> {
    try {
      console.log(`🔍 Buscando serviços para barbearia: ${barberShopId}`);

      const response = await api.get(`/servicos/${barberShopId}`);

      console.log("✅ Resposta completa da API:", response.data);

      const servicos = response.data.services || response.data || [];

      console.log("📋 Array de serviços extraído:", servicos);
      console.log(`📊 Número de serviços encontrados: ${servicos.length}`);

      const servicosFormatados: Servico[] = servicos.map(
        (servico: ServicoApiResponse) => ({
          ...servico,
          preco:
            typeof servico.preco === "string"
              ? parseFloat(servico.preco)
              : servico.preco,
        }),
      );

      console.log("✨ Serviços formatados:", servicosFormatados);

      return servicosFormatados;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erro ao buscar serviços:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 404) {
          console.log("📝 Nenhum serviço encontrado para esta barbearia");
          return [];
        }

        if (error.response?.status === 400) {
          throw new Error("ID da barbearia inválido");
        }

        if (error.response?.status === 500) {
          throw new Error("Erro interno do servidor");
        }
      }

      console.error("❌ Erro desconhecido ao buscar serviços:", error);
      throw new Error("Erro ao carregar serviços");
    }
  },

  async createServico(data: ServicoData): Promise<ServicoResponse> {
    try {
      console.log("➕ Criando serviço:", data);

      const response = await api.post<ServicoResponse>("/servicos", data);

      console.log("✅ Serviço criado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erro ao criar serviço:", {
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

  async updateServico(data: UpdateServicoData): Promise<ServicoResponse> {
    try {
      console.log("✏️ Atualizando serviço:", data);

      const response = await api.put<ServicoResponse>("/servicos", data);

      console.log("✅ Serviço atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erro ao atualizar serviço:", {
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
          throw new Error("Serviço ou barbearia não encontrada.");
        }
        if (error.response?.status === 500) {
          throw new Error("Erro interno do servidor. Tente novamente.");
        }
      }
      throw new Error("Erro ao atualizar serviço. Tente novamente.");
    }
  },

  async deleteServico(data: DeleteServicoData): Promise<void> {
    try {
      console.log("🗑️ Excluindo serviço:", data);

      await api.delete("/servicos", {
        data: data,
      });

      console.log("✅ Serviço excluído com sucesso");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Erro ao excluir serviço:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 400) {
          throw new Error("Dados inválidos para exclusão.");
        }
        if (error.response?.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.");
        }
        if (error.response?.status === 404) {
          throw new Error("Serviço ou barbearia não encontrada.");
        }
        if (error.response?.status === 500) {
          throw new Error("Erro interno do servidor. Tente novamente.");
        }
      }
      throw new Error("Erro ao excluir serviço. Tente novamente.");
    }
  },
};

export const servicoApiService = {
  createServico: servicoService.createServico,
  getServicosByBarbearia: servicoService.getServicosByBarbearia,
  updateServico: servicoService.updateServico,
  deleteServico: servicoService.deleteServico,
};
