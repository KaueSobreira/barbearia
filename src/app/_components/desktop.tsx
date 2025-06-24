/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface BarbershopCardDesktopProps {
  shop: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BarbershopCardDesktop = ({
  shop,
  isFavorite,
  onToggleFavorite,
}: BarbershopCardDesktopProps) => {
  return (
    <div className="hidden w-[400px] overflow-hidden rounded-2xl bg-white md:block">
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

        <p className="line-clamp-3 text-sm text-gray-600">{shop.description}</p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex w-full items-center gap-3">
          <Button
            asChild
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href={`/barbearias/${shop.id}`}>Agendar Horário</Link>
          </Button>

          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            variant="desktop"
          />
        </div>
      </CardFooter>
    </div>
  );
};

export default BarbershopCardDesktop;
