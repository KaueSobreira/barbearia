/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import { isPast, isToday, set } from "date-fns";
import { useEffect, useMemo, useState } from "react";

// Lista de horários disponíveis
const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

interface BookingCalendarProps {
  serviceId: string;
  barberId: string;
  onDateTimeSelect: (date: Date | null) => void;
  selectedDate?: Date;
}

// Função para filtrar horários (apenas remove horários que já passaram hoje)
const getAvailableTimeList = (selectedDay: Date) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);

    // Verifica se o horário já passou (apenas para hoje)
    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }));
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false;
    }

    return true;
  });
};

const BookingCalendar = ({
  serviceId,
  barberId,
  onDateTimeSelect,
  selectedDate,
}: BookingCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    selectedDate,
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  // Calcular data/hora selecionada final
  const selectedDateTime = useMemo(() => {
    if (!selectedDay || !selectedTime) return null;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    return set(selectedDay, { hours, minutes });
  }, [selectedDay, selectedTime]);

  // Notificar mudanças para o componente pai
  useEffect(() => {
    onDateTimeSelect(selectedDateTime);
  }, [selectedDateTime, onDateTimeSelect]);

  // Calcular horários disponíveis (todos disponíveis, exceto os que já passaram hoje)
  const availableTimeList = useMemo(() => {
    if (!selectedDay) return [];
    return getAvailableTimeList(selectedDay);
  }, [selectedDay]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
    setSelectedTime(undefined); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="space-y-4">
      {/* Calendário */}
      <div className="border-b border-solid py-5">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selectedDay}
            onSelect={handleDateSelect}
            fromDate={new Date()}
            styles={{
              head_cell: {
                width: "100%",
                textTransform: "capitalize",
              },
              cell: {
                width: "100%",
              },
              button: {
                width: "100%",
              },
              nav_button_previous: {
                width: "32px",
                height: "32px",
              },
              nav_button_next: {
                width: "32px",
                height: "32px",
              },
              caption: {
                textTransform: "capitalize",
              },
            }}
          />
        </div>
      </div>

      {/* Seleção de Horários */}
      {selectedDay && (
        <div className="border-b border-solid pb-5">
          <h4 className="mb-3 px-5 font-semibold">Horários Disponíveis</h4>

          <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
            {availableTimeList.length > 0 ? (
              availableTimeList.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="rounded-full whitespace-nowrap"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Não há horários disponíveis para este dia.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Resumo da seleção */}
      {selectedDateTime && (
        <div className="px-5">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="mb-2 font-semibold">Agendamento Selecionado</h4>
            <p className="text-muted-foreground text-sm">
              <strong>Data:</strong>{" "}
              {selectedDateTime.toLocaleDateString("pt-BR")}
            </p>
            <p className="text-muted-foreground text-sm">
              <strong>Horário:</strong>{" "}
              {selectedDateTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
