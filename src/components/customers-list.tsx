
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  criarCliente,
  deletarCliente,
  obterClientes,
  atualizarCliente,
} from "@/services/sales-service";
import type { Cliente } from "@/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { EsquemaCliente, type ValoresFormularioCliente } from "@/types";

export function ListaClientes() {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [dialogoAberto, setDialogoAberto] = React.useState(false);
  const [clienteEditando, setClienteEditando] =
    React.useState<Cliente | null>(null);
  const { toast } = useToast();

  const form = useForm<ValoresFormularioCliente>({
    resolver: zodResolver(EsquemaCliente),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const carregarClientes = React.useCallback(async () => {
    const dadosClientes = await obterClientes();
    setClientes(dadosClientes);
  }, []);

  React.useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const tratarEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    form.reset({
      name: cliente.name,
      email: cliente.email,
    });
    setDialogoAberto(true);
  };

  const tratarNovo = () => {
    setClienteEditando(null);
    form.reset({ name: "", email: "" });
    setDialogoAberto(true);
  };

  const tratarDeletar = async (clienteId: string) => {
    try {
      await deletarCliente(clienteId);
      toast({
        title: "Sucesso!",
        description: "Cliente excluído com sucesso.",
      });
      carregarClientes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir o cliente. Verifique se ele não possui vendas associadas.",
      });
    }
  };

  const aoEnviar = async (valores: ValoresFormularioCliente) => {
    try {
      if (clienteEditando) {
        await atualizarCliente({ ...valores, id: clienteEditando.id });
        toast({
          title: "Sucesso!",
          description: "Cliente atualizado com sucesso.",
        });
      } else {
        await criarCliente(valores);
        toast({
          title: "Sucesso!",
          description: "Cliente criado com sucesso.",
        });
      }
      setDialogoAberto(false);
      carregarClientes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Clientes</h2>
        <Button onClick={tratarNovo}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.name}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => tratarEditar(cliente)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => tratarDeletar(cliente.id)}
                          className="text-destructive"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {clienteEditando ? "Editar Cliente" : "Adicionar Cliente"}
            </DialogTitle>
            <DialogDescription>
              {clienteEditando
                ? "Altere os detalhes do cliente e clique em salvar."
                : "Preencha os detalhes do novo cliente."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(aoEnviar)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Empresa Alfa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contato@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
