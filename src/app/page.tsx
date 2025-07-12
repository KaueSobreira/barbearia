"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { barbeariaService } from "@/lib/api/list-barbearia";
import Header from "@/components/header";
import BarbershopCardMobile from "./_components/mobile";
import BarbershopCardDesktop from "./_components/desktop";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Barbearia } from "@/lib/model/barbearia";

const Home = () => {
  const [barbearias, setBarbearias] = useState<Barbearia[]>([]);
  const [filteredBarbearias, setFilteredBarbearias] = useState<Barbearia[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const favoriteScrollRef = useRef<HTMLDivElement | null>(null);
  const topRatedScrollRef = useRef<HTMLDivElement | null>(null);
  const filteredScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadBarbearias();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBarbearias(barbearias);
    } else {
      const filtered = barbearias.filter(
        (barbearia) =>
          barbearia.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          barbearia.cidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
          barbearia.bairro.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (barbearia.area_atendimento &&
            barbearia.area_atendimento
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
      setFilteredBarbearias(filtered);
    }
  }, [searchQuery, barbearias]);

  useEffect(() => {
    const paramSearch = searchParams.get("search") || "";
    if (paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
  }, [searchParams, searchQuery]);

  const loadBarbearias = async () => {
    try {
      setLoading(true);
      setError("");
      const data: Barbearia[] = await barbeariaService.getAllBarbearias();
      setBarbearias(data);
      if (initialSearchQuery) {
        const filtered = data.filter(
          (barbearia: Barbearia) =>
            barbearia.nome
              .toLowerCase()
              .includes(initialSearchQuery.toLowerCase()) ||
            barbearia.cidade
              .toLowerCase()
              .includes(initialSearchQuery.toLowerCase()) ||
            barbearia.bairro
              .toLowerCase()
              .includes(initialSearchQuery.toLowerCase()) ||
            (barbearia.area_atendimento &&
              barbearia.area_atendimento
                .toLowerCase()
                .includes(initialSearchQuery.toLowerCase())),
        );
        setFilteredBarbearias(filtered);
      } else {
        setFilteredBarbearias(data);
      }
    } catch (err: unknown) {
      console.error("Erro ao carregar barbearias:", err);
      if (axios.isAxiosError(err)) {
        console.error("Detalhes do erro Axios:", err.response?.data);
        setError(
          `Erro ao carregar as barbearias: ${err.response?.data?.message || err.message}`,
        );
      } else if (err instanceof Error) {
        setError(`Erro ao carregar as barbearias: ${err.message}`);
      } else {
        setError(
          "Erro desconhecido ao carregar as barbearias. Tente novamente.",
        );
      }
      setBarbearias([]);
      setFilteredBarbearias([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem("barbershop-favorites");
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error: unknown) {
      console.error("Erro ao carregar favoritos:", error);
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message);
      }
    }
  };

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(
        "barbershop-favorites",
        JSON.stringify([...newFavorites]),
      );
    } catch (error: unknown) {
      console.error("Erro ao salvar favoritos:", error);
      if (error instanceof Error) {
        console.error("Detalhes do erro:", error.message);
      }
    }
  };

  const toggleFavorite = (barbeariaId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(barbeariaId)) {
      newFavorites.delete(barbeariaId);
    } else {
      newFavorites.add(barbeariaId);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const getFavoriteShops = (): Barbearia[] => {
    return barbearias.filter((shop) => favorites.has(shop.id));
  };

  const getTopRatedShops = (): Barbearia[] => {
    return [...barbearias].sort((a, b) => b.rating - a.rating).slice(0, 10);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBarbearias(barbearias);
  };

  const hasActiveSearch = searchQuery.trim() !== "";
  const favoriteShops = getFavoriteShops();
  const topRatedShops = getTopRatedShops();

  const scrollAmount = 450;
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Carregando barbearias...</p>
        </div>
      </div>
    );
  }

  const BarbershopCarousel = ({
    shops,
    title,
    scrollRef,
  }: {
    shops: Barbearia[];
    title: string;
    scrollRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    if (shops.length === 0) return null;

    return (
      <div className="relative mx-auto mb-8 w-full max-w-7xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-white">
          {title}
        </h2>
        {/* Container principal para o carrossel, que agora terá padding nas laterais no desktop */}
        <div className="relative md:px-12">
          <Button
            onClick={() => scrollLeft(scrollRef)}
            className="group bg-opacity-70 absolute top-1/2 left-[-20px] z-20 hidden -translate-y-1/2 rounded-full bg-transparent p-3 pr-4 text-white shadow-lg ring-0 transition-all duration-300 hover:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none active:bg-transparent md:block"
            asChild
          >
            <ChevronLeft className="h-20 w-20 transform transition-transform duration-300 group-hover:scale-110" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
          >
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
              >
                <div className="md:hidden">
                  <BarbershopCardMobile
                    shop={shop}
                    isFavorite={favorites.has(shop.id)}
                    onToggleFavorite={() => toggleFavorite(shop.id)}
                  />
                </div>
                <div className="hidden md:block">
                  <BarbershopCardDesktop
                    shop={shop}
                    isFavorite={favorites.has(shop.id)}
                    onToggleFavorite={() => toggleFavorite(shop.id)}
                  />
                </div>
              </Card>
            ))}
          </div>
          {/* Seta direita - visível apenas no desktop, sempre visível */}
          <Button
            onClick={() => scrollRight(scrollRef)}
            className="group bg-opacity-70 absolute top-1/2 right-[-20px] z-20 hidden -translate-y-1/2 rounded-full bg-transparent p-3 pl-4 text-white shadow-lg ring-0 transition-all duration-300 hover:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none active:bg-transparent md:block"
            asChild
          >
            <ChevronRight className="h-20 w-20 transform transition-transform duration-300 group-hover:scale-110" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex flex-col items-center justify-center p-4 pt-8">
        <Input
          className="mb-6 max-w-sm rounded-full border-gray-300 text-center focus:border-blue-500"
          placeholder="Pesquisar barbearia ou cidade..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="mx-auto mb-4 max-w-md px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {!hasActiveSearch && (
        <div className="pb-5 pl-10 font-bold text-gray-300">
          <h1>Kaue Sobreira Lucena</h1>
          <p className="text-sm font-semibold">Domingo, 08 Julho de 2025</p>
        </div>
      )}

      {!hasActiveSearch && favoriteShops.length > 0 && (
        <BarbershopCarousel
          shops={favoriteShops}
          title="Meus Favoritos"
          scrollRef={favoriteScrollRef}
        />
      )}

      {!hasActiveSearch && (
        <BarbershopCarousel
          shops={topRatedShops}
          title="Barbearias"
          scrollRef={topRatedScrollRef}
        />
      )}

      <div className="mx-auto w-full max-w-7xl px-4">
        {hasActiveSearch && filteredBarbearias.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <p className="text-lg text-gray-600">
                Não há resultados para <strong>{searchQuery}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Tente pesquisar por outro termo ou verifique a ortografia.
              </p>
              <Button
                onClick={clearSearch}
                className="mt-4 bg-blue-600 font-bold text-white hover:bg-blue-700"
              >
                Limpar pesquisa
              </Button>
            </div>
          </div>
        ) : (
          <BarbershopCarousel
            shops={hasActiveSearch ? filteredBarbearias : barbearias}
            title={
              hasActiveSearch
                ? `Resultados para "${searchQuery}"`
                : "Melhores Avaliados"
            }
            scrollRef={filteredScrollRef}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
