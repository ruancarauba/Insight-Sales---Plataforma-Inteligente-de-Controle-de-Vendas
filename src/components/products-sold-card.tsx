"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { obterProdutosMaisVendidos } from "@/services/sales-service"
import type { ProdutoVendido } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Package } from "lucide-react"

export function CardProdutosVendidos() {
  const [produtos, setProdutos] = React.useState<ProdutoVendido[]>([])
  const [carregando, setCarregando] = React.useState(true)

  React.useEffect(() => {
    async function carregarDados() {
      const dados = await obterProdutosMaisVendidos()
      setProdutos(dados)
      setCarregando(false)
    }
    carregarDados()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Mais Vendidos</CardTitle>
        <CardDescription>
          Top 5 produtos mais vendidos no período.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {carregando ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <div className="space-y-4">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div key={produto.nomeProduto} className="flex items-center">
                <Package className="h-6 w-6 text-muted-foreground mr-4" />
                <div className="flex-1">
                  <p className="font-medium">{produto.nomeProduto}</p>
                </div>
                <div className="font-semibold">{produto.quantidade} vendidos</div>
              </div>
            ))
           ) : (
            <div className="text-center text-muted-foreground py-8">
                <p>Nenhum produto vendido ainda.</p>
            </div>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
