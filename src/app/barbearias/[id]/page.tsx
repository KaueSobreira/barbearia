/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { barbeariaService } from "@/lib/api/list-barbearia";

const HomeBarbearia = () => {
  const params = useParams();
  const [barbearia, setBarbearia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbearia();
  }, [params.id]);

  const loadBarbearia = async () => {
    try {
      setLoading(true);

      const barbearias = await barbeariaService.getAllBarbearias();
      const barbeariaEncontrada = barbearias.find(
        (b: any) => b.id === params.id,
      );

      if (barbeariaEncontrada) {
        setBarbearia(barbeariaEncontrada);
      }
    } catch (err) {
      console.error("Erro ao carregar barbearia:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1>{barbearia?.nome}</h1>
    </div>
  );
};

export default HomeBarbearia;
