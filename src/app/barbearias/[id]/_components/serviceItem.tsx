/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Servico } from "@/lib/model/servico";
import { User } from "lucide-react";

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Corte masculino
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Barba
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Corte + Barba
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Sobrancelha
  "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Tratamento
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", // Infantil
];

const BARBEIROS = [
  {
    id: "1",
    nome: "Caio",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    nome: "Felipe",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

interface Barbeiro {
  id: string;
  nome: string;
  foto: string;
}

const ServiceItem = ({
  servico,
  barbearia,
}: {
  servico: Servico;
  barbearia: any;
}) => {
  const [barberSelectionOpen, setBarberSelectionOpen] = useState(false);
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barbeiro | null>(null);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleBookingClick = () => {
    console.log(
      `Iniciando processo de reserva: ${servico.nome} na barbearia: ${barbearia?.nome}`,
    );
    setBarberSelectionOpen(true);
  };

  const handleBarberSelect = (barbeiro: Barbeiro) => {
    setSelectedBarber(barbeiro);
    setBarberSelectionOpen(false);
    setBookingSheetIsOpen(true);
    console.log(`Barbeiro selecionado: ${barbeiro.nome}`);
  };

  const handleBookingSheetOpenChange = (open: boolean) => {
    setBookingSheetIsOpen(open);
    if (!open) {
      // Reset barbeiro selecionado quando fechar o sheet
      setSelectedBarber(null);
    }
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

          {/* direita */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-semibold">{servico.nome}</h3>
            <p className="text-sm text-gray-400">{servico.descricao}</p>

            {/* preco */}
            <div className="flex items-center justify-between">
              <p className="text-1xl font-bold text-white">
                {formatPrice(servico.preco)}
              </p>

              <Button
                variant="secondary"
                size="default"
                onClick={handleBookingClick}
                className="bg-blue-700"
              >
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Seleção de Barbeiro */}
      <Dialog open={barberSelectionOpen} onOpenChange={setBarberSelectionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Escolha seu Barbeiro
            </DialogTitle>
            <DialogDescription>
              Selecione o barbeiro de sua preferência para o serviço{" "}
              <strong>{servico.nome}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {BARBEIROS.map((barbeiro) => (
              <Card
                key={barbeiro.id}
                className="hover:bg-muted/50 cursor-pointer border-2 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Foto do Barbeiro */}
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        alt={barbeiro.nome}
                        src={barbeiro.foto}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>

                    {/* Informações do Barbeiro */}
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold">{barbeiro.nome}</h3>
                    </div>

                    {/* Botão Escolher */}
                    <Button
                      onClick={() => handleBarberSelect(barbeiro)}
                      className="bg-white hover:bg-blue-700"
                    >
                      Escolher
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet de Agendamento */}
      <Sheet
        open={bookingSheetIsOpen}
        onOpenChange={handleBookingSheetOpenChange}
      >
        <SheetContent className="px-0">
          <SheetHeader>
            <SheetTitle>Fazer Reserva</SheetTitle>
          </SheetHeader>

          {/* Conteúdo do agendamento */}
          <div className="p-5">
            <div className="space-y-4">
              {/* Informações do Serviço */}
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
                  <p className="max-w-xs truncate text-sm text-gray-400">
                    {servico.descricao}
                  </p>
                  <p className="text-primary text-sm font-bold">
                    {formatPrice(servico.preco)}
                  </p>
                </div>
              </div>

              {/* Barbeiro Selecionado */}
              {selectedBarber && (
                <div className="space-y-3 border-b pb-4">
                  <h4 className="font-semibold">Barbeiro Selecionado</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12">
                      <Image
                        alt={selectedBarber.nome}
                        src={selectedBarber.foto}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{selectedBarber.nome}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações da Barbearia */}
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
            <div className="flex w-full gap-3">
              <Button
                onClick={() => {
                  setBookingSheetIsOpen(false);
                  setBarberSelectionOpen(true);
                }}
                variant="outline"
                className="flex-1"
              >
                Trocar Barbeiro
              </Button>
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                Confirmar Reserva
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ServiceItem;
