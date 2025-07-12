'use server';
/**
 * @fileOverview Um agente de IA que analisa dados de vendas e gera um relatório.
 *
 * - generateSalesReport - Gera um relatório de desempenho de vendas para um determinado mês.
 * - SalesReportInput - O tipo de entrada para a função generateSalesReport.
 * - SalesReportOutput - O tipo de retorno para a função generateSalesReport.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getSalesByMonth, getTopProductsSold, getTopActiveCustomers } from '@/services/sales-service';

const SalesReportInputSchema = z.object({
  month: z.string().describe('O mês para o qual o relatório deve ser gerado (ex: "Jan", "Fev").'),
});
export type SalesReportInput = z.infer<typeof SalesReportInputSchema>;

const SalesReportOutputSchema = z.object({
  executiveSummary: z.string().describe('Um resumo executivo conciso do desempenho de vendas no mês.'),
  strengths: z.array(z.string()).describe('Uma lista de pontos fortes observados no período.'),
  areasForImprovement: z.array(z.string()).describe('Uma lista de áreas que precisam de melhoria.'),
  recommendations: z.array(z.string()).describe('Uma lista de recomendações acionáveis para impulsionar as vendas.'),
});
export type SalesReportOutput = z.infer<typeof SalesReportOutputSchema>;

export async function generateSalesReport(input: SalesReportInput): Promise<SalesReportOutput> {
  return salesReportFlow(input);
}

const salesReportFlow = ai.defineFlow(
  {
    name: 'salesReportFlow',
    inputSchema: SalesReportInputSchema,
    outputSchema: SalesReportOutputSchema,
  },
  async (input) => {
    // Coleta todos os dados de vendas para fornecer contexto à IA
    const [salesByMonth, topProducts, topCustomers] = await Promise.all([
        getSalesByMonth(),
        getTopProductsSold(),
        getTopActiveCustomers(),
    ]);

    const salesForMonth = salesByMonth.find(s => s.month === input.month);

    const prompt = ai.definePrompt({
        name: 'salesReportPrompt',
        input: { schema: SalesReportInputSchema },
        output: { schema: SalesReportOutputSchema },
        prompt: `Você é um analista de vendas sênior encarregado de criar um relatório de desempenho para a diretoria.
    
        Analise os seguintes dados de vendas para o mês de ${input.month} e gere um relatório detalhado.

        **Dados Consolidados:**
        - **Vendas Totais do Mês de ${input.month}:** ${salesForMonth ? salesForMonth.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL"}) : 'Nenhuma venda registrada.'}
        - **Vendas Totais (Todos os Meses):** ${JSON.stringify(salesByMonth)}
        - **Top 5 Produtos Mais Vendidos (Geral):** ${JSON.stringify(topProducts)}
        - **Top 5 Clientes Mais Ativos (Geral):** ${JSON.stringify(topCustomers)}

        **Sua Tarefa:**
        Com base nos dados fornecidos, crie um relatório que inclua:
        1.  **Resumo Executivo:** Um parágrafo conciso resumindo o desempenho de vendas do mês.
        2.  **Pontos Fortes:** Liste de 2 a 3 pontos positivos notáveis. Seja específico (ex: "O produto X foi um sucesso de vendas, impulsionando a receita" ou "A atividade do cliente Y foi excepcional").
        3.  **Pontos de Melhoria:** Liste de 2 a 3 áreas que precisam de atenção. Seja construtivo (ex: "As vendas do produto Z estão abaixo da média, sugerindo uma revisão de estratégia" ou "A concentração de vendas em poucos clientes representa um risco").
        4.  **Recomendações:** Forneça de 2 a 3 recomendações claras e acionáveis para melhorar o desempenho no próximo mês (ex: "Criar uma campanha de marketing para o produto Z" ou "Lançar um programa de fidelidade para aumentar a recorrência de compras").

        Seja claro, objetivo e use uma linguagem profissional. O relatório deve ser útil para a tomada de decisões estratégicas.`,
    });
    
    const { output } = await prompt(input);
    return output!;
  }
);
