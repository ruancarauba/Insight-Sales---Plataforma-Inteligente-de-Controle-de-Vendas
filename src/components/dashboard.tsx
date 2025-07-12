"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { getDashboardStats } from "@/services/sales-service";
import type { DashboardStats } from "@/types";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats();
      setStats(data);
    }
    loadStats();
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
            {stats ? (
              <div className="text-2xl font-bold">
                R$ {stats.totalRevenue.toLocaleString("pt-BR")}
              </div>
            ) : (
              <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted"></div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="text-2xl font-bold">+{stats.totalSales}</div>
            ) : (
              <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted"></div>
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
            {stats ? (
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
            ) : (
              <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
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
            {stats ? (
              <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
            ) : (
              <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-80 w-full rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico em breve</p>
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Lista de vendas em breve</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
