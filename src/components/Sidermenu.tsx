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
import { useRouter } from "next/navigation";

import { signIn, signOut, useSession } from "next-auth/react"; // <-- Importa aqui
import { useState } from "react";

const SiderMenu = () => {
  const router = useRouter();

  const { data: session } = useSession(); // <-- Usa o hook para pegar sessão

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const handleCategoryClick = (categoryTitle: string) => {
    router.push(`/?search=${encodeURIComponent(categoryTitle)}`);
  };
  const handleAgendamentoClick = () => {
    if (!session) {
      setLoginDialogOpen(true); // se não logado, abre modal
    } else {
      router.push("/bookings"); // se logado, redireciona
    }
  };

  return (
    <SheetContent className="overflow-y-auto pr-5 pl-5">
      <SheetHeader className="pl-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>
      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {/* DADOS DO USUARIO */}
        <>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Foto do usuário"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="font-bold">Olá, {session.user?.name}</h2>
              </>
            ) : (
              <h2 className="font-bold">Olá, Faça seu Login!</h2>
            )}
          </div>

          {!session && (
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
                <Button
                  variant="outline"
                  className="gap-1 font-bold"
                  onClick={() => signIn("google")}
                >
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
          )}
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
        <>
          <Button
            className="justify-start gap-2"
            variant={"ghost"}
            onClick={handleAgendamentoClick}
          >
            <CalendarIcon size={18} />
            Agendamento
          </Button>

          {/* Dialog para login, só aparece se loginDialogOpen estiver true */}
          <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
            <DialogContent className="w-[90%]">
              <DialogHeader>
                <DialogTitle>
                  Faça login para acessar seus agendamentos
                </DialogTitle>
                <DialogDescription>
                  É necessário estar logado para visualizar seus agendamentos.
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="outline"
                className="gap-1 font-bold"
                onClick={() => signIn("google")}
              >
                <Image
                  alt="Fazer Login com Google"
                  src="/google.png"
                  width={18}
                  height={18}
                />
                Login com Google
              </Button>
            </DialogContent>
          </Dialog>
        </>
      </div>

      <h1 className="text-sm font-semibold">CATEGORIAS DE BUSCA</h1>
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {categoryOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button
              className="justify-start gap-2"
              variant={"ghost"}
              onClick={() => handleCategoryClick(option.title)}
            >
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.title}
              />
              {option.title}
            </Button>
          </SheetClose>
        ))}
      </div>
      {/* SAIR */}
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {session && (
          <Button
            variant={"ghost"}
            className="justify-start gap-2"
            onClick={() => signOut()}
          >
            <LogOutIcon />
            Sair da Conta
          </Button>
        )}
      </div>
    </SheetContent>
  );
};

export default SiderMenu;
