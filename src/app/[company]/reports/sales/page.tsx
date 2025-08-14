
"use client";

import { ReportsDataTable } from "@/components/reports-data-table";
import { DashboardHeader } from "@/components/dashboard-header";

export default function SalesReportsPage() {
  return (
     <>
      <DashboardHeader
        title="Sales & Marketing Reports"
        description="Generate and download sales and marketing reports."
      />
      <main className="flex-1 p-4 sm:px-6 lg:px-8 space-y-6">
        <ReportsDataTable reportType="sales" />
      </main>
    </>
  );
}
