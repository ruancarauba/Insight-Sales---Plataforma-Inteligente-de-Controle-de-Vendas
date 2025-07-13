import LayoutAplicacao from "@/components/app-layout";
import { ListaVendas } from "@/components/sales-list";

export default function PaginaVendas() {
  return (
    <LayoutAplicacao pageTitle="Vendas">
      <ListaVendas />
    </LayoutAplicacao>
  );
}
