"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTopActiveCustomers } from "@/services/sales-service"
import type { ActiveCustomer } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Users } from "lucide-react"

export function ActiveCustomersCard() {
  const [customers, setCustomers] = React.useState<ActiveCustomer[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      const data = await getTopActiveCustomers()
      setCustomers(data)
      setLoading(false)
    }
    loadData()
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
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <div className="space-y-4">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <div key={customer.customerName} className="flex items-center">
                <Users className="h-6 w-6 text-muted-foreground mr-4" />
                <div className="flex-1">
                  <p className="font-medium">{customer.customerName}</p>
                </div>
                <div className="font-semibold">{customer.purchaseCount} compras</div>
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
