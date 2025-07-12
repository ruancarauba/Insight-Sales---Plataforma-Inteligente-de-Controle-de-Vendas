import AppLayout from "@/components/app-layout";
import { SalesReport } from "@/components/sales-report";

export default function AiReportPage() {
  return (
    <AppLayout pageTitle="Relatório de Vendas com IA">
      <SalesReport />
    </AppLayout>
  );
}
