"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { VendasPorMes } from "@/types"
import { obterVendasPorMes } from "@/services/sales-service"
import { Skeleton } from "./ui/skeleton"

const configGrafico = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
}

export function GraficoVendasPorMes() {
    const [dadosGrafico, setDadosGrafico] = React.useState<VendasPorMes[]>([]);
    const [carregando, setCarregando] = React.useState(true);

    React.useEffect(() => {
        async function carregarDados() {
            const dados = await obterVendasPorMes();
            setDadosGrafico(dados);
            setCarregando(false);
        }
        carregarDados();
    }, []);

    if(carregando) {
        return <Skeleton className="h-80 w-full" />
    }

  return (
    <ChartContainer config={configGrafico} className="min-h-[200px] w-full h-80">
      <BarChart 
        data={dadosGrafico}
        margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="mes"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(valor) => `R$${valor/1000}k`}
        />
        <Tooltip 
            cursor={false}
            content={<ChartTooltipContent
                formatter={(valor) =>
                  valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
                indicator="dot"
             />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
