import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ProvedorSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Sales Insights Hub",
  description: "Sistema de controle de vendas e análise de desempenho.",
};

export default function LayoutRaiz({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn(inter.variable, spaceGrotesk.variable)}>
      <body className="font-sans antialiased">
        <ProvedorSidebar>
          {children}
        </ProvedorSidebar>
        <Toaster />
      </body>
    </html>
  );
}
