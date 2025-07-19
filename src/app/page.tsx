// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Barbearia } from "@/lib/model/barbearia";
import { useSession } from "next-auth/react";
import DataAtual from "./_components/date_dinamic";

const CITY_STORAGE_KEY = "user_selected_city";

const saveCityToLocalStorage = (city: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CITY_STORAGE_KEY, city);
  }
};

const getCityFromLocalStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(CITY_STORAGE_KEY);
  }
  return null;
};

const Home = () => {
  const { data: session } = useSession();
  const [barbearias, setBarbearias] = useState<Barbearia[]>([]);
  const [filteredBarbeariasBySearch, setFilteredBarbeariasBySearch] = useState<
    Barbearia[]
  >([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const [userCity, setUserCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(
    getCityFromLocalStorage(),
  );

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(
    getCityFromLocalStorage() === null,
  );

  const hasActiveSearch = searchQuery.trim() !== "";

  const favoriteScrollRef = useRef<HTMLDivElement | null>(null);
  const topRatedScrollRef = useRef<HTMLDivElement | null>(null);
  const allBarbeariasScrollRef = useRef<HTMLDivElement | null>(null);
  const searchResultsScrollRef = useRef<HTMLDivElement | null>(null);

  const extractCityFromNominatimResponse = (data: any): string | null => {
    if (data && data.address) {
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.address.suburb ||
        null
      );
    }
    return null;
  };

  const loadBarbearias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: Barbearia[] = await barbeariaService.getAllBarbearias();
      setBarbearias(data);

      const cities = Array.from(new Set(data.map((b) => b.cidade))).sort();
      setAvailableCities(cities);
    } catch (err: unknown) {
      console.error("Erro ao carregar barbearias:", err);
      if (axios.isAxiosError(err)) {
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
      setFilteredBarbeariasBySearch([]);
      setShowLocationModal(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserLocationAndFilter = useCallback(async () => {
    if (
      barbearias.length === 0 ||
      userCity ||
      selectedCity ||
      getCityFromLocalStorage()
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        },
      );

      const { latitude, longitude } = position.coords;

      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "BarberApp/1.0 (seu_email@example.com)",
        },
      });
      const data = await response.json();

      const detectedCity = extractCityFromNominatimResponse(data);

      if (detectedCity && availableCities.includes(detectedCity)) {
        setUserCity(detectedCity);
        setSelectedCity(detectedCity);
        saveCityToLocalStorage(detectedCity);
        setShowLocationModal(false);
        setIsInitialLoad(false);
      } else {
        setShowLocationModal(true);
      }
    } catch (geoError: unknown) {
      console.error("Erro de geolocalização ou reverse geocoding:", geoError);
      setShowLocationModal(true);
    } finally {
      setLoading(false);
    }
  }, [barbearias.length, userCity, selectedCity, availableCities]);

  useEffect(() => {
    loadFavorites();
    loadBarbearias();
  }, [loadBarbearias]);

  useEffect(() => {
    if (
      !loading &&
      barbearias.length > 0 &&
      availableCities.length > 0 &&
      !userCity &&
      !selectedCity &&
      isInitialLoad
    ) {
      getUserLocationAndFilter();
    }
  }, [
    loading,
    barbearias.length,
    availableCities.length,
    userCity,
    selectedCity,
    isInitialLoad,
    getUserLocationAndFilter,
  ]);

  useEffect(() => {
    if (
      !loading &&
      barbearias.length > 0 &&
      availableCities.length > 0 &&
      !userCity &&
      !selectedCity &&
      isInitialLoad
    ) {
      setShowLocationModal(true);
    }
  }, [
    loading,
    barbearias.length,
    availableCities.length,
    userCity,
    selectedCity,
    isInitialLoad,
  ]);

  useEffect(() => {
    const paramSearch = searchParams.get("search") || "";
    if (paramSearch !== searchQuery) {
      setSearchQuery(paramSearch);
    }
  }, [searchParams, searchQuery]);

  useEffect(() => {
    if (!barbearias.length) {
      setFilteredBarbeariasBySearch([]);
      return;
    }

    if (hasActiveSearch) {
      const currentCity = selectedCity || userCity;
      const filtered = barbearias.filter(
        (barbearia) =>
          (currentCity
            ? barbearia.cidade.toLowerCase() === currentCity.toLowerCase()
            : true) &&
          (barbearia.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            barbearia.cidade
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            barbearia.bairro
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (barbearia.area_atendimento &&
              barbearia.area_atendimento
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))),
      );
      setFilteredBarbeariasBySearch(filtered);
    } else {
      setFilteredBarbeariasBySearch([]);
    }
  }, [searchQuery, hasActiveSearch, barbearias, selectedCity, userCity]);

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

  const getBarbeariasByCurrentCity = (): Barbearia[] => {
    const cityToFilterBy = selectedCity || userCity;
    if (!cityToFilterBy) {
      return [];
    }
    return barbearias.filter(
      (barbearia) =>
        barbearia.cidade.toLowerCase() === cityToFilterBy.toLowerCase(),
    );
  };

  const getTopRatedShopsByCity = (): Barbearia[] => {
    const barbershopsInCity = getBarbeariasByCurrentCity();
    return [...barbershopsInCity]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setUserCity(null);
    saveCityToLocalStorage(city);
    setSearchQuery("");
    setShowLocationModal(false);
    setIsInitialLoad(false);
  };
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const favoriteShops = getFavoriteShops();
  const barbeariasInCurrentCity = getBarbeariasByCurrentCity();
  const topRatedShopsInCurrentCity = getTopRatedShopsByCity();

  const scrollAmount = 450;
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (loading && barbearias.length === 0 && isInitialLoad) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (
    isInitialLoad &&
    !selectedCity &&
    !userCity &&
    barbearias.length > 0 &&
    availableCities.length > 0
  ) {
    return (
      <div className="min-h-screen">
        <Header />
        <Dialog
          open={showLocationModal}
          onOpenChange={(open) => {
            if (!open && !selectedCity && !userCity) {
              setShowLocationModal(true);
            } else {
              setShowLocationModal(open);
            }
          }}
        >
          <DialogContent className="w-[90%] rounded-lg p-6 md:w-auto">
            <DialogHeader>
              <DialogTitle>Selecione sua Localização</DialogTitle>
              <DialogDescription className="mb-4">
                Para continuar, por favor, selecione sua cidade na lista.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <Select
                onValueChange={handleCitySelect}
                value={selectedCity || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione sua cidade" />
                </SelectTrigger>
                <SelectContent>
                  <Command>
                    <CommandInput placeholder="Buscar cidade..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {availableCities.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={handleCitySelect}
                          >
                            {city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
          </DialogContent>
        </Dialog>
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
        <div className="group relative md:px-12">
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
          disabled={!selectedCity && !userCity}
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

      {!hasActiveSearch && (selectedCity || userCity) && (
        <div className="pb-5 pl-10 font-bold text-gray-300">
          <h2 className="font-bold">
            {session ? `Olá, ${session.user?.name}` : "Olá, Faça seu Login!"}
          </h2>
          <DataAtual />
          {userCity && (
            <p className="text-sm font-semibold">
              Cidade detectada: {userCity}
            </p>
          )}
          {selectedCity && !userCity && (
            <p className="text-sm font-semibold">
              Cidade selecionada: {selectedCity}
            </p>
          )}
        </div>
      )}

      {hasActiveSearch &&
        (filteredBarbeariasBySearch.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <p className="text-lg text-gray-600">
                Não há resultados para <strong>{searchQuery}</strong> em{" "}
                {selectedCity || userCity}.
              </p>
              <p className="text-sm text-gray-500">
                Tente pesquisar por outro termo ou verificar a ortografia.
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
            shops={filteredBarbeariasBySearch}
            title={`Resultados para "${searchQuery}" em ${selectedCity || userCity}`}
            scrollRef={searchResultsScrollRef}
          />
        ))}

      {!hasActiveSearch && (selectedCity || userCity) && (
        <>
          {favoriteShops.length > 0 && (
            <BarbershopCarousel
              shops={favoriteShops}
              title="Meus Favoritos"
              scrollRef={favoriteScrollRef}
            />
          )}

          {barbeariasInCurrentCity.length > 0 && (
            <BarbershopCarousel
              shops={barbeariasInCurrentCity}
              title={`Todas as Barbearias em ${selectedCity || userCity}`}
              scrollRef={allBarbeariasScrollRef}
            />
          )}

          {topRatedShopsInCurrentCity.length > 0 && (
            <BarbershopCarousel
              shops={topRatedShopsInCurrentCity}
              title={`Melhores Avaliados em ${selectedCity || userCity}`}
              scrollRef={topRatedScrollRef}
            />
          )}
        </>
      )}

      {!hasActiveSearch && !selectedCity && !userCity && (
        <div className="mt-20 text-center text-gray-500"></div>
      )}
    </div>
  );
};

export default Home;
