"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { SalesByMonth } from "@/types"
import { getSalesByMonth } from "@/services/sales-service"
import { Skeleton } from "./ui/skeleton"

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
}

export function SalesByMonthChart() {
    const [chartData, setChartData] = React.useState<SalesByMonth[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadData() {
            const data = await getSalesByMonth();
            setChartData(data);
            setLoading(false);
        }
        loadData();
    }, []);

    if(loading) {
        return <Skeleton className="h-80 w-full" />
    }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-80">
      <BarChart 
        data={chartData}
        margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value/1000}k`}
        />
        <Tooltip 
            cursor={false}
            content={<ChartTooltipContent
                formatter={(value) =>
                  value.toLocaleString("pt-BR", {
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
