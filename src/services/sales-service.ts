
"use server";

import type {
  DashboardStats,
  Product,
  ProductFormValues,
  Customer,
  CustomerFormValues,
  Sale,
  SaleItem,
  SaleFormValues,
  SaleWithDetails,
  SalesByMonth,
  ProductsSold,
  ActiveCustomer,
} from "@/types";

// Simulação de banco de dados em memória
let products: Product[] = [
  { id: 'prod-1', name: 'Laptop Pro X2', price: 7500.00, stock: 50 },
  { id: 'prod-2', name: 'Monitor Gamer 4K', price: 2800.00, stock: 30 },
  { id: 'prod-3', name: 'Teclado Mecânico RGB', price: 450.50, stock: 100 },
  { id: 'prod-4', name: 'Mouse Sem Fio Ergonômico', price: 199.90, stock: 150 },
  { id: 'prod-5', name: 'Webcam Full HD', price: 350.00, stock: 80 },
];

let customers: Customer[] = [
  { id: 'cust-1', name: 'Tech Solutions Ltda', email: 'contato@techsolutions.com' },
  { id: 'cust-2', name: 'Inova Corp', email: 'compras@inovacorp.com' },
  { id: 'cust-3', name: 'Mercado Digital ABC', email: 'financeiro@mercadoabc.com' },
];

let sales: Sale[] = [
    { id: 'sale-1', customerId: 'cust-1', date: new Date('2024-05-10T10:00:00Z'), total: 10300.00 },
    { id: 'sale-2', customerId: 'cust-2', date: new Date('2024-05-15T14:30:00Z'), total: 649.50 },
    { id: 'sale-3', customerId: 'cust-1', date: new Date('2024-06-02T11:20:00Z'), total: 2800.00 },
    { id: 'sale-4', customerId: 'cust-3', date: new Date('2024-07-20T09:05:00Z'), total: 199.90 },
];

let saleItems: SaleItem[] = [
    { saleId: 'sale-1', productId: 'prod-1', quantity: 1, price: 7500.00 },
    { saleId: 'sale-1', productId: 'prod-2', quantity: 1, price: 2800.00 },
    { saleId: 'sale-2', productId: 'prod-3', quantity: 1, price: 450.50 },
    { saleId: 'sale-2', productId: 'prod-4', quantity: 1, price: 199.90 },
    { saleId: 'sale-3', productId: 'prod-2', quantity: 1, price: 2800.00 },
    { saleId: 'sale-4', productId: 'prod-4', quantity: 1, price: 199.90 },
];

// Função auxiliar para gerar IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export async function getDashboardStats(): Promise<DashboardStats> {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const activeProducts = products.length;
  const uniqueCustomers = new Set(sales.map(s => s.customerId)).size;

  return {
    totalRevenue,
    totalSales,
    activeProducts,
    uniqueCustomers,
  };
}

// --- Produtos CRUD ---
export async function getProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => a.name.localeCompare(b.name));
}

export async function createProduct(productData: ProductFormValues): Promise<Product> {
  const newProduct: Product = {
    id: generateId('prod'),
    ...productData,
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(productData: Product): Promise<Product> {
  const index = products.findIndex((p) => p.id === productData.id);
  if (index === -1) throw new Error("Produto não encontrado");
  products[index] = { ...products[index], ...productData };
  return products[index];
}

export async function deleteProduct(productId: string): Promise<void> {
    const isProductInSale = saleItems.some(item => item.productId === productId);
    if (isProductInSale) {
        throw new Error("Não é possível excluir um produto que já está associado a uma venda.");
    }
    products = products.filter((p) => p.id !== productId);
}

// --- Clientes CRUD ---
export async function getCustomers(): Promise<Customer[]> {
  return [...customers].sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCustomer(customerData: CustomerFormValues): Promise<Customer> {
  const newCustomer: Customer = {
    id: generateId('cust'),
    ...customerData,
  };
  customers.push(newCustomer);
  return newCustomer;
}

export async function updateCustomer(customerData: Customer): Promise<Customer> {
  const index = customers.findIndex((c) => c.id === customerData.id);
  if (index === -1) throw new Error("Cliente não encontrado");
  customers[index] = { ...customers[index], ...customerData };
  return customers[index];
}

export async function deleteCustomer(customerId: string): Promise<void> {
    const isCustomerInSale = sales.some(sale => sale.customerId === customerId);
    if(isCustomerInSale) {
        throw new Error("Não é possível excluir um cliente que já possui vendas.");
    }
    customers = customers.filter((c) => c.id !== customerId);
}

// --- Vendas ---
export async function getSalesWithDetails(): Promise<SaleWithDetails[]> {
  const detailedSales = sales.map(sale => {
    const itemsForSale = saleItems
      .filter(item => item.saleId === sale.id)
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: {
            id: product?.id || 'unknown',
            name: product?.name || 'Produto Desconhecido'
          }
        };
      });

    const customer = customers.find(c => c.id === sale.customerId);
    return {
      ...sale,
      customer: {
        id: customer?.id || 'unknown',
        name: customer?.name || 'Cliente Desconhecido'
      },
      items: itemsForSale
    };
  });

  return detailedSales.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function createSale(saleData: SaleFormValues): Promise<Sale> {
    const customer = customers.find(c => c.id === saleData.customerId);
    if (!customer) {
        throw new Error("Cliente não encontrado.");
    }

    let total = 0;
    const newSaleItems: SaleItem[] = [];
    const saleId = generateId('sale');

    for (const item of saleData.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
            throw new Error(`Produto com ID ${item.productId} não encontrado.`);
        }
        if (product.stock < item.quantity) {
            throw new Error(`Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.stock}`);
        }
        total += product.price * item.quantity;
        newSaleItems.push({
            saleId,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        });
    }

    const newSale: Sale = {
        id: saleId,
        customerId: saleData.customerId,
        date: new Date(),
        total,
    };
    
    // Atualizar estoque
    for (const item of saleData.items) {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex > -1) {
            products[productIndex].stock -= item.quantity;
        }
    }

    sales.push(newSale);
    saleItems.push(...newSaleItems);
    
    return newSale;
}


// --- Funções de Análise ---

export async function getSalesByMonth(): Promise<SalesByMonth[]> {
    const salesByMonth: { [key: number]: number } = {};

    sales.forEach(sale => {
        const month = new Date(sale.date).getMonth();
        if (!salesByMonth[month]) {
            salesByMonth[month] = 0;
        }
        salesByMonth[month] += sale.total;
    });

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    return monthNames.map((name, index) => ({
        month: name,
        total: salesByMonth[index] || 0,
    })).filter(d => d.total > 0);
}


export async function getTopProductsSold(): Promise<ProductsSold[]> {
    const productCount: { [key: string]: number } = {};

    saleItems.forEach(item => {
        if (!productCount[item.productId]) {
            productCount[item.productId] = 0;
        }
        productCount[item.productId] += item.quantity;
    });

    return Object.entries(productCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([productId, quantity]) => {
            const product = products.find(p => p.id === productId);
            return {
                productName: product?.name || 'Desconhecido',
                quantity,
            };
        });
}

export async function getTopActiveCustomers(): Promise<ActiveCustomer[]> {
    const customerCount: { [key: string]: number } = {};

    sales.forEach(sale => {
        if (!customerCount[sale.customerId]) {
            customerCount[sale.customerId] = 0;
        }
        customerCount[sale.customerId]++;
    });

    return Object.entries(customerCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([customerId, count]) => {
            const customer = customers.find(c => c.id === customerId);
            return {
                customerName: customer?.name || 'Desconhecido',
                purchaseCount: count,
            };
        });
}
