
"use client";

import { ReportsDataTable } from "@/components/reports-data-table";
import { DashboardHeader } from "@/components/dashboard-header";

export default function OperationsReportsPage() {
  return (
    <>
      <DashboardHeader
        title="Operations Reports"
        description="Generate and download operational reports."
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <ReportsDataTable reportType="operations" />
      </main>
    </>
  );
}
