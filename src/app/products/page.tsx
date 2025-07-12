import AppLayout from "@/components/app-layout";
import { ProductsList } from "@/components/products-list";

export default function ProductsPage() {
  return (
    <AppLayout pageTitle="Produtos">
      <ProductsList />
    </AppLayout>
  );
}
