import AppLayout from "@/components/app-layout";
import { SalesList } from "@/components/sales-list";

export default function SalesPage() {
  return (
    <AppLayout pageTitle="Vendas">
      <SalesList />
    </AppLayout>
  );
}
