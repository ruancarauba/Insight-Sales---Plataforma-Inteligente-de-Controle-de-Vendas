
"use client";

import {
  Sidebar,
  ConteudoSidebar,
  RodapeSidebar,
  CabecalhoSidebar,
  LayoutInterno,
  MenuSidebar,
  BotaoMenuSidebar,
  ItemMenuSidebar,
  SeparadorSidebar,
  GatilhoSidebar,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, Package, BarChart3, Bot, Users, Lightbulb, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "./ui/button";

export default function LayoutAplicacao({ children, pageTitle = "Dashboard" }: { children: React.ReactNode, pageTitle?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <CabecalhoSidebar>
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-primary" />
            <h1 className="text-lg font-semibold font-grotesk">Sales Insights Hub</h1>
          </div>
        </CabecalhoSidebar>
        <ConteudoSidebar>
          <MenuSidebar>
            <ItemMenuSidebar>
              <Link href="/dashboard">
                <BotaoMenuSidebar tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                  <Home />
                  <span>Dashboard</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
            <ItemMenuSidebar>
              <Link href="/sales">
                <BotaoMenuSidebar tooltip="Vendas" isActive={pathname.startsWith('/sales')}>
                  <ShoppingCart />
                  <span>Vendas</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
            <ItemMenuSidebar>
              <Link href="/products">
                <BotaoMenuSidebar tooltip="Produtos" isActive={pathname.startsWith('/products')}>
                  <Package />
                  <span>Produtos</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
            <ItemMenuSidebar>
              <Link href="/customers">
                <BotaoMenuSidebar tooltip="Clientes" isActive={pathname.startsWith('/customers')}>
                  <Users />
                  <span>Clientes</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
            <ItemMenuSidebar>
               <Link href="/performance">
                <BotaoMenuSidebar tooltip="Análise" isActive={pathname.startsWith('/performance')}>
                  <BarChart3 />
                  <span>Análise</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
            <ItemMenuSidebar>
               <Link href="/ai-report">
                <BotaoMenuSidebar tooltip="Relatório IA" isActive={pathname.startsWith('/ai-report')}>
                  <Lightbulb />
                  <span>Relatório IA</span>
                </BotaoMenuSidebar>
              </Link>
            </ItemMenuSidebar>
          </MenuSidebar>
        </ConteudoSidebar>
        <SeparadorSidebar />
        <RodapeSidebar>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
            </Button>
          </Link>
        </RodapeSidebar>
      </Sidebar>
      <LayoutInterno>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <GatilhoSidebar className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-grotesk">{pageTitle}</h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </LayoutInterno>
    </div>
  );
}
