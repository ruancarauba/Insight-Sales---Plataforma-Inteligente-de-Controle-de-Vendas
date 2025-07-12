import { z } from "zod";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number; // Preço no momento da venda
}

export interface Sale {
  id: string;
  customerId: string;
  date: Date;
  items: SaleItem[];
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  activeProducts: number;
  uniqueCustomers: number;
}

// Zod Schema for Product Form Validation
export const ProductSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  price: z.coerce.number().positive({ message: "O preço deve ser um número positivo." }),
  stock: z.coerce.number().int().min(0, { message: "O estoque não pode ser negativo." }),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
