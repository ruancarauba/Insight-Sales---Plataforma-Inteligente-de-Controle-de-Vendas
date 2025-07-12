import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  DashboardStats,
  ProductFormValues,
  CustomerFormValues,
  SaleFormValues,
  SaleWithDetails,
  SalesByMonth,
  ProductsSold,
  ActiveCustomer,
  Product,
  Customer,
} from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const salesData = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    _count: {
      id: true,
    },
  });

  const activeProducts = await prisma.product.count();
  const uniqueCustomers = (await prisma.sale.findMany({
    distinct: ['customerId']
  })).length;

  return {
    totalRevenue: salesData._sum.total ?? 0,
    totalSales: salesData._count.id,
    activeProducts: activeProducts,
    uniqueCustomers: uniqueCustomers,
  };
}

// --- Produtos CRUD ---
export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createProduct(productData: ProductFormValues): Promise<Product> {
  return prisma.product.create({
    data: productData,
  });
}

export async function updateProduct(productData: Product): Promise<Product> {
  return prisma.product.update({
    where: { id: productData.id },
    data: productData,
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await prisma.product.delete({
    where: { id: productId },
  });
}

// --- Clientes CRUD ---
export async function getCustomers(): Promise<Customer[]> {
  return prisma.customer.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function createCustomer(customerData: CustomerFormValues): Promise<Customer> {
  return prisma.customer.create({
    data: customerData,
  });
}

export async function updateCustomer(customerData: Customer): Promise<Customer> {
  return prisma.customer.update({
    where: { id: customerData.id },
    data: customerData,
  });
}

export async function deleteCustomer(customerId: string): Promise<void> {
   await prisma.customer.delete({
    where: { id: customerId },
  });
}

// --- Vendas ---
export async function getSalesWithDetails(): Promise<SaleWithDetails[]> {
  const sales = await prisma.sale.findMany({
    orderBy: {
      date: 'desc'
    },
    include: {
      customer: {
        select: { id: true, name: true }
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  // Mapeia para garantir a estrutura de tipo esperada, especialmente para `items`
  return sales.map(sale => ({
    ...sale,
    customer: sale.customer,
    items: sale.items.map(item => ({
      ...item,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name
      }
    }))
  }));
}


export async function createSale(saleData: SaleFormValues): Promise<any> {
  return prisma.$transaction(async (tx) => {
    // 1. Validar cliente
    const customer = await tx.customer.findUnique({
      where: { id: saleData.customerId },
    });
    if (!customer) {
      throw new Error("Cliente não encontrado.");
    }

    let total = 0;
    const saleItemsData = [];

    // 2. Validar itens, verificar estoque e calcular total
    for (const item of saleData.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.stock}`);
      }

      total += product.price * item.quantity;
      saleItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Usar o preço do DB como fonte da verdade
      });
    }

    // 3. Criar a venda
    const newSale = await tx.sale.create({
      data: {
        customerId: saleData.customerId,
        total,
        items: {
          create: saleItemsData,
        },
      },
    });
    
    // 4. Deduzir do estoque
    for (const item of saleData.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newSale;
  });
}

// --- Funções de Análise ---

export async function getSalesByMonth(): Promise<SalesByMonth[]> {
    const sales = await prisma.sale.findMany({
        select: {
            date: true,
            total: true,
        },
    });

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
    const result = await prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    });

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: result.map(r => r.productId)
            }
        }
    });

    const productMap = new Map(products.map(p => [p.id, p.name]));

    return result.map(item => ({
        productName: productMap.get(item.productId) || 'Desconhecido',
        quantity: item._sum.quantity || 0
    }));
}


export async function getTopActiveCustomers(): Promise<ActiveCustomer[]> {
    const result = await prisma.sale.groupBy({
        by: ['customerId'],
        _count: {
            _all: true
        },
        orderBy: {
            _count: {
                id: 'desc'
            }
        },
        take: 5
    });

    const customers = await prisma.customer.findMany({
        where: {
            id: {
                in: result.map(r => r.customerId)
            }
        }
    });
    
    const customerMap = new Map(customers.map(c => [c.id, c.name]));

    return result.map(item => ({
        customerName: customerMap.get(item.customerId) || 'Desconhecido',
        purchaseCount: item._count._all
    }));
}
