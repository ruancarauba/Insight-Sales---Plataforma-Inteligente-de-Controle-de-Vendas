import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformancePage() {
  return (
    <AppLayout pageTitle="Análise de Desempenho">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Vendas por Mês</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-80 w-full rounded-md bg-muted/50 flex items-center justify-center">
                        <p className="text-muted-foreground">Gráfico de vendas em breve</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 w-full rounded-md bg-muted/50 flex items-center justify-center">
                        <p className="text-muted-foreground">Lista de produtos em breve</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
