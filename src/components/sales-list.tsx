
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
import { Button } from "@/components/ui/button";
import {
  obterVendasComDetalhes,
  criarVenda,
  obterClientes,
  obterProdutos,
} from "@/services/sales-service";
import type {
  VendaComDetalhes,
  ValoresFormularioVenda,
  Cliente,
  Produto,
} from "@/types";
import { PlusCircle, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { EsquemaVenda } from "@/types";

export function ListaVendas() {
  const [vendas, setVendas] = React.useState<VendaComDetalhes[]>([]);
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [dialogoAberto, setDialogoAberto] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ValoresFormularioVenda>({
    resolver: zodResolver(EsquemaVenda),
    defaultValues: {
      customerId: "",
      items: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const carregarDados = React.useCallback(async () => {
    const [dadosVendas, dadosClientes, dadosProdutos] = await Promise.all([
      obterVendasComDetalhes(),
      obterClientes(),
      obterProdutos(),
    ]);
    setVendas(dadosVendas);
    setClientes(dadosClientes);
    setProdutos(dadosProdutos);
  }, []);

  React.useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const tratarNova = () => {
    form.reset({ customerId: "", items: [{ productId: "", quantity: 1 }] });
    setDialogoAberto(true);
  };

  const aoEnviar = async (valores: ValoresFormularioVenda) => {
    try {
      await criarVenda(valores);
      toast({
        title: "Sucesso!",
        description: "Venda registrada com sucesso.",
      });
      setDialogoAberto(false);
      carregarDados();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao registrar a venda.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Histórico de Vendas</h2>
        <Button onClick={tratarNova}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.length > 0 ? (
              vendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">
                    {venda.customer.name}
                  </TableCell>
                  <TableCell>
                    {new Date(venda.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {venda.items
                      .map((item) => `${item.quantity}x ${item.product.name}`)
                      .join(", ")}
                  </TableCell>
                  <TableCell className="text-right">
                    {venda.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Registrar Nova Venda</DialogTitle>
            <DialogDescription>
              Selecione o cliente e adicione os produtos para a venda.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoEnviar)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Itens da Venda</FormLabel>
                  <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-end gap-4 p-4 border rounded-md"
                      >
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Produto</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {produtos.map((p) => (
                                    <SelectItem
                                      key={p.id}
                                      value={p.id}
                                      disabled={p.stock === 0}
                                    >
                                      {p.name} (Estoque: {p.stock})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qtd.</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} className="w-24" 
                                   onChange={e => field.onChange(e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            Remover
                          </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() =>
                      append({ productId: "", quantity: 1 })
                    }
                  >
                    Adicionar Item
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                    <ShoppingCart className="mr-2 h-4 w-4"/>
                    Finalizar Venda
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
