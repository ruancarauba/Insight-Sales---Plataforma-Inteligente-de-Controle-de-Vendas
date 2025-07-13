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
import { gerarRelatorioVendas, type SaidaRelatorioVendas } from "@/ai/flows/sales-report-flow";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function RelatorioVendas() {
  const [mesSelecionado, setMesSelecionado] = React.useState<string | undefined>(undefined);
  const [relatorio, setRelatorio] = React.useState<SaidaRelatorioVendas | null>(null);
  const [carregando, setCarregando] = React.useState(false);
  const { toast } = useToast();

  const tratarGerarRelatorio = async () => {
    if (!mesSelecionado) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um mês para gerar o relatório.",
      });
      return;
    }
    
    setCarregando(true);
    setRelatorio(null);
    try {
      const resultado = await gerarRelatorioVendas({ mes: mesSelecionado });
      setRelatorio(resultado);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de IA",
        description: "Não foi possível gerar o relatório. Tente novamente.",
      });
      console.error(error);
    } finally {
      setCarregando(false);
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
          <Select onValueChange={setMesSelecionado} value={mesSelecionado}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {nomesMeses.map((mes) => (
                <SelectItem key={mes} value={mes}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={tratarGerarRelatorio} disabled={carregando || !mesSelecionado}>
            {carregando ? "Gerando..." : "Gerar Relatório"}
          </Button>
        </CardContent>
      </Card>

      {carregando && (
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

      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Análise de Vendas - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm max-w-none dark:prose-invert">
            <div>
              <h3 className="flex items-center gap-2 font-semibold"><Lightbulb className="text-primary"/>Resumo Executivo</h3>
              <p>{relatorio.resumoExecutivo}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 font-semibold"><TrendingUp className="text-green-500" />Pontos Fortes</h3>
              <ul className="list-disc pl-5 space-y-2">
                {relatorio.pontosFortes.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold"><AlertTriangle className="text-yellow-500" />Pontos de Melhoria</h3>
              <ul className="list-disc pl-5 space-y-2">
                {relatorio.areasParaMelhoria.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold"><CheckCircle className="text-blue-500" />Recomendações</h3>
               <ul className="list-disc pl-5 space-y-2">
                {relatorio.recomendacoes.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
