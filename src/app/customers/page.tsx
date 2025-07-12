import AppLayout from "@/components/app-layout";
import { CustomersList } from "@/components/customers-list";

export default function CustomersPage() {
  return (
    <AppLayout pageTitle="Clientes">
      <CustomersList />
    </AppLayout>
  );
}
