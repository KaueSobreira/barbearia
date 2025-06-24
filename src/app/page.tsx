/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Heart } from "lucide-react";
import Image from "next/image";
import { barbeariaService } from "@/lib/api/list-barbearia";
import Link from "next/link";
import Header from "@/components/header";

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const favoriteShops = getFavoriteShops();

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

      <div className="pb-5 pl-10 font-bold text-gray-300">
        <h1>Kaue Sobreira Lucena</h1>
        <p className="text-sm font-semibold">Domingo, 08 Junho de 2025</p>
      </div>

      {/* Seção de Favoritos */}
      {favoriteShops.length > 0 && (
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
                {/* Mobile - Favoritos */}
                <div className="relative w-[200px] rounded-2xl bg-gray-900 text-white shadow-lg md:hidden">
                  <div className="p-4">
                    <div className="mb-3 flex justify-center">
                      <div className="relative h-16 w-16">
                        <Image
                          src={shop.image}
                          alt={shop.nome}
                          className="h-full w-full rounded-full border-3 border-white object-cover shadow-lg"
                          width={500}
                          height={500}
                        />
                      </div>
                    </div>

                    <h3 className="mb-2 text-center text-sm font-semibold text-white">
                      {shop.nome}
                    </h3>

                    <div className="mb-2 flex justify-center">
                      <Badge className="bg-blue-600 px-2 py-1 text-xs text-white">
                        {shop.cidade}
                      </Badge>
                    </div>

                    <p className="mb-2 text-center text-xs text-gray-300">
                      {shop.logradouro}, {shop.numero} - {shop.bairro}
                    </p>

                    <div className="mb-3 flex items-center justify-center">
                      <div className="flex text-xs text-yellow-400">
                        ⭐⭐⭐⭐⭐
                      </div>
                      <span className="ml-1 text-xs text-gray-300">
                        ({shop.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        className="flex-1 bg-blue-600 py-2 text-xs text-white hover:bg-blue-700"
                      >
                        <Link href={`/barbearias/${shop.id}`}>Agendar</Link>
                      </Button>

                      {/* Coração Favorito - Mobile */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-800"
                        onClick={() => toggleFavorite(shop.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.has(shop.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop - Favoritos */}
                <div className="relative hidden w-[400px] overflow-hidden rounded-2xl bg-white md:block">
                  <CardHeader className="relative h-48 p-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${shop.bgImage})` }}
                    >
                      <div className="bg-opacity-40 absolute inset-0 bg-black"></div>
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold">{shop.nome}</h3>
                        <Badge className="bg-blue-600 px-3 py-1 text-white">
                          {shop.cidade}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="mb-3 text-gray-600">
                      {shop.logradouro}, {shop.numero} - {shop.bairro}
                    </p>

                    <div className="mb-4 flex items-center">
                      <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="ml-2 text-gray-600">
                        ({shop.rating.toFixed(1)}) • {shop.reviews} avaliações
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm text-gray-600">
                      {shop.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <div className="flex w-full items-center gap-3">
                      <Button
                        asChild
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Link href={`/barbearias/${shop.id}`}>
                          Agendar Horário
                        </Link>
                      </Button>

                      {/* Coração Favorito - Desktop */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-10 w-10 p-0 hover:bg-gray-100"
                        onClick={() => toggleFavorite(shop.id)}
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            favorites.has(shop.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Todas as Barbearias */}
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-center gap-2">
          <h2 className="text-center text-2xl font-bold text-gray-600">
            Barbearias
          </h2>
        </div>

        {filteredBarbearias.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {searchQuery
                ? `Nenhuma barbearia encontrada para "${searchQuery}"`
                : "Nenhuma barbearia cadastrada ainda."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredBarbearias(barbearias);
                }}
                className="mt-4"
              >
                Limpar busca
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {filteredBarbearias.map((shop) => (
              <Card
                key={shop.id}
                className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
              >
                {/* Mobile */}
                <div className="relative w-[200px] rounded-2xl bg-gray-900 text-white shadow-lg md:hidden">
                  <div className="p-4">
                    <div className="mb-3 flex justify-center">
                      <div className="relative h-16 w-16">
                        <Image
                          src={shop.image}
                          alt={shop.nome}
                          className="h-full w-full rounded-full border-3 border-white object-cover shadow-lg"
                          width={500}
                          height={500}
                        />
                      </div>
                    </div>

                    <h3 className="mb-2 text-center text-sm font-semibold text-white">
                      {shop.nome}
                    </h3>

                    <div className="mb-2 flex justify-center">
                      <Badge className="bg-blue-600 px-2 py-1 text-xs text-white">
                        {shop.cidade}
                      </Badge>
                    </div>

                    <p className="mb-2 text-center text-xs text-gray-300">
                      {shop.logradouro}, {shop.numero} - {shop.bairro}
                    </p>

                    <div className="mb-3 flex items-center justify-center">
                      <div className="flex text-xs text-yellow-400">
                        ⭐⭐⭐⭐⭐
                      </div>
                      <span className="ml-1 text-xs text-gray-300">
                        ({shop.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        className="flex-1 bg-blue-600 py-2 text-xs text-white hover:bg-blue-700"
                      >
                        <Link href={`/barbearias/${shop.id}`}>Agendar</Link>
                      </Button>

                      {/* Coração Favorito - Mobile */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-800"
                        onClick={() => toggleFavorite(shop.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.has(shop.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop */}
                <div className="relative hidden w-[400px] overflow-hidden rounded-2xl bg-white md:block">
                  <CardHeader className="relative h-48 p-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${shop.bgImage})` }}
                    >
                      <div className="bg-opacity-40 absolute inset-0 bg-black"></div>
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-bold">{shop.nome}</h3>
                        <Badge className="bg-blue-600 px-3 py-1 text-white">
                          {shop.cidade}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="mb-3 text-gray-600">
                      {shop.logradouro}, {shop.numero} - {shop.bairro}
                    </p>

                    <div className="mb-4 flex items-center">
                      <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="ml-2 text-gray-600">
                        ({shop.rating.toFixed(1)}) • {shop.reviews} avaliações
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm text-gray-600">
                      {shop.description}
                    </p>
                  </CardContent>

                  <CardFooter className="relative p-6 pt-0">
                    <Button
                      asChild
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Link href={`/barbearias/${shop.id}`}>
                        Agendar Horário
                      </Link>
                    </Button>

                    {/* Coração Favorito - Desktop */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-4 bottom-4 h-10 w-10 p-0 hover:bg-gray-100"
                      onClick={() => toggleFavorite(shop.id)}
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          favorites.has(shop.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
