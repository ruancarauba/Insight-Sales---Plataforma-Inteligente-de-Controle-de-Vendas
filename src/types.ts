import { z } from "zod";

// --- Modelos de Dados ---

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
  id:string;
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

// --- Tipos para Análise ---

export interface SalesByMonth {
    month: string;
    total: number;
}

export interface ProductsSold {
    productName: string;
    quantity: number;
}


// --- Tipos para Visualização (com dados aninhados) ---
export interface SaleWithDetails extends Omit<Sale, 'items' | 'customerId'> {
    customer: { id: string; name: string };
    items: (SaleItem & { product: {id: string, name: string} })[];
}


// --- Zod Schemas para Validação de Formulários ---

export const ProductSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  price: z.coerce.number().positive({ message: "O preço deve ser um número positivo." }),
  stock: z.coerce.number().int().min(0, { message: "O estoque não pode ser negativo." }),
});

export const CustomerSchema = z.object({
  name: z.string().min(3, { message: "O nome do cliente é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});

export const SaleItemSchema = z.object({
    productId: z.string().min(1, { message: "Selecione um produto." }),
    quantity: z.coerce.number().int().min(1, { message: "A quantidade deve ser no mínimo 1." }),
});

export const SaleSchema = z.object({
    customerId: z.string().min(1, { message: "Selecione um cliente." }),
    items: z.array(SaleItemSchema).min(1, { message: "Adicione pelo menos um item à venda." }),
});


// --- Tipos inferidos dos Schemas ---

export type ProductFormValues = z.infer<typeof ProductSchema>;
export type CustomerFormValues = z.infer<typeof CustomerSchema>;
export type SaleFormValues = z.infer<typeof SaleSchema>;
