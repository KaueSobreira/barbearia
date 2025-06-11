import axios from "axios";
import { Barbearia } from "../model/barbearia";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

const images = [
  "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
];

const bgImages = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
];

export const barbeariaService = {
  async getAllBarbearias() {
    const response = await api.get("/barbearias/fetch-barber-shops", {});
    const barbearias = response.data.barberShops || [];

    return barbearias.map((barbearia: Barbearia, index: number) => ({
      ...barbearia,
      image: images[index % images.length],
      bgImage: bgImages[index % bgImages.length],
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 100) + 20,
      description: `${barbearia.area_atendimento} localizada em ${barbearia.bairro}. Profissionais experientes e ambiente aconchegante.`,
    }));
  },
};
