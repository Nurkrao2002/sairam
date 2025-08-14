
"use client";

import { ReportsDataTable } from "@/components/reports-data-table";
import { DashboardHeader } from "@/components/dashboard-header";

export default function FinanceReportsPage() {
  return (
    <>
      <DashboardHeader
        title="Financial Reports"
        description="Generate and download financial reports for sharing and documentation."
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <ReportsDataTable reportType="financial" />
      </main>
    </>
  );
}
