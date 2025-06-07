export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  barberShop: {
    id: string;
    email: string;
    nome: string;
    area_atendimento: string;
    CEP: string;
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    complemento: string;
    createdAt: string;
  };
}
