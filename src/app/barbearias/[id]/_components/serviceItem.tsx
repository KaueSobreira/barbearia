/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Servico } from "@/lib/model/servico";

// Imagens constantes para os serviços
const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Corte masculino
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Barba
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Corte + Barba
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Sobrancelha
  "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Tratamento
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Infantil
];

const ServiceItem = ({
  servico,
  barbearia,
}: {
  servico: Servico;
  barbearia: any;
}) => {
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleBookingClick = () => {
    console.log(
      `Abrindo agendamento: ${servico.nome} na barbearia: ${barbearia?.nome}`,
    );
    setBookingSheetIsOpen(true);
  };

  const handleBookingSheetOpenChange = (open: boolean) => {
    setBookingSheetIsOpen(open);
  };

  const getServiceImage = (servicoId: string): string => {
    const index =
      servicoId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      SERVICE_IMAGES.length;
    return SERVICE_IMAGES[index];
  };

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3">
          {/* IMAGEM */}
          <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px]">
            <Image
              alt={servico.nome}
              src={getServiceImage(servico.id)}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* CONTEÚDO DIREITA */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-semibold">{servico.nome}</h3>
            <p className="text-sm text-gray-400">{servico.descricao}</p>

            {/* PREÇO E BOTÃO */}
            <div className="flex items-center justify-between">
              <p className="text-1xl font-bold text-white">
                {formatPrice(servico.preco)}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="default"
                  onClick={handleBookingClick}
                  className="bg-blue-700"
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  {/* Conteúdo do agendamento */}
                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="relative h-16 w-16">
                          <Image
                            alt={servico.nome}
                            src={getServiceImage(servico.id)}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{servico.nome}</h3>
                          <p className="text-sm text-gray-400">
                            {servico.descricao}
                          </p>
                          <p className="text-primary text-sm font-bold">
                            {formatPrice(servico.preco)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Barbearia</h4>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12">
                            <Image
                              alt={barbearia?.nome || "Barbearia"}
                              src={barbearia?.image || SERVICE_IMAGES[0]}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{barbearia?.nome}</p>
                            <p className="text-xs text-gray-400">
                              {barbearia?.cidade}, {barbearia?.estado}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="mt-5 px-5">
                    <Button
                      onClick={() => setBookingSheetIsOpen(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Fechar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceItem;
