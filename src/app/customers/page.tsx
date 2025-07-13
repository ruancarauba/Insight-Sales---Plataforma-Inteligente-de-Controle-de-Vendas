import LayoutAplicacao from "@/components/app-layout";
import { ListaClientes } from "@/components/customers-list";

export default function PaginaClientes() {
  return (
    <LayoutAplicacao pageTitle="Clientes">
      <ListaClientes />
    </LayoutAplicacao>
  );
}
