"use client";

import AppLayout from "@/components/app-layout";
import { ProductsSoldCard } from "@/components/products-sold-card";
import { SalesByMonthChart } from "@/components/sales-by-month-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformancePage() {
  return (
    <AppLayout pageTitle="Análise de Desempenho">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <SalesByMonthChart />
                </CardContent>
            </Card>
            <ProductsSoldCard />
        </div>
      </div>
    </AppLayout>
  );
}
