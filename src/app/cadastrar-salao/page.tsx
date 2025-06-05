"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import barbershopService from "@/lib/api/route-api";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  senha: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  area_atendimento: z.string().min(2, {
    message: "Área de atendimento é obrigatória.",
  }),
  CEP: z.string().regex(/^\d{5}-?\d{3}$/, {
    message: "CEP deve ter o formato 00000-000.",
  }),
  estado: z.string().min(2, {
    message: "Estado é obrigatório.",
  }),
  cidade: z.string().min(2, {
    message: "Cidade é obrigatória.",
  }),
  bairro: z.string().min(2, {
    message: "Bairro é obrigatório.",
  }),
  logradouro: z.string().min(2, {
    message: "Logradouro é obrigatório.",
  }),
  numero: z.string().min(1, {
    message: "Número é obrigatório.",
  }),
  complemento: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BarbershopRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      area_atendimento: "",
      CEP: "",
      estado: "",
      cidade: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: "",
    },
  });

  const handleCEPChange = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");

    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCEP}/json/`,
        );
        const data = await response.json();

        if (!data.erro) {
          form.setValue("estado", data.uf);
          form.setValue("cidade", data.localidade);
          form.setValue("bairro", data.bairro);
          form.setValue("logradouro", data.logradouro);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const response = await barbershopService.create(values);

      console.log("Barbearia cadastrada:", response);

      form.reset();

      alert("Barbearia cadastrada com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${errorMessage}`);
      console.error("Erro ao cadastrar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Cadastro de Barbearia
            </CardTitle>
            <p className="text-white">
              Preencha os dados para cadastrar sua barbearia
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Dados da Barbearia
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Barbearia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Barbearia Kaue"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area_atendimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área de Atendimento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Estética, Barbearia, Salão de Beleza"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Dados de Acesso
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Endereço
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="CEP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00000-000"
                                disabled={isLoading}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleCEPChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              O endereço será preenchido automaticamente
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SP"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="São Paulo"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Centro"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="logradouro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua das Flores"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sala 2 (opcional)"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar Barbearia"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
