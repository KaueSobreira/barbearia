/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeftIcon,
  Loader2,
  MapPinIcon,
  MenuIcon,
  StarIcon,
} from "lucide-react";
import { barbeariaService } from "@/lib/api/list-barbearia";
import { servicoService, Servico } from "@/lib/api/list-servico";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceItem } from "./_components/serviceItem";
// import PhoneItem from "./_components/phone-item";

const HomeBarbearia = () => {
  const params = useParams();
  const [barbearia, setBarbearia] = useState<any>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicosLoading, setServicosLoading] = useState(false);

  useEffect(() => {
    loadBarbearia();
  }, [params.id]);

  useEffect(() => {
    if (barbearia?.id) {
      loadServicos();
    }
  }, [barbearia?.id]);

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

  const loadServicos = async () => {
    try {
      setServicosLoading(true);
      const servicosData = await servicoService.getServicosByBarbearia(
        barbearia.id,
      );
      setServicos(servicosData);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
      setServicos([]);
    } finally {
      setServicosLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Carregando barbearia...</p>
        </div>
      </div>
    );
  }

  if (!barbearia) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Barbearia não encontrada</h2>
          <p className="text-muted-foreground">
            A barbearia que você procura não existe ou foi removida.
          </p>
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* IMAGEM DE CAPA */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={barbearia.nome}
          src={barbearia.bgImage || "/default-barbershop.jpg"}
          fill
          className="object-cover"
          priority
        />

        {/* Botão Voltar */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 left-4 shadow-lg"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>

        {/* Botão Menu */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-4 right-4 shadow-lg"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* INFORMAÇÕES DA BARBEARIA */}
      <div className="bg-background border-b border-solid p-5">
        <h1 className="mb-3 text-2xl font-bold">{barbearia.nome}</h1>

        {/* Endereço */}
        <div className="mb-3 flex items-start gap-2">
          <MapPinIcon className="text-primary mt-0.5 flex-shrink-0" size={16} />
          <p className="text-muted-foreground text-sm">
            {barbearia.logradouro}, {barbearia.numero} - {barbearia.bairro},{" "}
            {barbearia.cidade}/{barbearia.estado}
          </p>
        </div>

        {/* Avaliação */}
        <div className="mb-3 flex items-center gap-2">
          <StarIcon className="fill-yellow-400 text-yellow-400" size={16} />
          <p className="text-sm font-medium">
            {barbearia.rating || "4.9"} ({barbearia.reviews || "400"}{" "}
            avaliações)
          </p>
        </div>

        {/* Badge da área de atendimento */}
        <Badge variant="secondary" className="text-xs">
          {barbearia.area_atendimento}
        </Badge>
      </div>

      {/* DESCRIÇÃO */}
      <div className="bg-background border-b border-solid p-5">
        <h2 className="text-muted-foreground mb-3 text-xs font-bold uppercase">
          Sobre Nós
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {barbearia.description ||
            `Barbearia especializada em ${barbearia.area_atendimento}. Oferecemos serviços de qualidade em um ambiente aconchegante e profissional. Nossa equipe é composta por barbeiros experientes, sempre atualizados com as últimas tendências e técnicas do mercado.`}
        </p>
      </div>

      {/* SERVIÇOS */}
      <div className="bg-background p-5">
        <h2 className="text-muted-foreground mb-4 text-xs font-bold uppercase">
          Serviços Disponíveis
        </h2>

        {servicosLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Carregando serviços...
              </span>
            </div>
          </div>
        ) : servicos.length > 0 ? (
          <div className="space-y-3">
            {servicos.map((servico) => (
              <ServiceItem
                key={servico.id}
                servico={servico}
                barbearia={barbearia}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum serviço cadastrado ainda.
            </p>
            <p className="text-muted-foreground text-xs">
              Entre em contato com a barbearia para mais informações.
            </p>
          </div>
        )}
      </div>

      {/* CONTATO */}
      {/* <div className="bg-muted/30 border-t border-solid p-5">
        <h2 className="text-muted-foreground mb-3 text-xs font-bold uppercase">
          Contato
        </h2>
        <div className="space-y-3 p-5">
          {phones.map((phone) => (
            <PhoneItem key={phone} phone={phone} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default HomeBarbearia;
