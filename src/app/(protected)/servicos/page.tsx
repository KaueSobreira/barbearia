/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { authService } from "@/lib/api/auth";
import { servicoApiService } from "@/lib/api/list-servico";

interface FormData {
  nome: string;
  descricao: string;
  preco: string;
}

const ListServico = () => {
  const [barbearia, setBarbearia] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    descricao: "",
    preco: "",
  });

  useEffect(() => {
    const barbeariaData = authService.getBarberShop();
    if (barbeariaData) {
      setBarbearia(barbeariaData);
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao || !formData.preco) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!barbearia?.id) {
      setError(
        "Erro: Dados da barbearia não encontrados. Faça login novamente.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const servicoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        barberShopId: barbearia.id,
      };

      const novoServico = await servicoApiService.createServico(servicoData);

      console.log("Serviço criado:", novoServico);
      setSuccess(`Serviço "${formData.nome}" criado com sucesso!`);
      resetForm();

      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao criar serviço:", err);
      setError(err.message || "Erro ao criar serviço. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!barbearia) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12" />
          <h2 className="text-xl font-semibold">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Gerenciar Serviços
              </CardTitle>
              <CardDescription>
                Gerencie todos os serviços da sua barbearia
              </CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="text-white">
                  <Plus className="mr-2 h-4 w-4 text-white" />
                  Novo Serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Serviço</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para criar um novo serviço
                  </DialogDescription>
                </DialogHeader>

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Serviço *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Corte Masculino"
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva o serviço oferecido"
                      value={formData.descricao}
                      onChange={(e) =>
                        handleInputChange("descricao", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                      maxLength={30}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.preco}
                      onChange={(e) =>
                        handleInputChange("preco", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                      className="hover:text-red-600"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        "Criar Serviço"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">
                        Nenhum serviço encontrado.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListServico;
