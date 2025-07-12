"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateSalesReport, type SalesReportOutput } from "@/ai/flows/sales-report-flow";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function SalesReport() {
  const [selectedMonth, setSelectedMonth] = React.useState<string | undefined>(undefined);
  const [report, setReport] = React.useState<SalesReportOutput | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!selectedMonth) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um mês para gerar o relatório.",
      });
      return;
    }
    
    setLoading(true);
    setReport(null);
    try {
      const result = await generateSalesReport({ month: selectedMonth });
      setReport(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de IA",
        description: "Não foi possível gerar o relatório. Tente novamente.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Relatório de Vendas</CardTitle>
          <CardDescription>
            Selecione um mês para obter uma análise de desempenho gerada por IA, com insights e recomendações.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Select onValueChange={setSelectedMonth} value={selectedMonth}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={loading || !selectedMonth}>
            {loading ? "Gerando..." : "Gerar Relatório"}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </CardContent>
        </Card>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Análise de Vendas - {selectedMonth}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm max-w-none dark:prose-invert">
            <div>
              <h3 className="flex items-center gap-2 font-semibold"><Lightbulb className="text-primary"/>Resumo Executivo</h3>
              <p>{report.executiveSummary}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-semibold"><TrendingUp className="text-green-500" />Pontos Fortes</h3>
              <ul className="list-disc pl-5 space-y-2">
                {report.strengths.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold"><AlertTriangle className="text-yellow-500" />Pontos de Melhoria</h3>
              <ul className="list-disc pl-5 space-y-2">
                {report.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold"><CheckCircle className="text-blue-500" />Recomendações</h3>
               <ul className="list-disc pl-5 space-y-2">
                {report.recommendations.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
