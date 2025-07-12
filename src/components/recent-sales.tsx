"use client"

import * as React from "react"
import { getSalesWithDetails } from "@/services/sales-service"
import type { SaleWithDetails } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function RecentSales() {
  const [sales, setSales] = React.useState<SaleWithDetails[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      const data = await getSalesWithDetails()
      // Pegar apenas as 5 vendas mais recentes
      setSales(data.slice(0, 5))
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
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
      {sales.length > 0 ? (
        sales.map((sale) => (
          <div key={sale.id} className="flex items-center">
            <Avatar className="h-9 w-9">
               <AvatarFallback>{sale.customer.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {sale.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(sale.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="ml-auto font-medium">
                {sale.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})}
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
