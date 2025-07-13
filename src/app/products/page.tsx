import LayoutAplicacao from "@/components/app-layout";
import { ListaProdutos } from "@/components/products-list";

export default function PaginaProdutos() {
  return (
    <LayoutAplicacao pageTitle="Produtos">
      <ListaProdutos />
    </LayoutAplicacao>
  );
}
