import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Home = () => {
  const barbershops = [
    {
      id: 1,
      name: "Barbearia Kaue",
      address: "Rua Lorena, 123",
      city: "Birigui",
      rating: 4.8,
      reviews: 120,
      image:
        "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description:
        "Barbearia moderna com profissionais experientes. Ambiente aconchegante e serviços de qualidade premium.",
      color: "blue",
    },
    {
      id: 2,
      name: "Barber Elite",
      address: "Av. Central, 456",
      city: "Centro",
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description:
        "Tradicional barbearia com mais de 20 anos de experiência. Cortes modernos e serviços de qualidade premium.",
      color: "green",
    },
    {
      id: 3,
      name: "Studio Hair",
      address: "Rua Nova, 789",
      city: "Vila Nova",
      rating: 4.7,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description:
        "Ambiente moderno e aconchegante. Especialistas em cortes masculinos e tratamentos capilares.",
      color: "purple",
    },
    {
      id: 4,
      name: "Vintage Barber",
      address: "Rua Jardim, 321",
      city: "Jardins",
      rating: 4.6,
      reviews: 43,
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      bgImage:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description:
        "Estilo vintage com equipamentos modernos. Experiência única em cortes clássicos e barba.",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center justify-center p-4 pt-8">
        <h1 className="pb-6 text-4xl font-bold">Barberia</h1>

        <Input
          className="mb-6 max-w-sm justify-center rounded-full border-gray-300 text-center focus:border-blue-500"
          placeholder="Faça sua pesquisa..."
        />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-600">
          Meus Favoritos
        </h2>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-600">
          Salões
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((shop) => (
            <Card
              key={shop.id}
              className="flex-shrink-0 overflow-hidden border-0 !bg-transparent shadow-lg"
            >
              {/* celular */}
              <div className="w-[200px] rounded-2xl bg-gray-900 text-white shadow-lg md:hidden">
                <div className="p-4">
                  <div className="mb-3 flex justify-center">
                    <div className="relative h-16 w-16">
                      <Image
                        src={shop.image}
                        alt={shop.name}
                        className="h-full w-full rounded-full border-3 border-white object-cover shadow-lg"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>

                  <h3 className="mb-2 text-center text-sm font-semibold text-white">
                    {shop.name}
                  </h3>

                  <div className="mb-2 flex justify-center">
                    <Badge className="bg-blue-600 px-2 py-1 text-xs text-white">
                      {shop.city}
                    </Badge>
                  </div>

                  <p className="mb-2 text-center text-xs text-gray-300">
                    {shop.address}
                  </p>

                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex text-xs text-yellow-400">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <span className="ml-1 text-xs text-gray-300">
                      ({shop.rating})
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button className="w-full bg-blue-600 py-2 text-xs text-white hover:bg-blue-700">
                    Agendar
                  </Button>
                </div>
              </div>

              {/* pc */}
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
                      <h3 className="text-xl font-bold">{shop.name}</h3>
                      <Badge className="bg-blue-600 px-3 py-1 text-white">
                        {shop.city}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="mb-3 text-gray-600">{shop.address}</p>

                  {/* Rating */}
                  <div className="mb-4 flex items-center">
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <span className="ml-2 text-gray-600">
                      ({shop.rating}) • {shop.reviews} avaliações
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm text-gray-600">
                    {shop.description}
                  </p>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Agendar Horário
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
