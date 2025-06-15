export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  barberShopId: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface ServicoApiResponse {
  id: string;
  nome: string;
  descricao: string;
  preco: string | number;
  barberShopId: string;
  createdAt?: string;
  updatedAt?: string;
}
