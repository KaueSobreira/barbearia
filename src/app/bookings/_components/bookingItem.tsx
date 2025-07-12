import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// TODO: TRAZER DO BANCO DE DAODS
const BookingItem = () => {
  return (
    <>
      <h2 className="mt-6 mb-3 flex items-center justify-center font-bold text-white uppercase">
        Agendamentos
      </h2>
      <Card className="mb-6">
        <CardContent className="flex justify-between p-0">
          {/* Parte Esquerda do Agendamento */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit text-white">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo e Barba</h3>

            <div className="flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png" />
              </Avatar>
              <p className="text-sm">Barbearia Dom Pedro</p>
            </div>
          </div>
          {/* Parte da Direita do Agendamento */}
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="text-sm">Maio</p>
            <p className="text-2xl">06</p>
            <p className="text-sm">20:00</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex justify-between p-0">
          {/* Parte Esquerda do Agendamento */}
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit text-white">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo e Barba</h3>

            <div className="flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png" />
              </Avatar>
              <p className="text-sm">Barbearia Dom Pedro</p>
            </div>
          </div>
          {/* Parte da Direita do Agendamento */}
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="text-sm">Maio</p>
            <p className="text-2xl">06</p>
            <p className="text-sm">20:00</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookingItem;
