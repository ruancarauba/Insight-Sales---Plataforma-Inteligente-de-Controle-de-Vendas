
"use client";
import LayoutAplicacao from "@/components/app-layout";
import { Dashboard } from "@/components/dashboard";

export default function PaginaDashboard() {
  return (
    <LayoutAplicacao pageTitle="Dashboard">
      <Dashboard />
    </LayoutAplicacao>
  );
}
