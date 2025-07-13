import LayoutAplicacao from "@/components/app-layout";
import { RelatorioVendas } from "@/components/sales-report";

export default function PaginaRelatorioIA() {
  return (
    <LayoutAplicacao pageTitle="Relatório de Vendas com IA">
      <RelatorioVendas />
    </LayoutAplicacao>
  );
}
