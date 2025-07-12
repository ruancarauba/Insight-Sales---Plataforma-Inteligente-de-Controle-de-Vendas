"use client";

import AppLayout from "@/components/app-layout";
import { ProductsSoldCard } from "@/components/products-sold-card";
import { SalesByMonthChart } from "@/components/sales-by-month-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveCustomersCard } from "@/components/active-customers-card";

export default function PerformancePage() {
  return (
    <AppLayout pageTitle="Análise de Desempenho">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                    <CardTitle>Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <SalesByMonthChart />
                </CardContent>
            </Card>
            <div className="col-span-full lg:col-span-3 space-y-4">
              <ProductsSoldCard />
              <ActiveCustomersCard />
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
