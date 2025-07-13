
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
  criarProduto,
  deletarProduto,
  obterProdutos,
  atualizarProduto,
} from "@/services/sales-service";
import type { Produto } from "@/types";
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
import { EsquemaProduto, type ValoresFormularioProduto } from "@/types";

export function ListaProdutos() {
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [dialogoAberto, setDialogoAberto] = React.useState(false);
  const [produtoEditando, setProdutoEditando] =
    React.useState<Produto | null>(null);
  const { toast } = useToast();

  const form = useForm<ValoresFormularioProduto>({
    resolver: zodResolver(EsquemaProduto),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const carregarProdutos = React.useCallback(async () => {
    const dadosProdutos = await obterProdutos();
    setProdutos(dadosProdutos);
  }, []);

  React.useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const tratarEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    form.reset({
      name: produto.name,
      price: produto.price,
      stock: produto.stock,
    });
    setDialogoAberto(true);
  };

  const tratarNovo = () => {
    setProdutoEditando(null);
    form.reset({ name: "", price: 0, stock: 0 });
    setDialogoAberto(true);
  };

  const tratarDeletar = async (produtoId: string) => {
    try {
      await deletarProduto(produtoId);
      toast({
        title: "Sucesso!",
        description: "Produto excluído com sucesso.",
      });
      carregarProdutos();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir o produto. Verifique se ele não está associado a nenhuma venda.",
      });
    }
  };

  const aoEnviar = async (valores: ValoresFormularioProduto) => {
    try {
      if (produtoEditando) {
        await atualizarProduto({ ...valores, id: produtoEditando.id });
        toast({
          title: "Sucesso!",
          description: "Produto atualizado com sucesso.",
        });
      } else {
        await criarProduto(valores);
        toast({
          title: "Sucesso!",
          description: "Produto criado com sucesso.",
        });
      }
      setDialogoAberto(false);
      carregarProdutos();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Produtos</h2>
        <Button onClick={tratarNovo}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[180px]">Preço</TableHead>
              <TableHead className="w-[100px]">Estoque</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.length > 0 ? (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.name}</TableCell>
                  <TableCell>
                    {produto.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{produto.stock}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => tratarEditar(produto)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => tratarDeletar(produto.id)}
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
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum produto encontrado.
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
              {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
            <DialogDescription>
              {produtoEditando
                ? "Altere os detalhes do produto e clique em salvar."
                : "Preencha os detalhes do novo produto."}
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
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Laptop Pro X2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} 
                         onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
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
