"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function VerificaCadastro() {
  const { data: session, status } = useSession();
  const [exibeDialog, setExibeDialog] = useState(false);
  const [telefone, setTelefone] = useState("");

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
            setExibeDialog(true);
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
        setExibeDialog(false);
      } else {
        alert("Erro ao registrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na solicitação.");
    }
  };

  return (
    <Dialog open={exibeDialog} onOpenChange={setExibeDialog}>
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
        <Button className="mt-2" onClick={finalizarCadastro}>
          Finalizar Cadastro
        </Button>
      </DialogContent>
    </Dialog>
  );
}
