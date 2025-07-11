/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { barbeariaService } from "@/lib/api/list-barbearia";
import Header from "@/components/header";
import BarbershopCardMobile from "./_components/mobile";
import BarbershopCardDesktop from "./_components/desktop";

const Home = () => {
  const [barbearias, setBarbearias] = useState<any[]>([]);
  const [filteredBarbearias, setFilteredBarbearias] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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
          barbearia.bairro.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBarbearias(filtered);
    }
  }, [searchQuery, barbearias]);

  const loadBarbearias = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await barbeariaService.getAllBarbearias();
      setBarbearias(data);
      setFilteredBarbearias(data);
    } catch (err: any) {
      console.error("Erro ao carregar barbearias:", err);
      setError("Erro ao carregar as barbearias. Tente novamente.");
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
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(
        "barbershop-favorites",
        JSON.stringify([...newFavorites]),
      );
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
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

  const getFavoriteShops = () => {
    return barbearias.filter((shop) => favorites.has(shop.id));
  };

  const getTopRatedShops = () => {
    return [...barbearias].sort((a, b) => b.rating - a.rating).slice(0, 10);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBarbearias(barbearias);
  };

  const hasActiveSearch = searchQuery.trim() !== "";
  const favoriteShops = getFavoriteShops();
  const topRatedShops = getTopRatedShops();

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
          <p className="text-sm font-semibold">Domingo, 08 Junho de 2025</p>
        </div>
      )}

      {!hasActiveSearch && favoriteShops.length > 0 && (
        <div className="mx-auto mb-8 w-full max-w-7xl px-4">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-600">
            Meus Favoritos
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {favoriteShops.map((shop) => (
              <Card
                key={`favorite-${shop.id}`}
                className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
              >
                <BarbershopCardMobile
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
                <BarbershopCardDesktop
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
              </Card>
            ))}
          </div>
        </div>
      )}

      {!hasActiveSearch && (
        <div className="mx-auto mb-8 w-full max-w-7xl px-4">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-600">
            Barbearias
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {topRatedShops.map((shop) => (
              <Card
                key={`top-rated-${shop.id}`}
                className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
              >
                <BarbershopCardMobile
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
                <BarbershopCardDesktop
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4">
        {!hasActiveSearch && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <h2 className="text-center text-2xl font-bold text-gray-600">
              Melhores Avaliados
            </h2>
          </div>
        )}

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
        ) : hasActiveSearch ? (
          <div>
            <div className="mb-4 text-center">
              <p className="text-gray-600">
                {filteredBarbearias.length} resultado
                {filteredBarbearias.length !== 1 ? "s" : ""} para{" "}
                <strong>{searchQuery}</strong>
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
              {filteredBarbearias.map((shop) => (
                <Card
                  key={shop.id}
                  className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
                >
                  <BarbershopCardMobile
                    shop={shop}
                    isFavorite={favorites.has(shop.id)}
                    onToggleFavorite={() => toggleFavorite(shop.id)}
                  />
                  <BarbershopCardDesktop
                    shop={shop}
                    isFavorite={favorites.has(shop.id)}
                    onToggleFavorite={() => toggleFavorite(shop.id)}
                  />
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {filteredBarbearias.map((shop) => (
              <Card
                key={shop.id}
                className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
              >
                <BarbershopCardMobile
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
                <BarbershopCardDesktop
                  shop={shop}
                  isFavorite={favorites.has(shop.id)}
                  onToggleFavorite={() => toggleFavorite(shop.id)}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
