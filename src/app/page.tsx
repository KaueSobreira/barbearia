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

import CitySelectorModal from "./_components/CitySelectorModal";
import BarbershopCarousel from "./_components/BarbershopCarousel";
import ErrorAlert from "./_components/ErrorAlert";
import VerificaCadastro from "./_components/VerificaCadastro";

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

  const [selectedCity, setSelectedCity] = useState<string | null>(
    getCityFromLocalStorage(),
  );

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showManualCitySelector, setShowManualCitySelector] = useState(false);

  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [isInitialLoad, setIsInitialLoad] = useState(
    getCityFromLocalStorage() === null,
  );

  const hasActiveSearch = searchQuery.trim() !== "";

  const favoriteScrollRef = useRef<HTMLDivElement>(null);
  const topRatedScrollRef = useRef<HTMLDivElement>(null);
  const allBarbeariasScrollRef = useRef<HTMLDivElement>(null);
  const searchResultsScrollRef = useRef<HTMLDivElement>(null);

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

  const getCityFromUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocalização não suportada pelo navegador.");
      setShowLocationModal(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            null;

          if (city) {
            setSelectedCity(city);
            saveCityToLocalStorage(city);
            setIsInitialLoad(false);
            setShowLocationModal(false);
            setLocationErrorMsg(null);
            setShowManualCitySelector(false);
          } else {
            setLocationErrorMsg(
              "Não foi possível determinar a cidade pela localização.",
            );
            setShowLocationModal(true);
          }
        } catch (error) {
          console.error("Erro ao consultar Nominatim:", error);
          setLocationErrorMsg(
            "Erro ao consultar localização. Por favor, selecione manualmente.",
          );
          setShowLocationModal(true);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationErrorMsg(
            "Permissão para localização negada. Por favor, habilite-a ou selecione manualmente.",
          );
        } else {
          setLocationErrorMsg(
            "Erro ao obter localização: " +
              error.message +
              ". Por favor, selecione manualmente.",
          );
        }
        setShowLocationModal(true);
      },
      { timeout: 10000 },
    );
  };

  useEffect(() => {
    loadFavorites();
    loadBarbearias();
  }, [loadBarbearias]);

  useEffect(() => {
    if (
      !loading &&
      barbearias.length > 0 &&
      availableCities.length > 0 &&
      !selectedCity &&
      isInitialLoad &&
      !showManualCitySelector
    ) {
      getCityFromUserLocation();
    }
  }, [
    loading,
    barbearias.length,
    availableCities.length,
    selectedCity,
    isInitialLoad,
    getCityFromUserLocation,
    showManualCitySelector,
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
      const currentCity = selectedCity;
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
  }, [searchQuery, hasActiveSearch, barbearias, selectedCity]);

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
    const cityToFilterBy = selectedCity;
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
    saveCityToLocalStorage(city);
    setSearchQuery("");
    setShowLocationModal(false);
    setShowManualCitySelector(false);
    setLocationErrorMsg(null);
    setIsInitialLoad(false);
  };

  const handleChooseManual = () => {
    setShowManualCitySelector(true);
    setShowLocationModal(false);
    setLocationErrorMsg(null);
  };

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const favoriteShops = getFavoriteShops();
  const barbeariasInCurrentCity = getBarbeariasByCurrentCity();
  const topRatedShopsInCurrentCity = getTopRatedShopsByCity();

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

  const LocationPermissionModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p className="mb-4 text-black">{locationErrorMsg}</p>
        <div className="flex justify-center gap-4 text-black">
          <Button onClick={handleChooseManual} variant="secondary" className="">
            Selecionar cidade manualmente
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <VerificaCadastro />
      <Header />

      {!selectedCity && showLocationModal && <LocationPermissionModal />}

      <CitySelectorModal
        open={showManualCitySelector}
        onOpenChange={(open) => {
          setShowManualCitySelector(open);
          if (!open && !selectedCity) {
            setShowLocationModal(true);
          }
        }}
        availableCities={availableCities}
        selectedCity={selectedCity}
        handleCitySelect={handleCitySelect}
      />

      <div className="flex flex-col items-center justify-center p-4 pt-8">
        <Input
          className="mb-6 max-w-sm rounded-full border-gray-300 text-center focus:border-blue-500"
          placeholder="Pesquisar barbearia ou cidade..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!selectedCity}
        />
      </div>

      {error && <ErrorAlert message={error} />}

      {!hasActiveSearch && selectedCity && (
        <div className="pb-5 pl-10 font-bold text-gray-300">
          <h2 className="font-bold">
            {session ? `Olá, ${session.user?.name}` : "Olá, Faça seu Login!"}
          </h2>
          <DataAtual />
          <p className="text-sm font-semibold">
            Cidade selecionada: {selectedCity}
          </p>
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
                onClick={() => setSearchQuery("")}
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

      {!hasActiveSearch && selectedCity && (
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
