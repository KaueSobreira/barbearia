/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Servico } from "@/lib/model/servico";
import { CalendarIcon } from "lucide-react";

const ServiceItem = ({
  servico,
  barbearia,
}: {
  servico: Servico;
  barbearia: any;
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAgendarClick = () => {
    console.log(
      `Agendando serviço: ${servico.nome} na barbearia: ${barbearia?.nome}`,
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{servico.nome}</h3>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {servico.descricao}
          </p>
          <div className="mt-2">
            <span className="text-primary text-sm font-bold">
              {formatPrice(servico.preco)}
            </span>
          </div>
        </div>

        <div className="ml-4">
          <Button size="sm" className="w-full" onClick={handleAgendarClick}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Agendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
