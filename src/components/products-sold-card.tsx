"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTopProductsSold } from "@/services/sales-service"
import type { ProductsSold } from "@/types"
import { Skeleton } from "./ui/skeleton"
import { Package } from "lucide-react"

export function ProductsSoldCard() {
  const [products, setProducts] = React.useState<ProductsSold[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      const data = await getTopProductsSold()
      setProducts(data)
      setLoading(false)
    }
    loadData()
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
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.productName} className="flex items-center">
                <Package className="h-6 w-6 text-muted-foreground mr-4" />
                <div className="flex-1">
                  <p className="font-medium">{product.productName}</p>
                </div>
                <div className="font-semibold">{product.quantity} vendidos</div>
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
