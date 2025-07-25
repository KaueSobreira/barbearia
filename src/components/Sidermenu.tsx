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
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SiderMenu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [exibeDialogCadastro, setExibeDialogCadastro] = useState(false);
  const [telefone, setTelefone] = useState("");

  const handleCategoryClick = (categoryTitle: string) => {
    router.push(`/?search=${encodeURIComponent(categoryTitle)}`);
  };

  const handleAgendamentoClick = () => {
    if (!session) {
      setLoginDialogOpen(true);
    } else {
      router.push("/bookings");
    }
  };

  // Verificação se o e-mail já está cadastrado
  useEffect(() => {
    const verificarUsuario = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch("http://localhost:3333/user/authentication", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!res.ok) {
            // Usuário não encontrado, abre o dialog de telefone
            setExibeDialogCadastro(true);
          }
        } catch (err) {
          console.error("Erro ao verificar usuário:", err);
        }
      }
    };

    verificarUsuario();
  }, [status, session]);

  const finalizarCadastro = async () => {
    try {
      const res = await fetch("http://localhost:3333/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: session?.user?.name,
          email: session?.user?.email,
          telefone,
        }),
      });

      if (res.ok) {
        setExibeDialogCadastro(false);
      } else {
        alert("Erro ao registrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na solicitação.");
    }
  };

  return (
    <SheetContent className="overflow-y-auto pr-5 pl-5">
      <SheetHeader className="pl-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
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
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant={"ghost"} asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        <Button
          className="justify-start gap-2"
          variant={"ghost"}
          onClick={handleAgendamentoClick}
        >
          <CalendarIcon size={18} />
          Agendamento
        </Button>

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

      {/* Dialog para completar o cadastro (telefone) */}
      <Dialog open={exibeDialogCadastro} onOpenChange={setExibeDialogCadastro}>
        <DialogContent className="w-[90%]">
          <DialogHeader>
            <DialogTitle>Complete seu cadastro</DialogTitle>
            <DialogDescription>
              Precisamos do seu telefone para concluir o cadastro.
            </DialogDescription>
          </DialogHeader>
          <input
            type="text"
            placeholder="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded border px-2 py-1"
          />
          <Button
            className="mt-2 cursor-pointer text-white"
            onClick={finalizarCadastro}
          >
            Finalizar Cadastro
          </Button>
        </DialogContent>
      </Dialog>
    </SheetContent>
  );
};

export default SiderMenu;
