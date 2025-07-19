"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCities: string[];
  selectedCity: string | null;
  handleCitySelect: (city: string) => void;
  error?: string | null;
}

const CitySelectorModal: React.FC<Props> = ({
  open,
  onOpenChange,
  availableCities,
  selectedCity,
  handleCitySelect,
  error,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] rounded-lg p-6 md:w-auto">
        <DialogHeader>
          <DialogTitle>Selecione sua Localização</DialogTitle>
          <DialogDescription className="mb-4">
            Para continuar, por favor, selecione sua cidade na lista.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Select onValueChange={handleCitySelect} value={selectedCity || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione sua cidade" />
            </SelectTrigger>
            <SelectContent>
              <Command>
                <CommandInput placeholder="Buscar cidade..." />
                <CommandList>
                  <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                  <CommandGroup>
                    {availableCities.map((city) => (
                      <CommandItem
                        key={city}
                        value={city}
                        onSelect={handleCitySelect}
                      >
                        {city}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </SelectContent>
          </Select>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitySelectorModal;
