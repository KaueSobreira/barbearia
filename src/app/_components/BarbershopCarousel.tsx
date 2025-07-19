// BarbershopCarousel.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BarbershopCardMobile from "./mobile";
import BarbershopCardDesktop from "./desktop";
import { Barbearia } from "@/lib/model/barbearia";
import React from "react";

interface Props {
  shops: Barbearia[];
  title: string;
  scrollRef: React.RefObject<HTMLDivElement | null>; // Change this line
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

const scrollAmount = 450;

const BarbershopCarousel: React.FC<Props> = ({
  shops,
  title,
  scrollRef,
  favorites,
  toggleFavorite,
}) => {
  if (shops.length === 0) return null;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative mx-auto mb-8 w-full max-w-7xl px-4">
      <h2 className="mb-4 text-center text-2xl font-bold text-white">
        {title}
      </h2>
      <div className="group relative md:px-12">
        <Button
          onClick={scrollLeft}
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
          onClick={scrollRight}
          className="group bg-opacity-70 absolute top-1/2 right-[-20px] z-20 hidden -translate-y-1/2 rounded-full bg-transparent p-3 pl-4 text-white shadow-lg ring-0 transition-all duration-300 hover:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none active:bg-transparent md:block"
          asChild
        >
          <ChevronRight className="h-20 w-20 transform transition-transform duration-300 group-hover:scale-110" />
        </Button>
      </div>
    </div>
  );
};

export default BarbershopCarousel;
