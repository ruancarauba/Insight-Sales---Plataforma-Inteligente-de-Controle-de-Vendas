
"use client"

import * as React from "react"
import { obterVendasComDetalhes } from "@/services/sales-service"
import type { VendaComDetalhes } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function VendasRecentes() {
  const [vendas, setVendas] = React.useState<VendaComDetalhes[]>([])
  const [carregando, setCarregando] = React.useState(true)

  React.useEffect(() => {
    async function carregarDados() {
      const dados = await obterVendasComDetalhes()
      // Pegar apenas as 5 vendas mais recentes
      setVendas(dados.slice(0, 5))
      setCarregando(false)
    }
    carregarDados()
  }, [])

  if (carregando) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {vendas.length > 0 ? (
        vendas.map((venda) => (
          <div key={venda.id} className="flex items-center">
            <Avatar className="h-9 w-9">
               <AvatarFallback>{venda.customer.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {venda.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(venda.date).toLocaleDateString("pt-BR", { year: 'numeric', month: 'numeric', day: 'numeric'})}
              </p>
            </div>
            <div className="ml-auto font-medium">
                {venda.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})}
            </div>
          </div>
        ))
      ) : (
         <div className="text-center text-muted-foreground py-8">
             <p>Nenhuma venda recente.</p>
         </div>
      )}
    </div>
  )
}
