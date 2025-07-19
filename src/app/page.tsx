// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { barbeariaService } from "@/lib/api/list-barbearia";
import Header from "@/components/header";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Barbearia } from "@/lib/model/barbearia";
import { useSession } from "next-auth/react";
import DataAtual from "./_components/date_dinamic";

// Import the new components
import CitySelectorModal from "./_components/CitySelectorModal";
import BarbershopCarousel from "./_components/BarbershopCarousel";
import ErrorAlert from "./_components/ErrorAlert";

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

  // Removed userCity state
  const [selectedCity, setSelectedCity] = useState<string | null>(
    getCityFromLocalStorage(),
  );

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  // isInitialLoad will now only check if a city has been selected at all
  const [isInitialLoad, setIsInitialLoad] = useState(
    getCityFromLocalStorage() === null,
  );

  const hasActiveSearch = searchQuery.trim() !== "";

  const favoriteScrollRef = useRef<HTMLDivElement>(null);
  const topRatedScrollRef = useRef<HTMLDivElement>(null);
  const allBarbeariasScrollRef = useRef<HTMLDivElement>(null);
  const searchResultsScrollRef = useRef<HTMLDivElement>(null);

  // No longer needed since we're not doing reverse geocoding
  // const extractCityFromNominatimResponse = (data: any): string | null => {
  //   if (data && data.address) {
  //     return (
  //       data.address.city ||
  //       data.address.town ||
  //       data.address.village ||
  //       data.address.county ||
  //       data.address.suburb ||
  //       null
  //     );
  // }
  //   return null;
  // };

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
      setShowLocationModal(false); // Still good to close if there's a load error
    } finally {
      setLoading(false);
    }
  }, []);

  // Removed getUserLocationAndFilter function completely

  useEffect(() => {
    loadFavorites();
    loadBarbearias();
  }, [loadBarbearias]);

  // Modified useEffect to always show CitySelectorModal if no city is selected
  useEffect(() => {
    if (
      !loading &&
      barbearias.length > 0 &&
      availableCities.length > 0 &&
      !selectedCity && // Check only selectedCity
      isInitialLoad
    ) {
      setShowLocationModal(true);
    }
  }, [
    loading,
    barbearias.length,
    availableCities.length,
    selectedCity, // Only selectedCity here
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
      const currentCity = selectedCity; // Removed userCity
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
  }, [searchQuery, hasActiveSearch, barbearias, selectedCity]); // Removed userCity from dependencies

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
    const cityToFilterBy = selectedCity; // Removed userCity
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
    // Removed setUserCity(null); as userCity is gone
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

  // If loading initially AND no city is selected (meaning modal is about to show)
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

  // Always show the modal if no city is selected and data is loaded
  if (
    isInitialLoad &&
    !selectedCity &&
    barbearias.length > 0 &&
    availableCities.length > 0
  ) {
    return (
      <div className="min-h-screen">
        <Header />
        <CitySelectorModal
          open={showLocationModal}
          onOpenChange={(open) => {
            if (!open && !selectedCity) {
              // Only check selectedCity
              setShowLocationModal(true);
            } else {
              setShowLocationModal(open);
            }
          }}
          availableCities={availableCities}
          selectedCity={selectedCity}
          handleCitySelect={handleCitySelect}
          error={error} // This error would be from initial barbearia load, not geolocation
        />
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
          disabled={!selectedCity} // Enabled only when a city is selected
        />
      </div>

      {error && <ErrorAlert message={error} />}

      {!hasActiveSearch &&
        selectedCity && ( // Only check selectedCity
          <div className="pb-5 pl-10 font-bold text-gray-300">
            <h2 className="font-bold">
              {session ? `Olá, ${session.user?.name}` : "Olá, Faça seu Login!"}
            </h2>
            <DataAtual />
            {/* Removed userCity display */}
            {selectedCity && (
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
                {selectedCity}.
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
            title={`Resultados para "${searchQuery}" em ${selectedCity}`}
            scrollRef={searchResultsScrollRef}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        ))}

      {!hasActiveSearch &&
        selectedCity && ( // Only check selectedCity
          <>
            {favoriteShops.length > 0 && (
              <BarbershopCarousel
                shops={favoriteShops}
                title="Meus Favoritos"
                scrollRef={favoriteScrollRef}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}

            {barbeariasInCurrentCity.length > 0 && (
              <BarbershopCarousel
                shops={barbeariasInCurrentCity}
                title={`Todas as Barbearias em ${selectedCity}`}
                scrollRef={allBarbeariasScrollRef}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}

            {topRatedShopsInCurrentCity.length > 0 && (
              <BarbershopCarousel
                shops={topRatedShopsInCurrentCity}
                title={`Melhores Avaliados em ${selectedCity}`}
                scrollRef={topRatedScrollRef}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}
          </>
        )}

      {!hasActiveSearch && !selectedCity && (
        <div className="mt-20 text-center text-gray-500"></div>
      )}
    </div>
  );
};

export default Home;
