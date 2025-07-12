import type { Sale, Product, Customer, DashboardStats, ProductFormValues } from "@/types";

// Simulação de um banco de dados em memória
let products: Product[] = [
  { id: 'prod-001', name: 'Laptop Pro X1', price: 6500.00, stock: 15 },
  { id: 'prod-002', name: 'Mouse Sem Fio Ergo', price: 180.00, stock: 45 },
  { id: 'prod-003', name: 'Teclado Mecânico RGB', price: 450.00, stock: 30 },
  { id: 'prod-004', name: 'Monitor Ultrawide 34"', price: 2800.00, stock: 10 },
  { id: 'prod-005', name: 'Webcam 4K', price: 950.00, stock: 22 },
];

let customers: Customer[] = [
    { id: 'cust-01', name: 'Empresa Alfa', email: 'contato@alfa.com' },
    { id: 'cust-02', name: 'Serviços Beta', email: 'financeiro@beta.co' },
    { id: 'cust-03', name: 'Gama Soluções', email: 'compras@gama.dev' },
];

let sales: Sale[] = [
  { id: 'sale-01', customerId: 'cust-01', date: new Date('2024-05-01T10:00:00Z'), items: [ { productId: 'prod-001', quantity: 2, price: 6500.00 }, { productId: 'prod-002', quantity: 2, price: 180.00 } ], total: 13360.00 },
  { id: 'sale-02', customerId: 'cust-02', date: new Date('2024-05-02T14:30:00Z'), items: [ { productId: 'prod-003', quantity: 5, price: 450.00 } ], total: 2250.00 },
  { id: 'sale-03', customerId: 'cust-01', date: new Date('2024-05-03T11:20:00Z'), items: [ { productId: 'prod-004', quantity: 1, price: 2800.00 }, { productId: 'prod-005', quantity: 1, price: 950.00 } ], total: 3750.00 },
  { id: 'sale-04', customerId: 'cust-03', date: new Date('2024-05-04T09:00:00Z'), items: [ { productId: 'prod-002', quantity: 10, price: 180.00 } ], total: 1800.00 },
  { id: 'sale-05', customerId: 'cust-02', date: new Date('2024-05-05T16:45:00Z'), items: [ { productId: 'prod-001', quantity: 1, price: 6500.00 }, { productId: 'prod-003', quantity: 1, price: 450.00 } ], total: 6950.00 },
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// --- Funções do Serviço ---

export async function getDashboardStats(): Promise<DashboardStats> {
  await simulateDelay();
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const activeProducts = products.length;
  const uniqueCustomers = new Set(sales.map(s => s.customerId)).size;
  return { totalRevenue, totalSales, activeProducts, uniqueCustomers };
}

// --- Produtos CRUD ---

export async function getProducts(): Promise<Product[]> {
    await simulateDelay();
    return [...products];
}

export async function createProduct(productData: ProductFormValues): Promise<Product> {
    await simulateDelay();
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productData,
    };
    products.push(newProduct);
    return newProduct;
}

export async function updateProduct(productData: Product): Promise<Product> {
    await simulateDelay();
    const index = products.findIndex(p => p.id === productData.id);
    if (index === -1) throw new Error("Produto não encontrado");
    products[index] = { ...products[index], ...productData };
    return products[index];
}

export async function deleteProduct(productId: string): Promise<void> {
    await simulateDelay();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) throw new Error("Produto não encontrado");
    products.splice(index, 1);
}

// --- Vendas (a ser implementado) ---

export async function getSales(): Promise<Sale[]> {
    await simulateDelay();
    return [...sales];
}

// --- Clientes (a ser implementado) ---

export async function getCustomers(): Promise<Customer[]> {
    await simulateDelay();
    return [...customers];
}
