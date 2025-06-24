/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface BarbershopCardMobileProps {
  shop: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BarbershopCardMobile = ({
  shop,
  isFavorite,
  onToggleFavorite,
}: BarbershopCardMobileProps) => {
  return (
    <div className="w-[200px] rounded-2xl bg-gray-900 text-white shadow-lg md:hidden">
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
          <div className="flex text-xs text-yellow-400">⭐⭐⭐⭐⭐</div>
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

          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            variant="mobile"
          />
        </div>
      </div>
    </div>
  );
};

export default BarbershopCardMobile;
