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

export interface Barbearia {
  id: string;
  nome: string;
  email: string;
  area_atendimento: string;
  CEP: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  createdAt: string;
  rating: number;
  reviews: number;
  description: string;
}
