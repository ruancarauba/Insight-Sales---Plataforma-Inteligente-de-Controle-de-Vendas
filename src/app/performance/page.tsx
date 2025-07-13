
"use client";

import LayoutAplicacao from "@/components/app-layout";
import { CardProdutosVendidos } from "@/components/products-sold-card";
import { GraficoVendasPorMes } from "@/components/sales-by-month-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardClientesAtivos } from "@/components/active-customers-card";

export default function PaginaDesempenho() {
  return (
    <LayoutAplicacao pageTitle="Análise de Desempenho">
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                    <CardTitle>Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <GraficoVendasPorMes />
                </CardContent>
            </Card>
            <div className="col-span-full lg:col-span-3 space-y-4">
              <CardProdutosVendidos />
              <CardClientesAtivos />
            </div>
        </div>
      </div>
    </LayoutAplicacao>
  );
}
