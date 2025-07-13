import { z } from "zod";

// --- Modelos de Dados (Simulados) ---

export interface Produto {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Cliente {
  id: string;
  name: string;
  email: string;
}

export interface Venda {
  id: string;
  customerId: string;
  date: Date;
  total: number;
}

export interface ItemVenda {
  saleId: string;
  productId: string;
  quantity: number;
  price: number;
}


export interface EstatisticasDashboard {
  receitaTotal: number;
  totalVendas: number;
  produtosAtivos: number;
  clientesUnicos: number;
}

// --- Tipos para Análise ---

export interface VendasPorMes {
    mes: string;
    total: number;
}

export interface ProdutoVendido {
    nomeProduto: string;
    quantidade: number;
}

export interface ClienteAtivo {
    nomeCliente: string;
    quantidadeCompras: number;
}


// --- Tipos para Visualização (com dados aninhados) ---
export interface VendaComDetalhes extends Omit<Venda, 'customerId'> {
    customer: { id: string; name: string };
    items: (Omit<ItemVenda, 'saleId'|'productId'> & { product: {id: string, name: string} })[];
}


// --- Zod Schemas para Validação de Formulários ---

export const EsquemaProduto = z.object({
  name: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  price: z.coerce.number().positive({ message: "O preço deve ser um número positivo." }),
  stock: z.coerce.number().int().min(0, { message: "O estoque não pode ser negativo." }),
});

export const EsquemaCliente = z.object({
  name: z.string().min(3, { message: "O nome do cliente é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});

export const EsquemaItemVenda = z.object({
    productId: z.string().min(1, { message: "Selecione um produto." }),
    quantity: z.coerce.number().int().min(1, { message: "A quantidade deve ser no mínimo 1." }),
});

export const EsquemaVenda = z.object({
    customerId: z.string().min(1, { message: "Selecione um cliente." }),
    items: z.array(EsquemaItemVenda).min(1, { message: "Adicione pelo menos um item à venda." }),
});


// --- Tipos inferidos dos Schemas ---

export type ValoresFormularioProduto = z.infer<typeof EsquemaProduto>;
export type ValoresFormularioCliente = z.infer<typeof EsquemaCliente>;
export type ValoresFormularioVenda = z.infer<typeof EsquemaVenda>;
