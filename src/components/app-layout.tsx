import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, Package, BarChart3, Bot, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function AppLayout({ children, pageTitle = "Dashboard" }: { children: React.ReactNode, pageTitle?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-primary" />
            <h1 className="text-lg font-semibold">Insight Sales</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/'}>
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/sales">
                <SidebarMenuButton tooltip="Vendas" isActive={pathname.startsWith('/sales')}>
                  <ShoppingCart />
                  <span>Vendas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/products">
                <SidebarMenuButton tooltip="Produtos" isActive={pathname.startsWith('/products')}>
                  <Package />
                  <span>Produtos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/customers">
                <SidebarMenuButton tooltip="Clientes" isActive={pathname.startsWith('/customers')}>
                  <Users />
                  <span>Clientes</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/performance">
                <SidebarMenuButton tooltip="Análise" isActive={pathname.startsWith('/performance')}>
                  <BarChart3 />
                  <span>Análise</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </div>
  );
}
