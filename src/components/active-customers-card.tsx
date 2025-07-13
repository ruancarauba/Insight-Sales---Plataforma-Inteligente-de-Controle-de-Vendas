
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { obterClientesMaisAtivos } from "@/services/sales-service"
import type { ClienteAtivo } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Users } from "lucide-react"

export function CardClientesAtivos() {
  const [clientes, setClientes] = React.useState<ClienteAtivo[]>([])
  const [carregando, setCarregando] = React.useState(true)

  React.useEffect(() => {
    async function carregarDados() {
      const dados = await obterClientesMaisAtivos()
      setClientes(dados)
      setCarregando(false)
    }
    carregarDados()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Mais Ativos</CardTitle>
        <CardDescription>
          Clientes com mais compras no período.
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
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <div key={cliente.nomeCliente} className="flex items-center">
                <Users className="h-6 w-6 text-muted-foreground mr-4" />
                <div className="flex-1">
                  <p className="font-medium">{cliente.nomeCliente}</p>
                </div>
                <div className="font-semibold">{cliente.quantidadeCompras} compras</div>
              </div>
            ))
           ) : (
            <div className="text-center text-muted-foreground py-8">
                <p>Nenhum cliente ativo ainda.</p>
            </div>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
