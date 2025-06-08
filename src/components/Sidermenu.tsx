"use client";

import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { categoryOptions } from "@/lib/model/category";

const SiderMenu = () => {
  return (
    <SheetContent className="overflow-y-auto pr-5 pl-5">
      <SheetHeader className="pl-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>
      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {/* DADOS DO USUARIO */}
        <>
          <h2 className="font-bold">Olá, Faça seu Login!</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="text-white">
                <LogInIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <DialogHeader>
                <DialogTitle>Faça Login na plataforma!</DialogTitle>
                <DialogDescription>
                  Conecte-se usando sua conta no Google!
                </DialogDescription>
              </DialogHeader>
              <Button variant="outline" className="gap-1 font-bold">
                <Image
                  alt="Fazer Login com Google"
                  src="/google.png"
                  width={18}
                  height={18}
                />
                Faça Login com Google
              </Button>
            </DialogContent>
          </Dialog>
        </>
      </div>
      {/* parte inicial do menu do cliente */}
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant={"ghost"} asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Inicio
            </Link>
          </Button>
        </SheetClose>
        <Button className="justify-start gap-2" variant={"ghost"} asChild>
          <Link href="/bookings">
            <CalendarIcon size={18} />
            Agendamento
          </Link>
        </Button>
      </div>

      <h1 className="text-sm font-semibold">CATEGORIAS DE BUSCA</h1>
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {categoryOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button className="justify-start gap-2" variant={"ghost"} asChild>
              <Link href={`/barbershops?category=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>
      {/* SAIR */}
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <Button variant={"ghost"} className="justify-start gap-2">
          <LogOutIcon />
          Sair da Conta
        </Button>
      </div>
    </SheetContent>
  );
};

export default SiderMenu;
