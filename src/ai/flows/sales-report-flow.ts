'use server';
/**
 * @fileOverview Um agente de IA que analisa dados de vendas e gera um relatório.
 *
 * - gerarRelatorioVendas - Gera um relatório de desempenho de vendas para um determinado mês.
 * - EntradaRelatorioVendas - O tipo de entrada para a função gerarRelatorioVendas.
 * - SaidaRelatorioVendas - O tipo de retorno para a função gerarRelatorioVendas.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { obterVendasPorMes, obterProdutosMaisVendidos, obterClientesMaisAtivos } from '@/services/sales-service';

const EsquemaEntradaRelatorioVendas = z.object({
  mes: z.string().describe('O mês para o qual o relatório deve ser gerado (ex: "Jan", "Fev").'),
});
export type EntradaRelatorioVendas = z.infer<typeof EsquemaEntradaRelatorioVendas>;

const EsquemaSaidaRelatorioVendas = z.object({
  resumoExecutivo: z.string().describe('Um resumo executivo conciso do desempenho de vendas no mês.'),
  pontosFortes: z.array(z.string()).describe('Uma lista de pontos fortes observados no período.'),
  areasParaMelhoria: z.array(z.string()).describe('Uma lista de áreas que precisam de melhoria.'),
  recomendacoes: z.array(z.string()).describe('Uma lista de recomendações acionáveis para impulsionar as vendas.'),
});
export type SaidaRelatorioVendas = z.infer<typeof EsquemaSaidaRelatorioVendas>;

export async function gerarRelatorioVendas(entrada: EntradaRelatorioVendas): Promise<SaidaRelatorioVendas> {
  return fluxoRelatorioVendas(entrada);
}

const fluxoRelatorioVendas = ai.defineFlow(
  {
    name: 'fluxoRelatorioVendas',
    inputSchema: EsquemaEntradaRelatorioVendas,
    outputSchema: EsquemaSaidaRelatorioVendas,
  },
  async (entrada) => {
    // Coleta todos os dados de vendas para fornecer contexto à IA
    const [vendasPorMes, produtosMaisVendidos, clientesMaisAtivos] = await Promise.all([
        obterVendasPorMes(),
        obterProdutosMaisVendidos(),
        obterClientesMaisAtivos(),
    ]);

    const vendasDoMes = vendasPorMes.find(v => v.mes === entrada.mes);

    const instrucao = ai.definePrompt({
        name: 'instrucaoRelatorioVendas',
        input: { schema: EsquemaEntradaRelatorioVendas },
        output: { schema: EsquemaSaidaRelatorioVendas },
        prompt: `Você é um analista de vendas sênior encarregado de criar um relatório de desempenho para a diretoria.
    
        Analise os seguintes dados de vendas para o mês de ${entrada.mes} e gere um relatório detalhado.

        **Dados Consolidados:**
        - **Vendas Totais do Mês de ${entrada.mes}:** ${vendasDoMes ? vendasDoMes.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL"}) : 'Nenhuma venda registrada.'}
        - **Vendas Totais (Todos os Meses):** ${JSON.stringify(vendasPorMes)}
        - **Top 5 Produtos Mais Vendidos (Geral):** ${JSON.stringify(produtosMaisVendidos)}
        - **Top 5 Clientes Mais Ativos (Geral):** ${JSON.stringify(clientesMaisAtivos)}

        **Sua Tarefa:**
        Com base nos dados fornecidos, crie um relatório que inclua:
        1.  **Resumo Executivo:** Um parágrafo conciso resumindo o desempenho de vendas do mês.
        2.  **Pontos Fortes:** Liste de 2 a 3 pontos positivos notáveis. Seja específico (ex: "O produto X foi um sucesso de vendas, impulsionando a receita" ou "A atividade do cliente Y foi excepcional").
        3.  **Pontos de Melhoria:** Liste de 2 a 3 áreas que precisam de atenção. Seja construtivo (ex: "As vendas do produto Z estão abaixo da média, sugerindo uma revisão de estratégia" ou "A concentração de vendas em poucos clientes representa um risco").
        4.  **Recomendações:** Forneça de 2 a 3 recomendações claras e acionáveis para melhorar o desempenho no próximo mês (ex: "Criar uma campanha de marketing para o produto Z" ou "Lançar um programa de fidelidade para aumentar a recorrência de compras").

        Seja claro, objetivo e use uma linguagem profissional. O relatório deve ser útil para a tomada de decisões estratégicas.`,
    });
    
    const { output: saida } = await instrucao(entrada);
    return saida!;
  }
);
