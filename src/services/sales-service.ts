
"use server";

import type {
  EstatisticasDashboard,
  Produto,
  ValoresFormularioProduto,
  Cliente,
  ValoresFormularioCliente,
  Venda,
  ItemVenda,
  ValoresFormularioVenda,
  VendaComDetalhes,
  VendasPorMes,
  ProdutoVendido,
  ClienteAtivo,
} from "@/types";

// Simulação de banco de dados em memória
let produtos: Produto[] = [
  { id: 'prod-1', name: 'Laptop Pro X2', price: 7500.00, stock: 50 },
  { id: 'prod-2', name: 'Monitor Gamer 4K', price: 2800.00, stock: 30 },
  { id: 'prod-3', name: 'Teclado Mecânico RGB', price: 450.50, stock: 100 },
  { id: 'prod-4', name: 'Mouse Sem Fio Ergonômico', price: 199.90, stock: 150 },
  { id: 'prod-5', name: 'Webcam Full HD', price: 350.00, stock: 80 },
];

let clientes: Cliente[] = [
  { id: 'cust-1', name: 'Tech Solutions Ltda', email: 'contato@techsolutions.com' },
  { id: 'cust-2', name: 'Inova Corp', email: 'compras@inovacorp.com' },
  { id: 'cust-3', name: 'Mercado Digital ABC', email: 'financeiro@mercadoabc.com' },
];

let vendas: Venda[] = [
    { id: 'sale-1', customerId: 'cust-1', date: new Date('2024-05-10T10:00:00Z'), total: 10300.00 },
    { id: 'sale-2', customerId: 'cust-2', date: new Date('2024-05-15T14:30:00Z'), total: 649.50 },
    { id: 'sale-3', customerId: 'cust-1', date: new Date('2024-06-02T11:20:00Z'), total: 2800.00 },
    { id: 'sale-4', customerId: 'cust-3', date: new Date('2024-07-20T09:05:00Z'), total: 199.90 },
];

let itensVenda: ItemVenda[] = [
    { saleId: 'sale-1', productId: 'prod-1', quantity: 1, price: 7500.00 },
    { saleId: 'sale-1', productId: 'prod-2', quantity: 1, price: 2800.00 },
    { saleId: 'sale-2', productId: 'prod-3', quantity: 1, price: 450.50 },
    { saleId: 'sale-2', productId: 'prod-4', quantity: 1, price: 199.90 },
    { saleId: 'sale-3', productId: 'prod-2', quantity: 1, price: 2800.00 },
    { saleId: 'sale-4', productId: 'prod-4', quantity: 1, price: 199.90 },
];

// Função auxiliar para gerar IDs
const gerarId = (prefixo: string) => `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export async function obterEstatisticasDashboard(): Promise<EstatisticasDashboard> {
  const receitaTotal = vendas.reduce((soma, venda) => soma + venda.total, 0);
  const totalVendas = vendas.length;
  const produtosAtivos = produtos.length;
  const clientesUnicos = new Set(vendas.map(v => v.customerId)).size;

  return {
    receitaTotal,
    totalVendas,
    produtosAtivos,
    clientesUnicos,
  };
}

// --- Produtos CRUD ---
export async function obterProdutos(): Promise<Produto[]> {
  return [...produtos].sort((a, b) => a.name.localeCompare(b.name));
}

export async function criarProduto(dadosProduto: ValoresFormularioProduto): Promise<Produto> {
  const novoProduto: Produto = {
    id: gerarId('prod'),
    ...dadosProduto,
  };
  produtos.push(novoProduto);
  return novoProduto;
}

export async function atualizarProduto(dadosProduto: Produto): Promise<Produto> {
  const indice = produtos.findIndex((p) => p.id === dadosProduto.id);
  if (indice === -1) throw new Error("Produto não encontrado");
  produtos[indice] = { ...produtos[indice], ...dadosProduto };
  return produtos[indice];
}

export async function deletarProduto(produtoId: string): Promise<void> {
    const produtoEmVenda = itensVenda.some(item => item.productId === produtoId);
    if (produtoEmVenda) {
        throw new Error("Não é possível excluir um produto que já está associado a uma venda.");
    }
    produtos = produtos.filter((p) => p.id !== produtoId);
}

// --- Clientes CRUD ---
export async function obterClientes(): Promise<Cliente[]> {
  return [...clientes].sort((a, b) => a.name.localeCompare(b.name));
}

export async function criarCliente(dadosCliente: ValoresFormularioCliente): Promise<Cliente> {
  const novoCliente: Cliente = {
    id: gerarId('cust'),
    ...dadosCliente,
  };
  clientes.push(novoCliente);
  return novoCliente;
}

export async function atualizarCliente(dadosCliente: Cliente): Promise<Cliente> {
  const indice = clientes.findIndex((c) => c.id === dadosCliente.id);
  if (indice === -1) throw new Error("Cliente não encontrado");
  clientes[indice] = { ...clientes[indice], ...dadosCliente };
  return clientes[indice];
}

export async function deletarCliente(clienteId: string): Promise<void> {
    const clienteEmVenda = vendas.some(venda => venda.customerId === clienteId);
    if(clienteEmVenda) {
        throw new Error("Não é possível excluir um cliente que já possui vendas.");
    }
    clientes = clientes.filter((c) => c.id !== clienteId);
}

// --- Vendas ---
export async function obterVendasComDetalhes(): Promise<VendaComDetalhes[]> {
  const vendasDetalhadas = vendas.map(venda => {
    const itensDaVenda = itensVenda
      .filter(item => item.saleId === venda.id)
      .map(item => {
        const produto = produtos.find(p => p.id === item.productId);
        return {
          ...item,
          product: {
            id: produto?.id || 'unknown',
            name: produto?.name || 'Produto Desconhecido'
          }
        };
      });

    const cliente = clientes.find(c => c.id === venda.customerId);
    return {
      ...venda,
      customer: {
        id: cliente?.id || 'unknown',
        name: cliente?.name || 'Cliente Desconhecido'
      },
      items: itensDaVenda
    };
  });

  return vendasDetalhadas.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function criarVenda(dadosVenda: ValoresFormularioVenda): Promise<Venda> {
    const cliente = clientes.find(c => c.id === dadosVenda.customerId);
    if (!cliente) {
        throw new Error("Cliente não encontrado.");
    }

    let total = 0;
    const novosItensVenda: ItemVenda[] = [];
    const idVenda = gerarId('sale');

    for (const item of dadosVenda.items) {
        const produto = produtos.find(p => p.id === item.productId);
        if (!produto) {
            throw new Error(`Produto com ID ${item.productId} não encontrado.`);
        }
        if (produto.stock < item.quantity) {
            throw new Error(`Estoque insuficiente para o produto: ${produto.name}. Disponível: ${produto.stock}`);
        }
        total += produto.price * item.quantity;
        novosItensVenda.push({
            saleId: idVenda,
            productId: item.productId,
            quantity: item.quantity,
            price: produto.price,
        });
    }

    const novaVenda: Venda = {
        id: idVenda,
        customerId: dadosVenda.customerId,
        date: new Date(),
        total,
    };
    
    // Atualizar estoque
    for (const item of dadosVenda.items) {
        const indiceProduto = produtos.findIndex(p => p.id === item.productId);
        if (indiceProduto > -1) {
            produtos[indiceProduto].stock -= item.quantity;
        }
    }

    vendas.push(novaVenda);
    itensVenda.push(...novosItensVenda);
    
    return novaVenda;
}


// --- Funções de Análise ---

export async function obterVendasPorMes(): Promise<VendasPorMes[]> {
    const vendasPorMes: { [key: string]: number } = {};

    vendas.forEach(venda => {
        const mes = new Date(venda.date).getMonth();
        if (!vendasPorMes[mes]) {
            vendasPorMes[mes] = 0;
        }
        vendasPorMes[mes] += venda.total;
    });

    const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    return nomesMeses.map((nome, indice) => ({
        mes: nome,
        total: vendasPorMes[indice] || 0,
    })).filter(d => d.total > 0);
}


export async function obterProdutosMaisVendidos(): Promise<ProdutoVendido[]> {
    const contagemProdutos: { [key: string]: number } = {};

    itensVenda.forEach(item => {
        if (!contagemProdutos[item.productId]) {
            contagemProdutos[item.productId] = 0;
        }
        contagemProdutos[item.productId] += item.quantity;
    });

    return Object.entries(contagemProdutos)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([produtoId, quantidade]) => {
            const produto = produtos.find(p => p.id === produtoId);
            return {
                nomeProduto: produto?.name || 'Desconhecido',
                quantidade,
            };
        });
}

export async function obterClientesMaisAtivos(): Promise<ClienteAtivo[]> {
    const contagemClientes: { [key: string]: number } = {};

    vendas.forEach(venda => {
        if (!contagemClientes[venda.customerId]) {
            contagemClientes[venda.customerId] = 0;
        }
        contagemClientes[venda.customerId]++;
    });

    return Object.entries(contagemClientes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([clienteId, contagem]) => {
            const cliente = clientes.find(c => c.id === clienteId);
            return {
                nomeCliente: cliente?.name || 'Desconhecido',
                quantidadeCompras: contagem,
            };
        });
}
