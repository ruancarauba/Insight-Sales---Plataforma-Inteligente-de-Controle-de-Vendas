
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { obterEstatisticasDashboard } from "@/services/sales-service";
import type { EstatisticasDashboard } from "@/types";
import { VendasRecentes } from "./recent-sales";
import { CardProdutosVendidos } from "./products-sold-card";
import { Skeleton } from "./ui/skeleton";

export function Dashboard() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasDashboard | null>(null);

  useEffect(() => {
    async function carregarEstatisticas() {
      const dados = await obterEstatisticasDashboard();
      setEstatisticas(dados);
    }
    carregarEstatisticas();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {estatisticas ? (
              <div className="text-2xl font-bold">
                {estatisticas.receitaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})}
              </div>
            ) : (
               <Skeleton className="h-8 w-3/4" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {estatisticas ? (
              <div className="text-2xl font-bold">+{estatisticas.totalVendas}</div>
            ) : (
              <Skeleton className="h-8 w-1/2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {estatisticas ? (
              <div className="text-2xl font-bold">{estatisticas.produtosAtivos}</div>
            ) : (
              <Skeleton className="h-8 w-1/4" />
            )}
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Únicos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {estatisticas ? (
              <div className="text-2xl font-bold">{estatisticas.clientesUnicos}</div>
            ) : (
              <Skeleton className="h-8 w-1/4" />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <VendasRecentes />
          </CardContent>
        </Card>
        <div className="col-span-full lg:col-span-3 space-y-4">
            <CardProdutosVendidos />
        </div>
      </div>
    </div>
  );
}
