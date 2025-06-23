/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Servico } from "@/lib/model/servico";

interface FormData {
  nome: string;
  descricao: string;
  preco: string;
}

const ListServico = () => {
  const [barbearia, setBarbearia] = useState<any>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    descricao: "",
    preco: "",
  });

  useEffect(() => {
    const barbeariaData = authService.getBarberShop();
    if (barbeariaData) {
      setBarbearia(barbeariaData);
      loadServicos(barbeariaData.id);
    }
  }, []);

  const loadServicos = async (barberShopId: string) => {
    try {
      setIsLoading(true);
      const servicosData =
        await servicoApiService.getServicosByBarbearia(barberShopId);
      setServicos(servicosData);
    } catch (err: any) {
      console.error("Erro ao carregar serviços:", err);
      setError("Erro ao carregar serviços. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
    setSelectedServico(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
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

      await servicoApiService.createServico(servicoData);
      setSuccess(`Serviço "${formData.nome}" criado com sucesso!`);
      resetForm();

      // Recarregar a lista de serviços
      await loadServicos(barbearia.id);

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

  const handleEdit = (servico: Servico) => {
    setSelectedServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao || !formData.preco) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!selectedServico || !barbearia?.id) {
      setError("Erro: Dados não encontrados.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const updateData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        idBarberShop: barbearia.id,
        idService: selectedServico.id,
      };

      await servicoApiService.updateServico(updateData);
      setSuccess(`Serviço "${formData.nome}" atualizado com sucesso!`);
      resetForm();

      // Recarregar a lista de serviços
      await loadServicos(barbearia.id);

      setTimeout(() => {
        setIsEditDialogOpen(false);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao atualizar serviço:", err);
      setError(err.message || "Erro ao atualizar serviço. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (servico: Servico) => {
    setSelectedServico(servico);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedServico || !barbearia?.id) {
      setError("Erro: Dados não encontrados.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const deleteData = {
        idBarberShop: barbearia.id,
        idService: selectedServico.id,
      };

      await servicoApiService.deleteServico(deleteData);
      setSuccess(`Serviço "${selectedServico.nome}" excluído com sucesso!`);

      // Recarregar a lista de serviços
      await loadServicos(barbearia.id);

      setIsDeleteDialogOpen(false);
      setSelectedServico(null);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao excluir serviço:", err);
      setError(err.message || "Erro ao excluir serviço. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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

                <form onSubmit={handleCreate} className="space-y-4">
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
          {/* Mensagens de sucesso/erro globais */}
          {success && !isDialogOpen && !isEditDialogOpen && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && !isDialogOpen && !isEditDialogOpen && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p>Carregando serviços...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : servicos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-muted-foreground">
                          Nenhum serviço encontrado.
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Clique em Novo Servico para adicionar seu primeiro
                          serviço.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  servicos.map((servico) => (
                    <TableRow key={servico.id}>
                      <TableCell className="font-medium">
                        {servico.nome}
                      </TableCell>
                      <TableCell>{servico.descricao}</TableCell>
                      <TableCell>{formatPrice(servico.preco)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(servico)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClick(servico)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Altere os dados do serviço selecionado
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

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome do Serviço *</Label>
              <Input
                id="edit-nome"
                placeholder="Ex: Corte Masculino"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descricao">Descrição *</Label>
              <Textarea
                id="edit-descricao"
                placeholder="Descreva o serviço oferecido"
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                required
                disabled={isSubmitting}
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-preco">Preço (R$) *</Label>
              <Input
                id="edit-preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) => handleInputChange("preco", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
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
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Serviço"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o serviço {selectedServico?.nome}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedServico(null);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListServico;
