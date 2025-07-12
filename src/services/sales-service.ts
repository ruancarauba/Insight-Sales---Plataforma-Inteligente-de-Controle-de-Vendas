import type {
  Sale,
  Product,
  Customer,
  DashboardStats,
  ProductFormValues,
  CustomerFormValues,
  SaleFormValues,
  SaleWithDetails,
} from "@/types";

// Simulação de um banco de dados em memória
let products: Product[] = [
  { id: "prod-001", name: "Laptop Pro X1", price: 6500.0, stock: 15 },
  { id: "prod-002", name: "Mouse Sem Fio Ergo", price: 180.0, stock: 45 },
  { id: "prod-003", name: "Teclado Mecânico RGB", price: 450.0, stock: 30 },
  { id: "prod-004", name: 'Monitor Ultrawide 34"', price: 2800.0, stock: 10 },
  { id: "prod-005", name: "Webcam 4K", price: 950.0, stock: 22 },
];

let customers: Customer[] = [
  { id: "cust-01", name: "Empresa Alfa", email: "contato@alfa.com" },
  { id: "cust-02", name: "Serviços Beta", email: "financeiro@beta.co" },
  { id: "cust-03", name: "Gama Soluções", email: "compras@gama.dev" },
];

let sales: Sale[] = [
  {
    id: "sale-01",
    customerId: "cust-01",
    date: new Date("2024-05-01T10:00:00Z"),
    items: [
      { productId: "prod-001", quantity: 2, price: 6500.0 },
      { productId: "prod-002", quantity: 2, price: 180.0 },
    ],
    total: 13360.0,
  },
  {
    id: "sale-02",
    customerId: "cust-02",
    date: new Date("2024-05-02T14:30:00Z"),
    items: [{ productId: "prod-003", quantity: 5, price: 450.0 }],
    total: 2250.0,
  },
  {
    id: "sale-03",
    customerId: "cust-01",
    date: new Date("2024-05-03T11:20:00Z"),
    items: [
      { productId: "prod-004", quantity: 1, price: 2800.0 },
      { productId: "prod-005", quantity: 1, price: 950.0 },
    ],
    total: 3750.0,
  },
];

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

// --- Funções do Serviço ---

export async function getDashboardStats(): Promise<DashboardStats> {
  await simulateDelay();
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const activeProducts = products.length;
  const uniqueCustomers = new Set(sales.map((s) => s.customerId)).size;
  return { totalRevenue, totalSales, activeProducts, uniqueCustomers };
}

// --- Produtos CRUD ---

export async function getProducts(): Promise<Product[]> {
  await simulateDelay();
  return [...products];
}

export async function createProduct(
  productData: ProductFormValues
): Promise<Product> {
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
  const index = products.findIndex((p) => p.id === productData.id);
  if (index === -1) throw new Error("Produto não encontrado");
  products[index] = { ...products[index], ...productData };
  return products[index];
}

export async function deleteProduct(productId: string): Promise<void> {
  await simulateDelay();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) throw new Error("Produto não encontrado");
  products.splice(index, 1);
}

// --- Clientes CRUD ---

export async function getCustomers(): Promise<Customer[]> {
  await simulateDelay();
  return [...customers];
}

export async function createCustomer(
  customerData: CustomerFormValues
): Promise<Customer> {
  await simulateDelay();
  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    ...customerData,
  };
  customers.push(newCustomer);
  return newCustomer;
}

export async function updateCustomer(customerData: Customer): Promise<Customer> {
  await simulateDelay();
  const index = customers.findIndex((c) => c.id === customerData.id);
  if (index === -1) throw new Error("Cliente não encontrado");
  customers[index] = { ...customers[index], ...customerData };
  return customers[index];
}

export async function deleteCustomer(customerId: string): Promise<void> {
  await simulateDelay();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) throw new Error("Cliente não encontrado");
  customers.splice(index, 1);
}

// --- Vendas ---

export async function getSalesWithDetails(): Promise<SaleWithDetails[]> {
  await simulateDelay();
  return sales
    .map((sale) => {
      const customer = customers.find((c) => c.id === sale.customerId);
      const saleItems = sale.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product
            ? {
                ...item,
                product: {
                  id: product.id,
                  name: product.name,
                },
              }
            : null;
        })
        .filter((i): i is NonNullable<typeof i> => i !== null);

      return customer
        ? {
            ...sale,
            customer: { id: customer.id, name: customer.name },
            items: saleItems,
          }
        : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .sort((a,b) => b.date.getTime() - a.date.getTime()); // Mais recentes primeiro
}

export async function createSale(saleData: SaleFormValues): Promise<Sale> {
  await simulateDelay();

  // 1. Validar cliente
  const customer = customers.find((c) => c.id === saleData.customerId);
  if (!customer) {
    throw new Error("Cliente não encontrado.");
  }

  let total = 0;
  
  // 2. Validar itens e calcular total
  for (const item of saleData.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Produto com ID ${item.productId} não encontrado.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.stock}`);
    }
    total += product.price * item.quantity;
  }
  
  // 3. Deduzir do estoque
  for (const item of saleData.items) {
     const productIndex = products.findIndex((p) => p.id === item.productId);
     products[productIndex].stock -= item.quantity;
  }

  // 4. Criar a venda
  const newSale: Sale = {
    id: `sale-${Date.now()}`,
    customerId: saleData.customerId,
    date: new Date(),
    items: saleData.items.map(item => ({
        ...item,
        price: products.find(p => p.id === item.productId)?.price || 0
    })),
    total,
  };

  sales.push(newSale);
  return newSale;
}
