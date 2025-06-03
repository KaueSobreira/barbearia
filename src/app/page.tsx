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
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="pb-6 text-4xl font-bold">Barberia</h1>

      <Input
        className="mb-6 max-w-sm justify-center rounded-full text-center"
        placeholder="Faça sua pesquisa..."
      />

      <div className="w-full max-w-6xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-500">
          Meus Favoritos
        </h2>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-500">
          Salões
        </h2>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <Card className="mx-auto w-full max-w-[280px] overflow-hidden rounded-xl">
            <CardHeader className="p-0">
              <Image
                src="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                alt="barbearia"
                className="h-32 w-full object-cover"
                width={280}
                height={128}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Verudela Beach</p>
                <Badge
                  variant="secondary"
                  className="bg-blue-700 text-xs text-white"
                >
                  Birigui
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-gray-600">
                Completely renovated for the season 2020, Arena Verudela Beach
                Apartments are fully equipped and modernly furnished.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Agendar</Button>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="mx-auto w-full max-w-[280px] overflow-hidden rounded-xl">
            <CardHeader className="p-0">
              <Image
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="barbearia"
                className="h-32 w-full object-cover"
                width={280}
                height={128}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Barber Shop Elite</p>
                <Badge
                  variant="secondary"
                  className="bg-green-700 text-xs text-white"
                >
                  Centro
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-gray-600">
                Tradicional barbearia com mais de 20 anos de experiência. Cortes
                modernos e serviços de qualidade premium.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Agendar</Button>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="mx-auto w-full max-w-[280px] overflow-hidden rounded-xl">
            <CardHeader className="p-0">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="barbearia"
                className="h-32 w-full object-cover"
                width={280}
                height={128}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Studio Hair</p>
                <Badge
                  variant="secondary"
                  className="bg-purple-700 text-xs text-white"
                >
                  Vila Nova
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-gray-600">
                Ambiente moderno e aconchegante. Especialistas em cortes
                masculinos e tratamentos capilares.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Agendar</Button>
            </CardFooter>
          </Card>

          {/* Card 4 */}
          <Card className="mx-auto w-full max-w-[280px] overflow-hidden rounded-xl">
            <CardHeader className="p-0">
              <Image
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="barbearia"
                className="h-32 w-full object-cover"
                width={280}
                height={128}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Vintage Barber</p>
                <Badge
                  variant="secondary"
                  className="bg-orange-700 text-xs text-white"
                >
                  Jardins
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-gray-600">
                Estilo vintage com equipamentos modernos. Experiência única em
                cortes clássicos e barba.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Agendar</Button>
            </CardFooter>
          </Card>

          {/* Card 5 */}
          <Card className="mx-auto w-full max-w-[280px] overflow-hidden rounded-xl">
            <CardHeader className="p-0">
              <Image
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="barbearia"
                className="h-32 w-full object-cover"
                width={280}
                height={128}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Modern Cut</p>
                <Badge
                  variant="secondary"
                  className="bg-red-700 text-xs text-white"
                >
                  Shopping
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-gray-600">
                Localizada no centro comercial. Atendimento rápido e
                profissional para o homem moderno.
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Agendar</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
