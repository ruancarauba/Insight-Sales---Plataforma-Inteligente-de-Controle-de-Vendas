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
